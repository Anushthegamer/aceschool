import { format, startOfWeek, addDays, isToday, isSameDay } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Task } from "@/components/tasks/TaskCard";
import { cn } from "@/lib/utils";

interface WeekViewProps {
  tasks: Task[];
  onSelectDate?: (date: Date) => void;
}

export function WeekView({ tasks, onSelectDate }: WeekViewProps) {
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getTasksForDate = (date: Date) => {
    return tasks.filter((task) => isSameDay(task.dueDate, date));
  };

  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle className="text-lg">This Week</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day) => {
            const dayTasks = getTasksForDate(day);
            const hasUrgent = dayTasks.some((t) => t.priority === "high" && !t.completed);
            
            return (
              <button
                key={day.toISOString()}
                onClick={() => onSelectDate?.(day)}
                className={cn(
                  "flex flex-col items-center p-2 sm:p-3 rounded-xl transition-all duration-200",
                  isToday(day)
                    ? "bg-primary text-primary-foreground shadow-glow"
                    : "hover:bg-secondary",
                  hasUrgent && !isToday(day) && "ring-2 ring-warning"
                )}
              >
                <span className={cn(
                  "text-xs font-medium mb-1",
                  isToday(day) ? "text-primary-foreground/80" : "text-muted-foreground"
                )}>
                  {format(day, "EEE")}
                </span>
                <span className={cn(
                  "text-lg font-bold",
                  isToday(day) ? "text-primary-foreground" : "text-foreground"
                )}>
                  {format(day, "d")}
                </span>
                {dayTasks.length > 0 && (
                  <div className="mt-1 flex gap-0.5">
                    {dayTasks.slice(0, 3).map((task, i) => (
                      <div
                        key={i}
                        className={cn(
                          "w-1.5 h-1.5 rounded-full",
                          task.priority === "high" ? "bg-destructive" :
                          task.priority === "medium" ? "bg-warning" : "bg-success",
                          isToday(day) && "opacity-80"
                        )}
                      />
                    ))}
                    {dayTasks.length > 3 && (
                      <span className={cn(
                        "text-[10px]",
                        isToday(day) ? "text-primary-foreground/80" : "text-muted-foreground"
                      )}>
                        +{dayTasks.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
