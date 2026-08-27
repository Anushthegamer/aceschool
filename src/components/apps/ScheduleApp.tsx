import { useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Plus, Trash2, Clock } from "lucide-react";

interface ClassEntry {
  id: string;
  name: string;
  day: string;
  startTime: string;
  endTime: string;
  room: string;
  color: string;
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const COLORS = ["bg-violet-500", "bg-rose-500", "bg-cyan-500", "bg-emerald-500", "bg-amber-500", "bg-indigo-500"];
const HOURS = Array.from({ length: 12 }, (_, i) => i + 7);

export function ScheduleApp() {
  const [classes, setClasses] = useLocalStorage<ClassEntry[]>("edison-schedule", []);
  const [showAdd, setShowAdd] = useState(false);
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [name, setName] = useState("");
  const [day, setDay] = useState("Monday");
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("09:00");
  const [room, setRoom] = useState("");

  const addClass = () => {
    if (!name.trim()) return;
    setClasses((prev) => [...prev, {
      id: uid(), name: name.trim(), day, startTime, endTime,
      room: room.trim(), color: COLORS[prev.length % COLORS.length],
    }]);
    setName(""); setRoom(""); setShowAdd(false);
  };

  const deleteClass = (id: string) => {
    setClasses((prev) => prev.filter((c) => c.id !== id));
  };

  const dayClasses = classes.filter((c) => c.day === selectedDay).sort((a, b) => a.startTime.localeCompare(b.startTime));

  return (
    <div className="flex flex-col h-full">
      {/* Day tabs */}
      <div className="flex items-center gap-1 px-3 py-2 border-b border-border/60 bg-muted/20">
        {DAYS.map((d) => (
          <button key={d} onClick={() => setSelectedDay(d)} className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${selectedDay === d ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted/60"}`}>
            {d.slice(0, 3)}
          </button>
        ))}
        <button onClick={() => setShowAdd(true)} className="ml-auto flex items-center gap-1 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium">
          <Plus className="h-3 w-3" /> Add
        </button>
      </div>

      {/* Timeline */}
      <div className="flex-1 overflow-y-auto">
        {dayClasses.length === 0 ? (
          <div className="text-center py-10">
            <Clock className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No classes on {selectedDay}</p>
          </div>
        ) : (
          <div className="p-3 space-y-2">
            {dayClasses.map((cls) => (
              <div key={cls.id} className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border/40">
                <div className={`w-1 h-10 rounded-full ${cls.color}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{cls.name}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {cls.startTime} – {cls.endTime}{cls.room ? ` · ${cls.room}` : ""}
                  </p>
                </div>
                <button onClick={() => deleteClass(cls.id)}>
                  <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add dialog */}
      {showAdd && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-card rounded-2xl border border-border/60 shadow-glow p-5 w-80">
            <h3 className="text-sm font-bold text-foreground mb-3">Add Class</h3>
            <input type="text" placeholder="Class name" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 bg-muted/40 border border-border/60 rounded-xl text-sm mb-2 focus:outline-none focus:ring-1 focus:ring-primary" />
            <select value={day} onChange={(e) => setDay(e.target.value)} className="w-full px-3 py-2 bg-muted/40 border border-border/60 rounded-xl text-sm mb-2 focus:outline-none focus:ring-1 focus:ring-primary">
              {DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
            <div className="flex gap-2 mb-2">
              <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="flex-1 px-3 py-2 bg-muted/40 border border-border/60 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
              <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="flex-1 px-3 py-2 bg-muted/40 border border-border/60 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <input type="text" placeholder="Room (optional)" value={room} onChange={(e) => setRoom(e.target.value)} className="w-full px-3 py-2 bg-muted/40 border border-border/60 rounded-xl text-sm mb-3 focus:outline-none focus:ring-1 focus:ring-primary" />
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowAdd(false)} className="px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground">Cancel</button>
              <button onClick={addClass} className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium">Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
