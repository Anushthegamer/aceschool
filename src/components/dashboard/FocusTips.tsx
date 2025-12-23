import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Brain, Target, Smile } from "lucide-react";

const tips = [
  {
    icon: Brain,
    title: "Take a 5-min break",
    description: "Studies show short breaks boost focus by 20%",
    color: "text-primary",
  },
  {
    icon: Target,
    title: "Focus on one task",
    description: "Multitasking reduces productivity by 40%",
    color: "text-success",
  },
  {
    icon: Smile,
    title: "You're doing great!",
    description: "Remember: progress, not perfection",
    color: "text-warning",
  },
];

export function FocusTips() {
  const randomTip = tips[Math.floor(Math.random() * tips.length)];

  return (
    <Card variant="glass" className="overflow-hidden relative">
      <div className="absolute inset-0 gradient-calm opacity-10" />
      <CardContent className="p-4 relative">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <randomTip.icon className={`h-5 w-5 ${randomTip.color}`} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-medium text-primary uppercase tracking-wide">
                Focus Tip
              </span>
            </div>
            <h4 className="font-semibold text-foreground">{randomTip.title}</h4>
            <p className="text-sm text-muted-foreground mt-0.5">
              {randomTip.description}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
