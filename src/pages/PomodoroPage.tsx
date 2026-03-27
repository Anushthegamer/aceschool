import { useState, useEffect, useCallback, useRef } from "react";
import { Play, Pause, RotateCcw, SkipForward, Coffee, Brain, Zap, Volume2, VolumeX, Settings } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

type TimerMode = "focus" | "shortBreak" | "longBreak";

interface Session {
  id: string;
  mode: TimerMode;
  duration: number;
  completedAt: Date;
}

const modeConfig = {
  focus: { label: "Focus Time", icon: Brain, duration: 25, color: "text-primary" },
  shortBreak: { label: "Short Break", icon: Coffee, duration: 5, color: "text-success" },
  longBreak: { label: "Long Break", icon: Zap, duration: 15, color: "text-info" },
};

const PomodoroPage = () => {
  const [mode, setMode] = useState<TimerMode>("focus");
  const [customDurations, setCustomDurations] = useState({ focus: 25, shortBreak: 5, longBreak: 15 });
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalTime = customDurations[mode] * 60;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  const playSound = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 800;
      gain.gain.value = 0.3;
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch {}
  }, [soundEnabled]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      playSound();
      const session: Session = {
        id: Date.now().toString(),
        mode,
        duration: customDurations[mode],
        completedAt: new Date(),
      };
      setSessions((prev) => [session, ...prev]);
      if (mode === "focus") {
        const newCount = pomodoroCount + 1;
        setPomodoroCount(newCount);
        if (newCount % 4 === 0) {
          switchMode("longBreak");
        } else {
          switchMode("shortBreak");
        }
      } else {
        switchMode("focus");
      }
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, timeLeft]);

  const switchMode = (newMode: TimerMode) => {
    setMode(newMode);
    setTimeLeft(customDurations[newMode] * 60);
    setIsRunning(false);
  };

  const toggleTimer = () => setIsRunning(!isRunning);
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(customDurations[mode] * 60);
  };
  const skipSession = () => {
    if (mode === "focus") switchMode("shortBreak");
    else switchMode("focus");
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const config = modeConfig[mode];
  const todaySessions = sessions.filter(
    (s) => s.mode === "focus" && s.completedAt.toDateString() === new Date().toDateString()
  );
  const totalFocusMinutes = todaySessions.reduce((sum, s) => sum + s.duration, 0);

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-8 lg:pt-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Pomodoro Timer</h1>
            <p className="text-muted-foreground mt-1">Stay focused, take breaks, be productive</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={() => setSoundEnabled(!soundEnabled)}>
              {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
            <Button variant="outline" size="icon" onClick={() => setShowSettings(!showSettings)}>
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </header>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Mode Selector */}
            <div className="flex gap-2">
              {(Object.entries(modeConfig) as [TimerMode, typeof modeConfig.focus][]).map(([key, cfg]) => (
                <Button
                  key={key}
                  variant={mode === key ? "default" : "outline"}
                  onClick={() => switchMode(key)}
                  className="gap-2 flex-1"
                >
                  <cfg.icon className="h-4 w-4" />
                  {cfg.label}
                </Button>
              ))}
            </div>

            {/* Timer Display */}
            <Card variant="elevated" className="relative overflow-hidden">
              <div className={cn(
                "absolute inset-0 opacity-5",
                mode === "focus" ? "gradient-calm" : mode === "shortBreak" ? "bg-success" : "bg-info"
              )} />
              <CardContent className="py-12 sm:py-16 relative">
                <div className="text-center">
                  <config.icon className={cn("h-12 w-12 mx-auto mb-4", config.color)} />
                  <h2 className={cn("text-sm font-medium uppercase tracking-widest mb-6", config.color)}>
                    {config.label}
                  </h2>
                  <div className="text-7xl sm:text-8xl font-bold text-foreground tabular-nums tracking-tight mb-8">
                    {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
                  </div>
                  <Progress value={progress} className="h-2 max-w-md mx-auto mb-8" />
                  <div className="flex items-center justify-center gap-3">
                    <Button variant="outline" size="icon" onClick={resetTimer}>
                      <RotateCcw className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="calm"
                      size="lg"
                      className="px-12 h-14 text-lg gap-3"
                      onClick={toggleTimer}
                    >
                      {isRunning ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                      {isRunning ? "Pause" : "Start"}
                    </Button>
                    <Button variant="outline" size="icon" onClick={skipSession}>
                      <SkipForward className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Settings */}
            {showSettings && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Timer Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {(Object.entries(modeConfig) as [TimerMode, typeof modeConfig.focus][]).map(([key, cfg]) => (
                    <div key={key} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">{cfg.label}</label>
                        <span className="text-sm text-muted-foreground">{customDurations[key]} min</span>
                      </div>
                      <Slider
                        value={[customDurations[key]]}
                        onValueChange={([val]) => {
                          setCustomDurations((prev) => ({ ...prev, [key]: val }));
                          if (mode === key && !isRunning) setTimeLeft(val * 60);
                        }}
                        min={1}
                        max={key === "focus" ? 60 : 30}
                        step={1}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-6">
            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="text-lg">Today's Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <div className="text-4xl font-bold text-primary">{pomodoroCount}</div>
                  <p className="text-sm text-muted-foreground mt-1">Pomodoros completed</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-success/5 border border-success/20">
                  <div className="text-4xl font-bold text-success">{totalFocusMinutes}</div>
                  <p className="text-sm text-muted-foreground mt-1">Minutes focused today</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-info/5 border border-info/20">
                  <div className="text-4xl font-bold text-info">
                    {sessions.filter((s) => s.mode !== "focus").length}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Breaks taken</p>
                </div>
              </CardContent>
            </Card>

            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="text-lg">Recent Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                {sessions.length > 0 ? (
                  <div className="space-y-2">
                    {sessions.slice(0, 8).map((session) => {
                      const cfg = modeConfig[session.mode];
                      return (
                        <div key={session.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                          <cfg.icon className={cn("h-4 w-4", cfg.color)} />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{cfg.label}</p>
                            <p className="text-xs text-muted-foreground">
                              {session.duration} min
                            </p>
                          </div>
                          <Badge variant="muted" className="text-xs">
                            {session.completedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-4 text-sm">
                    No sessions yet. Start your first pomodoro!
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default PomodoroPage;
