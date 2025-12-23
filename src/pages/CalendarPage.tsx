import { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, addMonths, subMonths, startOfWeek, endOfWeek } from "date-fns";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { addDays } from "date-fns";

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type: "assignment" | "assessment" | "event" | "personal";
  color: string;
}

const sampleEvents: CalendarEvent[] = [
  { id: "1", title: "Math Homework Due", date: new Date(), type: "assignment", color: "bg-primary" },
  { id: "2", title: "Science Quiz", date: addDays(new Date(), 2), type: "assessment", color: "bg-warning" },
  { id: "3", title: "English Essay", date: addDays(new Date(), 3), type: "assignment", color: "bg-primary" },
  { id: "4", title: "School Assembly", date: addDays(new Date(), 5), type: "event", color: "bg-info" },
  { id: "5", title: "History Test", date: addDays(new Date(), 7), type: "assessment", color: "bg-warning" },
  { id: "6", title: "Birthday Party", date: addDays(new Date(), 10), type: "personal", color: "bg-success" },
  { id: "7", title: "Art Project Due", date: addDays(new Date(), 12), type: "assignment", color: "bg-primary" },
];

const CalendarPage = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getEventsForDate = (date: Date) => {
    return sampleEvents.filter(event => isSameDay(event.date, date));
  };

  const selectedEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-8 lg:pt-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Calendar</h1>
            <p className="text-muted-foreground mt-1">Plan and track all your important dates</p>
          </div>
          <Button variant="calm" className="gap-2">
            <Plus className="h-5 w-5" />
            Add Event
          </Button>
        </header>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Calendar Grid */}
          <Card variant="elevated" className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl">
                {format(currentMonth, "MMMM yyyy")}
              </CardTitle>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="icon-sm"
                  onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon-sm"
                  onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Day Headers */}
              <div className="grid grid-cols-7 mb-2">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => (
                  <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, index) => {
                  const dayEvents = getEventsForDate(day);
                  const isCurrentMonth = isSameMonth(day, currentMonth);
                  const isSelected = selectedDate && isSameDay(day, selectedDate);

                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedDate(day)}
                      className={cn(
                        "aspect-square p-1 rounded-lg transition-all duration-200 flex flex-col items-center justify-start",
                        !isCurrentMonth && "opacity-30",
                        isToday(day) && "ring-2 ring-primary",
                        isSelected && "bg-primary text-primary-foreground",
                        !isSelected && "hover:bg-secondary"
                      )}
                    >
                      <span className={cn(
                        "text-sm font-medium",
                        isSelected ? "text-primary-foreground" : "text-foreground"
                      )}>
                        {format(day, "d")}
                      </span>
                      {dayEvents.length > 0 && (
                        <div className="flex gap-0.5 mt-1 flex-wrap justify-center">
                          {dayEvents.slice(0, 3).map((event, i) => (
                            <div
                              key={i}
                              className={cn(
                                "w-1.5 h-1.5 rounded-full",
                                event.color,
                                isSelected && "opacity-80"
                              )}
                            />
                          ))}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Selected Date Events */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="text-lg">
                {selectedDate 
                  ? format(selectedDate, "EEEE, MMMM d")
                  : "Select a date"
                }
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDate ? (
                selectedEvents.length > 0 ? (
                  <div className="space-y-3">
                    {selectedEvents.map(event => (
                      <div
                        key={event.id}
                        className="p-3 rounded-lg bg-muted/50 border border-border"
                      >
                        <div className="flex items-start gap-3">
                          <div className={cn("w-2 h-2 rounded-full mt-1.5", event.color)} />
                          <div>
                            <h4 className="font-medium text-foreground">{event.title}</h4>
                            <Badge variant="muted" className="mt-1 text-xs">
                              {event.type}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    No events on this day
                  </p>
                )
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  Click on a date to see events
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Legend */}
        <Card>
          <CardContent className="py-4">
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <span className="text-muted-foreground">Legend:</span>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span>Assignment</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-warning" />
                <span>Assessment</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-info" />
                <span>Event</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-success" />
                <span>Personal</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default CalendarPage;
