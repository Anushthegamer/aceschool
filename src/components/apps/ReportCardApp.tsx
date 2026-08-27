import { Printer } from "lucide-react";

const SUBJECTS = [
  { name: "English Language Arts", teacher: "Ms. Thompson", grades: ["A", "A", "A-", "A"], comment: "Excellent analytical writing" },
  { name: "Mathematics", teacher: "Mr. Rodriguez", grades: ["A-", "B+", "A", "A"], comment: "Strong problem-solving skills" },
  { name: "Science", teacher: "Dr. Patel", grades: ["B+", "A-", "A", "A+"], comment: "Outstanding lab reports" },
  { name: "Social Studies", teacher: "Mrs. Chen", grades: ["A", "A", "A", "A"], comment: "Deep historical understanding" },
  { name: "World Language (Spanish)", teacher: "Sra. Martinez", grades: ["A-", "A", "A", "A"], comment: "Conversational fluency" },
  { name: "Physical Education", teacher: "Coach Davis", grades: ["A", "A", "A", "A"], comment: "Excellent teamwork" },
  { name: "Art", teacher: "Ms. Kim", grades: ["A+", "A", "A", "A+"], comment: "Creative vision" },
];

function gpaFromLetter(g: string): number {
  const map: Record<string, number> = { "A+": 4.0, "A": 4.0, "A-": 3.7, "B+": 3.3, "B": 3.0, "B-": 2.7, "C+": 2.3, "C": 2.0 };
  return map[g] ?? 0;
}

const overallGpa = (SUBJECTS.reduce((s, sub) => {
  const avg = sub.grades.reduce((s2, g) => s2 + gpaFromLetter(g), 0) / sub.grades.length;
  return s + avg;
}, 0) / SUBJECTS.length).toFixed(2);

export function ReportCardApp() {
  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="px-4 py-3 border-b border-border/60 bg-muted/20 flex items-center justify-between sticky top-0 bg-card/90 backdrop-blur z-10">
        <div>
          <h3 className="text-sm font-bold text-foreground">Report Card</h3>
          <p className="text-[10px] text-muted-foreground">Edison Middle School · Grade 8 · Section A</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 bg-primary/10 text-primary rounded-lg text-xs font-bold">GPA: {overallGpa}</span>
          <button onClick={() => window.print()} className="p-2 rounded-lg hover:bg-muted/60"><Printer className="h-4 w-4 text-muted-foreground" /></button>
        </div>
      </div>

      <div className="p-4">
        {/* Student info */}
        <div className="mb-4 p-4 rounded-xl bg-card border border-border/40">
          <p className="text-sm font-bold text-foreground">Jack Williams</p>
          <p className="text-[10px] text-muted-foreground">Grade 8 · Section 8-A · Edison Middle School</p>
          <p className="text-[10px] text-muted-foreground">Academic Year 2025–2026</p>
        </div>

        {/* Grades table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border/60">
                <th className="text-left py-2 px-2 text-muted-foreground font-medium">Subject</th>
                <th className="text-left py-2 px-2 text-muted-foreground font-medium">Teacher</th>
                <th className="text-center py-2 px-2 text-muted-foreground font-medium">MP1</th>
                <th className="text-center py-2 px-2 text-muted-foreground font-medium">MP2</th>
                <th className="text-center py-2 px-2 text-muted-foreground font-medium">MP3</th>
                <th className="text-center py-2 px-2 text-muted-foreground font-medium">MP4</th>
                <th className="text-left py-2 px-2 text-muted-foreground font-medium hidden md:table-cell">Comment</th>
              </tr>
            </thead>
            <tbody>
              {SUBJECTS.map((s, i) => (
                <tr key={i} className="border-b border-border/30 hover:bg-muted/20">
                  <td className="py-2.5 px-2 font-medium text-foreground">{s.name}</td>
                  <td className="py-2.5 px-2 text-muted-foreground">{s.teacher}</td>
                  {s.grades.map((g, j) => (
                    <td key={j} className="py-2.5 px-2 text-center">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        g.startsWith("A") ? "bg-emerald-500/10 text-emerald-500" :
                        g.startsWith("B") ? "bg-blue-500/10 text-blue-500" :
                        "bg-amber-500/10 text-amber-500"
                      }`}>{g}</span>
                    </td>
                  ))}
                  <td className="py-2.5 px-2 text-muted-foreground hidden md:table-cell">{s.comment}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
