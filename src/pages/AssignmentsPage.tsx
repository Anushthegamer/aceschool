import { useState } from "react";
import { Filter, Plus, Search, SortAsc } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TaskCard, Task } from "@/components/tasks/TaskCard";
import { QuickAddTask } from "@/components/tasks/QuickAddTask";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { addDays } from "date-fns";

const initialAssignments: Task[] = [
  { id: "1", title: "Pre-Algebra: Solve linear equations worksheet (pg 178-182)", subject: "Mathematics", dueDate: new Date(), priority: "high", completed: false, type: "assignment" },
  { id: "2", title: "ELA: Annotate chapters 12-14 of 'To Kill a Mockingbird'", subject: "English Language Arts", dueDate: addDays(new Date(), 1), priority: "medium", completed: false, type: "assignment" },
  { id: "3", title: "Science: Cell division lab report with labeled diagrams", subject: "Science", dueDate: addDays(new Date(), 2), priority: "high", completed: false, type: "assignment" },
  { id: "4", title: "U.S. History: Read Ch. 5 — Causes of the American Revolution", subject: "U.S. History", dueDate: addDays(new Date(), 3), priority: "low", completed: true, type: "assignment" },
  { id: "5", title: "Spanish I: Conjugate -AR verbs and write 5 original sentences", subject: "Spanish", dueDate: addDays(new Date(), 1), priority: "medium", completed: false, type: "assignment" },
  { id: "6", title: "Art & Design: One-point perspective cityscape drawing", subject: "Art", dueDate: addDays(new Date(), 5), priority: "medium", completed: false, type: "assignment" },
  { id: "7", title: "Computer Science: Create a Scratch animation project", subject: "Computer Science", dueDate: addDays(new Date(), 4), priority: "low", completed: false, type: "assignment" },
  { id: "8", title: "Pre-Algebra: Graph 6 linear equations on coordinate plane", subject: "Mathematics", dueDate: addDays(new Date(), 6), priority: "medium", completed: false, type: "assignment" },
  { id: "9", title: "ELA: Write thesis statement for TKAM essay (MLA format)", subject: "English Language Arts", dueDate: addDays(new Date(), 4), priority: "high", completed: false, type: "assignment" },
  { id: "10", title: "Science: Complete periodic table element identification sheet", subject: "Science", dueDate: addDays(new Date(), 7), priority: "low", completed: false, type: "assignment" },
];

const AssignmentsPage = () => {
  const [assignments, setAssignments] = useState<Task[]>(initialAssignments);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");

  const toggleTask = (id: string) => {
    setAssignments(assignments.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const addTask = (newTask: Omit<Task, "id" | "completed">) => {
    const task: Task = { ...newTask, id: Date.now().toString(), completed: false };
    setAssignments([task, ...assignments]);
  };

  const subjects = ["all", ...new Set(assignments.map(a => a.subject))];
  
  const filteredAssignments = assignments.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          a.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === "all" || a.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const pendingAssignments = filteredAssignments.filter(a => !a.completed);
  const completedAssignments = filteredAssignments.filter(a => a.completed);

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-8 lg:pt-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Assignments</h1>
            <p className="text-muted-foreground mt-1">Manage all your homework and projects in one place</p>
          </div>
          <QuickAddTask onAdd={addTask} />
        </header>

        <Card>
          <CardContent className="py-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search assignments..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
              </div>
              <div className="flex gap-2 flex-wrap">
                {subjects.map(subject => (
                  <Button key={subject} variant={selectedSubject === subject ? "default" : "outline"} size="sm" onClick={() => setSelectedSubject(subject)}>
                    {subject === "all" ? "All" : subject}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

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
      </div>
    </MainLayout>
  );
};

export default AssignmentsPage;
