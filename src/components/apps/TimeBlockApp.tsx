import { useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Plus, Trash2, CheckCircle2, Circle, Clock } from "lucide-react";

interface TimeBlock {
  id: string;
  title: string;
  subject: string;
  startTime: string;
  endTime: string;
  completed: boolean;
  date: string;
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function TimeBlockApp() {
  const [blocks, setBlocks] = useLocalStorage<TimeBlock[]>("edison-time-blocks", []);
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("09:00");

  const dayBlocks = blocks
    .filter((b) => b.date === selectedDate)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const totalMin = dayBlocks.reduce((s, b) => {
    const [sh, sm] = b.startTime.split(":").map(Number);
    const [eh, em] = b.endTime.split(":").map(Number);
    return s + (eh * 60 + em) - (sh * 60 + sm);
  }, 0);

  const doneMin = dayBlocks.filter((b) => b.completed).reduce((s, b) => {
    const [sh, sm] = b.startTime.split(":").map(Number);
    const [eh, em] = b.endTime.split(":").map(Number);
    return s + (eh * 60 + em) - (sh * 60 + sm);
  }, 0);

  const add = () => {
    if (!title.trim()) return;
    setBlocks((prev) => [...prev, { id: uid(), title: title.trim(), subject: subject.trim() || "General", startTime, endTime, completed: false, date: selectedDate }]);
    setTitle(""); setSubject(""); setShowAdd(false);
  };

  const toggle = (id: string) => {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, completed: !b.completed } : b)));
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-border/60 bg-muted/20 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-foreground">Time Blocks</h3>
          <p className="text-[10px] text-muted-foreground">{doneMin}/{totalMin} min planned</p>
        </div>
        <div className="flex items-center gap-2">
          <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="px-2 py-1 bg-muted/40 border border-border/60 rounded-lg text-[11px] focus:outline-none focus:ring-1 focus:ring-primary" />
          <button onClick={() => setShowAdd(true)} className="flex items-center gap-1 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium">
            <Plus className="h-3 w-3" /> Add
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {dayBlocks.length === 0 && (
          <div className="text-center py-10">
            <Clock className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No time blocks for this day</p>
          </div>
        )}
        {dayBlocks.map((b) => (
          <div key={b.id} className={`flex items-center gap-3 p-3 rounded-xl border ${b.completed ? "bg-muted/20 border-border/30 opacity-60" : "bg-card border-border/40"}`}>
            <button onClick={() => toggle(b.id)} className="shrink-0">
              {b.completed ? <CheckCircle2 className="h-5 w-5 text-emerald-500" /> : <Circle className="h-5 w-5 text-muted-foreground" />}
            </button>
            <div className="flex-1 min-w-0">
              <p className={`text-xs font-medium ${b.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>{b.title}</p>
              <p className="text-[10px] text-muted-foreground">{b.startTime} – {b.endTime} · {b.subject}</p>
            </div>
            <button onClick={() => setBlocks((p) => p.filter((x) => x.id !== b.id))}>
              <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
            </button>
          </div>
        ))}
      </div>

      {showAdd && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-card rounded-2xl border border-border/60 shadow-glow p-5 w-80">
            <h3 className="text-sm font-bold text-foreground mb-3">New Time Block</h3>
            <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 bg-muted/40 border border-border/60 rounded-xl text-sm mb-2 focus:outline-none focus:ring-1 focus:ring-primary" />
            <input type="text" placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full px-3 py-2 bg-muted/40 border border-border/60 rounded-xl text-sm mb-2 focus:outline-none focus:ring-1 focus:ring-primary" />
            <div className="flex gap-2 mb-3">
              <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="flex-1 px-3 py-2 bg-muted/40 border border-border/60 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
              <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="flex-1 px-3 py-2 bg-muted/40 border border-border/60 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
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
