import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bus, MapPin, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const stops = [
  { name: "Maple St & 1st Ave", time: "7:12 AM" },
  { name: "Oak Park entrance", time: "7:18 AM" },
  { name: "Edison Middle School", time: "7:35 AM" },
];

export default function BusPage() {
  const [progress, setProgress] = useState(45);
  useEffect(() => { const i = setInterval(() => setProgress(p => Math.min(100, p + 1)), 3000); return () => clearInterval(i); }, []);
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-info/20 flex items-center justify-center"><Bus className="h-6 w-6 text-info" /></div>
          <div>
            <h1 className="text-3xl font-bold">Bus Tracker</h1>
            <p className="text-muted-foreground">Bus #42 • Route Westside</p>
          </div>
        </div>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><MapPin className="h-5 w-5 text-primary" />Live Location</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-muted-foreground">Bus is <span className="font-semibold text-foreground">{progress}%</span> along the route • ETA at school: <span className="font-semibold text-foreground">7:35 AM</span></p>
            <div className="space-y-3 pt-2">
              {stops.map((s, i) => (
                <div key={s.name} className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${i <= Math.floor(progress / 35) ? "bg-primary" : "bg-muted"}`} />
                  <div className="flex-1"><div className="text-sm font-medium">{s.name}</div></div>
                  <Badge variant="outline" className="gap-1"><Clock className="h-3 w-3" />{s.time}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
