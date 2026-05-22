import { useState } from "react";
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  TrendingUp,
  Sparkles,
  Timer,
  BarChart3,
  Layers,
  Brain,
  FolderOpen,
  Calendar,
  Zap,
  Shield,
  GraduationCap,
  Users,
  Trophy,
  Wifi
} from "lucide-react";
import { Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { WeekView } from "@/components/dashboard/WeekView";
import { UpcomingAssessments } from "@/components/dashboard/UpcomingAssessments";
import { FocusTips } from "@/components/dashboard/FocusTips";
import { MoodTracker } from "@/components/dashboard/MoodTracker";
import { StreakWidget } from "@/components/dashboard/StreakWidget";
import { SubjectBreakdown } from "@/components/dashboard/SubjectBreakdown";
import { TaskCard, Task } from "@/components/tasks/TaskCard";
import { QuickAddTask } from "@/components/tasks/QuickAddTask";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { addDays } from "date-fns";
import { AnnouncementsBanner } from "@/components/AnnouncementsBanner";

const initialTasks: Task[] = [
  { id: "1", title: "Pre-Algebra: Solve linear equations worksheet (pg 178-182)", subject: "Mathematics", dueDate: new Date(), priority: "high", completed: false, type: "assignment" },
  { id: "2", title: "ELA: Read chapters 12-14 of 'To Kill a Mockingbird'", subject: "English Language Arts", dueDate: addDays(new Date(), 1), priority: "medium", completed: false, type: "assignment" },
  { id: "3", title: "Science: Cell division lab report – draw and label diagrams", subject: "Science", dueDate: addDays(new Date(), 2), priority: "high", completed: false, type: "assignment" },
  { id: "4", title: "U.S. History: Read Ch. 5 – Causes of the American Revolution", subject: "U.S. History", dueDate: addDays(new Date(), 3), priority: "low", completed: true, type: "assignment" },
  { id: "5", title: "Spanish I: Conjugate -AR verbs worksheet", subject: "Spanish", dueDate: addDays(new Date(), 1), priority: "medium", completed: false, type: "assignment" },
  { id: "6", title: "Art & Design: Sketch perspective drawing draft", subject: "Art", dueDate: addDays(new Date(), 5), priority: "low", completed: false, type: "assignment" },
];

const initialAssessments = [
  { id: "a1", title: "Pre-Algebra Unit 5 Test", subject: "Mathematics", date: addDays(new Date(), 3), preparationProgress: 45, topics: ["Linear Equations", "Slope-Intercept Form", "Graphing Lines"] },
  { id: "a2", title: "Science Quiz – Cell Biology", subject: "Science", date: addDays(new Date(), 5), preparationProgress: 70, topics: ["Mitosis", "Cell Organelles", "Osmosis"] },
  { id: "a3", title: "ELA Essay – To Kill a Mockingbird", subject: "English Language Arts", date: addDays(new Date(), 7), preparationProgress: 20, topics: ["Theme Analysis", "Character Study", "MLA Format"] },
];

const gpaData = {
  current: 3.67,
  cumulative: 3.72,
  classRank: 28,
  totalStudents: 312,
};

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const addTask = (newTask: Omit<Task, "id" | "completed">) => {
    const task: Task = { ...newTask, id: Date.now().toString(), completed: false };
    setTasks([task, ...tasks]);
  };

  const pendingTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);
  const urgentTasks = pendingTasks.filter(t => t.priority === "high");
  const todayTasks = pendingTasks.filter(t => t.dueDate.toDateString() === new Date().toDateString());

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Hero Header */}
        <header className="pt-8 lg:pt-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{greeting}, Jack! 👋</h1>
              <p className="text-muted-foreground mt-1">Edison Middle School • Grade 8 • MP3 2025–2026</p>
            </div>
            <div className="flex items-center gap-3">
              <QuickAddTask onAdd={addTask} />
            </div>
          </div>
        </header>

        <AnnouncementsBanner />


        {/* GPA + Student Card */}
        <Card className="bg-gradient-to-r from-primary/10 via-info/5 to-success/10 border-primary/20">
          <CardContent className="p-5">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="w-16 h-16 rounded-full gradient-calm flex items-center justify-center text-2xl font-bold text-primary-foreground shadow-glow">
                JW
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-xl font-bold text-foreground">Jack Williams</h2>
                <p className="text-sm text-muted-foreground">Student ID: 2026-0847 • 8th Grade • Section 8-A</p>
              </div>
              <div className="flex gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">{gpaData.current}</div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">GPA (MP3)</p>
                </div>
                <div>
                  <div className="text-2xl font-bold text-success">{gpaData.cumulative}</div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Cumulative</p>
                </div>
                <div>
                  <div className="text-2xl font-bold text-info">A-</div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Overall</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard title="Due Today" value={todayTasks.length} subtitle="tasks need attention" icon={Clock} variant={todayTasks.length > 0 ? "warning" : "default"} />
          <StatsCard title="Urgent" value={urgentTasks.length} subtitle="high priority" icon={AlertTriangle} variant={urgentTasks.length > 0 ? "primary" : "default"} />
          <StatsCard title="Completed" value={completedTasks.length} subtitle="tasks done" icon={CheckCircle2} variant="success" trend={{ value: 15, positive: true }} />
          <StatsCard title="Focus Score" value="85%" subtitle="completion rate" icon={TrendingUp} variant="primary" />
        </section>

        {/* Streak + Mood */}
        <div className="grid sm:grid-cols-2 gap-4">
          <StreakWidget currentStreak={12} longestStreak={28} todayComplete={completedTasks.length > 0} />
          <FocusTips />
        </div>

        {/* School Time Management */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Today's School Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-1 overflow-x-auto pb-2">
              {[
                { time: "8:00", label: "Math", active: false, done: true },
                { time: "8:55", label: "ELA", active: false, done: true },
                { time: "9:50", label: "History", active: true, done: false },
                { time: "10:45", label: "Advisory", active: false, done: false },
                { time: "11:15", label: "Lunch", active: false, done: false },
                { time: "12:00", label: "Science", active: false, done: false },
                { time: "12:55", label: "Spanish", active: false, done: false },
                { time: "1:50", label: "PE", active: false, done: false },
              ].map((period, i) => (
                <div key={i} className={`flex-1 min-w-[80px] p-2 rounded-lg text-center text-xs border transition-all ${
                  period.active ? "bg-primary/10 border-primary/40 ring-2 ring-primary/30" : 
                  period.done ? "bg-success/10 border-success/20 opacity-70" : "bg-muted/50 border-border"
                }`}>
                  <div className="font-medium text-foreground">{period.label}</div>
                  <div className="text-muted-foreground text-[10px]">{period.time}</div>
                  {period.active && <Badge variant="success" className="text-[8px] mt-1 px-1">NOW</Badge>}
                  {period.done && <CheckCircle2 className="h-3 w-3 text-success mx-auto mt-1" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <WeekView tasks={tasks} />

        {/* Quick Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <Link to="/pomodoro">
            <Card className="hover-lift cursor-pointer border-primary/20 bg-primary/5">
              <CardContent className="p-4 flex items-center gap-3">
                <Timer className="h-5 w-5 text-primary" />
                <span className="font-medium text-sm">Focus Timer</span>
              </CardContent>
            </Card>
          </Link>
          <Link to="/flashcards">
            <Card className="hover-lift cursor-pointer border-info/20 bg-info/5">
              <CardContent className="p-4 flex items-center gap-3">
                <Layers className="h-5 w-5 text-info" />
                <span className="font-medium text-sm">Flashcards</span>
              </CardContent>
            </Card>
          </Link>
          <Link to="/study-planner">
            <Card className="hover-lift cursor-pointer border-warning/20 bg-warning/5">
              <CardContent className="p-4 flex items-center gap-3">
                <Brain className="h-5 w-5 text-warning" />
                <span className="font-medium text-sm">Study Planner</span>
              </CardContent>
            </Card>
          </Link>
          <Link to="/schedule">
            <Card className="hover-lift cursor-pointer border-success/20 bg-success/5">
              <CardContent className="p-4 flex items-center gap-3">
                <Calendar className="h-5 w-5 text-success" />
                <span className="font-medium text-sm">Schedule</span>
              </CardContent>
            </Card>
          </Link>
          <Link to="/resources">
            <Card className="hover-lift cursor-pointer border-destructive/20 bg-destructive/5">
              <CardContent className="p-4 flex items-center gap-3">
                <FolderOpen className="h-5 w-5 text-destructive" />
                <span className="font-medium text-sm">Resources</span>
              </CardContent>
            </Card>
          </Link>
          <Link to="/grades">
            <Card className="hover-lift cursor-pointer border-primary/20 bg-primary/5">
              <CardContent className="p-4 flex items-center gap-3">
                <BarChart3 className="h-5 w-5 text-primary" />
                <span className="font-medium text-sm">Grades</span>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Integration Status Bar */}
        <Card className="border-dashed border-2 border-muted-foreground/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Wifi className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">API Integrations</span>
              <Badge variant="muted" className="text-[10px]">Ready for Connection</Badge>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { name: "Genesis Portal", status: "ready", desc: "Sync real grades & attendance", icon: GraduationCap },
                { name: "Google Classroom", status: "ready", desc: "Import assignments & classes", icon: Users },
                { name: "SmartPass", status: "ready", desc: "Hall passes & check-ins", icon: Shield },
                { name: "AWS / Cloud", status: "ready", desc: "Full-stack production server", icon: Zap },
              ].map((api) => (
                <div key={api.name} className="p-3 rounded-lg bg-muted/30 border border-border text-center">
                  <api.icon className="h-5 w-5 text-muted-foreground mx-auto mb-1" />
                  <p className="text-xs font-medium text-foreground">{api.name}</p>
                  <p className="text-[10px] text-muted-foreground">{api.desc}</p>
                  <Badge variant="muted" className="text-[8px] mt-1">Provision Ready</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Your Tasks
              </h2>
              <span className="text-sm text-muted-foreground">{pendingTasks.length} pending</span>
            </div>
            <div className="space-y-3 stagger-children">
              {pendingTasks.slice(0, 6).map((task) => (
                <TaskCard key={task.id} task={task} onToggle={toggleTask} />
              ))}
              {pendingTasks.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-success" />
                  <p className="font-medium">All caught up!</p>
                  <p className="text-sm">Great job, Jack!</p>
                </div>
              )}
            </div>
          </section>

          <aside className="space-y-6">
            <MoodTracker />

            {/* Clubs & Electives */}
            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-warning" />
                  Clubs & Electives
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { name: "Robotics Club", day: "Tuesdays", time: "3:00–4:30 PM", emoji: "🤖" },
                  { name: "Math League", day: "Thursdays", time: "3:00–4:00 PM", emoji: "🧮" },
                  { name: "Art & Design", day: "Mon/Wed", time: "Period 3", emoji: "🎨" },
                  { name: "Band – Trumpet", day: "Wed", time: "Period 6", emoji: "🎺" },
                  { name: "Student Council", day: "Fridays", time: "Lunch", emoji: "🗳️" },
                ].map((club) => (
                  <div key={club.name} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50 border border-border">
                    <span className="text-lg">{club.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{club.name}</p>
                      <p className="text-[10px] text-muted-foreground">{club.day} • {club.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <SubjectBreakdown />
            <UpcomingAssessments assessments={initialAssessments} />
          </aside>
        </div>
      </div>
      <footer className="mt-8 pt-4 border-t border-border text-center text-xs text-muted-foreground">
        The Planner — Made by Ramskandh Thirandasu
      </footer>
    </MainLayout>
  );
};

export default Index;
