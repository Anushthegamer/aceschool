import { useState, useEffect } from "react";
import { Plus, Clock, CalendarDays, Brain, Trash2, CheckCircle2, AlertTriangle, Sparkles, ChevronRight } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { addDays, format, differenceInDays, isToday, isTomorrow } from "date-fns";

interface StudyBlock {
  id: string;
  topic: string;
  duration: number; // minutes
  completed: boolean;
}

interface StudyPlan {
  id: string;
  title: string;
  subject: string;
  examDate: Date;
  createdAt: Date;
  blocks: StudyBlock[];
  priority: "low" | "medium" | "high";
}

const subjects = ["Mathematics", "English Language Arts", "Science", "U.S. History", "Spanish", "Computer Science"];

function generateStudyBlocks(title: string, subject: string, examDate: Date): StudyBlock[] {
  const daysUntil = Math.max(1, differenceInDays(examDate, new Date()));
  
  const topicsBySubject: Record<string, string[]> = {
    "Mathematics": ["Review key formulas and definitions", "Practice word problems", "Work through textbook exercises", "Create formula cheat sheet", "Do timed practice problems", "Review previous quiz mistakes", "Watch tutorial videos for weak areas"],
    "English Language Arts": ["Re-read key passages and annotate", "Outline essay structure and thesis", "Review literary terms and devices", "Practice writing body paragraphs", "Review grammar and punctuation rules", "Study vocabulary from reading", "Peer review practice essays"],
    "Science": ["Review chapter summaries and key terms", "Study diagrams and labeled drawings", "Practice lab procedure questions", "Review the scientific method steps", "Create concept maps linking topics", "Do practice problems with formulas", "Review safety protocols"],
    "U.S. History": ["Create a timeline of major events", "Review cause-and-effect relationships", "Study key figures and their roles", "Review primary source documents", "Practice writing short-answer responses", "Study maps and geographic context", "Review vocabulary and key terms"],
    "Spanish": ["Review vocabulary flashcards", "Practice verb conjugation tables", "Listen to Spanish audio/podcasts", "Write sentences using new grammar", "Practice reading comprehension", "Review common conversation phrases", "Do translation exercises"],
    "Computer Science": ["Review key concepts and terminology", "Practice coding exercises", "Debug sample programs", "Review algorithm logic", "Study input/output examples", "Create pseudocode outlines", "Review previous assignments"],
  };

  const topics = topicsBySubject[subject] || topicsBySubject["Mathematics"];
  const blocksNeeded = Math.min(topics.length, Math.max(3, daysUntil + 1));
  
  return topics.slice(0, blocksNeeded).map((topic, i) => ({
    id: `${Date.now()}-${i}`,
    topic,
    duration: [30, 25, 20, 30, 25, 20, 30][i % 7],
    completed: false,
  }));
}

const initialPlans: StudyPlan[] = [
  {
    id: "1",
    title: "Pre-Algebra Unit 5 Test",
    subject: "Mathematics",
    examDate: addDays(new Date(), 3),
    createdAt: new Date(Date.now() - 86400000 * 2),
    priority: "high",
    blocks: [
      { id: "1a", topic: "Review key formulas: slope formula, y-intercept", duration: 30, completed: true },
      { id: "1b", topic: "Practice word problems from Ch. 5 worksheet", duration: 25, completed: true },
      { id: "1c", topic: "Work through textbook exercises pg. 178-182", duration: 30, completed: false },
      { id: "1d", topic: "Create formula cheat sheet for quick reference", duration: 20, completed: false },
      { id: "1e", topic: "Do timed practice: 10 problems in 15 minutes", duration: 20, completed: false },
    ],
  },
  {
    id: "2",
    title: "Life Science Quiz – Cell Division",
    subject: "Science",
    examDate: addDays(new Date(), 5),
    createdAt: new Date(Date.now() - 86400000),
    priority: "medium",
    blocks: [
      { id: "2a", topic: "Review mitosis phases with diagrams", duration: 25, completed: true },
      { id: "2b", topic: "Study cell organelle functions", duration: 20, completed: false },
      { id: "2c", topic: "Practice labeling cell diagrams", duration: 20, completed: false },
      { id: "2d", topic: "Review osmosis and diffusion concepts", duration: 25, completed: false },
    ],
  },
  {
    id: "3",
    title: "ELA – To Kill a Mockingbird Essay",
    subject: "English Language Arts",
    examDate: addDays(new Date(), 7),
    createdAt: new Date(),
    priority: "medium",
    blocks: [
      { id: "3a", topic: "Re-read key chapters (10, 15, 25) and annotate", duration: 30, completed: false },
      { id: "3b", topic: "Outline thesis and 3 supporting arguments", duration: 25, completed: false },
      { id: "3c", topic: "Find textual evidence for each body paragraph", duration: 30, completed: false },
      { id: "3d", topic: "Write first draft introduction and conclusion", duration: 25, completed: false },
      { id: "3e", topic: "Review MLA formatting and citations", duration: 15, completed: false },
    ],
  },
  {
    id: "4",
    title: "American Revolution Test",
    subject: "U.S. History",
    examDate: addDays(new Date(), 10),
    createdAt: new Date(),
    priority: "low",
    blocks: [
      { id: "4a", topic: "Create timeline: 1765-1783", duration: 30, completed: false },
      { id: "4b", topic: "Review key figures: Washington, Jefferson, Adams", duration: 25, completed: false },
      { id: "4c", topic: "Study causes of the Revolution", duration: 25, completed: false },
      { id: "4d", topic: "Review Declaration of Independence main ideas", duration: 20, completed: false },
      { id: "4e", topic: "Practice short-answer responses", duration: 25, completed: false },
      { id: "4f", topic: "Watch CrashCourse episodes 5-8", duration: 30, completed: false },
    ],
  },
];

const StudyPlannerPage = () => {
  const [plans, setPlans] = useState<StudyPlan[]>(() => {
    const saved = localStorage.getItem("focusflow-studyplans");
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((p: any) => ({ ...p, examDate: new Date(p.examDate), createdAt: new Date(p.createdAt) }));
    }
    return initialPlans;
  });
  const [selectedPlan, setSelectedPlan] = useState<StudyPlan | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newPlan, setNewPlan] = useState({ title: "", subject: "Mathematics", daysUntilExam: 7, priority: "medium" as StudyPlan["priority"] });

  useEffect(() => {
    localStorage.setItem("focusflow-studyplans", JSON.stringify(plans));
  }, [plans]);

  const createPlan = () => {
    if (!newPlan.title) return;
    const examDate = addDays(new Date(), newPlan.daysUntilExam);
    const blocks = generateStudyBlocks(newPlan.title, newPlan.subject, examDate);
    const plan: StudyPlan = {
      id: Date.now().toString(),
      title: newPlan.title,
      subject: newPlan.subject,
      examDate,
      createdAt: new Date(),
      priority: newPlan.priority,
      blocks,
    };
    setPlans([plan, ...plans]);
    setNewPlan({ title: "", subject: "Mathematics", daysUntilExam: 7, priority: "medium" });
    setShowCreate(false);
    setSelectedPlan(plan);
  };

  const toggleBlock = (planId: string, blockId: string) => {
    setPlans(plans.map((p) => {
      if (p.id !== planId) return p;
      const updated = { ...p, blocks: p.blocks.map((b) => (b.id === blockId ? { ...b, completed: !b.completed } : b)) };
      if (selectedPlan?.id === planId) setSelectedPlan(updated);
      return updated;
    }));
  };

  const deletePlan = (id: string) => {
    setPlans(plans.filter((p) => p.id !== id));
    if (selectedPlan?.id === id) setSelectedPlan(null);
  };

  const sortedPlans = [...plans].sort((a, b) => a.examDate.getTime() - b.examDate.getTime());
  const totalBlocks = plans.reduce((sum, p) => sum + p.blocks.length, 0);
  const completedBlocks = plans.reduce((sum, p) => sum + p.blocks.filter((b) => b.completed).length, 0);

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-8 lg:pt-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Study Planner</h1>
            <p className="text-muted-foreground mt-1">Auto-generate study schedules for upcoming assessments</p>
          </div>
          <Dialog open={showCreate} onOpenChange={setShowCreate}>
            <DialogTrigger asChild>
              <Button variant="calm" className="gap-2"><Sparkles className="h-5 w-5" />Generate Plan</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Create Study Plan</DialogTitle></DialogHeader>
              <div className="space-y-4 pt-4">
                <Input placeholder="Assessment name (e.g., Pre-Algebra Unit Test)" value={newPlan.title} onChange={(e) => setNewPlan({ ...newPlan, title: e.target.value })} />
                <div className="grid grid-cols-2 gap-4">
                  <Select value={newPlan.subject} onValueChange={(v) => setNewPlan({ ...newPlan, subject: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{subjects.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                  <Select value={newPlan.priority} onValueChange={(v) => setNewPlan({ ...newPlan, priority: v as StudyPlan["priority"] })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">🔴 High Priority</SelectItem>
                      <SelectItem value="medium">🟡 Medium</SelectItem>
                      <SelectItem value="low">🟢 Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Days until exam</label>
                  <Select value={String(newPlan.daysUntilExam)} onValueChange={(v) => setNewPlan({ ...newPlan, daysUntilExam: parseInt(v) })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 5, 7, 10, 14, 21, 30].map((d) => <SelectItem key={d} value={String(d)}>{d} days</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <p className="text-xs text-muted-foreground">A study plan with recommended sessions will be auto-generated based on the subject and timeframe.</p>
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={() => setShowCreate(false)}>Cancel</Button>
                  <Button variant="calm" className="flex-1" onClick={createPlan}>Generate Plan</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card variant="elevated" className="bg-primary/5 border-primary/20">
            <CardContent className="p-4 text-center">
              <Brain className="h-6 w-6 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">{plans.length}</div>
              <p className="text-xs text-muted-foreground">Active Plans</p>
            </CardContent>
          </Card>
          <Card variant="elevated" className="bg-success/5 border-success/20">
            <CardContent className="p-4 text-center">
              <CheckCircle2 className="h-6 w-6 text-success mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">{completedBlocks}/{totalBlocks}</div>
              <p className="text-xs text-muted-foreground">Sessions Done</p>
            </CardContent>
          </Card>
          <Card variant="elevated" className="bg-warning/5 border-warning/20">
            <CardContent className="p-4 text-center">
              <Clock className="h-6 w-6 text-warning mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">
                {plans.reduce((sum, p) => sum + p.blocks.filter((b) => !b.completed).reduce((s, b) => s + b.duration, 0), 0)}
              </div>
              <p className="text-xs text-muted-foreground">Minutes Left</p>
            </CardContent>
          </Card>
          <Card variant="elevated" className="bg-info/5 border-info/20">
            <CardContent className="p-4 text-center">
              <CalendarDays className="h-6 w-6 text-info mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">
                {totalBlocks > 0 ? Math.round((completedBlocks / totalBlocks) * 100) : 0}%
              </div>
              <p className="text-xs text-muted-foreground">Overall Progress</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Plan List */}
          <div className="space-y-3">
            {sortedPlans.map((plan) => {
              const daysUntil = differenceInDays(plan.examDate, new Date());
              const completed = plan.blocks.filter((b) => b.completed).length;
              const total = plan.blocks.length;
              const progress = total > 0 ? (completed / total) * 100 : 0;
              const isUrgent = daysUntil <= 3;
              const isSelected = selectedPlan?.id === plan.id;

              return (
                <Card
                  key={plan.id}
                  className={cn(
                    "cursor-pointer transition-all group relative",
                    isSelected ? "ring-2 ring-primary shadow-glow" : "hover:border-primary/50",
                    isUrgent && !isSelected && "border-warning/50"
                  )}
                  onClick={() => setSelectedPlan(plan)}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 h-7 w-7"
                    onClick={(e) => { e.stopPropagation(); deletePlan(plan.id); }}
                  >
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </Button>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={plan.priority === "high" ? "warning" : plan.priority === "medium" ? "info" : "muted"} className="text-[10px]">
                        {plan.priority}
                      </Badge>
                      <Badge variant="subject" className="text-[10px]">{plan.subject}</Badge>
                    </div>
                    <h4 className="font-semibold text-foreground line-clamp-1 mt-1">{plan.title}</h4>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      {isUrgent && <AlertTriangle className="h-3 w-3 text-warning" />}
                      <span>
                        {daysUntil === 0 ? "Today!" : daysUntil === 1 ? "Tomorrow" : `${daysUntil} days left`}
                      </span>
                      <span>•</span>
                      <span>{completed}/{total} done</span>
                    </div>
                    <Progress value={progress} className="h-1.5 mt-2" />
                  </CardContent>
                </Card>
              );
            })}
            {plans.length === 0 && (
              <Card>
                <CardContent className="py-8 text-center">
                  <Sparkles className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground text-sm">No study plans yet. Generate one!</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Plan Details */}
          <div className="lg:col-span-2">
            {selectedPlan ? (
              <Card variant="elevated">
                <CardHeader className="border-b border-border">
                  <div className="flex items-start justify-between">
                    <div>
                      <Badge variant="subject" className="mb-2">{selectedPlan.subject}</Badge>
                      <CardTitle className="text-xl">{selectedPlan.title}</CardTitle>
                      <CardDescription>
                        Exam: {format(selectedPlan.examDate, "EEEE, MMMM d")} • {differenceInDays(selectedPlan.examDate, new Date())} days left
                      </CardDescription>
                    </div>
                    <Badge variant={selectedPlan.priority === "high" ? "warning" : "info"}>
                      {selectedPlan.priority} priority
                    </Badge>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Study Progress</span>
                      <span className="font-medium">
                        {selectedPlan.blocks.filter((b) => b.completed).length}/{selectedPlan.blocks.length} sessions
                      </span>
                    </div>
                    <Progress
                      value={selectedPlan.blocks.length > 0 ? (selectedPlan.blocks.filter((b) => b.completed).length / selectedPlan.blocks.length) * 100 : 0}
                      className="h-2"
                    />
                  </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-3">
                  <h4 className="font-medium text-foreground flex items-center gap-2">
                    <Brain className="h-4 w-4 text-primary" />
                    Study Sessions
                  </h4>
                  {selectedPlan.blocks.map((block, index) => (
                    <div
                      key={block.id}
                      className={cn(
                        "flex items-start gap-3 p-3 rounded-lg border transition-all",
                        block.completed ? "bg-success/5 border-success/20" : "bg-muted/30 border-border"
                      )}
                    >
                      <Checkbox
                        checked={block.completed}
                        onCheckedChange={() => toggleBlock(selectedPlan.id, block.id)}
                        className="mt-0.5"
                      />
                      <div className="flex-1">
                        <p className={cn("text-sm font-medium", block.completed && "line-through text-muted-foreground")}>
                          {block.topic}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="muted" className="text-[10px] gap-1">
                            <Clock className="h-2.5 w-2.5" />{block.duration} min
                          </Badge>
                          <Badge variant="muted" className="text-[10px]">Session {index + 1}</Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground">
                      Total study time: <span className="font-medium text-foreground">{selectedPlan.blocks.reduce((s, b) => s + b.duration, 0)} minutes</span>
                      {" "}• Remaining: <span className="font-medium text-foreground">{selectedPlan.blocks.filter((b) => !b.completed).reduce((s, b) => s + b.duration, 0)} minutes</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card variant="elevated" className="h-full flex items-center justify-center">
                <CardContent className="text-center py-12">
                  <Brain className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">Select a Study Plan</h3>
                  <p className="text-muted-foreground">Click a plan to view and track your study sessions</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default StudyPlannerPage;
