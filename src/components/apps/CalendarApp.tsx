import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: "assignment" | "assessment" | "school" | "personal";
  color: string;
}

const SAMPLE_EVENTS: CalendarEvent[] = [
  { id: "1", title: "Math Homework Due", date: "2026-08-28", type: "assignment", color: "bg-primary" },
  { id: "2", title: "Science Quiz", date: "2026-08-30", type: "assessment", color: "bg-amber-500" },
  { id: "3", title: "School Assembly", date: "2026-09-01", type: "school", color: "bg-cyan-500" },
  { id: "4", title: "Soccer Practice", date: "2026-09-02", type: "personal", color: "bg-emerald-500" },
  { id: "5", title: "English Essay Due", date: "2026-09-03", type: "assignment", color: "bg-primary" },
  { id: "6", title: "History Test", date: "2026-09-05", type: "assessment", color: "bg-amber-500" },
  { id: "7", title: "School Picture Day", date: "2026-09-08", type: "school", color: "bg-cyan-500" },
  { id: "8", title: "Dentist Appointment", date: "2026-09-10", type: "personal", color: "bg-emerald-500" },
  { id: "9", title: "Book Report Due", date: "2026-09-12", type: "assignment", color: "bg-primary" },
  { id: "10", title: "Math Midterm", date: "2026-09-15", type: "assessment", color: "bg-amber-500" },
  { id: "11", title: "Back to School Night", date: "2026-09-18", type: "school", color: "bg-cyan-500" },
  { id: "12", title: "Club Fair", date: "2026-09-20", type: "school", color: "bg-cyan-500" },
];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export function CalendarApp() {
  const [month, setMonth] = useState(8); // September (0-indexed)
  const [year, setYear] = useState(2026);
  const [selected, setSelected] = useState<string | null>(null);

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const prev = () => { if (month === 0) { setMonth(11); setYear(year - 1); } else setMonth(month - 1); };
  const next = () => { if (month === 11) { setMonth(0); setYear(year + 1); } else setMonth(month + 1); };

  const dateStr = (d: number) => `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  const eventsFor = (d: number) => SAMPLE_EVENTS.filter((e) => e.date === dateStr(d));
  const selectedEvents = selected ? SAMPLE_EVENTS.filter((e) => e.date === selected) : [];

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-border/60 bg-muted/20 flex items-center justify-between">
        <button onClick={prev} className="w-7 h-7 rounded-lg hover:bg-muted/60 flex items-center justify-center"><ChevronLeft className="h-4 w-4" /></button>
        <p className="text-sm font-bold text-foreground">{MONTHS[month]} {year}</p>
        <button onClick={next} className="w-7 h-7 rounded-lg hover:bg-muted/60 flex items-center justify-center"><ChevronRight className="h-4 w-4" /></button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Calendar grid */}
        <div className="flex-1 p-3">
          <div className="grid grid-cols-7 gap-px mb-1">
            {DAYS.map((d) => <div key={d} className="text-center text-[10px] font-medium text-muted-foreground py-1">{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-px">
            {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const d = i + 1;
              const ds = dateStr(d);
              const evts = eventsFor(d);
              const isToday = d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
              const isSelected = selected === ds;
              return (
                <button key={d} onClick={() => setSelected(isSelected ? null : ds)}
                  className={`relative h-10 flex flex-col items-center justify-center rounded-lg transition-colors ${isSelected ? "bg-primary/10 ring-1 ring-primary" : isToday ? "bg-muted/40 ring-1 ring-muted-foreground/30" : "hover:bg-muted/30"}`}>
                  <span className={`text-xs ${isToday ? "font-bold text-primary" : "text-foreground"}`}>{d}</span>
                  {evts.length > 0 && (
                    <div className="flex gap-0.5 mt-0.5">
                      {evts.slice(0, 3).map((e, j) => <div key={j} className={`w-1 h-1 rounded-full ${e.color}`} />)}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Side panel */}
        <div className="w-48 border-l border-border/60 p-3 bg-muted/10 overflow-y-auto">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            {selected ? new Date(selected + "T12:00:00").toLocaleDateString([], { weekday: "long", month: "short", day: "numeric" }) : "Select a day"}
          </p>
          {selectedEvents.length === 0 && <p className="text-[10px] text-muted-foreground">No events</p>}
          {selectedEvents.map((e) => (
            <div key={e.id} className="p-2 rounded-lg bg-card border border-border/30 mb-1.5">
              <div className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${e.color}`} />
                <p className="text-[11px] font-medium text-foreground">{e.title}</p>
              </div>
              <span className="text-[9px] text-muted-foreground ml-3.5 capitalize">{e.type}</span>
            </div>
          ))}

          {/* Legend */}
          <div className="mt-4 space-y-1">
            <p className="text-[9px] font-semibold text-muted-foreground uppercase">Legend</p>
            {[
              { label: "Assignment", color: "bg-primary" },
              { label: "Assessment", color: "bg-amber-500" },
              { label: "School Event", color: "bg-cyan-500" },
              { label: "Personal", color: "bg-emerald-500" },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${l.color}`} />
                <span className="text-[9px] text-muted-foreground">{l.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
