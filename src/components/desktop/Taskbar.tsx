import { useState, useEffect } from "react";
import { useWindowManager } from "@/contexts/WindowManagerContext";
import { APP_REGISTRY } from "./DesktopIcon";
import { cn } from "@/lib/utils";
import {
  Timer, StickyNote, Layers, Brain, Calculator,
  BarChart3, Calendar, Settings, Sparkles, BookOpen,
  TrendingUp, FolderOpen, X
} from "lucide-react";

const ICON_MAP: Record<string, React.ReactNode> = {
  dashboard: <Sparkles className="h-4 w-4" />,
  notes: <StickyNote className="h-4 w-4" />,
  pomodoro: <Timer className="h-4 w-4" />,
  flashcards: <Layers className="h-4 w-4" />,
  "study-planner": <Brain className="h-4 w-4" />,
  calculator: <Calculator className="h-4 w-4" />,
  grades: <BarChart3 className="h-4 w-4" />,
  schedule: <Calendar className="h-4 w-4" />,
  assignments: <BookOpen className="h-4 w-4" />,
  goals: <TrendingUp className="h-4 w-4" />,
  resources: <FolderOpen className="h-4 w-4" />,
  settings: <Settings className="h-4 w-4" />,
  "gpa-projector": <BarChart3 className="h-4 w-4" />,
  "report-card": <BarChart3 className="h-4 w-4" />,
  about: <Sparkles className="h-4 w-4" />,
};

function getIcon(appKey: string) {
  return ICON_MAP[appKey] || <Sparkles className="h-4 w-4" />;
}

function getLabel(appKey: string) {
  const reg = APP_REGISTRY.find((a) => a.appKey === appKey);
  return reg?.title || appKey;
}

export function Taskbar() {
  const { windows, activeWindowId, focusWindow, minimizeWindow } = useWindowManager();
  const [time, setTime] = useState(new Date());
  const [startOpen, setStartOpen] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const handleTaskClick = (win: { id: string; minimized: boolean; appKey: string }) => {
    if (win.minimized) {
      focusWindow(win.id);
    } else if (activeWindowId === win.id) {
      minimizeWindow(win.id);
    } else {
      focusWindow(win.id);
    }
  };

  return (
    <>
      {/* Start Menu */}
      {startOpen && (
        <>
          <div className="fixed inset-0 z-[9998]" onClick={() => setStartOpen(false)} />
          <div className="fixed bottom-12 left-2 z-[9999] w-72 bg-card/95 backdrop-blur-xl border border-border/60 rounded-xl shadow-glow overflow-hidden animate-scale-in">
            <div className="p-3 border-b border-border/60 bg-primary/5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">Edison OS</p>
                  <p className="text-[10px] text-muted-foreground">Student Productivity</p>
                </div>
              </div>
            </div>
            <div className="p-2 max-h-[400px] overflow-y-auto">
              {APP_REGISTRY.map((app) => (
                <button
                  key={app.appKey}
                  onClick={() => {
                    useWindowManager().openWindow(app.appKey, app.title, "");
                    setStartOpen(false);
                  }}
                  className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-muted/60 transition-colors text-left"
                >
                  <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center", app.color)}>
                    {app.icon}
                  </div>
                  <span className="text-sm font-medium text-foreground">{app.title}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Taskbar */}
      <div className="fixed bottom-0 left-0 right-0 h-12 bg-card/90 backdrop-blur-xl border-t border-border/60 flex items-center px-2 gap-1 z-[9990]">
        {/* Start button */}
        <button
          onClick={() => setStartOpen(!startOpen)}
          className={cn(
            "h-9 px-3 flex items-center gap-2 rounded-lg transition-colors",
            startOpen ? "bg-primary/10 text-primary" : "hover:bg-muted/60 text-foreground"
          )}
        >
          <Sparkles className="h-4 w-4" />
          <span className="text-xs font-bold hidden sm:inline">Edison</span>
        </button>

        <div className="w-px h-6 bg-border/60 mx-1" />

        {/* Open windows */}
        <div className="flex-1 flex items-center gap-1 overflow-x-auto">
          {windows.map((win) => (
            <button
              key={win.id}
              onClick={() => handleTaskClick(win)}
              className={cn(
                "h-9 px-3 flex items-center gap-2 rounded-lg transition-all text-xs font-medium shrink-0",
                activeWindowId === win.id && !win.minimized
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : win.minimized
                  ? "text-muted-foreground hover:bg-muted/40"
                  : "bg-muted/40 text-foreground"
              )}
            >
              {getIcon(win.appKey)}
              <span className="hidden md:inline truncate max-w-[100px]">{getLabel(win.appKey)}</span>
            </button>
          ))}
        </div>

        <div className="w-px h-6 bg-border/60 mx-1" />

        {/* System tray */}
        <div className="flex items-center gap-3 px-2">
          <div className="text-xs text-muted-foreground font-medium tabular-nums">
            {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </div>
          <div className="text-[10px] text-muted-foreground/60 hidden sm:block">
            {time.toLocaleDateString([], { month: "short", day: "numeric" })}
          </div>
        </div>
      </div>
    </>
  );
}
