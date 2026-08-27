import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Coffee, Zap } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

type Mode = "focus" | "short" | "long";

const DURATIONS: Record<Mode, number> = { focus: 25 * 60, short: 5 * 60, long: 15 * 60 };
const LABELS: Record<Mode, string> = { focus: "Focus", short: "Short Break", long: "Long Break" };
const COLORS: Record<Mode, string> = { focus: "from-rose-500 to-red-600", short: "from-emerald-400 to-teal-500", long: "from-blue-400 to-indigo-500" };

export function PomodoroApp() {
  const [mode, setMode] = useState<Mode>("focus");
  const [timeLeft, setTimeLeft] = useState(DURATIONS.focus);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useLocalStorage("edison-pomodoro-sessions", 0);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (running && timeLeft > 0) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            setRunning(false);
            if (mode === "focus") setSessions((s) => s + 1);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, timeLeft, mode, setSessions]);

  const reset = () => {
    setRunning(false);
    setTimeLeft(DURATIONS[mode]);
  };

  const switchMode = (m: Mode) => {
    setRunning(false);
    setMode(m);
    setTimeLeft(DURATIONS[m]);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = 1 - timeLeft / DURATIONS[mode];

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 bg-gradient-to-b from-card to-muted/20">
      {/* Mode tabs */}
      <div className="flex gap-1 p-1 bg-muted/40 rounded-xl mb-8">
        {(["focus", "short", "long"] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => switchMode(m)}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
              mode === m ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {LABELS[m]}
          </button>
        ))}
      </div>

      {/* Timer circle */}
      <div className="relative w-52 h-52 mb-8">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="88" fill="none" stroke="currentColor" strokeWidth="6" className="text-muted/30" />
          <circle
            cx="100" cy="100" r="88" fill="none"
            stroke="url(#timer-gradient)" strokeWidth="6" strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 88}
            strokeDashoffset={2 * Math.PI * 88 * (1 - progress)}
            className="transition-all duration-1000"
          />
          <defs>
            <linearGradient id="timer-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" className="text-primary" stopColor="currentColor" />
              <stop offset="100%" className="text-violet-400" stopColor="currentColor" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-mono font-bold text-foreground tabular-nums">
            {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
          </span>
          <span className="text-xs text-muted-foreground mt-1">{LABELS[mode]}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <button onClick={reset} className="w-10 h-10 rounded-xl bg-muted/60 flex items-center justify-center hover:bg-muted transition-colors">
          <RotateCcw className="h-4 w-4 text-muted-foreground" />
        </button>
        <button
          onClick={() => setRunning(!running)}
          className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${COLORS[mode]} flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-shadow`}
        >
          {running ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-0.5" />}
        </button>
        <div className="w-10 h-10 rounded-xl bg-muted/60 flex items-center justify-center">
          <span className="text-xs font-bold text-muted-foreground">{sessions}</span>
        </div>
      </div>

      <p className="text-[10px] text-muted-foreground mt-4">Sessions completed today</p>
    </div>
  );
}
