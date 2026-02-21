import { useState, useEffect } from "react";
import { Sun, Moon, Monitor, User, Bell, Palette, Shield, BookOpen, Save } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

type Theme = "light" | "dark" | "system";

const SettingsPage = () => {
  const { toast } = useToast();
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem("focusflow-theme") as Theme) || "light";
  });
  const [profile, setProfile] = useState({
    name: "Student",
    school: "Edison Middle School",
    grade: "8",
    email: "",
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
    toast({ title: "Settings saved", description: "Your preferences have been updated." });
  };

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        <header className="pt-8 lg:pt-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">Customize your FocusFlow experience</p>
        </header>

        <Tabs defaultValue="appearance" className="space-y-6">
          <TabsList className="flex-wrap">
            <TabsTrigger value="appearance" className="gap-2"><Palette className="h-4 w-4" />Appearance</TabsTrigger>
            <TabsTrigger value="profile" className="gap-2"><User className="h-4 w-4" />Profile</TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2"><Bell className="h-4 w-4" />Notifications</TabsTrigger>
            <TabsTrigger value="preferences" className="gap-2"><BookOpen className="h-4 w-4" />Preferences</TabsTrigger>
          </TabsList>

          {/* Appearance */}
          <TabsContent value="appearance">
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Theme</CardTitle>
                <CardDescription>Choose how FocusFlow looks</CardDescription>
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

          {/* Profile */}
          <TabsContent value="profile">
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Your personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full gradient-calm flex items-center justify-center text-2xl font-bold text-primary-foreground">
                    {profile.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{profile.name}</h3>
                    <p className="text-sm text-muted-foreground">{profile.school} • Grade {profile.grade}</p>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Display Name</Label>
                    <Input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} placeholder="student@school.com" />
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
                        {["7", "8", "9", "10", "11", "12"].map((g) => (
                          <SelectItem key={g} value={g}>Grade {g}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button variant="calm" className="gap-2 mt-4" onClick={saveSettings}>
                  <Save className="h-4 w-4" />Save Profile
                </Button>
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
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default SettingsPage;
