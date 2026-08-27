import { useState, useEffect } from "react";
import { useWindowManager } from "@/contexts/WindowManagerContext";
import { APP_REGISTRY } from "./DesktopIcon";
import { cn } from "@/lib/utils";

export function Taskbar() {
  const { windows, activeWindowId, focusWindow, minimizeWindow, openWindow } = useWindowManager();
  const [time, setTime] = useState(new Date());
  const [startOpen, setStartOpen] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const handleTaskClick = (win: { id: string; minimized: boolean }) => {
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
          <div className="fixed bottom-14 left-1/2 -translate-x-1/2 z-[9999] w-[520px] max-h-[70vh] bg-card/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="p-5 pb-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Applications</p>
              <div className="grid grid-cols-5 gap-1">
                {APP_REGISTRY.map((app) => (
                  <button
                    key={app.appKey}
                    onClick={() => { openWindow(app.appKey, app.title, ""); setStartOpen(false); }}
                    className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl hover:bg-white/8 transition-all group"
                  >
                    <div className={cn("w-10 h-10 rounded-[12px] flex items-center justify-center group-hover:scale-110 transition-transform shadow-md", app.color)}>
                      {app.icon}
                    </div>
                    <span className="text-[10px] text-muted-foreground group-hover:text-foreground transition-colors leading-tight text-center line-clamp-2">
                      {app.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Taskbar */}
      <div className="fixed bottom-0 left-0 right-0 h-[52px] z-[9990] flex items-center justify-center px-3">
        {/* Dock container */}
        <div className="flex items-center gap-0.5 px-3 py-1.5 bg-white/8 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl">
          {/* Start button */}
          <button
            onClick={() => setStartOpen(!startOpen)}
            className={cn(
              "w-9 h-9 flex items-center justify-center rounded-xl transition-all",
              startOpen ? "bg-white/15" : "hover:bg-white/10"
            )}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 text-white/70">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="w-px h-5 bg-white/10 mx-1" />

          {/* Open windows */}
          {windows.map((win) => (
            <button
              key={win.id}
              onClick={() => handleTaskClick(win)}
              className={cn(
                "relative h-9 px-3 flex items-center gap-2 rounded-xl transition-all text-xs font-medium",
                activeWindowId === win.id && !win.minimized
                  ? "bg-white/15 text-white"
                  : "text-white/50 hover:bg-white/8 hover:text-white/70"
              )}
            >
              <span className="hidden md:inline truncate max-w-[80px]">
                {APP_REGISTRY.find((a) => a.appKey === win.appKey)?.title || win.appKey}
              </span>
              {/* Active indicator */}
              {activeWindowId === win.id && !win.minimized && (
                <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-primary rounded-full" />
              )}
            </button>
          ))}

          {/* System tray */}
          <div className="w-px h-5 bg-white/10 mx-1" />
          <div className="flex items-center gap-3 px-2">
            <div className="text-[11px] text-white/50 font-medium tabular-nums">
              {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </div>
            <div className="text-[10px] text-white/30 hidden sm:block">
              {time.toLocaleDateString([], { month: "short", day: "numeric" })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
