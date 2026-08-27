import { useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Plus, Trash2, Users } from "lucide-react";

interface Club {
  id: string;
  name: string;
  kind: string;
  dayOfWeek: string;
  room: string;
  advisor: string;
  color: string;
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

const KINDS = ["Club", "Elective", "Sport", "Volunteer"];
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const COLORS = ["#7c3aed", "#e11d48", "#0891b2", "#059669", "#d97706", "#6366f1", "#db2777", "#ea580c"];

export function ClubsApp() {
  const [clubs, setClubs] = useLocalStorage<Club[]>("edison-clubs", []);
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState("");
  const [kind, setKind] = useState("Club");
  const [day, setDay] = useState("Monday");
  const [room, setRoom] = useState("");
  const [advisor, setAdvisor] = useState("");
  const [color, setColor] = useState(COLORS[0]);

  const add = () => {
    if (!name.trim()) return;
    setClubs((prev) => [...prev, { id: uid(), name: name.trim(), kind, dayOfWeek: day, room: room.trim(), advisor: advisor.trim(), color }]);
    setName(""); setRoom(""); setAdvisor(""); setShowAdd(false);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-border/60 bg-muted/20 flex items-center justify-between">
        <h3 className="text-sm font-bold text-foreground">Clubs & Activities</h3>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-1 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium">
          <Plus className="h-3 w-3" /> Add
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {clubs.length === 0 ? (
          <div className="text-center py-10">
            <Users className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No clubs added yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {clubs.map((c) => (
              <div key={c.id} className="flex items-start gap-3 p-3 rounded-xl bg-card border border-border/40">
                <div className="w-1 h-full min-h-[40px] rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{c.name}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    <span className="text-[9px] px-1.5 py-0.5 bg-muted/60 rounded text-muted-foreground">{c.kind}</span>
                    <span className="text-[9px] px-1.5 py-0.5 bg-muted/60 rounded text-muted-foreground">{c.dayOfWeek}</span>
                    {c.room && <span className="text-[9px] px-1.5 py-0.5 bg-muted/60 rounded text-muted-foreground">Room {c.room}</span>}
                  </div>
                  {c.advisor && <p className="text-[10px] text-muted-foreground mt-1">Advisor: {c.advisor}</p>}
                </div>
                <button onClick={() => setClubs((p) => p.filter((x) => x.id !== c.id))}>
                  <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {showAdd && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-card rounded-2xl border border-border/60 shadow-glow p-5 w-80">
            <h3 className="text-sm font-bold text-foreground mb-3">Add Club</h3>
            <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 bg-muted/40 border border-border/60 rounded-xl text-sm mb-2 focus:outline-none focus:ring-1 focus:ring-primary" />
            <div className="flex gap-2 mb-2">
              <select value={kind} onChange={(e) => setKind(e.target.value)} className="flex-1 px-3 py-2 bg-muted/40 border border-border/60 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary">
                {KINDS.map((k) => <option key={k} value={k}>{k}</option>)}
              </select>
              <select value={day} onChange={(e) => setDay(e.target.value)} className="flex-1 px-3 py-2 bg-muted/40 border border-border/60 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary">
                {DAYS.map((d) => <option key={d} value={d}>{d.slice(0, 3)}</option>)}
              </select>
            </div>
            <div className="flex gap-2 mb-2">
              <input type="text" placeholder="Room" value={room} onChange={(e) => setRoom(e.target.value)} className="flex-1 px-3 py-2 bg-muted/40 border border-border/60 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
              <input type="text" placeholder="Advisor" value={advisor} onChange={(e) => setAdvisor(e.target.value)} className="flex-1 px-3 py-2 bg-muted/40 border border-border/60 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <div className="flex gap-1 mb-3">
              {COLORS.map((c) => (
                <button key={c} onClick={() => setColor(c)} className={`w-6 h-6 rounded-full transition-transform ${color === c ? "scale-125 ring-2 ring-white" : ""}`} style={{ backgroundColor: c }} />
              ))}
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
