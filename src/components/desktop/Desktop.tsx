// Desktop — the main OS shell. Renders wallpaper, clock, desktop icons, windows, and taskbar.

import { useState, useEffect } from "react";
import { useWindowManager } from "@/contexts/WindowManagerContext";
import { Taskbar } from "./Taskbar";
import { DesktopIcon, APP_REGISTRY } from "./DesktopIcon";
import { Window } from "@/components/window/Window";

// lazy-load all app components — keeps initial bundle small
import { DashboardApp } from "@/components/apps/DashboardApp";
import { NotesApp } from "@/components/apps/NotesApp";
import { PomodoroApp } from "@/components/apps/PomodoroApp";
import { FlashcardsApp } from "@/components/apps/FlashcardsApp";
import { StudyPlannerApp } from "@/components/apps/StudyPlannerApp";
import { CalculatorApp } from "@/components/apps/CalculatorApp";
import { GradesApp } from "@/components/apps/GradesApp";
import { ScheduleApp } from "@/components/apps/ScheduleApp";
import { AssignmentsApp } from "@/components/apps/AssignmentsApp";
import { GoalsApp } from "@/components/apps/GoalsApp";
import { ResourcesApp } from "@/components/apps/ResourcesApp";
import { SettingsApp } from "@/components/apps/SettingsApp";
import { HallPassApp } from "@/components/apps/HallPassApp";
import { LockerApp } from "@/components/apps/LockerApp";
import { BusTrackerApp } from "@/components/apps/BusTrackerApp";
import { LunchMenuApp } from "@/components/apps/LunchMenuApp";
import { ClubsApp } from "@/components/apps/ClubsApp";
import { TimeBlockApp } from "@/components/apps/TimeBlockApp";
import { ReportCardApp } from "@/components/apps/ReportCardApp";
import { GpaProjectorApp } from "@/components/apps/GpaProjectorApp";
import { CalendarApp } from "@/components/apps/CalendarApp";
import { AssessmentsApp } from "@/components/apps/AssessmentsApp";

const APPS: Record<string, React.ComponentType> = {
  dashboard: DashboardApp, notes: NotesApp, pomodoro: PomodoroApp,
  flashcards: FlashcardsApp, "study-planner": StudyPlannerApp, calculator: CalculatorApp,
  grades: GradesApp, schedule: ScheduleApp, assignments: AssignmentsApp,
  goals: GoalsApp, resources: ResourcesApp, settings: SettingsApp,
  "hall-pass": HallPassApp, locker: LockerApp, "bus-tracker": BusTrackerApp,
  "lunch-menu": LunchMenuApp, clubs: ClubsApp, "time-blocks": TimeBlockApp,
  "report-card": ReportCardApp, "gpa-projector": GpaProjectorApp,
  calendar: CalendarApp, assessments: AssessmentsApp,
};

function ClockWidget() {
  const [now, setNow] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);

  const h = now.getHours();
  const greeting = h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="absolute top-8 left-1/2 -translate-x-1/2 text-center pointer-events-none select-none">
      <p className="text-7xl font-extralight text-white/90 tabular-nums tracking-tight drop-shadow-lg">
        {now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </p>
      <p className="text-lg text-white/60 mt-2 font-light drop-shadow">
        {greeting} — {now.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" })}
      </p>
    </div>
  );
}

export function Desktop() {
  const { windows } = useWindowManager();

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* wallpaper — deep space with aurora glows */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a1a] via-[#0d1225] to-[#0f0720]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(1px 1px at 10% 20%, rgba(255,255,255,0.3) 0%, transparent 100%),
            radial-gradient(1px 1px at 30% 60%, rgba(255,255,255,0.2) 0%, transparent 100%),
            radial-gradient(1px 1px at 50% 10%, rgba(255,255,255,0.4) 0%, transparent 100%),
            radial-gradient(1px 1px at 70% 80%, rgba(255,255,255,0.15) 0%, transparent 100%),
            radial-gradient(1px 1px at 90% 40%, rgba(255,255,255,0.25) 0%, transparent 100%),
            radial-gradient(1.5px 1.5px at 15% 75%, rgba(200,180,255,0.3) 0%, transparent 100%),
            radial-gradient(1.5px 1.5px at 85% 15%, rgba(180,200,255,0.2) 0%, transparent 100%)`,
        }} />
        <div className="absolute top-0 left-0 right-0 h-1/3 overflow-hidden opacity-40">
          <div className="absolute -top-20 left-1/4 w-[500px] h-[300px] bg-violet-600/20 rounded-full blur-[100px] rotate-12" />
          <div className="absolute -top-10 right-1/3 w-[400px] h-[250px] bg-indigo-500/15 rounded-full blur-[80px] -rotate-6" />
        </div>
        <div className="absolute bottom-12 left-0 right-0 h-32 bg-gradient-to-t from-violet-900/20 to-transparent" />
      </div>

      <ClockWidget />

      {/* desktop icons */}
      <div className="absolute inset-0 bottom-14 p-6 pt-44 flex flex-wrap content-start gap-1">
        {APP_REGISTRY.map(app => <DesktopIcon key={app.appKey} {...app} />)}
      </div>

      {/* open windows */}
      {windows.map(win => {
        const Comp = APPS[win.appKey];
        if (!Comp) return null;
        return <Window key={win.id} window={win}><Comp /></Window>;
      })}

      <Taskbar />
    </div>
  );
}
