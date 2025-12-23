import { format, isToday, isTomorrow, differenceInDays } from "date-fns";
import { Clock, BookOpen, Flag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

export interface Task {
  id: string;
  title: string;
  subject: string;
  dueDate: Date;
  priority: "high" | "medium" | "low";
  completed: boolean;
  type: "assignment" | "assessment" | "event";
}

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
}

function getDueDateLabel(date: Date): { label: string; urgent: boolean } {
  if (isToday(date)) return { label: "Today", urgent: true };
  if (isTomorrow(date)) return { label: "Tomorrow", urgent: false };
  const days = differenceInDays(date, new Date());
  if (days < 0) return { label: "Overdue", urgent: true };
  if (days <= 3) return { label: `${days} days`, urgent: true };
  return { label: format(date, "MMM d"), urgent: false };
}

export function TaskCard({ task, onToggle }: TaskCardProps) {
  const { label: dueLabel, urgent } = getDueDateLabel(task.dueDate);
  
  return (
    <Card 
      variant={urgent && !task.completed ? "urgent" : "interactive"}
      className={cn(
        "group",
        task.completed && "opacity-60"
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Checkbox
            checked={task.completed}
            onCheckedChange={() => onToggle(task.id)}
            className="mt-1"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className={cn(
                "font-medium text-card-foreground line-clamp-2",
                task.completed && "line-through text-muted-foreground"
              )}>
                {task.title}
              </h3>
              <Badge variant={task.priority}>
                {task.priority}
              </Badge>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <BookOpen className="h-3.5 w-3.5" />
                {task.subject}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {dueLabel}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
