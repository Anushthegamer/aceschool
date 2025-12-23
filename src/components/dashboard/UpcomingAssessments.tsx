import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, AlertTriangle, BookOpen } from "lucide-react";
import { differenceInDays, format } from "date-fns";

interface Assessment {
  id: string;
  title: string;
  subject: string;
  date: Date;
  preparationProgress: number;
  topics: string[];
}

interface UpcomingAssessmentsProps {
  assessments: Assessment[];
}

export function UpcomingAssessments({ assessments }: UpcomingAssessmentsProps) {
  const sortedAssessments = [...assessments].sort(
    (a, b) => a.date.getTime() - b.date.getTime()
  );

  return (
    <Card variant="elevated">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Upcoming Assessments</CardTitle>
        <Badge variant="warning" className="gap-1">
          <AlertTriangle className="h-3 w-3" />
          {assessments.length} upcoming
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {sortedAssessments.slice(0, 3).map((assessment) => {
          const daysUntil = differenceInDays(assessment.date, new Date());
          const isUrgent = daysUntil <= 3;

          return (
            <div
              key={assessment.id}
              className={`p-4 rounded-lg border transition-all ${
                isUrgent ? "border-warning/50 bg-warning/5" : "border-border bg-muted/30"
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-foreground">{assessment.title}</h4>
                  <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                    <BookOpen className="h-3.5 w-3.5" />
                    {assessment.subject}
                  </div>
                </div>
                <Badge variant={isUrgent ? "warning" : "muted"}>
                  <Clock className="h-3 w-3 mr-1" />
                  {daysUntil === 0
                    ? "Today!"
                    : daysUntil === 1
                    ? "Tomorrow"
                    : `${daysUntil} days`}
                </Badge>
              </div>

              <div className="mt-3">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-muted-foreground">Preparation Progress</span>
                  <span className="font-medium text-foreground">
                    {assessment.preparationProgress}%
                  </span>
                </div>
                <Progress value={assessment.preparationProgress} className="h-2" />
              </div>

              {assessment.topics.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {assessment.topics.slice(0, 3).map((topic) => (
                    <Badge key={topic} variant="subject" className="text-xs">
                      {topic}
                    </Badge>
                  ))}
                  {assessment.topics.length > 3 && (
                    <Badge variant="muted" className="text-xs">
                      +{assessment.topics.length - 3} more
                    </Badge>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
