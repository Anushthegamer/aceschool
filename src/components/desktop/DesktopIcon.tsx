// DesktopIcon — app icon on the desktop. Double-click to open the app in a window.

import { useWindowManager } from "@/contexts/WindowManagerContext";

interface Props {
  appKey: string;
  title: string;
  icon: React.ReactNode;
  color: string;
}

export function DesktopIcon({ appKey, title, icon, color }: Props) {
  const { openWindow } = useWindowManager();

  return (
    <button onDoubleClick={() => openWindow(appKey, title)}
      className="flex flex-col items-center gap-1 w-[76px] p-2 rounded-xl hover:bg-white/8 transition-all cursor-default select-none group">
      <div className={`w-11 h-11 rounded-[14px] flex items-center justify-center ${color} group-hover:scale-110 transition-transform shadow-lg`}>
        {icon}
      </div>
      <span className="text-[10px] font-medium text-white/80 text-center leading-tight drop-shadow line-clamp-2">{title}</span>
    </button>
  );
}

// app registry — every app that can be opened as a window
export const APP_REGISTRY = [
  // productivity
  { appKey: "dashboard", title: "Dashboard", icon: <Svg.Dashboard />, color: "bg-gradient-to-br from-violet-500 to-purple-600" },
  { appKey: "notes", title: "Notes", icon: <Svg.Notes />, color: "bg-gradient-to-br from-amber-400 to-orange-500" },
  { appKey: "pomodoro", title: "Focus Timer", icon: <Svg.Timer />, color: "bg-gradient-to-br from-rose-400 to-red-500" },
  { appKey: "flashcards", title: "Flashcards", icon: <Svg.Flashcards />, color: "bg-gradient-to-br from-cyan-400 to-blue-500" },
  { appKey: "study-planner", title: "Study Planner", icon: <Svg.Study />, color: "bg-gradient-to-br from-emerald-400 to-teal-500" },
  { appKey: "calendar", title: "Calendar", icon: <Svg.Calendar />, color: "bg-gradient-to-br from-blue-400 to-indigo-500" },
  // school
  { appKey: "grades", title: "Grades", icon: <Svg.Grades />, color: "bg-gradient-to-br from-indigo-400 to-blue-600" },
  { appKey: "report-card", title: "Report Card", icon: <Svg.Report />, color: "bg-gradient-to-br from-purple-400 to-violet-600" },
  { appKey: "gpa-projector", title: "GPA Projector", icon: <Svg.Gpa />, color: "bg-gradient-to-br from-teal-400 to-cyan-600" },
  { appKey: "schedule", title: "Schedule", icon: <Svg.Schedule />, color: "bg-gradient-to-br from-pink-400 to-rose-500" },
  { appKey: "assignments", title: "Assignments", icon: <Svg.Assignments />, color: "bg-gradient-to-br from-yellow-400 to-amber-500" },
  { appKey: "assessments", title: "Assessments", icon: <Svg.Assessments />, color: "bg-gradient-to-br from-red-400 to-pink-500" },
  { appKey: "goals", title: "Goals", icon: <Svg.Goals />, color: "bg-gradient-to-br from-green-400 to-emerald-500" },
  // school life
  { appKey: "hall-pass", title: "Hall Pass", icon: <Svg.HallPass />, color: "bg-gradient-to-br from-orange-400 to-red-500" },
  { appKey: "locker", title: "Locker", icon: <Svg.Locker />, color: "bg-gradient-to-br from-slate-400 to-gray-600" },
  { appKey: "bus-tracker", title: "Bus Tracker", icon: <Svg.Bus />, color: "bg-gradient-to-br from-yellow-400 to-orange-500" },
  { appKey: "lunch-menu", title: "Lunch Menu", icon: <Svg.Lunch />, color: "bg-gradient-to-br from-lime-400 to-green-500" },
  { appKey: "clubs", title: "Clubs", icon: <Svg.Clubs />, color: "bg-gradient-to-br from-fuchsia-400 to-pink-500" },
  { appKey: "time-blocks", title: "Time Blocks", icon: <Svg.Time />, color: "bg-gradient-to-br from-sky-400 to-blue-500" },
  { appKey: "resources", title: "Resources", icon: <Svg.Resources />, color: "bg-gradient-to-br from-sky-400 to-indigo-500" },
  // system
  { appKey: "calculator", title: "Calculator", icon: <Svg.Calc />, color: "bg-gradient-to-br from-gray-400 to-slate-600" },
  { appKey: "settings", title: "Settings", icon: <Svg.Settings />, color: "bg-gradient-to-br from-gray-500 to-zinc-600" },
];

// hand-drawn SVG icons — each one is a simple stroke icon
const S = "h-5 w-5";
const c = { fill: "none", stroke: "white", strokeWidth: "2", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
const I = (d: string) => <svg viewBox="0 0 24 24" {...c} className={S}>{d}</svg>;

export const Svg = {
  Dashboard: () => I(<><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>),
  Notes: () => I(<><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></>),
  Timer: () => I(<><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>),
  Flashcards: () => I(<><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 10h20"/><path d="M12 4v16"/></>),
  Study: () => I(<><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></>),
  Calendar: () => I(<><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>),
  Grades: () => I(<><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></>),
  Report: () => I(<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></>),
  Gpa: () => I(<><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></>),
  Schedule: () => I(<><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 8 14"/></>),
  Assignments: () => I(<><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></>),
  Assessments: () => I(<><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><path d="M9 14l2 2 4-4"/></>),
  Goals: () => I(<><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></>),
  HallPass: () => I(<><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></>),
  Locker: () => I(<><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="12" cy="10" r="2"/><line x1="12" y1="12" x2="12" y2="15"/></>),
  Bus: () => I(<><path d="M8 6v6"/><path d="M16 6v6"/><path d="M2 12h20"/><path d="M18 18H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2z"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></>),
  Lunch: () => I(<><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></>),
  Clubs: () => I(<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>),
  Time: () => I(<><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="10" y1="14" x2="14" y2="14"/></>),
  Resources: () => I(<><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></>),
  Calc: () => I(<><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="8" y2="10.01"/><line x1="12" y1="10" x2="12" y2="10.01"/><line x1="16" y1="10" x2="16" y2="10.01"/><line x1="8" y1="14" x2="8" y2="14.01"/><line x1="12" y1="14" x2="12" y2="14.01"/><line x1="16" y1="14" x2="16" y2="14.01"/><line x1="8" y1="18" x2="8" y2="18.01"/><line x1="12" y1="18" x2="16" y2="18"/></>),
  Settings: () => I(<><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></>),
};
