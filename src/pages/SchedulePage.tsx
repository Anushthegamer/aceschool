import { useState } from "react";
import { Clock, MapPin, User, ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ClassPeriod {
  id: string;
  period: number;
  subject: string;
  teacher: string;
  room: string;
  startTime: string;
  endTime: string;
  color: string;
  type: "class" | "lunch" | "advisory" | "elective" | "pe";
}

const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const schedule: Record<string, ClassPeriod[]> = {
  Monday: [
    { id: "m1", period: 1, subject: "Mathematics – Pre-Algebra", teacher: "Mr. Thompson", room: "Room 204", startTime: "8:00", endTime: "8:50", color: "bg-primary/10 border-primary/30 text-primary", type: "class" },
    { id: "m2", period: 2, subject: "English Language Arts", teacher: "Ms. Rivera", room: "Room 112", startTime: "8:55", endTime: "9:45", color: "bg-warning/10 border-warning/30 text-warning", type: "class" },
    { id: "m3", period: 3, subject: "U.S. History", teacher: "Mr. Chen", room: "Room 308", startTime: "9:50", endTime: "10:40", color: "bg-info/10 border-info/30 text-info", type: "class" },
    { id: "m4", period: 4, subject: "Advisory / Homeroom", teacher: "Ms. Patel", room: "Room 115", startTime: "10:45", endTime: "11:10", color: "bg-muted border-border text-muted-foreground", type: "advisory" },
    { id: "m5", period: 5, subject: "Lunch", teacher: "", room: "Cafeteria", startTime: "11:15", endTime: "11:55", color: "bg-success/10 border-success/30 text-success", type: "lunch" },
    { id: "m6", period: 6, subject: "Science – Life Science", teacher: "Dr. Williams", room: "Lab 201", startTime: "12:00", endTime: "12:50", color: "bg-success/10 border-success/30 text-success", type: "class" },
    { id: "m7", period: 7, subject: "Spanish I", teacher: "Sra. García", room: "Room 305", startTime: "12:55", endTime: "1:45", color: "bg-destructive/10 border-destructive/30 text-destructive", type: "class" },
    { id: "m8", period: 8, subject: "Physical Education", teacher: "Coach Davis", room: "Gymnasium", startTime: "1:50", endTime: "2:40", color: "bg-accent/10 border-accent/30 text-accent-foreground", type: "pe" },
  ],
  Tuesday: [
    { id: "t1", period: 1, subject: "Science – Life Science", teacher: "Dr. Williams", room: "Lab 201", startTime: "8:00", endTime: "8:50", color: "bg-success/10 border-success/30 text-success", type: "class" },
    { id: "t2", period: 2, subject: "Mathematics – Pre-Algebra", teacher: "Mr. Thompson", room: "Room 204", startTime: "8:55", endTime: "9:45", color: "bg-primary/10 border-primary/30 text-primary", type: "class" },
    { id: "t3", period: 3, subject: "Art & Design", teacher: "Ms. Kim", room: "Art Studio", startTime: "9:50", endTime: "10:40", color: "bg-accent/10 border-accent/30 text-accent-foreground", type: "elective" },
    { id: "t4", period: 4, subject: "Advisory / Homeroom", teacher: "Ms. Patel", room: "Room 115", startTime: "10:45", endTime: "11:10", color: "bg-muted border-border text-muted-foreground", type: "advisory" },
    { id: "t5", period: 5, subject: "Lunch", teacher: "", room: "Cafeteria", startTime: "11:15", endTime: "11:55", color: "bg-success/10 border-success/30 text-success", type: "lunch" },
    { id: "t6", period: 6, subject: "English Language Arts", teacher: "Ms. Rivera", room: "Room 112", startTime: "12:00", endTime: "12:50", color: "bg-warning/10 border-warning/30 text-warning", type: "class" },
    { id: "t7", period: 7, subject: "U.S. History", teacher: "Mr. Chen", room: "Room 308", startTime: "12:55", endTime: "1:45", color: "bg-info/10 border-info/30 text-info", type: "class" },
    { id: "t8", period: 8, subject: "Spanish I", teacher: "Sra. García", room: "Room 305", startTime: "1:50", endTime: "2:40", color: "bg-destructive/10 border-destructive/30 text-destructive", type: "class" },
  ],
  Wednesday: [
    { id: "w1", period: 1, subject: "English Language Arts", teacher: "Ms. Rivera", room: "Room 112", startTime: "8:00", endTime: "8:50", color: "bg-warning/10 border-warning/30 text-warning", type: "class" },
    { id: "w2", period: 2, subject: "Science – Life Science (Lab)", teacher: "Dr. Williams", room: "Lab 201", startTime: "8:55", endTime: "10:40", color: "bg-success/10 border-success/30 text-success", type: "class" },
    { id: "w3", period: 3, subject: "Advisory / Homeroom", teacher: "Ms. Patel", room: "Room 115", startTime: "10:45", endTime: "11:10", color: "bg-muted border-border text-muted-foreground", type: "advisory" },
    { id: "w4", period: 4, subject: "Lunch", teacher: "", room: "Cafeteria", startTime: "11:15", endTime: "11:55", color: "bg-success/10 border-success/30 text-success", type: "lunch" },
    { id: "w5", period: 5, subject: "Mathematics – Pre-Algebra", teacher: "Mr. Thompson", room: "Room 204", startTime: "12:00", endTime: "12:50", color: "bg-primary/10 border-primary/30 text-primary", type: "class" },
    { id: "w6", period: 6, subject: "Music / Band", teacher: "Mr. Johnson", room: "Band Room", startTime: "12:55", endTime: "1:45", color: "bg-accent/10 border-accent/30 text-accent-foreground", type: "elective" },
    { id: "w7", period: 7, subject: "Physical Education", teacher: "Coach Davis", room: "Gymnasium", startTime: "1:50", endTime: "2:40", color: "bg-accent/10 border-accent/30 text-accent-foreground", type: "pe" },
  ],
  Thursday: [
    { id: "th1", period: 1, subject: "U.S. History", teacher: "Mr. Chen", room: "Room 308", startTime: "8:00", endTime: "8:50", color: "bg-info/10 border-info/30 text-info", type: "class" },
    { id: "th2", period: 2, subject: "Mathematics – Pre-Algebra", teacher: "Mr. Thompson", room: "Room 204", startTime: "8:55", endTime: "9:45", color: "bg-primary/10 border-primary/30 text-primary", type: "class" },
    { id: "th3", period: 3, subject: "Spanish I", teacher: "Sra. García", room: "Room 305", startTime: "9:50", endTime: "10:40", color: "bg-destructive/10 border-destructive/30 text-destructive", type: "class" },
    { id: "th4", period: 4, subject: "Advisory / Homeroom", teacher: "Ms. Patel", room: "Room 115", startTime: "10:45", endTime: "11:10", color: "bg-muted border-border text-muted-foreground", type: "advisory" },
    { id: "th5", period: 5, subject: "Lunch", teacher: "", room: "Cafeteria", startTime: "11:15", endTime: "11:55", color: "bg-success/10 border-success/30 text-success", type: "lunch" },
    { id: "th6", period: 6, subject: "English Language Arts", teacher: "Ms. Rivera", room: "Room 112", startTime: "12:00", endTime: "12:50", color: "bg-warning/10 border-warning/30 text-warning", type: "class" },
    { id: "th7", period: 7, subject: "Science – Life Science", teacher: "Dr. Williams", room: "Lab 201", startTime: "12:55", endTime: "1:45", color: "bg-success/10 border-success/30 text-success", type: "class" },
    { id: "th8", period: 8, subject: "Computer Science / Technology", teacher: "Ms. Nguyen", room: "Computer Lab", startTime: "1:50", endTime: "2:40", color: "bg-primary/10 border-primary/30 text-primary", type: "elective" },
  ],
  Friday: [
    { id: "f1", period: 1, subject: "Mathematics – Pre-Algebra", teacher: "Mr. Thompson", room: "Room 204", startTime: "8:00", endTime: "8:50", color: "bg-primary/10 border-primary/30 text-primary", type: "class" },
    { id: "f2", period: 2, subject: "English Language Arts", teacher: "Ms. Rivera", room: "Room 112", startTime: "8:55", endTime: "9:45", color: "bg-warning/10 border-warning/30 text-warning", type: "class" },
    { id: "f3", period: 3, subject: "U.S. History", teacher: "Mr. Chen", room: "Room 308", startTime: "9:50", endTime: "10:40", color: "bg-info/10 border-info/30 text-info", type: "class" },
    { id: "f4", period: 4, subject: "Advisory / Homeroom", teacher: "Ms. Patel", room: "Room 115", startTime: "10:45", endTime: "11:10", color: "bg-muted border-border text-muted-foreground", type: "advisory" },
    { id: "f5", period: 5, subject: "Lunch", teacher: "", room: "Cafeteria", startTime: "11:15", endTime: "11:55", color: "bg-success/10 border-success/30 text-success", type: "lunch" },
    { id: "f6", period: 6, subject: "Science – Life Science", teacher: "Dr. Williams", room: "Lab 201", startTime: "12:00", endTime: "12:50", color: "bg-success/10 border-success/30 text-success", type: "class" },
    { id: "f7", period: 7, subject: "Spanish I", teacher: "Sra. García", room: "Room 305", startTime: "12:55", endTime: "1:45", color: "bg-destructive/10 border-destructive/30 text-destructive", type: "class" },
    { id: "f8", period: 8, subject: "Study Hall / Free Period", teacher: "Ms. Patel", room: "Library", startTime: "1:50", endTime: "2:40", color: "bg-muted border-border text-muted-foreground", type: "advisory" },
  ],
};

const SchedulePage = () => {
  const today = new Date().getDay(); // 0=Sun
  const [selectedDay, setSelectedDay] = useState(today >= 1 && today <= 5 ? weekDays[today - 1] : "Monday");

  const currentPeriods = schedule[selectedDay] || [];

  // Determine current period based on time
  const now = new Date();
  const currentTimeMinutes = now.getHours() * 60 + now.getMinutes();

  const isCurrentPeriod = (period: ClassPeriod) => {
    if (weekDays[today - 1] !== selectedDay) return false;
    const [sh, sm] = period.startTime.split(":").map(Number);
    const [eh, em] = period.endTime.split(":").map(Number);
    const start = sh * 60 + sm;
    const end = eh * 60 + em;
    return currentTimeMinutes >= start && currentTimeMinutes < end;
  };

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        <header className="pt-8 lg:pt-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Class Schedule</h1>
          <p className="text-muted-foreground mt-1">8th Grade – Edison Middle School • 2025–2026</p>
        </header>

        {/* Day Selector */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {weekDays.map((day) => {
            const isToday = today >= 1 && today <= 5 && weekDays[today - 1] === day;
            return (
              <Button
                key={day}
                variant={selectedDay === day ? "default" : "outline"}
                size="sm"
                className={cn("flex-shrink-0", isToday && selectedDay !== day && "ring-2 ring-primary")}
                onClick={() => setSelectedDay(day)}
              >
                {day}
                {isToday && <Badge variant="success" className="ml-2 text-[10px] px-1">Today</Badge>}
              </Button>
            );
          })}
        </div>

        {/* Schedule */}
        <div className="space-y-3">
          {currentPeriods.map((period) => {
            const isCurrent = isCurrentPeriod(period);
            return (
              <Card
                key={period.id}
                className={cn(
                  "transition-all border-l-4",
                  period.color,
                  isCurrent && "ring-2 ring-primary shadow-glow"
                )}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground">{period.subject}</h3>
                        {isCurrent && <Badge variant="success" className="text-[10px]">NOW</Badge>}
                        {period.type !== "class" && (
                          <Badge variant="muted" className="text-[10px] capitalize">{period.type}</Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {period.startTime} – {period.endTime}
                        </span>
                        {period.teacher && (
                          <span className="flex items-center gap-1">
                            <User className="h-3.5 w-3.5" />
                            {period.teacher}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {period.room}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-muted-foreground">Period {period.period}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Info */}
        <div className="grid sm:grid-cols-3 gap-4">
          <Card variant="elevated">
            <CardContent className="p-4 text-center">
              <Calendar className="h-6 w-6 text-primary mx-auto mb-2" />
              <div className="text-lg font-bold text-foreground">{currentPeriods.filter((p) => p.type === "class").length}</div>
              <p className="text-xs text-muted-foreground">Core Classes</p>
            </CardContent>
          </Card>
          <Card variant="elevated">
            <CardContent className="p-4 text-center">
              <Clock className="h-6 w-6 text-info mx-auto mb-2" />
              <div className="text-lg font-bold text-foreground">8:00 – 2:40</div>
              <p className="text-xs text-muted-foreground">School Hours</p>
            </CardContent>
          </Card>
          <Card variant="elevated">
            <CardContent className="p-4 text-center">
              <MapPin className="h-6 w-6 text-success mx-auto mb-2" />
              <div className="text-lg font-bold text-foreground">{new Set(currentPeriods.map((p) => p.room)).size}</div>
              <p className="text-xs text-muted-foreground">Rooms Today</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default SchedulePage;
