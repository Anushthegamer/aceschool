import { useState } from "react";
import { Plus, TrendingUp, TrendingDown, Minus, Award, BarChart3, BookOpen, Calendar, GraduationCap } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface Grade {
  id: string;
  title: string;
  subject: string;
  score: number;
  maxScore: number;
  type: "test" | "quiz" | "assignment" | "project" | "exam";
  date: Date;
  weight: number;
  markingPeriod: "MP1" | "MP2" | "MP3" | "MP4";
}

// Realistic grades for Jack Williams — A- average (~90-92%) per subject
const allGrades: Grade[] = [
  // Mathematics
  { id: "m1", title: "Linear Equations Unit Test", subject: "Mathematics", score: 91, maxScore: 100, type: "test", date: new Date(2025, 8, 20), weight: 3, markingPeriod: "MP1" },
  { id: "m2", title: "Slope & Y-Intercept Quiz", subject: "Mathematics", score: 18, maxScore: 20, type: "quiz", date: new Date(2025, 8, 28), weight: 1, markingPeriod: "MP1" },
  { id: "m3", title: "Graphing Coordinate Plane HW", subject: "Mathematics", score: 47, maxScore: 50, type: "assignment", date: new Date(2025, 9, 5), weight: 1, markingPeriod: "MP1" },
  { id: "m4", title: "MP1 Midterm Exam", subject: "Mathematics", score: 88, maxScore: 100, type: "exam", date: new Date(2025, 9, 18), weight: 4, markingPeriod: "MP1" },
  { id: "m5", title: "Systems of Equations Test", subject: "Mathematics", score: 93, maxScore: 100, type: "test", date: new Date(2025, 10, 8), weight: 3, markingPeriod: "MP2" },
  { id: "m6", title: "Inequalities Quiz", subject: "Mathematics", score: 19, maxScore: 20, type: "quiz", date: new Date(2025, 10, 20), weight: 1, markingPeriod: "MP2" },
  { id: "m7", title: "Exponents & Radicals Test", subject: "Mathematics", score: 87, maxScore: 100, type: "test", date: new Date(2025, 11, 5), weight: 3, markingPeriod: "MP2" },
  { id: "m8", title: "MP2 Final Exam", subject: "Mathematics", score: 92, maxScore: 100, type: "exam", date: new Date(2026, 0, 15), weight: 4, markingPeriod: "MP2" },
  { id: "m9", title: "Polynomials Quiz", subject: "Mathematics", score: 17, maxScore: 20, type: "quiz", date: new Date(2026, 1, 3), weight: 1, markingPeriod: "MP3" },
  { id: "m10", title: "Quadratic Functions Test", subject: "Mathematics", score: 90, maxScore: 100, type: "test", date: new Date(2026, 1, 20), weight: 3, markingPeriod: "MP3" },
  { id: "m11", title: "Functions Project", subject: "Mathematics", score: 94, maxScore: 100, type: "project", date: new Date(2026, 2, 10), weight: 2, markingPeriod: "MP3" },

  // English Language Arts
  { id: "e1", title: "Summer Reading Essay", subject: "English Language Arts", score: 44, maxScore: 50, type: "assignment", date: new Date(2025, 8, 15), weight: 2, markingPeriod: "MP1" },
  { id: "e2", title: "Grammar & Syntax Quiz", subject: "English Language Arts", score: 18, maxScore: 20, type: "quiz", date: new Date(2025, 9, 1), weight: 1, markingPeriod: "MP1" },
  { id: "e3", title: "Narrative Writing Test", subject: "English Language Arts", score: 89, maxScore: 100, type: "test", date: new Date(2025, 9, 15), weight: 3, markingPeriod: "MP1" },
  { id: "e4", title: "Poetry Analysis Project", subject: "English Language Arts", score: 46, maxScore: 50, type: "project", date: new Date(2025, 10, 10), weight: 2, markingPeriod: "MP2" },
  { id: "e5", title: "Vocabulary Unit 3 Quiz", subject: "English Language Arts", score: 19, maxScore: 20, type: "quiz", date: new Date(2025, 10, 22), weight: 1, markingPeriod: "MP2" },
  { id: "e6", title: "TKAM Comprehension Test", subject: "English Language Arts", score: 91, maxScore: 100, type: "test", date: new Date(2025, 11, 10), weight: 3, markingPeriod: "MP2" },
  { id: "e7", title: "TKAM Essay – Theme Analysis", subject: "English Language Arts", score: 88, maxScore: 100, type: "assignment", date: new Date(2026, 1, 8), weight: 3, markingPeriod: "MP3" },
  { id: "e8", title: "Persuasive Speech", subject: "English Language Arts", score: 93, maxScore: 100, type: "project", date: new Date(2026, 2, 5), weight: 2, markingPeriod: "MP3" },

  // Science
  { id: "s1", title: "Scientific Method Quiz", subject: "Science", score: 19, maxScore: 20, type: "quiz", date: new Date(2025, 8, 18), weight: 1, markingPeriod: "MP1" },
  { id: "s2", title: "Cell Biology Test", subject: "Science", score: 92, maxScore: 100, type: "test", date: new Date(2025, 9, 10), weight: 3, markingPeriod: "MP1" },
  { id: "s3", title: "Microscope Lab Report", subject: "Science", score: 46, maxScore: 50, type: "assignment", date: new Date(2025, 9, 25), weight: 2, markingPeriod: "MP1" },
  { id: "s4", title: "Genetics Unit Test", subject: "Science", score: 88, maxScore: 100, type: "test", date: new Date(2025, 10, 15), weight: 3, markingPeriod: "MP2" },
  { id: "s5", title: "DNA Model Project", subject: "Science", score: 48, maxScore: 50, type: "project", date: new Date(2025, 11, 1), weight: 2, markingPeriod: "MP2" },
  { id: "s6", title: "Cell Division Quiz", subject: "Science", score: 18, maxScore: 20, type: "quiz", date: new Date(2026, 1, 5), weight: 1, markingPeriod: "MP3" },
  { id: "s7", title: "Ecology Lab Report", subject: "Science", score: 91, maxScore: 100, type: "assignment", date: new Date(2026, 2, 15), weight: 2, markingPeriod: "MP3" },

  // U.S. History
  { id: "h1", title: "Colonial America Quiz", subject: "U.S. History", score: 17, maxScore: 20, type: "quiz", date: new Date(2025, 8, 22), weight: 1, markingPeriod: "MP1" },
  { id: "h2", title: "13 Colonies Project", subject: "U.S. History", score: 93, maxScore: 100, type: "project", date: new Date(2025, 9, 8), weight: 2, markingPeriod: "MP1" },
  { id: "h3", title: "Revolutionary War Test", subject: "U.S. History", score: 90, maxScore: 100, type: "test", date: new Date(2025, 10, 5), weight: 3, markingPeriod: "MP2" },
  { id: "h4", title: "Constitution Quiz", subject: "U.S. History", score: 18, maxScore: 20, type: "quiz", date: new Date(2025, 11, 12), weight: 1, markingPeriod: "MP2" },
  { id: "h5", title: "Bill of Rights Essay", subject: "U.S. History", score: 89, maxScore: 100, type: "assignment", date: new Date(2026, 1, 10), weight: 2, markingPeriod: "MP3" },
  { id: "h6", title: "Westward Expansion Test", subject: "U.S. History", score: 91, maxScore: 100, type: "test", date: new Date(2026, 2, 8), weight: 3, markingPeriod: "MP3" },

  // Spanish
  { id: "sp1", title: "Greetings & Intro Quiz", subject: "Spanish", score: 19, maxScore: 20, type: "quiz", date: new Date(2025, 8, 16), weight: 1, markingPeriod: "MP1" },
  { id: "sp2", title: "AR Verb Conjugation Test", subject: "Spanish", score: 91, maxScore: 100, type: "test", date: new Date(2025, 9, 12), weight: 3, markingPeriod: "MP1" },
  { id: "sp3", title: "Family Vocabulary Quiz", subject: "Spanish", score: 18, maxScore: 20, type: "quiz", date: new Date(2025, 10, 8), weight: 1, markingPeriod: "MP2" },
  { id: "sp4", title: "Oral Presentation", subject: "Spanish", score: 45, maxScore: 50, type: "project", date: new Date(2025, 11, 5), weight: 2, markingPeriod: "MP2" },
  { id: "sp5", title: "ER/IR Verbs Test", subject: "Spanish", score: 89, maxScore: 100, type: "test", date: new Date(2026, 1, 12), weight: 3, markingPeriod: "MP3" },

  // Computer Science
  { id: "cs1", title: "Scratch Animation Project", subject: "Computer Science", score: 95, maxScore: 100, type: "project", date: new Date(2025, 9, 20), weight: 2, markingPeriod: "MP1" },
  { id: "cs2", title: "Binary & Logic Quiz", subject: "Computer Science", score: 19, maxScore: 20, type: "quiz", date: new Date(2025, 10, 18), weight: 1, markingPeriod: "MP2" },
  { id: "cs3", title: "Python Basics Test", subject: "Computer Science", score: 92, maxScore: 100, type: "test", date: new Date(2026, 1, 18), weight: 3, markingPeriod: "MP3" },
  { id: "cs4", title: "Website Project", subject: "Computer Science", score: 96, maxScore: 100, type: "project", date: new Date(2026, 2, 12), weight: 2, markingPeriod: "MP3" },

  // Art
  { id: "a1", title: "Color Theory Project", subject: "Art", score: 47, maxScore: 50, type: "project", date: new Date(2025, 9, 15), weight: 2, markingPeriod: "MP1" },
  { id: "a2", title: "Perspective Drawing", subject: "Art", score: 93, maxScore: 100, type: "assignment", date: new Date(2025, 11, 8), weight: 2, markingPeriod: "MP2" },
  { id: "a3", title: "Portfolio Review", subject: "Art", score: 92, maxScore: 100, type: "project", date: new Date(2026, 2, 1), weight: 3, markingPeriod: "MP3" },
];

const subjects = ["Mathematics", "English Language Arts", "Science", "U.S. History", "Spanish", "Computer Science", "Art"];
const markingPeriods = ["MP1", "MP2", "MP3", "MP4", "Full Year"] as const;

function getLetterGrade(percent: number): { grade: string; color: string } {
  if (percent >= 97) return { grade: "A+", color: "text-success" };
  if (percent >= 93) return { grade: "A", color: "text-success" };
  if (percent >= 90) return { grade: "A-", color: "text-success" };
  if (percent >= 87) return { grade: "B+", color: "text-primary" };
  if (percent >= 83) return { grade: "B", color: "text-primary" };
  if (percent >= 80) return { grade: "B-", color: "text-primary" };
  if (percent >= 77) return { grade: "C+", color: "text-warning" };
  if (percent >= 73) return { grade: "C", color: "text-warning" };
  if (percent >= 70) return { grade: "C-", color: "text-warning" };
  if (percent >= 67) return { grade: "D+", color: "text-destructive" };
  if (percent >= 60) return { grade: "D", color: "text-destructive" };
  return { grade: "F", color: "text-destructive" };
}

const GradesPage = () => {
  const [grades, setGrades] = useState<Grade[]>(allGrades);
  const [showAdd, setShowAdd] = useState(false);
  const [newGrade, setNewGrade] = useState({ title: "", subject: "Mathematics", score: 0, maxScore: 100, type: "test" as Grade["type"], weight: 2, markingPeriod: "MP3" as Grade["markingPeriod"] });
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedMP, setSelectedMP] = useState<string>("MP3");

  const addGrade = () => {
    if (!newGrade.title) return;
    setGrades([{ ...newGrade, id: Date.now().toString(), date: new Date() }, ...grades]);
    setNewGrade({ title: "", subject: "Mathematics", score: 0, maxScore: 100, type: "test", weight: 2, markingPeriod: "MP3" });
    setShowAdd(false);
  };

  const filteredByMP = selectedMP === "Full Year" ? grades : grades.filter(g => g.markingPeriod === selectedMP);

  const subjectStats = subjects.map((subject) => {
    const subjectGrades = filteredByMP.filter((g) => g.subject === subject);
    if (subjectGrades.length === 0) return null;
    const totalWeight = subjectGrades.reduce((sum, g) => sum + g.weight, 0);
    const weightedSum = subjectGrades.reduce((sum, g) => sum + (g.score / g.maxScore) * 100 * g.weight, 0);
    const average = weightedSum / totalWeight;
    const recentGrades = subjectGrades.slice(0, 3);
    const trend = recentGrades.length >= 2
      ? (recentGrades[0].score / recentGrades[0].maxScore) - (recentGrades[recentGrades.length - 1].score / recentGrades[recentGrades.length - 1].maxScore)
      : 0;
    return { subject, average, count: subjectGrades.length, trend, letterGrade: getLetterGrade(average) };
  }).filter(Boolean) as { subject: string; average: number; count: number; trend: number; letterGrade: { grade: string; color: string } }[];

  const overallAverage = subjectStats.length > 0
    ? subjectStats.reduce((sum, s) => sum + s.average, 0) / subjectStats.length
    : 0;

  const filteredGrades = (selectedSubject === "all" ? filteredByMP : filteredByMP.filter((g) => g.subject === selectedSubject));
  const sortedGrades = [...filteredGrades].sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-8 lg:pt-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Grade Tracker</h1>
            <p className="text-muted-foreground mt-1">Jack Williams • 8th Grade • Edison Middle School</p>
          </div>
          <Dialog open={showAdd} onOpenChange={setShowAdd}>
            <DialogTrigger asChild>
              <Button variant="calm" className="gap-2"><Plus className="h-5 w-5" />Add Grade</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add New Grade</DialogTitle></DialogHeader>
              <div className="space-y-4 pt-4">
                <Input placeholder="Assessment title" value={newGrade.title} onChange={(e) => setNewGrade({ ...newGrade, title: e.target.value })} />
                <div className="grid grid-cols-2 gap-4">
                  <Select value={newGrade.subject} onValueChange={(v) => setNewGrade({ ...newGrade, subject: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{subjects.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                  <Select value={newGrade.type} onValueChange={(v) => setNewGrade({ ...newGrade, type: v as Grade["type"] })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="test">Test</SelectItem>
                      <SelectItem value="quiz">Quiz</SelectItem>
                      <SelectItem value="assignment">Assignment</SelectItem>
                      <SelectItem value="project">Project</SelectItem>
                      <SelectItem value="exam">Exam</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  <div className="space-y-1"><label className="text-xs font-medium">Score</label><Input type="number" value={newGrade.score} onChange={(e) => setNewGrade({ ...newGrade, score: parseInt(e.target.value) || 0 })} /></div>
                  <div className="space-y-1"><label className="text-xs font-medium">Max</label><Input type="number" value={newGrade.maxScore} onChange={(e) => setNewGrade({ ...newGrade, maxScore: parseInt(e.target.value) || 100 })} /></div>
                  <div className="space-y-1"><label className="text-xs font-medium">Weight</label>
                    <Select value={String(newGrade.weight)} onValueChange={(v) => setNewGrade({ ...newGrade, weight: parseInt(v) })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="1">Low</SelectItem><SelectItem value="2">Med</SelectItem><SelectItem value="3">High</SelectItem><SelectItem value="4">Exam</SelectItem></SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1"><label className="text-xs font-medium">MP</label>
                    <Select value={newGrade.markingPeriod} onValueChange={(v) => setNewGrade({ ...newGrade, markingPeriod: v as Grade["markingPeriod"] })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{["MP1","MP2","MP3","MP4"].map(mp => <SelectItem key={mp} value={mp}>{mp}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={() => setShowAdd(false)}>Cancel</Button>
                  <Button variant="calm" className="flex-1" onClick={addGrade}>Save</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </header>

        {/* Marking Period Selector */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {markingPeriods.map((mp) => (
            <Button key={mp} variant={selectedMP === mp ? "default" : "outline"} size="sm" onClick={() => setSelectedMP(mp)}>
              {mp === "Full Year" ? "Full Year" : mp}
            </Button>
          ))}
        </div>

        {/* Overall Card */}
        <Card variant="elevated" className="bg-primary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="text-center">
                <GraduationCap className="h-10 w-10 text-primary mx-auto mb-2" />
                <div className={cn("text-5xl font-bold", getLetterGrade(overallAverage).color)}>{getLetterGrade(overallAverage).grade}</div>
                <p className="text-sm text-muted-foreground mt-1">{selectedMP} Average</p>
              </div>
              <div className="flex-1 w-full">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Jack Williams — Overall Average</span>
                  <span className="text-lg font-bold text-foreground">{overallAverage.toFixed(1)}%</span>
                </div>
                <Progress value={overallAverage} className="h-3" />
                <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                  <span>{filteredByMP.length} assessments in {selectedMP}</span>
                  <span>{subjectStats.length} subjects</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Genesis Sync Note */}
        <Card className="border-dashed border-2 border-muted-foreground/20">
          <CardContent className="p-3 flex items-center gap-3">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">Genesis Parent Portal Sync:</span> Connect to automatically import grades, attendance, and report cards.
                Storage hashing enabled for secure local grade caching.
              </p>
            </div>
            <Badge variant="muted" className="text-[10px]">API Ready</Badge>
          </CardContent>
        </Card>

        {/* Subject Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjectStats.map((stat) => (
            <Card key={stat.subject} variant="elevated" className="hover-lift cursor-pointer" onClick={() => setSelectedSubject(stat.subject)}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div><h4 className="font-semibold text-foreground">{stat.subject}</h4><p className="text-xs text-muted-foreground">{stat.count} assessments</p></div>
                  <div className={cn("text-2xl font-bold", stat.letterGrade.color)}>{stat.letterGrade.grade}</div>
                </div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Average</span>
                  <div className="flex items-center gap-1">
                    <span className="font-medium">{stat.average.toFixed(1)}%</span>
                    {stat.trend > 0.05 ? <TrendingUp className="h-3.5 w-3.5 text-success" /> : stat.trend < -0.05 ? <TrendingDown className="h-3.5 w-3.5 text-destructive" /> : <Minus className="h-3.5 w-3.5 text-muted-foreground" />}
                  </div>
                </div>
                <Progress value={stat.average} className="h-2" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Grades */}
        <Card variant="elevated">
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <CardTitle className="text-lg">Recent Grades — {selectedMP}</CardTitle>
              <div className="flex gap-2 flex-wrap">
                <Button variant={selectedSubject === "all" ? "default" : "outline"} size="sm" onClick={() => setSelectedSubject("all")}>All</Button>
                {subjectStats.map((s) => (
                  <Button key={s.subject} variant={selectedSubject === s.subject ? "default" : "outline"} size="sm" onClick={() => setSelectedSubject(s.subject)}>
                    {s.subject.length > 12 ? s.subject.slice(0, 12) + "…" : s.subject}
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sortedGrades.map((grade) => {
                const percent = (grade.score / grade.maxScore) * 100;
                const lg = getLetterGrade(percent);
                return (
                  <div key={grade.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 border border-border">
                    <div className={cn("text-xl font-bold w-10 text-center", lg.color)}>{lg.grade}</div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-foreground truncate">{grade.title}</h4>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Badge variant="subject" className="text-xs">{grade.subject}</Badge>
                        <span>{grade.type}</span><span>•</span><span>{format(grade.date, "MMM d")}</span>
                        <Badge variant="muted" className="text-[10px]">{grade.markingPeriod}</Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-foreground">{grade.score}/{grade.maxScore}</div>
                      <div className={cn("text-sm", lg.color)}>{percent.toFixed(0)}%</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default GradesPage;
