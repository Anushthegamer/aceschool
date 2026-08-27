import { useState } from "react";
import { TrendingUp } from "lucide-react";

const SUBJECTS_INIT = [
  { name: "English Language Arts", current: 92 },
  { name: "Mathematics", current: 88 },
  { name: "Science", current: 95 },
  { name: "Social Studies", current: 90 },
  { name: "World Language", current: 87 },
  { name: "Physical Education", current: 96 },
  { name: "Art", current: 98 },
];

function toGpa(score: number): number {
  if (score >= 93) return 4.0;
  if (score >= 90) return 3.7;
  if (score >= 87) return 3.3;
  if (score >= 83) return 3.0;
  if (score >= 80) return 2.7;
  if (score >= 77) return 2.3;
  if (score >= 73) return 2.0;
  if (score >= 70) return 1.7;
  return 1.0;
}

function toLetter(score: number): string {
  if (score >= 93) return "A";
  if (score >= 90) return "A-";
  if (score >= 87) return "B+";
  if (score >= 83) return "B";
  if (score >= 80) return "B-";
  if (score >= 77) return "C+";
  if (score >= 73) return "C";
  return "C-";
}

export function GpaProjectorApp() {
  const [scores, setScores] = useState(SUBJECTS_INIT.map((s) => s.current));
  const projectedGpa = (scores.reduce((s, sc) => s + toGpa(sc), 0) / scores.length).toFixed(2);

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-border/60 bg-muted/20">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-foreground">GPA Projector</h3>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-muted-foreground">Projected GPA</span>
            <span className="text-lg font-bold text-primary">{projectedGpa}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {SUBJECTS_INIT.map((sub, i) => (
          <div key={i} className="p-3 rounded-xl bg-card border border-border/40">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-foreground">{sub.name}</p>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                  toLetter(scores[i]).startsWith("A") ? "bg-emerald-500/10 text-emerald-500" :
                  toLetter(scores[i]).startsWith("B") ? "bg-blue-500/10 text-blue-500" :
                  "bg-amber-500/10 text-amber-500"
                }`}>{toLetter(scores[i])}</span>
                <span className="text-xs text-muted-foreground">{scores[i]}%</span>
                <span className="text-[10px] text-primary font-bold">{toGpa(scores[i]).toFixed(1)}</span>
              </div>
            </div>
            <input type="range" min={50} max={100} value={scores[i]} onChange={(e) => {
              const next = [...scores]; next[i] = parseInt(e.target.value); setScores(next);
            }} className="w-full h-1.5 bg-muted/40 rounded-full appearance-none cursor-pointer accent-primary" />
          </div>
        ))}
      </div>
    </div>
  );
}
