import { useWindowManager } from "@/contexts/WindowManagerContext";
import { Taskbar } from "./Taskbar";
import { DesktopIcon, APP_REGISTRY } from "./DesktopIcon";
import { Window } from "@/components/window/Window";
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

const APP_COMPONENTS: Record<string, React.ComponentType> = {
  dashboard: DashboardApp,
  notes: NotesApp,
  pomodoro: PomodoroApp,
  flashcards: FlashcardsApp,
  "study-planner": StudyPlannerApp,
  calculator: CalculatorApp,
  grades: GradesApp,
  schedule: ScheduleApp,
  assignments: AssignmentsApp,
  goals: GoalsApp,
  resources: ResourcesApp,
  settings: SettingsApp,
};

export function Desktop() {
  const { windows } = useWindowManager();

  return (
    <div className="fixed inset-0 overflow-hidden bg-gradient-to-br from-violet-950 via-indigo-950 to-slate-950">
      {/* Wallpaper decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-violet-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/3 rounded-full blur-3xl" />
      </div>

      {/* Desktop icons */}
      <div className="absolute inset-0 bottom-14 p-6 flex flex-wrap content-start gap-2">
        {APP_REGISTRY.map((app) => (
          <DesktopIcon key={app.appKey} {...app} />
        ))}
      </div>

      {/* Windows */}
      {windows.map((win) => {
        const AppComponent = APP_COMPONENTS[win.appKey];
        if (!AppComponent) return null;
        return (
          <Window key={win.id} window={win}>
            <AppComponent />
          </Window>
        );
      })}

      {/* Taskbar */}
      <Taskbar />
    </div>
  );
}
