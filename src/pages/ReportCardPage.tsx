import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

const subjects = [
  { name: "Pre-Algebra", teacher: "Ms. Chen", grades: ["A-", "A", "A-", "A"], comment: "Strong problem-solving skills." },
  { name: "English Language Arts", teacher: "Mr. Patel", grades: ["A-", "B+", "A-", "A-"], comment: "Excellent essay analysis." },
  { name: "Science (Life Sci)", teacher: "Dr. Ortiz", grades: ["A", "A-", "A-", "A"], comment: "Curious and engaged in labs." },
  { name: "U.S. History", teacher: "Ms. Klein", grades: ["A-", "A-", "B+", "A-"], comment: "Thoughtful class participation." },
  { name: "Spanish I", teacher: "Sra. Rivera", grades: ["A-", "A-", "A", "A-"], comment: "Great pronunciation." },
  { name: "Art & Design", teacher: "Mr. Brooks", grades: ["A", "A", "A", "A"], comment: "Creative and consistent." },
  { name: "Phys. Ed.", teacher: "Coach Lee", grades: ["A", "A", "A-", "A"], comment: "Great teamwork." },
];

export default function ReportCardPage() {
  return (
    <MainLayout>
      <div className="space-y-6 print:space-y-3">
        <div className="flex items-center justify-between print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center"><Award className="h-6 w-6 text-primary" /></div>
            <div><h1 className="text-3xl font-bold">Report Card</h1><p className="text-muted-foreground">2025–2026 Academic Year</p></div>
          </div>
          <Button onClick={() => window.print()} className="gap-2"><Printer className="h-4 w-4" />Print</Button>
        </div>
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div><CardTitle>Jack Williams</CardTitle><p className="text-sm text-muted-foreground">Grade 8 • Section 8-A • Edison Middle School</p></div>
              <Badge className="text-base px-3 py-1">GPA 3.72</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead><tr className="border-b text-muted-foreground text-xs uppercase">
                <th className="text-left pb-2">Subject</th><th className="text-left pb-2">Teacher</th>
                <th className="text-center pb-2">MP1</th><th className="text-center pb-2">MP2</th><th className="text-center pb-2">MP3</th><th className="text-center pb-2">MP4</th>
                <th className="text-left pb-2 pl-4">Comment</th>
              </tr></thead>
              <tbody>
                {subjects.map(s => (
                  <tr key={s.name} className="border-b last:border-0">
                    <td className="py-3 font-medium">{s.name}</td>
                    <td className="py-3 text-muted-foreground">{s.teacher}</td>
                    {s.grades.map((g, i) => <td key={i} className="text-center font-semibold">{g}</td>)}
                    <td className="py-3 pl-4 text-xs text-muted-foreground italic">{s.comment}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-xs text-muted-foreground mt-4 text-center">Developed by Ramskandh Thirandasu</p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
