import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { TrendingUp } from "lucide-react";

const subjects = [
  { name: "Pre-Algebra", current: 91 }, { name: "ELA", current: 89 },
  { name: "Science", current: 93 }, { name: "U.S. History", current: 88 },
  { name: "Spanish I", current: 90 }, { name: "Art", current: 96 }, { name: "P.E.", current: 95 },
];

const toGpa = (g: number) => g >= 93 ? 4.0 : g >= 90 ? 3.7 : g >= 87 ? 3.3 : g >= 83 ? 3.0 : g >= 80 ? 2.7 : g >= 77 ? 2.3 : g >= 70 ? 2.0 : 1.0;
const toLetter = (g: number) => g >= 93 ? "A" : g >= 90 ? "A-" : g >= 87 ? "B+" : g >= 83 ? "B" : g >= 80 ? "B-" : g >= 77 ? "C+" : "C";

export default function GpaProjectorPage() {
  const [scores, setScores] = useState(subjects.map(s => s.current));
  const gpa = (scores.reduce((a, b) => a + toGpa(b), 0) / scores.length).toFixed(2);
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center"><TrendingUp className="h-6 w-6 text-success" /></div>
          <div><h1 className="text-3xl font-bold">GPA Projector</h1><p className="text-muted-foreground">What-if calculator — drag sliders to predict</p></div>
        </div>
        <Card><CardHeader><CardTitle>Projected GPA: <span className="text-primary text-3xl">{gpa}</span></CardTitle></CardHeader></Card>
        <div className="grid gap-4 md:grid-cols-2">
          {subjects.map((s, i) => (
            <Card key={s.name}>
              <CardHeader className="pb-2 flex-row justify-between items-center">
                <CardTitle className="text-base">{s.name}</CardTitle>
                <span className="text-xl font-bold">{toLetter(scores[i])} ({scores[i]})</span>
              </CardHeader>
              <CardContent>
                <Slider value={[scores[i]]} min={50} max={100} step={1} onValueChange={v => setScores(scores.map((x, j) => j === i ? v[0] : x))} />
                <p className="text-xs text-muted-foreground mt-2">Current: {s.current} • GPA pts: {toGpa(scores[i])}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
