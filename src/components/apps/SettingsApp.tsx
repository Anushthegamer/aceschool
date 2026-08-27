import { useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Settings, Palette, Clock, Info, Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "@/components/theme-provider";

export function SettingsApp() {
  const { theme, setTheme } = useTheme();
  const [pomodoroDuration, setPomodoroDuration] = useLocalStorage("edison-pomodoro-duration", 25);
  const [username, setUsername] = useLocalStorage("edison-username", "Edison");
  const [activeTab, setActiveTab] = useState<"general" | "appearance" | "timer" | "about">("general");

  const tabs = [
    { key: "general" as const, label: "General", icon: <Settings className="h-4 w-4" /> },
    { key: "appearance" as const, label: "Appearance", icon: <Palette className="h-4 w-4" /> },
    { key: "timer" as const, label: "Timer", icon: <Clock className="h-4 w-4" /> },
    { key: "about" as const, label: "About", icon: <Info className="h-4 w-4" /> },
  ];

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-40 border-r border-border/60 bg-muted/20 p-2 space-y-0.5">
        {tabs.map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs font-medium transition-colors ${activeTab === tab.key ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted/60"}`}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 p-5 overflow-y-auto">
        {activeTab === "general" && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-foreground">General Settings</h3>
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1.5">Your Name</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full max-w-xs px-3 py-2 bg-muted/40 border border-border/60 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
          </div>
        )}

        {activeTab === "appearance" && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-foreground">Appearance</h3>
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-2">Theme</label>
              <div className="flex gap-2">
                {[
                  { key: "light" as const, label: "Light", icon: <Sun className="h-4 w-4" /> },
                  { key: "dark" as const, label: "Dark", icon: <Moon className="h-4 w-4" /> },
                  { key: "system" as const, label: "System", icon: <Monitor className="h-4 w-4" /> },
                ].map((t) => (
                  <button key={t.key} onClick={() => setTheme(t.key)} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-medium transition-all ${theme === t.key ? "border-primary bg-primary/10 text-primary" : "border-border/60 text-muted-foreground hover:bg-muted/60"}`}>
                    {t.icon} {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "timer" && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-foreground">Focus Timer</h3>
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1.5">Default Duration (minutes)</label>
              <input type="number" value={pomodoroDuration} onChange={(e) => setPomodoroDuration(parseInt(e.target.value) || 25)} min={5} max={120} className="w-24 px-3 py-2 bg-muted/40 border border-border/60 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
          </div>
        )}

        {activeTab === "about" && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-foreground">About Edison OS</h3>
            <div className="p-4 bg-card rounded-xl border border-border/40">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white text-lg">⚡</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">Edison OS</p>
                  <p className="text-[10px] text-muted-foreground">Student Productivity WebOS</p>
                </div>
              </div>
              <div className="space-y-2 text-xs text-muted-foreground">
                <p>Built for Stardance WebOS 1 Hackathon</p>
                <p>By Ramskandh Thirandasu (Anushthegamer)</p>
                <p>React + Vite + TypeScript + Tailwind CSS</p>
                <p className="text-[10px] text-muted-foreground/60 mt-3">Version 1.0.0</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
