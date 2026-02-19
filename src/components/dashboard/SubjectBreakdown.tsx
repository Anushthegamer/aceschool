import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface SubjectData {
  name: string;
  tasks: number;
  completed: number;
  color: string;
}

const subjects: SubjectData[] = [
  { name: "Mathematics", tasks: 8, completed: 5, color: "bg-primary" },
  { name: "English", tasks: 6, completed: 4, color: "bg-info" },
  { name: "Science", tasks: 5, completed: 3, color: "bg-success" },
  { name: "History", tasks: 4, completed: 4, color: "bg-warning" },
  { name: "Computer Science", tasks: 3, completed: 2, color: "bg-destructive" },
];

export function SubjectBreakdown() {
  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle className="text-lg">Subject Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {subjects.map((subject) => {
          const percent = (subject.completed / subject.tasks) * 100;
          return (
            <div key={subject.name} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className={cn("w-2.5 h-2.5 rounded-full", subject.color)} />
                  <span className="font-medium text-foreground">{subject.name}</span>
                </div>
                <span className="text-muted-foreground">{subject.completed}/{subject.tasks}</span>
              </div>
              <Progress value={percent} className="h-1.5" />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
