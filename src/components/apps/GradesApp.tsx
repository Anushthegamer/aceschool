import { useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Plus, Trash2, BarChart3 } from "lucide-react";

interface Grade {
  id: string;
  name: string;
  score: number;
  weight: number;
  course: string;
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function GradesApp() {
  const [grades, setGrades] = useLocalStorage<Grade[]>("edison-grades", []);
  const [gpa, setGpa] = useLocalStorage("edison-gpa", "0.00");
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState("");
  const [score, setScore] = useState("");
  const [weight, setWeight] = useState("10");
  const [course, setCourse] = useState("");
  const [gpaInput, setGpaInput] = useState(gpa);

  const addGrade = () => {
    if (!name.trim() || !score) return;
    setGrades((prev) => [...prev, { id: uid(), name: name.trim(), score: parseFloat(score), weight: parseFloat(weight) || 10, course: course.trim() || "General" }]);
    setName("");
    setScore("");
    setShowAdd(false);
    recalcGpa();
  };

  const deleteGrade = (id: string) => {
    setGrades((prev) => prev.filter((g) => g.id !== id));
  };

  const recalcGpa = () => {
    if (grades.length === 0) return;
    const totalWeight = grades.reduce((s, g) => s + g.weight, 0);
    const weighted = grades.reduce((s, g) => s + (g.score / 100) * 4 * g.weight, 0);
    const avg = totalWeight > 0 ? (weighted / totalWeight).toFixed(2) : "0.00";
    setGpa(avg);
    setGpaInput(avg);
  };

  const courses = [...new Set(grades.map((g) => g.course))];

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-border/60 bg-muted/20">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-foreground">Grade Tracker</h3>
          <button onClick={() => setShowAdd(true)} className="flex items-center gap-1 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-primary/90">
            <Plus className="h-3 w-3" /> Add Grade
          </button>
        </div>
        {/* GPA */}
        <div className="flex items-center gap-3 p-3 bg-card rounded-xl border border-border/40">
          <BarChart3 className="h-5 w-5 text-primary" />
          <div className="flex-1">
            <p className="text-[10px] text-muted-foreground">Cumulative GPA</p>
            <input type="text" value={gpaInput} onChange={(e) => setGpaInput(e.target.value)} onBlur={() => setGpa(gpaInput)} className="text-xl font-bold bg-transparent focus:outline-none text-foreground w-20" />
          </div>
          <button onClick={recalcGpa} className="text-[10px] text-primary hover:underline">Recalculate</button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {grades.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-10">No grades yet</p>
        )}
        {courses.map((c) => (
          <div key={c}>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1 mt-3">{c}</p>
            {grades.filter((g) => g.course === c).map((g) => (
              <div key={g.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-card border border-border/40 mb-1">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">{g.name}</p>
                  <p className="text-[10px] text-muted-foreground">Weight: {g.weight}%</p>
                </div>
                <span className={`text-sm font-bold ${g.score >= 90 ? "text-emerald-500" : g.score >= 70 ? "text-amber-500" : "text-red-500"}`}>
                  {g.score}%
                </span>
                <button onClick={() => deleteGrade(g.id)}><Trash2 className="h-3 w-3 text-muted-foreground hover:text-destructive" /></button>
              </div>
            ))}
          </div>
        ))}
      </div>

      {showAdd && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-card rounded-2xl border border-border/60 shadow-glow p-5 w-80">
            <h3 className="text-sm font-bold text-foreground mb-3">Add Grade</h3>
            <input type="text" placeholder="Assignment name" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 bg-muted/40 border border-border/60 rounded-xl text-sm mb-2 focus:outline-none focus:ring-1 focus:ring-primary" />
            <input type="text" placeholder="Course" value={course} onChange={(e) => setCourse(e.target.value)} className="w-full px-3 py-2 bg-muted/40 border border-border/60 rounded-xl text-sm mb-2 focus:outline-none focus:ring-1 focus:ring-primary" />
            <div className="flex gap-2 mb-3">
              <input type="number" placeholder="Score %" value={score} onChange={(e) => setScore(e.target.value)} className="flex-1 px-3 py-2 bg-muted/40 border border-border/60 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
              <input type="number" placeholder="Weight %" value={weight} onChange={(e) => setWeight(e.target.value)} className="w-24 px-3 py-2 bg-muted/40 border border-border/60 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowAdd(false)} className="px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground">Cancel</button>
              <button onClick={addGrade} className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium">Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
