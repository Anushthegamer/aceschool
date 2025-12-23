import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    positive: boolean;
  };
  variant?: "default" | "primary" | "warning" | "success";
}

export function StatsCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend,
  variant = "default" 
}: StatsCardProps) {
  const variantStyles = {
    default: "bg-card",
    primary: "bg-primary/5 border-primary/20",
    warning: "bg-warning/5 border-warning/20",
    success: "bg-success/5 border-success/20",
  };

  const iconStyles = {
    default: "bg-muted text-muted-foreground",
    primary: "bg-primary/10 text-primary",
    warning: "bg-warning/10 text-warning",
    success: "bg-success/10 text-success",
  };

  return (
    <Card variant="elevated" className={cn(variantStyles[variant])}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={cn("p-2 rounded-lg", iconStyles[variant])}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
        {trend && (
          <p className={cn(
            "text-xs font-medium mt-1",
            trend.positive ? "text-success" : "text-destructive"
          )}>
            {trend.positive ? "↑" : "↓"} {Math.abs(trend.value)}% from last week
          </p>
        )}
      </CardContent>
    </Card>
  );
}
