import { useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Play, Square, MapPin, Clock, Trash2 } from "lucide-react";

interface Pass {
  id: string;
  destination: string;
  reason: string;
  startedAt: number;
  endedAt: number | null;
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function formatDuration(ms: number) {
  const mins = Math.floor(ms / 60000);
  const secs = Math.floor((ms % 60000) / 1000);
  return `${mins}m ${secs}s`;
}

export function HallPassApp() {
  const [passes, setPasses] = useLocalStorage<Pass[]>("edison-hall-passes", []);
  const [dest, setDest] = useState("");
  const [reason, setReason] = useState("");
  const [now, setNow] = useState(Date.now());

  // Update timer every second when active pass exists
  const activePass = passes.find((p) => !p.endedAt);
  useState(() => {
    if (!activePass) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  });

  const startPass = () => {
    if (!dest.trim()) return;
    setPasses((prev) => [{ id: uid(), destination: dest.trim(), reason: reason.trim(), startedAt: Date.now(), endedAt: null }, ...prev]);
    setDest(""); setReason("");
  };

  const endPass = (id: string) => {
    setPasses((prev) => prev.map((p) => (p.id === id ? { ...p, endedAt: Date.now() } : p)));
  };

  const deletePass = (id: string) => {
    setPasses((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-border/60 bg-muted/20">
        <h3 className="text-sm font-bold text-foreground">Hall Pass</h3>
        <p className="text-[10px] text-muted-foreground">Track your hall passes</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Active pass */}
        {activePass && (
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-primary">Active Pass</span>
            </div>
            <p className="text-sm font-medium text-foreground">{activePass.destination}</p>
            {activePass.reason && <p className="text-[10px] text-muted-foreground mt-0.5">{activePass.reason}</p>}
            <p className="text-lg font-mono font-bold text-foreground mt-2">
              {formatDuration(now - activePass.startedAt)}
            </p>
            <button onClick={() => endPass(activePass.id)} className="mt-2 flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 text-red-500 rounded-lg text-xs font-medium hover:bg-red-500/20">
              <Square className="h-3 w-3" /> End Pass
            </button>
          </div>
        )}

        {/* New pass form */}
        {!activePass && (
          <div className="p-4 rounded-xl bg-card border border-border/40 space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="text-xs font-bold text-foreground">New Pass</span>
            </div>
            <input type="text" placeholder="Destination (e.g., Library)" value={dest} onChange={(e) => setDest(e.target.value)} className="w-full px-3 py-2 bg-muted/40 border border-border/60 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
            <input type="text" placeholder="Reason (optional)" value={reason} onChange={(e) => setReason(e.target.value)} className="w-full px-3 py-2 bg-muted/40 border border-border/60 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
            <button onClick={startPass} className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-xs font-medium hover:bg-primary/90">
              <Play className="h-3.5 w-3.5" /> Start Pass
            </button>
          </div>
        )}

        {/* History */}
        <div>
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Recent Passes</p>
          {passes.length === 0 && <p className="text-xs text-muted-foreground">No passes yet</p>}
          {passes.filter((p) => p.endedAt).slice(0, 10).map((p) => (
            <div key={p.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-card border border-border/30 mb-1.5">
              <div className="w-2 h-2 rounded-full bg-muted-foreground/30 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground">{p.destination}</p>
                <p className="text-[10px] text-muted-foreground">{formatDuration(p.endedAt! - p.startedAt)} · {new Date(p.startedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
              </div>
              <button onClick={() => deletePass(p.id)}><Trash2 className="h-3 w-3 text-muted-foreground hover:text-destructive" /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
