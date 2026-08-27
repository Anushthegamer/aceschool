import { useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Plus, Trash2, Target, CheckCircle2, Circle } from "lucide-react";

interface Goal {
  id: string;
  title: string;
  target: string;
  progress: number;
  done: boolean;
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function GoalsApp() {
  const [goals, setGoals] = useLocalStorage<Goal[]>("edison-goals", []);
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState("");
  const [target, setTarget] = useState("");

  const add = () => {
    if (!title.trim()) return;
    setGoals((prev) => [...prev, { id: uid(), title: title.trim(), target: target.trim(), progress: 0, done: false }]);
    setTitle(""); setTarget(""); setShowAdd(false);
  };

  const updateProgress = (id: string, delta: number) => {
    setGoals((prev) => prev.map((g) => {
      if (g.id !== id) return g;
      const newProgress = Math.min(100, Math.max(0, g.progress + delta));
      return { ...g, progress: newProgress, done: newProgress >= 100 };
    }));
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-border/60 bg-muted/20 flex items-center justify-between">
        <h3 className="text-sm font-bold text-foreground">Goals</h3>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-1 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium">
          <Plus className="h-3 w-3" /> Add
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {goals.length === 0 && (
          <div className="text-center py-10">
            <Target className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No goals set</p>
          </div>
        )}
        {goals.map((g) => (
          <div key={g.id} className={`p-3 rounded-xl border ${g.done ? "bg-emerald-500/5 border-emerald-500/20" : "bg-card border-border/40"}`}>
            <div className="flex items-center gap-3">
              {g.done ? <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" /> : <Circle className="h-5 w-5 text-muted-foreground shrink-0" />}
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${g.done ? "text-emerald-500" : "text-foreground"}`}>{g.title}</p>
                {g.target && <p className="text-[10px] text-muted-foreground">{g.target}</p>}
              </div>
              <span className="text-xs font-bold text-primary">{g.progress}%</span>
              <button onClick={() => setGoals((p) => p.filter((x) => x.id !== g.id))}>
                <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
              </button>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-muted/40 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-violet-400 rounded-full transition-all" style={{ width: `${g.progress}%` }} />
              </div>
              <button onClick={() => updateProgress(g.id, 10)} className="text-[10px] text-primary hover:underline">+10%</button>
              <button onClick={() => updateProgress(g.id, -10)} className="text-[10px] text-muted-foreground hover:underline">−10%</button>
            </div>
          </div>
        ))}
      </div>
      {showAdd && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-card rounded-2xl border border-border/60 shadow-glow p-5 w-80">
            <h3 className="text-sm font-bold text-foreground mb-3">New Goal</h3>
            <input type="text" placeholder="Goal" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 bg-muted/40 border border-border/60 rounded-xl text-sm mb-2 focus:outline-none focus:ring-1 focus:ring-primary" />
            <input type="text" placeholder="Description (optional)" value={target} onChange={(e) => setTarget(e.target.value)} className="w-full px-3 py-2 bg-muted/40 border border-border/60 rounded-xl text-sm mb-3 focus:outline-none focus:ring-1 focus:ring-primary" />
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowAdd(false)} className="px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground">Cancel</button>
              <button onClick={add} className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium">Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
