import { useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Plus, Trash2, CheckCircle2, Circle, Clock, Calendar } from "lucide-react";

interface Task {
  id: string;
  title: string;
  subject: string;
  done: boolean;
  dueDate: string;
  priority: "high" | "medium" | "low";
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

const PRIORITY_COLORS = {
  high: "bg-red-500",
  medium: "bg-amber-500",
  low: "bg-emerald-500",
};

export function StudyPlannerApp() {
  const [tasks, setTasks] = useLocalStorage<Task[]>("edison-study-tasks", []);
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<Task["priority"]>("medium");
  const [filter, setFilter] = useState<"all" | "pending" | "done">("all");

  const addTask = () => {
    if (!title.trim()) return;
    setTasks((prev) => [...prev, { id: uid(), title: title.trim(), subject: subject.trim() || "General", done: false, dueDate, priority }]);
    setTitle("");
    setSubject("");
    setDueDate("");
    setShowAdd(false);
  };

  const toggleTask = (id: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const filtered = tasks.filter((t) => {
    if (filter === "pending") return !t.done;
    if (filter === "done") return t.done;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1;
    const prio = { high: 0, medium: 1, low: 2 };
    return prio[a.priority] - prio[b.priority];
  });

  const completedCount = tasks.filter((t) => t.done).length;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border/60 bg-muted/20">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-foreground">Study Tasks</h3>
          <button onClick={() => setShowAdd(true)} className="flex items-center gap-1 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-primary/90">
            <Plus className="h-3 w-3" /> Add Task
          </button>
        </div>
        <div className="flex items-center gap-2">
          {(["all", "pending", "done"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${filter === f ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted/60"}`}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
          <span className="ml-auto text-[10px] text-muted-foreground">
            {completedCount}/{tasks.length} done
          </span>
        </div>
      </div>

      {/* Tasks */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {sorted.length === 0 && (
          <div className="text-center py-10">
            <Clock className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">{filter === "all" ? "No tasks yet" : `No ${filter} tasks`}</p>
          </div>
        )}
        {sorted.map((task) => (
          <div key={task.id} className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${task.done ? "bg-muted/20 border-border/30 opacity-60" : "bg-card border-border/40 hover:border-border/60"}`}>
            <button onClick={() => toggleTask(task.id)} className="shrink-0">
              {task.done ? <CheckCircle2 className="h-5 w-5 text-emerald-500" /> : <Circle className="h-5 w-5 text-muted-foreground" />}
            </button>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${task.done ? "line-through text-muted-foreground" : "text-foreground"}`}>{task.title}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] text-muted-foreground">{task.subject}</span>
                {task.dueDate && <span className="text-[10px] text-muted-foreground">Due {task.dueDate}</span>}
              </div>
            </div>
            <div className={`w-2 h-2 rounded-full shrink-0 ${PRIORITY_COLORS[task.priority]}`} />
            <button onClick={() => deleteTask(task.id)} className="shrink-0 opacity-0 group-hover:opacity-100 hover:opacity-100">
              <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
            </button>
          </div>
        ))}
      </div>

      {/* Add dialog */}
      {showAdd && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-card rounded-2xl border border-border/60 shadow-glow p-5 w-80">
            <h3 className="text-sm font-bold text-foreground mb-3">New Task</h3>
            <input type="text" placeholder="Task title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 bg-muted/40 border border-border/60 rounded-xl text-sm mb-2 focus:outline-none focus:ring-1 focus:ring-primary" />
            <input type="text" placeholder="Subject (optional)" value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full px-3 py-2 bg-muted/40 border border-border/60 rounded-xl text-sm mb-2 focus:outline-none focus:ring-1 focus:ring-primary" />
            <div className="flex gap-2 mb-3">
              <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="flex-1 px-3 py-2 bg-muted/40 border border-border/60 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
              <select value={priority} onChange={(e) => setPriority(e.target.value as Task["priority"])} className="px-3 py-2 bg-muted/40 border border-border/60 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary">
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowAdd(false)} className="px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground">Cancel</button>
              <button onClick={addTask} className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium">Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
