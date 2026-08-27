import { useWindowManager } from "@/contexts/WindowManagerContext";

interface DesktopIconProps {
  appKey: string;
  title: string;
  icon: React.ReactNode;
  color: string;
}

export function DesktopIcon({ appKey, title, icon, color }: DesktopIconProps) {
  const { openWindow } = useWindowManager();

  return (
    <button
      onDoubleClick={() => openWindow(appKey, title, "")}
      className="flex flex-col items-center gap-1 w-[76px] p-2 rounded-xl hover:bg-white/8 transition-all cursor-default select-none group"
    >
      <div className={`w-11 h-11 rounded-[14px] flex items-center justify-center ${color} group-hover:scale-110 transition-transform shadow-lg`}>
        {icon}
      </div>
      <span className="text-[10px] font-medium text-white/80 text-center leading-tight drop-shadow line-clamp-2">
        {title}
      </span>
    </button>
  );
}

export const APP_REGISTRY = [
  // Core productivity
  { appKey: "dashboard", title: "Dashboard", icon: <DashboardIcon />, color: "bg-gradient-to-br from-violet-500 to-purple-600" },
  { appKey: "notes", title: "Notes", icon: <NotesIcon />, color: "bg-gradient-to-br from-amber-400 to-orange-500" },
  { appKey: "pomodoro", title: "Focus Timer", icon: <TimerIcon />, color: "bg-gradient-to-br from-rose-400 to-red-500" },
  { appKey: "flashcards", title: "Flashcards", icon: <FlashcardsIcon />, color: "bg-gradient-to-br from-cyan-400 to-blue-500" },
  { appKey: "study-planner", title: "Study Planner", icon: <StudyIcon />, color: "bg-gradient-to-br from-emerald-400 to-teal-500" },
  { appKey: "calendar", title: "Calendar", icon: <CalendarIcon />, color: "bg-gradient-to-br from-blue-400 to-indigo-500" },

  // School tools
  { appKey: "grades", title: "Grades", icon: <GradesIcon />, color: "bg-gradient-to-br from-indigo-400 to-blue-600" },
  { appKey: "report-card", title: "Report Card", icon: <ReportIcon />, color: "bg-gradient-to-br from-purple-400 to-violet-600" },
  { appKey: "gpa-projector", title: "GPA Projector", icon: <GpaIcon />, color: "bg-gradient-to-br from-teal-400 to-cyan-600" },
  { appKey: "schedule", title: "Schedule", icon: <ScheduleIcon />, color: "bg-gradient-to-br from-pink-400 to-rose-500" },
  { appKey: "assignments", title: "Assignments", icon: <AssignmentIcon />, color: "bg-gradient-to-br from-yellow-400 to-amber-500" },
  { appKey: "assessments", title: "Assessments", icon: <AssessmentIcon />, color: "bg-gradient-to-br from-red-400 to-pink-500" },
  { appKey: "goals", title: "Goals", icon: <GoalsIcon />, color: "bg-gradient-to-br from-green-400 to-emerald-500" },

  // School life
  { appKey: "hall-pass", title: "Hall Pass", icon: <HallPassIcon />, color: "bg-gradient-to-br from-orange-400 to-red-500" },
  { appKey: "locker", title: "Locker", icon: <LockerIcon />, color: "bg-gradient-to-br from-slate-400 to-gray-600" },
  { appKey: "bus-tracker", title: "Bus Tracker", icon: <BusIcon />, color: "bg-gradient-to-br from-yellow-400 to-orange-500" },
  { appKey: "lunch-menu", title: "Lunch Menu", icon: <LunchIcon />, color: "bg-gradient-to-br from-lime-400 to-green-500" },
  { appKey: "clubs", title: "Clubs", icon: <ClubsIcon />, color: "bg-gradient-to-br from-fuchsia-400 to-pink-500" },
  { appKey: "time-blocks", title: "Time Blocks", icon: <TimeIcon />, color: "bg-gradient-to-br from-sky-400 to-blue-500" },
  { appKey: "resources", title: "Resources", icon: <ResourcesIcon />, color: "bg-gradient-to-br from-sky-400 to-indigo-500" },

  // System
  { appKey: "calculator", title: "Calculator", icon: <CalcIcon />, color: "bg-gradient-to-br from-gray-400 to-slate-600" },
  { appKey: "settings", title: "Settings", icon: <SettingsIcon />, color: "bg-gradient-to-br from-gray-500 to-zinc-600" },
];

// Inline SVG icons for a polished look
function DashboardIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>;
}
function NotesIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>;
}
function TimerIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
}
function FlashcardsIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 10h20"/><path d="M12 4v16"/></svg>;
}
function StudyIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>;
}
function CalendarIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
}
function GradesIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>;
}
function ReportIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>;
}
function GpaIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>;
}
function ScheduleIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 8 14"/></svg>;
}
function AssignmentIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>;
}
function AssessmentIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><path d="M9 14l2 2 4-4"/></svg>;
}
function GoalsIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>;
}
function HallPassIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>;
}
function LockerIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="12" cy="10" r="2"/><line x1="12" y1="12" x2="12" y2="15"/></svg>;
}
function BusIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M8 6v6"/><path d="M16 6v6"/><path d="M2 12h20"/><path d="M18 18H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2z"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>;
}
function LunchIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>;
}
function ClubsIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
}
function TimeIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="10" y1="14" x2="14" y2="14"/></svg>;
}
function ResourcesIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>;
}
function CalcIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="8" y2="10.01"/><line x1="12" y1="10" x2="12" y2="10.01"/><line x1="16" y1="10" x2="16" y2="10.01"/><line x1="8" y1="14" x2="8" y2="14.01"/><line x1="12" y1="14" x2="12" y2="14.01"/><line x1="16" y1="14" x2="16" y2="14.01"/><line x1="8" y1="18" x2="8" y2="18.01"/><line x1="12" y1="18" x2="16" y2="18"/></svg>;
}
function SettingsIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>;
}
