import { useState, useEffect } from "react";
import { Bus, MapPin } from "lucide-react";

const STOPS = [
  { name: "Elm Street & Oak Ave", time: "7:15 AM" },
  { name: "Edison Middle School", time: "7:40 AM" },
  { name: "Westside Community Center", time: "7:55 AM" },
];

export function BusTrackerApp() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setProgress((p) => (p >= 100 ? 0 : p + 2));
    }, 300);
    return () => clearInterval(t);
  }, []);

  const currentStop = STOPS.findIndex((_, i) => (i / STOPS.length) * 100 < progress);
  const eta = currentStop >= STOPS.length - 1 ? "Arrived" : STOPS[Math.min(currentStop + 1, STOPS.length - 1)].time;

  return (
    <div className="flex flex-col h-full p-5">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
          <Bus className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-foreground">Bus #42 — Route Westside</h3>
          <p className="text-[10px] text-muted-foreground">ETA: <span className="font-bold text-primary">{eta}</span></p>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="h-2 bg-muted/40 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary to-violet-400 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
        <p className="text-[10px] text-muted-foreground mt-1 text-right">{progress}% of route</p>
      </div>

      {/* Stops */}
      <div className="space-y-3">
        {STOPS.map((stop, i) => {
          const passed = (i / STOPS.length) * 100 < progress;
          return (
            <div key={i} className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full shrink-0 ${passed ? "bg-primary" : "bg-muted-foreground/20"}`} />
              <div className={`flex-1 p-3 rounded-xl border ${passed ? "bg-primary/5 border-primary/20" : "bg-card border-border/30"}`}>
                <p className="text-xs font-medium text-foreground">{stop.name}</p>
                <p className="text-[10px] text-muted-foreground">Arrives at {stop.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
