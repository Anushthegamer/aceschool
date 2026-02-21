import { useState } from "react";
import { Plus, TrendingUp, TrendingDown, Minus, Award, BarChart3, BookOpen } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
}

const initialGrades: Grade[] = [
  { id: "1", title: "Linear Equations Unit Test", subject: "Mathematics", score: 88, maxScore: 100, type: "test", date: new Date(Date.now() - 86400000 * 7), weight: 3 },
  { id: "2", title: "TKAM Essay – Theme Analysis", subject: "English Language Arts", score: 42, maxScore: 50, type: "assignment", date: new Date(Date.now() - 86400000 * 5), weight: 2 },
  { id: "3", title: "Cell Biology Quiz", subject: "Science", score: 18, maxScore: 20, type: "quiz", date: new Date(Date.now() - 86400000 * 3), weight: 1 },
  { id: "4", title: "American Revolution Project", subject: "U.S. History", score: 45, maxScore: 50, type: "project", date: new Date(Date.now() - 86400000 * 10), weight: 2 },
  { id: "5", title: "Slope & Y-Intercept Quiz", subject: "Mathematics", score: 15, maxScore: 20, type: "quiz", date: new Date(Date.now() - 86400000 * 2), weight: 1 },
  { id: "6", title: "Microscope Lab Report", subject: "Science", score: 38, maxScore: 40, type: "assignment", date: new Date(Date.now() - 86400000 * 1), weight: 2 },
  { id: "7", title: "Poetry Analysis – Langston Hughes", subject: "English Language Arts", score: 85, maxScore: 100, type: "test", date: new Date(Date.now() - 86400000 * 14), weight: 3 },
  { id: "8", title: "Spanish Verb Conjugation Quiz", subject: "Spanish", score: 28, maxScore: 30, type: "quiz", date: new Date(Date.now() - 86400000 * 4), weight: 1 },
  { id: "9", title: "Scratch Animation Project", subject: "Computer Science", score: 95, maxScore: 100, type: "project", date: new Date(Date.now() - 86400000 * 6), weight: 2 },
  { id: "10", title: "Constitution Vocabulary Quiz", subject: "U.S. History", score: 17, maxScore: 20, type: "quiz", date: new Date(Date.now() - 86400000 * 8), weight: 1 },
];

const subjects = ["Mathematics", "English Language Arts", "Science", "U.S. History", "Spanish", "Computer Science", "Art"];

function getLetterGrade(percent: number): { grade: string; color: string } {
  if (percent >= 93) return { grade: "A", color: "text-success" };
  if (percent >= 85) return { grade: "B+", color: "text-primary" };
  if (percent >= 77) return { grade: "B", color: "text-primary" };
  if (percent >= 70) return { grade: "C+", color: "text-warning" };
  if (percent >= 60) return { grade: "C", color: "text-warning" };
  if (percent >= 50) return { grade: "D", color: "text-destructive" };
  return { grade: "F", color: "text-destructive" };
}

const GradesPage = () => {
  const [grades, setGrades] = useState<Grade[]>(initialGrades);
  const [showAdd, setShowAdd] = useState(false);
  const [newGrade, setNewGrade] = useState({ title: "", subject: "Mathematics", score: 0, maxScore: 100, type: "test" as Grade["type"], weight: 2 });
  const [selectedSubject, setSelectedSubject] = useState("all");

  const addGrade = () => {
    if (!newGrade.title) return;
    setGrades([{ ...newGrade, id: Date.now().toString(), date: new Date() }, ...grades]);
    setNewGrade({ title: "", subject: "Mathematics", score: 0, maxScore: 100, type: "test", weight: 2 });
    setShowAdd(false);
  };

  const subjectStats = subjects.map((subject) => {
    const subjectGrades = grades.filter((g) => g.subject === subject);
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

  const filteredGrades = selectedSubject === "all" ? grades : grades.filter((g) => g.subject === selectedSubject);
  const sortedGrades = [...filteredGrades].sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-8 lg:pt-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Grade Tracker</h1>
            <p className="text-muted-foreground mt-1">Monitor your 8th grade academic performance</p>
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
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1"><label className="text-xs font-medium">Score</label><Input type="number" value={newGrade.score} onChange={(e) => setNewGrade({ ...newGrade, score: parseInt(e.target.value) || 0 })} /></div>
                  <div className="space-y-1"><label className="text-xs font-medium">Max Score</label><Input type="number" value={newGrade.maxScore} onChange={(e) => setNewGrade({ ...newGrade, maxScore: parseInt(e.target.value) || 100 })} /></div>
                  <div className="space-y-1"><label className="text-xs font-medium">Weight</label>
                    <Select value={String(newGrade.weight)} onValueChange={(v) => setNewGrade({ ...newGrade, weight: parseInt(v) })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="1">Low (1x)</SelectItem><SelectItem value="2">Medium (2x)</SelectItem><SelectItem value="3">High (3x)</SelectItem></SelectContent>
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

        <Card variant="elevated" className="bg-primary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="text-center">
                <Award className="h-10 w-10 text-primary mx-auto mb-2" />
                <div className={cn("text-5xl font-bold", getLetterGrade(overallAverage).color)}>{getLetterGrade(overallAverage).grade}</div>
                <p className="text-sm text-muted-foreground mt-1">Overall Grade</p>
              </div>
              <div className="flex-1 w-full">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Overall Average</span>
                  <span className="text-lg font-bold text-foreground">{overallAverage.toFixed(1)}%</span>
                </div>
                <Progress value={overallAverage} className="h-3" />
                <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                  <span>{grades.length} total assessments</span>
                  <span>{subjectStats.length} subjects tracked</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

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

        <Card variant="elevated">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Recent Grades</CardTitle>
              <div className="flex gap-2 flex-wrap">
                <Button variant={selectedSubject === "all" ? "default" : "outline"} size="sm" onClick={() => setSelectedSubject("all")}>All</Button>
                {subjectStats.map((s) => (
                  <Button key={s.subject} variant={selectedSubject === s.subject ? "default" : "outline"} size="sm" onClick={() => setSelectedSubject(s.subject)}>{s.subject}</Button>
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
