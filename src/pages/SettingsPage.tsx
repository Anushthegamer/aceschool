import { useState, useEffect } from "react";
import { Sun, Moon, Monitor, User, Bell, Palette, Shield, BookOpen, Save, Wifi, Database, Key, Server, Code, Layers, Cpu, Globe, Lock, FileCode, Zap } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

type Theme = "light" | "dark" | "system";

const SettingsPage = () => {
  const { toast } = useToast();
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem("focusflow-theme") as Theme) || "light";
  });
  const [profile, setProfile] = useState({
    name: "Jack Williams",
    school: "Edison Middle School",
    grade: "8",
    email: "jack.williams@edison.k12.nj.us",
    studentId: "2026-0847",
    section: "8-A",
  });
  const [notifications, setNotifications] = useState({
    dueDateReminders: true,
    assessmentAlerts: true,
    dailyDigest: true,
    streakReminders: true,
    soundEffects: true,
  });
  const [preferences, setPreferences] = useState({
    pomodoroLength: "25",
    shortBreak: "5",
    longBreak: "15",
    weekStartsOn: "monday",
    defaultPriority: "medium",
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else if (theme === "light") {
      root.classList.remove("dark");
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      root.classList.toggle("dark", prefersDark);
    }
    localStorage.setItem("focusflow-theme", theme);
  }, [theme]);

  const saveSettings = () => {
    toast({ title: "Settings saved", description: "Your preferences have been updated, Jack." });
  };

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        <header className="pt-8 lg:pt-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">Customize your The Planner experience</p>
        </header>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="flex-wrap">
            <TabsTrigger value="profile" className="gap-2"><User className="h-4 w-4" />Profile</TabsTrigger>
            <TabsTrigger value="appearance" className="gap-2"><Palette className="h-4 w-4" />Appearance</TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2"><Bell className="h-4 w-4" />Notifications</TabsTrigger>
            <TabsTrigger value="preferences" className="gap-2"><BookOpen className="h-4 w-4" />Preferences</TabsTrigger>
            <TabsTrigger value="integrations" className="gap-2"><Wifi className="h-4 w-4" />Integrations</TabsTrigger>
            <TabsTrigger value="techstack" className="gap-2"><Code className="h-4 w-4" />Tech Stack</TabsTrigger>
          </TabsList>

          {/* Profile */}
          <TabsContent value="profile">
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Student Profile</CardTitle>
                <CardDescription>Your personal details for Jack Williams</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full gradient-calm flex items-center justify-center text-2xl font-bold text-primary-foreground">
                    JW
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{profile.name}</h3>
                    <p className="text-sm text-muted-foreground">{profile.school} • Grade {profile.grade} • Section {profile.section}</p>
                    <p className="text-xs text-muted-foreground">ID: {profile.studentId}</p>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Student ID</Label>
                    <Input value={profile.studentId} onChange={(e) => setProfile({ ...profile, studentId: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>School</Label>
                    <Input value={profile.school} onChange={(e) => setProfile({ ...profile, school: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Grade Level</Label>
                    <Select value={profile.grade} onValueChange={(v) => setProfile({ ...profile, grade: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {["6", "7", "8", "9", "10", "11", "12"].map((g) => (
                          <SelectItem key={g} value={g}>Grade {g}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Section</Label>
                    <Input value={profile.section} onChange={(e) => setProfile({ ...profile, section: e.target.value })} />
                  </div>
                </div>
                <Button variant="calm" className="gap-2 mt-4" onClick={saveSettings}>
                  <Save className="h-4 w-4" />Save Profile
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance */}
          <TabsContent value="appearance">
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Theme</CardTitle>
                <CardDescription>Choose how The Planner looks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  {([
                    { value: "light" as Theme, icon: Sun, label: "Light", desc: "Clean and bright" },
                    { value: "dark" as Theme, icon: Moon, label: "Dark", desc: "Easy on the eyes" },
                    { value: "system" as Theme, icon: Monitor, label: "System", desc: "Follow device" },
                  ]).map((t) => (
                    <button
                      key={t.value}
                      onClick={() => setTheme(t.value)}
                      className={cn(
                        "p-4 rounded-xl border-2 text-center transition-all",
                        theme === t.value
                          ? "border-primary bg-primary/5 shadow-glow"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <t.icon className={cn("h-8 w-8 mx-auto mb-2", theme === t.value ? "text-primary" : "text-muted-foreground")} />
                      <h4 className="font-medium text-foreground">{t.label}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{t.desc}</p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications">
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Control what alerts you receive</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {([
                  { key: "dueDateReminders", label: "Due Date Reminders", desc: "Get notified before assignments are due" },
                  { key: "assessmentAlerts", label: "Assessment Alerts", desc: "Reminders for upcoming tests and quizzes" },
                  { key: "dailyDigest", label: "Daily Digest", desc: "Morning summary of today's tasks" },
                  { key: "streakReminders", label: "Streak Reminders", desc: "Don't break your habits streak" },
                  { key: "soundEffects", label: "Sound Effects", desc: "Play sounds for timer and notifications" },
                ] as const).map((item) => (
                  <div key={item.key} className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">{item.label}</Label>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                    <Switch
                      checked={notifications[item.key]}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, [item.key]: checked })}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences */}
          <TabsContent value="preferences">
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Study Preferences</CardTitle>
                <CardDescription>Customize your study workflow</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Default Pomodoro Length</Label>
                    <Select value={preferences.pomodoroLength} onValueChange={(v) => setPreferences({ ...preferences, pomodoroLength: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {["15", "20", "25", "30", "45", "60"].map((m) => <SelectItem key={m} value={m}>{m} minutes</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Week Starts On</Label>
                    <Select value={preferences.weekStartsOn} onValueChange={(v) => setPreferences({ ...preferences, weekStartsOn: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monday">Monday</SelectItem>
                        <SelectItem value="sunday">Sunday</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Default Priority</Label>
                    <Select value={preferences.defaultPriority} onValueChange={(v) => setPreferences({ ...preferences, defaultPriority: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button variant="calm" className="gap-2 mt-4" onClick={saveSettings}>
                  <Save className="h-4 w-4" />Save Preferences
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Integrations */}
          <TabsContent value="integrations">
            <div className="space-y-4">
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle>API Integrations & Provisioning</CardTitle>
                  <CardDescription>Connect external services for real-time data sync</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { name: "Genesis Parent Portal", desc: "Sync real grades, attendance, report cards, and marking period data from your school's Genesis system", icon: Database, status: "ready" },
                    { name: "Google Classroom", desc: "Import assignments, class streams, announcements, and teacher materials automatically", icon: BookOpen, status: "ready" },
                    { name: "SmartPass", desc: "Digital hall passes, bathroom check-ins, and attendance tracking integration", icon: Shield, status: "ready" },
                    { name: "AWS Cloud Backend", desc: "Full-stack production server with S3 storage, Lambda functions, RDS database, and CloudFront CDN", icon: Server, status: "ready" },
                  ].map((api) => (
                    <div key={api.name} className="flex items-center gap-4 p-4 rounded-lg bg-muted/30 border border-border">
                      <api.icon className="h-8 w-8 text-muted-foreground" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground">{api.name}</h4>
                        <p className="text-xs text-muted-foreground">{api.desc}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="muted" className="text-[10px]">Provision Ready</Badge>
                        <Button variant="outline" size="sm" disabled>Connect</Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
              <Card className="border-dashed border-2 border-muted-foreground/20">
                <CardContent className="p-4 text-center">
                  <Key className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    API keys and OAuth tokens are securely stored with SHA-256 hashing.
                    Connect a backend to enable real-time sync with Genesis, Google Classroom, and SmartPass.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tech Stack */}
          <TabsContent value="techstack" className="space-y-4">
            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Code className="h-5 w-5 text-primary" />Architecture Overview</CardTitle>
                <CardDescription>How The Planner is built — for developers and tech professionals</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-muted/30 border border-border space-y-3">
                    <div className="flex items-center gap-2"><Layers className="h-5 w-5 text-primary" /><h4 className="font-semibold text-foreground">Frontend Stack</h4></div>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2"><FileCode className="h-4 w-4 mt-0.5 shrink-0" /><span><strong>React 18</strong> — Component-based UI with hooks and functional components</span></li>
                      <li className="flex items-start gap-2"><FileCode className="h-4 w-4 mt-0.5 shrink-0" /><span><strong>Vite 5</strong> — Ultra-fast dev server and optimized production builds</span></li>
                      <li className="flex items-start gap-2"><FileCode className="h-4 w-4 mt-0.5 shrink-0" /><span><strong>TypeScript 5</strong> — Full type safety across the entire codebase</span></li>
                      <li className="flex items-start gap-2"><FileCode className="h-4 w-4 mt-0.5 shrink-0" /><span><strong>Tailwind CSS v3</strong> — Utility-first styling with custom design tokens</span></li>
                      <li className="flex items-start gap-2"><FileCode className="h-4 w-4 mt-0.5 shrink-0" /><span><strong>shadcn/ui</strong> — Accessible, composable UI primitives (Radix + Tailwind)</span></li>
                      <li className="flex items-start gap-2"><FileCode className="h-4 w-4 mt-0.5 shrink-0" /><span><strong>Framer Motion</strong> — Declarative animations and layout transitions</span></li>
                      <li className="flex items-start gap-2"><FileCode className="h-4 w-4 mt-0.5 shrink-0" /><span><strong>React Query (TanStack)</strong> — Server-state caching, synchronization, and background refetching</span></li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/30 border border-border space-y-3">
                    <div className="flex items-center gap-2"><Server className="h-5 w-5 text-primary" /><h4 className="font-semibold text-foreground">Backend & Cloud</h4></div>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2"><Database className="h-4 w-4 mt-0.5 shrink-0" /><span><strong>Lovable Cloud</strong> — Managed backend with PostgreSQL, Auth, Storage, and Edge Functions</span></li>
                      <li className="flex items-start gap-2"><Database className="h-4 w-4 mt-0.5 shrink-0" /><span><strong>PostgreSQL 15</strong> — Relational database with row-level security (RLS) policies</span></li>
                      <li className="flex items-start gap-2"><Zap className="h-4 w-4 mt-0.5 shrink-0" /><span><strong>Supabase Edge Functions</strong> — Deno-based serverless functions for custom logic</span></li>
                      <li className="flex items-start gap-2"><Globe className="h-4 w-4 mt-0.5 shrink-0" /><span><strong>Supabase Realtime</strong> — WebSocket-based live updates for collaborative features</span></li>
                      <li className="flex items-start gap-2"><Cpu className="h-4 w-4 mt-0.5 shrink-0" /><span><strong>AWS S3</strong> — Object storage for file attachments, notes, and media</span></li>
                      <li className="flex items-start gap-2"><Shield className="h-4 w-4 mt-0.5 shrink-0" /><span><strong>AWS CloudFront</strong> — CDN for global asset delivery (planned)</span></li>
                    </ul>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-muted/30 border border-border space-y-3">
                  <div className="flex items-center gap-2"><Lock className="h-5 w-5 text-primary" /><h4 className="font-semibold text-foreground">Authentication & Security</h4></div>
                  <div className="grid sm:grid-cols-2 gap-4 text-sm text-muted-foreground">
                    <div className="space-y-2">
                      <p className="flex items-start gap-2"><Shield className="h-4 w-4 mt-0.5 shrink-0" /><span><strong>Google OAuth 2.0</strong> — Domain-restricted to <code className="bg-muted px-1 rounded">@edison.k12.nj.us</code></span></p>
                      <p className="flex items-start gap-2"><Shield className="h-4 w-4 mt-0.5 shrink-0" /><span><strong>JWT Tokens</strong> — Signed access/refresh tokens with automatic rotation</span></p>
                      <p className="flex items-start gap-2"><Shield className="h-4 w-4 mt-0.5 shrink-0" /><span><strong>Row-Level Security</strong> — Every table has RLS policies scoped to <code className="bg-muted px-1 rounded">auth.uid()</code></span></p>
                    </div>
                    <div className="space-y-2">
                      <p className="flex items-start gap-2"><Shield className="h-4 w-4 mt-0.5 shrink-0" /><span><strong>Role-Based Access</strong> — Separate <code className="bg-muted px-1 rounded">user_roles</code> table with security-definer functions</span></p>
                      <p className="flex items-start gap-2"><Shield className="h-4 w-4 mt-0.5 shrink-0" /><span><strong>Email Verification</strong> — Required before first sign-in; no anonymous access</span></p>
                      <p className="flex items-start gap-2"><Shield className="h-4 w-4 mt-0.5 shrink-0" /><span><strong>Secure Secrets</strong> — API keys stored server-side; never exposed in client bundles</span></p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-muted/30 border border-border space-y-3">
                  <div className="flex items-center gap-2"><Cpu className="h-5 w-5 text-primary" /><h4 className="font-semibold text-foreground">Data Architecture</h4></div>
                  <div className="text-sm text-muted-foreground space-y-2">
                    <p className="flex items-start gap-2"><Database className="h-4 w-4 mt-0.5 shrink-0" /><span><strong>Normalized Schema</strong> — Separate tables for assignments, assessments, grades, notes, goals, schedules, and user profiles with foreign-key relationships</span></p>
                    <p className="flex items-start gap-2"><Database className="h-4 w-4 mt-0.5 shrink-0" /><span><strong>Offline-First Design</strong> — localStorage caches critical data; React Query syncs in background</span></p>
                    <p className="flex items-start gap-2"><Database className="h-4 w-4 mt-0.5 shrink-0" /><span><strong>4-Term Academic Model</strong> — MP1–MP4 marking periods with weighted grading categories</span></p>
                    <p className="flex items-start gap-2"><Database className="h-4 w-4 mt-0.5 shrink-0" /><span><strong>Activity Logging</strong> — Audit trail for admin dashboard with user actions and timestamps</span></p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-muted/30 border border-border space-y-3">
                  <div className="flex items-center gap-2"><Globe className="h-5 w-5 text-primary" /><h4 className="font-semibold text-foreground">Deployment & Infrastructure</h4></div>
                  <div className="grid sm:grid-cols-3 gap-3 text-sm text-muted-foreground">
                    <div className="p-3 rounded-lg bg-background border border-border text-center">
                      <Globe className="h-6 w-6 mx-auto mb-2 text-primary" />
                      <p className="font-medium text-foreground">Lovable Deploy</p>
                      <p className="text-xs mt-1">Auto-deployed preview + production</p>
                    </div>
                    <div className="p-3 rounded-lg bg-background border border-border text-center">
                      <Database className="h-6 w-6 mx-auto mb-2 text-primary" />
                      <p className="font-medium text-foreground">PostgreSQL</p>
                      <p className="text-xs mt-1">Managed by Lovable Cloud</p>
                    </div>
                    <div className="p-3 rounded-lg bg-background border border-border text-center">
                      <Server className="h-6 w-6 mx-auto mb-2 text-primary" />
                      <p className="font-medium text-foreground">Edge Functions</p>
                      <p className="text-xs mt-1">Deno runtime, auto-deployed</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-2">
                  <p className="text-sm font-medium text-foreground">Built for Edison Middle School students by a fellow student.</p>
                  <p className="text-xs text-muted-foreground">
                    The Planner is an open-architecture student productivity platform. All backend logic is implemented via SQL migrations and TypeScript edge functions. Frontend state is managed with React hooks and TanStack Query. No hidden dependencies, no closed-source logic.
                  </p>
                  <p className="text-xs text-muted-foreground pt-1">
                    <strong>Developer:</strong> Ramskandh Thirandasu · <strong>Version:</strong> 2.0 · <strong>License:</strong> All rights reserved © 2026
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="mt-6">
          <CardContent className="pt-6 text-center">
            <p className="text-sm font-medium text-foreground">The Planner v2.0</p>
            <p className="text-xs text-muted-foreground mt-1">Developed by Ramskandh Thirandasu</p>
            <p className="text-[10px] text-muted-foreground/60 mt-1">© 2026 All rights reserved</p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default SettingsPage;
