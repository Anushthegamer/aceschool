import { useState } from "react";
import { Plus, Search, Trash2, Pin, PinOff, BookOpen, Edit3, Save, X, StickyNote, FolderOpen } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface Note {
  id: string;
  title: string;
  content: string;
  subject: string;
  pinned: boolean;
  createdAt: Date;
  updatedAt: Date;
  color: string;
}

const colors = [
  { name: "Default", value: "bg-card" },
  { name: "Teal", value: "bg-primary/5" },
  { name: "Amber", value: "bg-warning/5" },
  { name: "Green", value: "bg-success/5" },
  { name: "Blue", value: "bg-info/5" },
  { name: "Rose", value: "bg-destructive/5" },
];

const subjects = ["Mathematics", "English", "Science", "History", "Geography", "Art", "Computer Science", "General"];

const initialNotes: Note[] = [
  {
    id: "1",
    title: "Quadratic Formula",
    content: "The quadratic formula is x = (-b ± √(b²-4ac)) / 2a\n\nUsed to solve equations in the form ax² + bx + c = 0\n\nDiscriminant (b²-4ac):\n- Positive = 2 real solutions\n- Zero = 1 real solution\n- Negative = no real solutions",
    subject: "Mathematics",
    pinned: true,
    createdAt: new Date(Date.now() - 86400000 * 3),
    updatedAt: new Date(Date.now() - 86400000),
    color: "bg-primary/5",
  },
  {
    id: "2",
    title: "Shakespeare's Key Themes",
    content: "1. Appearance vs Reality\n2. Order and Disorder\n3. Love and Loyalty\n4. Power and Ambition\n5. Fate vs Free Will\n\nHamlet: 'To be or not to be' - explores existential themes\nMacbeth: Ambition leading to downfall",
    subject: "English",
    pinned: true,
    createdAt: new Date(Date.now() - 86400000 * 5),
    updatedAt: new Date(Date.now() - 86400000 * 2),
    color: "bg-warning/5",
  },
  {
    id: "3",
    title: "Periodic Table Groups",
    content: "Group 1: Alkali Metals (Li, Na, K) - very reactive\nGroup 2: Alkaline Earth Metals (Be, Mg, Ca)\nGroup 17: Halogens (F, Cl, Br) - need 1 electron\nGroup 18: Noble Gases (He, Ne, Ar) - stable/unreactive\n\nElectron shells determine reactivity",
    subject: "Science",
    pinned: false,
    createdAt: new Date(Date.now() - 86400000 * 2),
    updatedAt: new Date(Date.now() - 86400000 * 2),
    color: "bg-success/5",
  },
  {
    id: "4",
    title: "WW2 Key Dates",
    content: "1939: Germany invades Poland\n1940: Battle of Britain\n1941: Pearl Harbor - US enters war\n1942: Battle of Stalingrad begins\n1944: D-Day - June 6th\n1945: VE Day - May 8th\n1945: Atomic bombs - August",
    subject: "History",
    pinned: false,
    createdAt: new Date(Date.now() - 86400000),
    updatedAt: new Date(Date.now() - 86400000),
    color: "bg-info/5",
  },
];

const NotesPage = () => {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newNote, setNewNote] = useState({ title: "", content: "", subject: "General", color: "bg-card" });

  const filteredNotes = notes
    .filter((n) => {
      const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSubject = selectedSubject === "all" || n.subject === selectedSubject;
      return matchesSearch && matchesSubject;
    })
    .sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return b.updatedAt.getTime() - a.updatedAt.getTime();
    });

  const createNote = () => {
    if (!newNote.title) return;
    const note: Note = {
      id: Date.now().toString(),
      ...newNote,
      pinned: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setNotes([note, ...notes]);
    setNewNote({ title: "", content: "", subject: "General", color: "bg-card" });
    setIsCreating(false);
  };

  const togglePin = (id: string) => {
    setNotes(notes.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n)));
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter((n) => n.id !== id));
    if (editingNote?.id === id) setEditingNote(null);
  };

  const saveEdit = () => {
    if (!editingNote) return;
    setNotes(notes.map((n) => (n.id === editingNote.id ? { ...editingNote, updatedAt: new Date() } : n)));
    setEditingNote(null);
  };

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-8 lg:pt-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Study Notes</h1>
            <p className="text-muted-foreground mt-1">Capture and organize your learning</p>
          </div>
          <Dialog open={isCreating} onOpenChange={setIsCreating}>
            <DialogTrigger asChild>
              <Button variant="calm" className="gap-2">
                <Plus className="h-5 w-5" />
                New Note
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Create New Note</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <Input
                  placeholder="Note title..."
                  value={newNote.title}
                  onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Select value={newNote.subject} onValueChange={(v) => setNewNote({ ...newNote, subject: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {subjects.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Select value={newNote.color} onValueChange={(v) => setNewNote({ ...newNote, color: v })}>
                    <SelectTrigger><SelectValue placeholder="Color" /></SelectTrigger>
                    <SelectContent>
                      {colors.map((c) => (
                        <SelectItem key={c.value} value={c.value}>
                          <span className="flex items-center gap-2">
                            <span className={cn("w-3 h-3 rounded-full border", c.value)} />
                            {c.name}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Textarea
                  placeholder="Write your notes here..."
                  value={newNote.content}
                  onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                  className="min-h-[200px]"
                />
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={() => setIsCreating(false)}>Cancel</Button>
                  <Button variant="calm" className="flex-1" onClick={createNote}>Create Note</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </header>

        {/* Search */}
        <Card>
          <CardContent className="py-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search notes..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button variant={selectedSubject === "all" ? "default" : "outline"} size="sm" onClick={() => setSelectedSubject("all")}>All</Button>
                {subjects.map((s) => (
                  <Button key={s} variant={selectedSubject === s ? "default" : "outline"} size="sm" onClick={() => setSelectedSubject(s)}>{s}</Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Notes Grid */}
          <div className={cn("space-y-4", editingNote ? "lg:col-span-2" : "lg:col-span-3")}>
            {editingNote ? null : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredNotes.map((note) => (
                  <Card
                    key={note.id}
                    className={cn("cursor-pointer hover-lift group relative", note.color)}
                    onClick={() => setEditingNote(note)}
                  >
                    {note.pinned && (
                      <div className="absolute top-2 right-2">
                        <Pin className="h-3.5 w-3.5 text-primary" />
                      </div>
                    )}
                    <CardHeader className="pb-2">
                      <Badge variant="subject" className="w-fit text-xs mb-1">{note.subject}</Badge>
                      <CardTitle className="text-base line-clamp-1">{note.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-4 whitespace-pre-wrap">{note.content}</p>
                      <p className="text-xs text-muted-foreground mt-3">{format(note.updatedAt, "MMM d, yyyy")}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {editingNote && (
              <div className="grid sm:grid-cols-2 gap-4">
                {filteredNotes.map((note) => (
                  <Card
                    key={note.id}
                    className={cn(
                      "cursor-pointer group relative transition-all",
                      note.color,
                      editingNote.id === note.id && "ring-2 ring-primary"
                    )}
                    onClick={() => setEditingNote(note)}
                  >
                    {note.pinned && <Pin className="absolute top-2 right-2 h-3.5 w-3.5 text-primary" />}
                    <CardHeader className="pb-2">
                      <Badge variant="subject" className="w-fit text-xs mb-1">{note.subject}</Badge>
                      <CardTitle className="text-sm line-clamp-1">{note.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-muted-foreground line-clamp-2 whitespace-pre-wrap">{note.content}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {filteredNotes.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center">
                  <StickyNote className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No notes found</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Editor */}
          {editingNote && (
            <div className="lg:col-span-1">
              <Card variant="elevated" className="sticky top-4">
                <CardHeader className="border-b border-border">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Edit Note</CardTitle>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => togglePin(editingNote.id)}>
                        {editingNote.pinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteNote(editingNote.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setEditingNote(null)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  <Input
                    value={editingNote.title}
                    onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })}
                    className="font-semibold"
                  />
                  <Select
                    value={editingNote.subject}
                    onValueChange={(v) => setEditingNote({ ...editingNote, subject: v })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {subjects.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Textarea
                    value={editingNote.content}
                    onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })}
                    className="min-h-[300px]"
                  />
                  <Button variant="calm" className="w-full gap-2" onClick={saveEdit}>
                    <Save className="h-4 w-4" />
                    Save Changes
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default NotesPage;
