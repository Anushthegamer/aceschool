import { useState, useEffect } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import {
  Timer, StickyNote, Layers, Brain, Calculator,
  TrendingUp, BookOpen, BarChart3, Sparkles,
  Clock, CheckCircle2, AlertCircle, GraduationCap
} from "lucide-react";

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  return (
    <div className="bg-muted/40 rounded-xl p-4 border border-border/40">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          {icon}
        </div>
        <div>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </div>
    </div>
  );
}

export function DashboardApp() {
  const [notes] = useLocalStorage<any[]>("edison-notes", []);
  const [flashcards] = useLocalStorage<any[]>("edison-flashcards", []);
  const [studyPlan] = useLocalStorage<any>("edison-study-plan", null);
  const [gpa] = useLocalStorage<string>("edison-gpa", "0.00");
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  const hour = now.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">{greeting}, Edison</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {now.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <StatCard icon={<StickyNote className="h-5 w-5 text-white" />} label="Notes" value={String(notes.length)} color="bg-gradient-to-br from-amber-400 to-orange-500" />
        <StatCard icon={<Layers className="h-5 w-5 text-white" />} label="Flashcards" value={String(flashcards.length)} color="bg-gradient-to-br from-cyan-400 to-blue-500" />
        <StatCard icon={<BarChart3 className="h-5 w-5 text-white" />} label="GPA" value={gpa} color="bg-gradient-to-br from-indigo-400 to-blue-600" />
        <StatCard icon={<Brain className="h-5 w-5 text-white" />} label="Study Tasks" value={studyPlan?.tasks?.length ? String(studyPlan.tasks.length) : "0"} color="bg-gradient-to-br from-emerald-400 to-teal-500" />
      </div>

      <div className="bg-muted/30 rounded-xl p-4 border border-border/40">
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "Start Focus Session", icon: <Timer className="h-4 w-4" />, action: "pomodoro" },
            { label: "Review Flashcards", icon: <Layers className="h-4 w-4" />, action: "flashcards" },
            { label: "Add a Note", icon: <StickyNote className="h-4 w-4" />, action: "notes" },
            { label: "Plan Study Time", icon: <Brain className="h-4 w-4" />, action: "study-planner" },
          ].map((item) => (
            <button
              key={item.action}
              className="flex items-center gap-2 p-3 rounded-lg bg-card border border-border/40 hover:bg-muted/60 transition-colors text-left"
            >
              <span className="text-primary">{item.icon}</span>
              <span className="text-xs font-medium text-foreground">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
