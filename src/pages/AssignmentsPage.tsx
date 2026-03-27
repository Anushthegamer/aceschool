import { useState } from "react";
import { Search, BookOpen, FlaskConical, Globe, Calculator, Palette, Code, Languages } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TaskCard, Task } from "@/components/tasks/TaskCard";
import { QuickAddTask } from "@/components/tasks/QuickAddTask";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { addDays } from "date-fns";

const subjectIcons: Record<string, typeof BookOpen> = {
  "Mathematics": Calculator,
  "English Language Arts": BookOpen,
  "Science": FlaskConical,
  "U.S. History": Globe,
  "Spanish": Languages,
  "Computer Science": Code,
  "Art": Palette,
};

const initialAssignments: Task[] = [
  // Mathematics
  { id: "1", title: "Solve linear equations worksheet (pg 178-182)", subject: "Mathematics", dueDate: new Date(), priority: "high", completed: false, type: "assignment" },
  { id: "8", title: "Graph 6 linear equations on coordinate plane", subject: "Mathematics", dueDate: addDays(new Date(), 6), priority: "medium", completed: false, type: "assignment" },
  { id: "15", title: "Quadratic formula practice problems #1-20", subject: "Mathematics", dueDate: addDays(new Date(), 3), priority: "high", completed: false, type: "assignment" },
  // ELA
  { id: "2", title: "Annotate chapters 12-14 of 'To Kill a Mockingbird'", subject: "English Language Arts", dueDate: addDays(new Date(), 1), priority: "medium", completed: false, type: "assignment" },
  { id: "9", title: "Write thesis statement for TKAM essay (MLA format)", subject: "English Language Arts", dueDate: addDays(new Date(), 4), priority: "high", completed: false, type: "assignment" },
  { id: "16", title: "Vocabulary Unit 5 – define & use in sentences", subject: "English Language Arts", dueDate: addDays(new Date(), 2), priority: "low", completed: true, type: "assignment" },
  // Science
  { id: "3", title: "Cell division lab report with labeled diagrams", subject: "Science", dueDate: addDays(new Date(), 2), priority: "high", completed: false, type: "assignment" },
  { id: "10", title: "Complete periodic table element identification sheet", subject: "Science", dueDate: addDays(new Date(), 7), priority: "low", completed: false, type: "assignment" },
  // U.S. History
  { id: "4", title: "Read Ch. 5 — Causes of the American Revolution", subject: "U.S. History", dueDate: addDays(new Date(), 3), priority: "low", completed: true, type: "assignment" },
  { id: "11", title: "Create timeline: Stamp Act to Treaty of Paris", subject: "U.S. History", dueDate: addDays(new Date(), 5), priority: "medium", completed: false, type: "assignment" },
  // Spanish
  { id: "5", title: "Conjugate -AR verbs and write 5 original sentences", subject: "Spanish", dueDate: addDays(new Date(), 1), priority: "medium", completed: false, type: "assignment" },
  { id: "12", title: "Translate dialogue worksheet (pg 45-46)", subject: "Spanish", dueDate: addDays(new Date(), 4), priority: "low", completed: false, type: "assignment" },
  // Art
  { id: "6", title: "One-point perspective cityscape drawing", subject: "Art", dueDate: addDays(new Date(), 5), priority: "medium", completed: false, type: "assignment" },
  // Computer Science
  { id: "7", title: "Create a Scratch animation project", subject: "Computer Science", dueDate: addDays(new Date(), 4), priority: "low", completed: false, type: "assignment" },
  { id: "13", title: "Python: Write a number guessing game", subject: "Computer Science", dueDate: addDays(new Date(), 6), priority: "medium", completed: false, type: "assignment" },
];

const AssignmentsPage = () => {
  const [assignments, setAssignments] = useState<Task[]>(initialAssignments);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"list" | "subject">("subject");

  const toggleTask = (id: string) => {
    setAssignments(assignments.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const addTask = (newTask: Omit<Task, "id" | "completed">) => {
    const task: Task = { ...newTask, id: Date.now().toString(), completed: false };
    setAssignments([task, ...assignments]);
  };

  const allSubjects = [...new Set(assignments.map(a => a.subject))];
  
  const filteredAssignments = assignments.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          a.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === "all" || a.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const pendingAssignments = filteredAssignments.filter(a => !a.completed);
  const completedAssignments = filteredAssignments.filter(a => a.completed);

  // Group by subject
  const groupedBySubject = allSubjects.map(subject => ({
    subject,
    pending: assignments.filter(a => a.subject === subject && !a.completed),
    completed: assignments.filter(a => a.subject === subject && a.completed),
  })).filter(g => g.pending.length > 0 || g.completed.length > 0);

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-8 lg:pt-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Assignments</h1>
            <p className="text-muted-foreground mt-1">Jack Williams • Organized by subject</p>
          </div>
          <div className="flex gap-2">
            <Button variant={viewMode === "subject" ? "default" : "outline"} size="sm" onClick={() => setViewMode("subject")}>By Subject</Button>
            <Button variant={viewMode === "list" ? "default" : "outline"} size="sm" onClick={() => setViewMode("list")}>List View</Button>
            <QuickAddTask onAdd={addTask} />
          </div>
        </header>

        <Card>
          <CardContent className="py-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search assignments..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button variant={selectedSubject === "all" ? "default" : "outline"} size="sm" onClick={() => setSelectedSubject("all")}>All</Button>
                {allSubjects.map(subject => (
                  <Button key={subject} variant={selectedSubject === subject ? "default" : "outline"} size="sm" onClick={() => setSelectedSubject(subject)}>
                    {subject.length > 10 ? subject.slice(0, 10) + "…" : subject}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {viewMode === "subject" && selectedSubject === "all" ? (
          <div className="space-y-6">
            {groupedBySubject.map(({ subject, pending, completed }) => {
              const Icon = subjectIcons[subject] || BookOpen;
              return (
                <Card key={subject} variant="elevated">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Icon className="h-5 w-5 text-primary" />
                      {subject}
                      <Badge variant="muted" className="ml-auto">{pending.length} pending</Badge>
                      {completed.length > 0 && <Badge variant="success">{completed.length} done</Badge>}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {pending.map(a => <TaskCard key={a.id} task={a} onToggle={toggleTask} />)}
                    {completed.map(a => <TaskCard key={a.id} task={a} onToggle={toggleTask} />)}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Tabs defaultValue="pending" className="space-y-4">
            <TabsList>
              <TabsTrigger value="pending" className="gap-2">Pending <Badge variant="warning">{pendingAssignments.length}</Badge></TabsTrigger>
              <TabsTrigger value="completed" className="gap-2">Completed <Badge variant="success">{completedAssignments.length}</Badge></TabsTrigger>
            </TabsList>
            <TabsContent value="pending" className="space-y-3">
              {pendingAssignments.length > 0 ? pendingAssignments.map(a => <TaskCard key={a.id} task={a} onToggle={toggleTask} />) : (
                <Card><CardContent className="py-12 text-center"><p className="text-muted-foreground">No pending assignments found</p></CardContent></Card>
              )}
            </TabsContent>
            <TabsContent value="completed" className="space-y-3">
              {completedAssignments.length > 0 ? completedAssignments.map(a => <TaskCard key={a.id} task={a} onToggle={toggleTask} />) : (
                <Card><CardContent className="py-12 text-center"><p className="text-muted-foreground">No completed assignments yet</p></CardContent></Card>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </MainLayout>
  );
};

export default AssignmentsPage;
