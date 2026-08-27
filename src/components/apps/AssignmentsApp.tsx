import { useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Plus, Trash2, CheckCircle2, Circle, BookOpen } from "lucide-react";

interface Assignment {
  id: string;
  title: string;
  course: string;
  dueDate: string;
  done: boolean;
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function AssignmentsApp() {
  const [assignments, setAssignments] = useLocalStorage<Assignment[]>("edison-assignments", []);
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState("");
  const [course, setCourse] = useState("");
  const [dueDate, setDueDate] = useState("");

  const add = () => {
    if (!title.trim()) return;
    setAssignments((prev) => [...prev, { id: uid(), title: title.trim(), course: course.trim() || "General", dueDate, done: false }]);
    setTitle(""); setCourse(""); setDueDate(""); setShowAdd(false);
  };

  const toggle = (id: string) => {
    setAssignments((prev) => prev.map((a) => (a.id === id ? { ...a, done: !a.done } : a)));
  };

  const sorted = [...assignments].sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1;
    return (a.dueDate || "9999").localeCompare(b.dueDate || "9999");
  });

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-border/60 bg-muted/20 flex items-center justify-between">
        <h3 className="text-sm font-bold text-foreground">Assignments</h3>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-1 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium">
          <Plus className="h-3 w-3" /> Add
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {sorted.length === 0 && (
          <div className="text-center py-10">
            <BookOpen className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No assignments</p>
          </div>
        )}
        {sorted.map((a) => (
          <div key={a.id} className={`flex items-center gap-3 p-3 rounded-xl border ${a.done ? "bg-muted/20 border-border/30 opacity-60" : "bg-card border-border/40"}`}>
            <button onClick={() => toggle(a.id)} className="shrink-0">
              {a.done ? <CheckCircle2 className="h-5 w-5 text-emerald-500" /> : <Circle className="h-5 w-5 text-muted-foreground" />}
            </button>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${a.done ? "line-through text-muted-foreground" : "text-foreground"}`}>{a.title}</p>
              <p className="text-[10px] text-muted-foreground">{a.course}{a.dueDate ? ` · Due ${a.dueDate}` : ""}</p>
            </div>
            <button onClick={() => setAssignments((p) => p.filter((x) => x.id !== a.id))}>
              <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
            </button>
          </div>
        ))}
      </div>
      {showAdd && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-card rounded-2xl border border-border/60 shadow-glow p-5 w-80">
            <h3 className="text-sm font-bold text-foreground mb-3">New Assignment</h3>
            <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 bg-muted/40 border border-border/60 rounded-xl text-sm mb-2 focus:outline-none focus:ring-1 focus:ring-primary" />
            <input type="text" placeholder="Course" value={course} onChange={(e) => setCourse(e.target.value)} className="w-full px-3 py-2 bg-muted/40 border border-border/60 rounded-xl text-sm mb-2 focus:outline-none focus:ring-1 focus:ring-primary" />
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full px-3 py-2 bg-muted/40 border border-border/60 rounded-xl text-sm mb-3 focus:outline-none focus:ring-1 focus:ring-primary" />
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
