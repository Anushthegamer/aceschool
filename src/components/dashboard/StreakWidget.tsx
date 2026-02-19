import { Flame, Trophy, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StreakWidgetProps {
  currentStreak: number;
  longestStreak: number;
  todayComplete: boolean;
}

export function StreakWidget({ currentStreak, longestStreak, todayComplete }: StreakWidgetProps) {
  return (
    <Card variant="glass" className="overflow-hidden relative">
      <div className={cn("absolute inset-0 opacity-10", todayComplete ? "gradient-calm" : "gradient-warm")} />
      <CardContent className="p-4 relative">
        <div className="flex items-center gap-4">
          <div className={cn(
            "w-14 h-14 rounded-xl flex items-center justify-center",
            todayComplete ? "bg-success/10" : "bg-warning/10"
          )}>
            <Flame className={cn("h-7 w-7", todayComplete ? "text-success" : "text-warning")} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-foreground">{currentStreak}</span>
              <span className="text-sm text-muted-foreground">day streak</span>
            </div>
            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Trophy className="h-3 w-3 text-warning" />
                Best: {longestStreak} days
              </span>
              <span className="flex items-center gap-1">
                <Zap className="h-3 w-3 text-primary" />
                {todayComplete ? "Done today ✓" : "Incomplete"}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
