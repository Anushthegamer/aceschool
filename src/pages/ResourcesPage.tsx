import { useState, useEffect } from "react";
import { Plus, Search, ExternalLink, Trash2, FolderOpen, Link2, FileText, Video, BookOpen, Globe, Star, StarOff } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  subject: string;
  type: "link" | "video" | "document" | "tool" | "textbook";
  starred: boolean;
  addedAt: Date;
}

const subjects = ["Mathematics", "English Language Arts", "Science", "U.S. History", "Spanish", "Computer Science", "General"];

const typeIcons: Record<string, typeof Link2> = {
  link: Globe,
  video: Video,
  document: FileText,
  tool: Link2,
  textbook: BookOpen,
};

const initialResources: Resource[] = [
  { id: "1", title: "Khan Academy – Pre-Algebra", description: "Full course covering linear equations, inequalities, ratios, and proportions. Great for self-paced review.", url: "https://www.khanacademy.org/math/pre-algebra", subject: "Mathematics", type: "link", starred: true, addedAt: new Date(Date.now() - 86400000 * 10) },
  { id: "2", title: "Desmos Graphing Calculator", description: "Free online graphing calculator. Plot equations, create tables, and explore math visually.", url: "https://www.desmos.com/calculator", subject: "Mathematics", type: "tool", starred: true, addedAt: new Date(Date.now() - 86400000 * 8) },
  { id: "3", title: "CommonLit – 8th Grade ELA", description: "Free reading passages and literacy resources aligned with Common Core standards.", url: "https://www.commonlit.org", subject: "English Language Arts", type: "link", starred: false, addedAt: new Date(Date.now() - 86400000 * 7) },
  { id: "4", title: "CK-12 Life Science Textbook", description: "Free digital textbook covering cells, genetics, evolution, and ecology. Includes interactive simulations.", url: "https://www.ck12.org/life-science/", subject: "Science", type: "textbook", starred: true, addedAt: new Date(Date.now() - 86400000 * 6) },
  { id: "5", title: "CrashCourse – U.S. History", description: "YouTube playlist covering American history from colonization through the modern era. Fast-paced and engaging.", url: "https://www.youtube.com/playlist?list=PL8dPuuaLjXtMwmepBjTSG593eG7ObzO7s", subject: "U.S. History", type: "video", starred: true, addedAt: new Date(Date.now() - 86400000 * 5) },
  { id: "6", title: "Quizlet – Spanish I Vocabulary", description: "Flashcard sets for common Spanish vocabulary, conjugations, and grammar. Includes practice games.", url: "https://quizlet.com/subject/spanish-1/", subject: "Spanish", type: "tool", starred: false, addedAt: new Date(Date.now() - 86400000 * 4) },
  { id: "7", title: "Cell Biology Lab Guide (PDF)", description: "Step-by-step microscope lab procedures for identifying cell structures. Includes diagram worksheets.", url: "#", subject: "Science", type: "document", starred: false, addedAt: new Date(Date.now() - 86400000 * 3) },
  { id: "8", title: "Scratch – Coding Projects", description: "Block-based programming for beginners. Create animations, games, and interactive stories.", url: "https://scratch.mit.edu", subject: "Computer Science", type: "tool", starred: false, addedAt: new Date(Date.now() - 86400000 * 2) },
  { id: "9", title: "Constitution Annotated", description: "Interactive guide to the U.S. Constitution with amendments explained in student-friendly language.", url: "https://constitution.congress.gov", subject: "U.S. History", type: "link", starred: false, addedAt: new Date(Date.now() - 86400000) },
  { id: "10", title: "Purdue OWL – Writing Guide", description: "MLA formatting, citation guide, and essay structure tips. Essential for ELA essays and research papers.", url: "https://owl.purdue.edu", subject: "English Language Arts", type: "document", starred: true, addedAt: new Date(Date.now() - 86400000 * 12) },
];

const ResourcesPage = () => {
  const [resources, setResources] = useState<Resource[]>(() => {
    const saved = localStorage.getItem("focusflow-resources");
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((r: any) => ({ ...r, addedAt: new Date(r.addedAt) }));
    }
    return initialResources;
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [showAdd, setShowAdd] = useState(false);
  const [newResource, setNewResource] = useState({ title: "", description: "", url: "", subject: "General", type: "link" as Resource["type"] });

  useEffect(() => {
    localStorage.setItem("focusflow-resources", JSON.stringify(resources));
  }, [resources]);

  const addResource = () => {
    if (!newResource.title) return;
    setResources([{ ...newResource, id: Date.now().toString(), starred: false, addedAt: new Date() }, ...resources]);
    setNewResource({ title: "", description: "", url: "", subject: "General", type: "link" });
    setShowAdd(false);
  };

  const toggleStar = (id: string) => {
    setResources(resources.map((r) => (r.id === id ? { ...r, starred: !r.starred } : r)));
  };

  const deleteResource = (id: string) => {
    setResources(resources.filter((r) => r.id !== id));
  };

  const filteredResources = resources
    .filter((r) => {
      const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) || r.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSubject = selectedSubject === "all" || r.subject === selectedSubject;
      const matchesType = selectedType === "all" || r.type === selectedType;
      return matchesSearch && matchesSubject && matchesType;
    })
    .sort((a, b) => {
      if (a.starred !== b.starred) return a.starred ? -1 : 1;
      return b.addedAt.getTime() - a.addedAt.getTime();
    });

  const subjectCounts = subjects.reduce((acc, s) => {
    acc[s] = resources.filter((r) => r.subject === s).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-8 lg:pt-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Resource Library</h1>
            <p className="text-muted-foreground mt-1">Save study materials, links, and tools by subject</p>
          </div>
          <Dialog open={showAdd} onOpenChange={setShowAdd}>
            <DialogTrigger asChild>
              <Button variant="calm" className="gap-2"><Plus className="h-5 w-5" />Add Resource</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add Study Resource</DialogTitle></DialogHeader>
              <div className="space-y-4 pt-4">
                <Input placeholder="Resource title" value={newResource.title} onChange={(e) => setNewResource({ ...newResource, title: e.target.value })} />
                <Input placeholder="URL (optional)" value={newResource.url} onChange={(e) => setNewResource({ ...newResource, url: e.target.value })} />
                <div className="grid grid-cols-2 gap-4">
                  <Select value={newResource.subject} onValueChange={(v) => setNewResource({ ...newResource, subject: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{subjects.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                  <Select value={newResource.type} onValueChange={(v) => setNewResource({ ...newResource, type: v as Resource["type"] })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="link">🌐 Website</SelectItem>
                      <SelectItem value="video">🎥 Video</SelectItem>
                      <SelectItem value="document">📄 Document</SelectItem>
                      <SelectItem value="tool">🔧 Tool</SelectItem>
                      <SelectItem value="textbook">📚 Textbook</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Textarea placeholder="Description (optional)" value={newResource.description} onChange={(e) => setNewResource({ ...newResource, description: e.target.value })} />
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={() => setShowAdd(false)}>Cancel</Button>
                  <Button variant="calm" className="flex-1" onClick={addResource}>Add</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </header>

        {/* Search & Filter */}
        <Card>
          <CardContent className="py-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search resources..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
              </div>
              <div className="flex gap-2 flex-wrap">
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger className="w-[160px]"><SelectValue placeholder="Subject" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    {subjects.map((s) => <SelectItem key={s} value={s}>{s} ({subjectCounts[s] || 0})</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-[130px]"><SelectValue placeholder="Type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="link">Website</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="document">Document</SelectItem>
                    <SelectItem value="tool">Tool</SelectItem>
                    <SelectItem value="textbook">Textbook</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resources Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredResources.map((resource) => {
            const TypeIcon = typeIcons[resource.type] || Globe;
            return (
              <Card key={resource.id} className="hover-lift group relative">
                <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => toggleStar(resource.id)}>
                    {resource.starred ? <Star className="h-3.5 w-3.5 text-warning fill-warning" /> : <StarOff className="h-3.5 w-3.5" />}
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => deleteResource(resource.id)}>
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </Button>
                </div>
                {resource.starred && (
                  <div className="absolute top-3 right-3 group-hover:opacity-0 transition-opacity">
                    <Star className="h-3.5 w-3.5 text-warning fill-warning" />
                  </div>
                )}
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2 mb-2">
                    <TypeIcon className="h-4 w-4 text-muted-foreground" />
                    <Badge variant="subject" className="text-xs">{resource.subject}</Badge>
                    <Badge variant="muted" className="text-xs capitalize">{resource.type}</Badge>
                  </div>
                  <CardTitle className="text-base line-clamp-1">{resource.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{resource.description}</p>
                  {resource.url && resource.url !== "#" && (
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Open Resource
                    </a>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredResources.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <FolderOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No resources found</p>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
};

export default ResourcesPage;
