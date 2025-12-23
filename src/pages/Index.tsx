import { useState } from "react";
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  TrendingUp,
  Sparkles 
} from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { WeekView } from "@/components/dashboard/WeekView";
import { UpcomingAssessments } from "@/components/dashboard/UpcomingAssessments";
import { FocusTips } from "@/components/dashboard/FocusTips";
import { TaskCard, Task } from "@/components/tasks/TaskCard";
import { QuickAddTask } from "@/components/tasks/QuickAddTask";
import { addDays } from "date-fns";

// Sample data - in a real app, this would come from a database
const initialTasks: Task[] = [
  {
    id: "1",
    title: "Complete English essay on Shakespeare's Hamlet",
    subject: "English",
    dueDate: new Date(),
    priority: "high",
    completed: false,
    type: "assignment",
  },
  {
    id: "2",
    title: "Math Chapter 7 Problems (pg 145-150)",
    subject: "Mathematics",
    dueDate: addDays(new Date(), 1),
    priority: "medium",
    completed: false,
    type: "assignment",
  },
  {
    id: "3",
    title: "Science Lab Report - Chemical Reactions",
    subject: "Science",
    dueDate: addDays(new Date(), 2),
    priority: "high",
    completed: false,
    type: "assignment",
  },
  {
    id: "4",
    title: "History Reading - World War II",
    subject: "History",
    dueDate: addDays(new Date(), 3),
    priority: "low",
    completed: true,
    type: "assignment",
  },
  {
    id: "5",
    title: "Art Project Sketch Draft",
    subject: "Art",
    dueDate: addDays(new Date(), 5),
    priority: "medium",
    completed: false,
    type: "assignment",
  },
];

const initialAssessments = [
  {
    id: "a1",
    title: "Algebra Unit Test",
    subject: "Mathematics",
    date: addDays(new Date(), 2),
    preparationProgress: 45,
    topics: ["Quadratic Equations", "Factoring", "Graphing"],
  },
  {
    id: "a2",
    title: "Science Quiz - Periodic Table",
    subject: "Science",
    date: addDays(new Date(), 5),
    preparationProgress: 70,
    topics: ["Elements", "Atomic Structure"],
  },
  {
    id: "a3",
    title: "English Literature Essay",
    subject: "English",
    date: addDays(new Date(), 7),
    preparationProgress: 20,
    topics: ["Analysis", "Themes", "Character Study"],
  },
];

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const addTask = (newTask: Omit<Task, "id" | "completed">) => {
    const task: Task = {
      ...newTask,
      id: Date.now().toString(),
      completed: false,
    };
    setTasks([task, ...tasks]);
  };

  const pendingTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);
  const urgentTasks = pendingTasks.filter(t => t.priority === "high");
  const todayTasks = pendingTasks.filter(t => {
    const today = new Date();
    return t.dueDate.toDateString() === today.toDateString();
  });

  // Get current time for greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <MainLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <header className="pt-8 lg:pt-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                {greeting}! 👋
              </h1>
              <p className="text-muted-foreground mt-1">
                Here's what you need to focus on today
              </p>
            </div>
            <QuickAddTask onAdd={addTask} />
          </div>
        </header>

        {/* Stats Grid */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Due Today"
            value={todayTasks.length}
            subtitle="tasks need attention"
            icon={Clock}
            variant={todayTasks.length > 0 ? "warning" : "default"}
          />
          <StatsCard
            title="Urgent"
            value={urgentTasks.length}
            subtitle="high priority tasks"
            icon={AlertTriangle}
            variant={urgentTasks.length > 0 ? "primary" : "default"}
          />
          <StatsCard
            title="Completed"
            value={completedTasks.length}
            subtitle="tasks done this week"
            icon={CheckCircle2}
            variant="success"
            trend={{ value: 15, positive: true }}
          />
          <StatsCard
            title="Focus Score"
            value="85%"
            subtitle="based on completion rate"
            icon={TrendingUp}
            variant="primary"
          />
        </section>

        {/* Week View */}
        <WeekView tasks={tasks} />

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Tasks Section */}
          <section className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Your Tasks
              </h2>
              <span className="text-sm text-muted-foreground">
                {pendingTasks.length} pending
              </span>
            </div>

            <div className="space-y-3 stagger-children">
              {pendingTasks.slice(0, 5).map((task) => (
                <TaskCard key={task.id} task={task} onToggle={toggleTask} />
              ))}
              {pendingTasks.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-success" />
                  <p className="font-medium">All caught up!</p>
                  <p className="text-sm">You've completed all your tasks. Great job!</p>
                </div>
              )}
            </div>
          </section>

          {/* Sidebar */}
          <aside className="space-y-6">
            <FocusTips />
            <UpcomingAssessments assessments={initialAssessments} />
          </aside>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
