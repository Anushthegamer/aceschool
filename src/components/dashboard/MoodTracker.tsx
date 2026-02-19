import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const moods = [
  { emoji: "😫", label: "Stressed", value: 1 },
  { emoji: "😟", label: "Anxious", value: 2 },
  { emoji: "😐", label: "Neutral", value: 3 },
  { emoji: "🙂", label: "Good", value: 4 },
  { emoji: "😊", label: "Great", value: 5 },
];

export function MoodTracker() {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [weekMoods] = useState([4, 3, 5, 3, 4, null, null]);
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle className="text-lg">How are you feeling?</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between">
          {moods.map((mood) => (
            <button
              key={mood.value}
              onClick={() => setSelectedMood(mood.value)}
              className={cn(
                "flex flex-col items-center gap-1 p-2 rounded-lg transition-all",
                selectedMood === mood.value
                  ? "bg-primary/10 scale-110"
                  : "hover:bg-muted"
              )}
            >
              <span className="text-2xl">{mood.emoji}</span>
              <span className="text-[10px] text-muted-foreground">{mood.label}</span>
            </button>
          ))}
        </div>

        {/* Week overview */}
        <div className="pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground mb-2">This week</p>
          <div className="flex justify-between">
            {weekMoods.map((mood, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <span className="text-lg">
                  {mood ? moods.find((m) => m.value === mood)?.emoji : "·"}
                </span>
                <span className="text-[10px] text-muted-foreground">{dayNames[i]}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
