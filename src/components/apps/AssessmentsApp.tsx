import { useState } from "react";
import { BookOpen, Target, FileText, CheckCircle2 } from "lucide-react";

interface Assessment {
  id: string;
  title: string;
  subject: string;
  date: string;
  preparationProgress: number;
  topics: string[];
  resources: string[];
  notes: string;
}

const ASSESSMENTS_INIT: Assessment[] = [
  { id: "1", title: "Science Midterm", subject: "Science", date: "2026-09-15", preparationProgress: 40, topics: ["Cell Biology", "Genetics", "Evolution", "Ecology", "Lab Safety"], resources: ["Textbook Ch. 5-8", "Khan Academy videos", "Lab notebook review"], notes: "Focus on genetics Punnett squares and cell division" },
  { id: "2", title: "Math Unit Test", subject: "Mathematics", date: "2026-09-12", preparationProgress: 25, topics: ["Linear Equations", "Systems of Equations", "Quadratics", "Factoring"], resources: ["Textbook practice problems", "IXL Math online"], notes: "Review quadratic formula and factoring by grouping" },
  { id: "3", title: "English Essay", subject: "English", date: "2026-09-10", preparationProgress: 60, topics: ["Thesis Statement", "Evidence Selection", "Body Paragraphs", "Citations"], resources: ["Rubric on Google Classroom", "Purdue OWL for citations"], notes: "Topic: analyze symbolism in To Kill a Mockingbird" },
  { id: "4", title: "History Project", subject: "Social Studies", date: "2026-09-18", preparationProgress: 10, topics: ["Research", "Presentation Design", "Timeline Creation", "Source Analysis"], resources: ["Library database access", "Presentation template"], notes: "Group project on Civil Rights Movement" },
  { id: "5", title: "Spanish Vocab Quiz", subject: "World Language", date: "2026-09-08", preparationProgress: 70, topics: ["Food vocabulary", "Restaurant phrases", "Family members", "Daily routines"], resources: ["Quizlet flashcards", "Textbook Ch. 4"], notes: "Focus on irregular verb conjugations" },
];

export function AssessmentsApp() {
  const [assessments] = useState(ASSESSMENTS_INIT);
  const [selectedId, setSelectedId] = useState(assessments[0]?.id || null);
  const [progress, setProgress] = useState(() => Object.fromEntries(assessments.map((a) => [a.id, a.preparationProgress])));
  const [tab, setTab] = useState<"topics" | "resources" | "notes">("topics");

  const selected = assessments.find((a) => a.id === selectedId);
  const sorted = [...assessments].sort((a, b) => a.date.localeCompare(b.date));

  const daysUntil = (date: string) => {
    const diff = Math.ceil((new Date(date).getTime() - Date.now()) / 86400000);
    return diff;
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-border/60 bg-muted/20">
        <h3 className="text-sm font-bold text-foreground">Upcoming Assessments</h3>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Assessment list */}
        <div className="w-52 border-r border-border/60 overflow-y-auto bg-muted/10">
          {sorted.map((a) => {
            const days = daysUntil(a.date);
            const prog = progress[a.id] ?? 0;
            return (
              <button key={a.id} onClick={() => setSelectedId(a.id)} className={`w-full text-left p-3 border-b border-border/30 transition-colors ${selectedId === a.id ? "bg-primary/5 border-l-2 border-l-primary" : "hover:bg-muted/30 border-l-2 border-l-transparent"}`}>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-medium text-foreground truncate">{a.title}</p>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                    days <= 3 ? "bg-red-500/10 text-red-500" : days <= 7 ? "bg-amber-500/10 text-amber-500" : "bg-muted/60 text-muted-foreground"
                  }`}>{days}d</span>
                </div>
                <p className="text-[10px] text-muted-foreground">{a.subject}</p>
                <div className="mt-1.5 h-1 bg-muted/40 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${prog}%` }} />
                </div>
              </button>
            );
          })}
        </div>

        {/* Detail panel */}
        <div className="flex-1 overflow-y-auto p-4">
          {selected ? (
            <div>
              <div className="mb-4">
                <h4 className="text-sm font-bold text-foreground">{selected.title}</h4>
                <p className="text-[10px] text-muted-foreground">{selected.subject} · {new Date(selected.date + "T12:00:00").toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" })}</p>
              </div>

              {/* Progress controls */}
              <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-card border border-border/40">
                <span className="text-xs text-muted-foreground">Prep:</span>
                <div className="flex-1 h-2 bg-muted/40 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary to-violet-400 rounded-full transition-all" style={{ width: `${progress[selected.id] ?? 0}%` }} />
                </div>
                <span className="text-xs font-bold text-primary">{progress[selected.id] ?? 0}%</span>
                <button onClick={() => setProgress((p) => ({ ...p, [selected.id]: Math.max(0, (p[selected.id] ?? 0) - 10) }))} className="px-2 py-0.5 rounded bg-muted/40 text-[10px] text-muted-foreground">-10</button>
                <button onClick={() => setProgress((p) => ({ ...p, [selected.id]: Math.min(100, (p[selected.id] ?? 0) + 10) }))} className="px-2 py-0.5 rounded bg-muted/40 text-[10px] text-muted-foreground">+10</button>
              </div>

              {/* Tabs */}
              <div className="flex gap-1 mb-3">
                {(["topics", "resources", "notes"] as const).map((t) => (
                  <button key={t} onClick={() => setTab(t)} className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${tab === t ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted/60"}`}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>

              {tab === "topics" && (
                <div className="grid grid-cols-2 gap-1.5">
                  {selected.topics.map((t, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-card border border-border/30">
                      <span className="text-[10px] font-bold text-primary w-5 text-center">{i + 1}</span>
                      <span className="text-xs text-foreground">{t}</span>
                    </div>
                  ))}
                </div>
              )}

              {tab === "resources" && (
                <div className="space-y-1.5">
                  {selected.resources.map((r, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-card border border-border/30">
                      <Target className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span className="text-xs text-foreground">{r}</span>
                    </div>
                  ))}
                </div>
              )}

              {tab === "notes" && (
                <div className="p-3 rounded-xl bg-card border border-border/30">
                  <p className="text-xs text-foreground leading-relaxed">{selected.notes}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              <BookOpen className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Select an assessment</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
