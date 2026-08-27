import { useState, useEffect } from "react";
import {
  Timer, StickyNote, Layers, Brain, Calculator,
  BarChart3, Calendar, Settings, Sparkles, BookOpen,
  ClipboardCheck, TrendingUp, FolderOpen, Clock,
  GraduationCap, Menu, X
} from "lucide-react";
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
      className="flex flex-col items-center gap-1.5 w-20 p-2 rounded-xl hover:bg-white/10 transition-colors cursor-default select-none group"
    >
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color} group-hover:scale-105 transition-transform shadow-soft`}>
        {icon}
      </div>
      <span className="text-[11px] font-medium text-white text-center leading-tight drop-shadow-md line-clamp-2">
        {title}
      </span>
    </button>
  );
}

export const APP_REGISTRY = [
  { appKey: "dashboard", title: "Dashboard", icon: <Sparkles className="h-6 w-6 text-white" />, color: "bg-gradient-to-br from-violet-500 to-purple-600" },
  { appKey: "notes", title: "Notes", icon: <StickyNote className="h-6 w-6 text-white" />, color: "bg-gradient-to-br from-amber-400 to-orange-500" },
  { appKey: "pomodoro", title: "Focus Timer", icon: <Timer className="h-6 w-6 text-white" />, color: "bg-gradient-to-br from-rose-400 to-red-500" },
  { appKey: "flashcards", title: "Flashcards", icon: <Layers className="h-6 w-6 text-white" />, color: "bg-gradient-to-br from-cyan-400 to-blue-500" },
  { appKey: "study-planner", title: "Study Planner", icon: <Brain className="h-6 w-6 text-white" />, color: "bg-gradient-to-br from-emerald-400 to-teal-500" },
  { appKey: "calculator", title: "Calculator", icon: <Calculator className="h-6 w-6 text-white" />, color: "bg-gradient-to-br from-slate-500 to-gray-600" },
  { appKey: "grades", title: "Grades", icon: <BarChart3 className="h-6 w-6 text-white" />, color: "bg-gradient-to-br from-indigo-400 to-blue-600" },
  { appKey: "schedule", title: "Schedule", icon: <Calendar className="h-6 w-6 text-white" />, color: "bg-gradient-to-br from-pink-400 to-rose-500" },
  { appKey: "assignments", title: "Assignments", icon: <BookOpen className="h-6 w-6 text-white" />, color: "bg-gradient-to-br from-yellow-400 to-amber-500" },
  { appKey: "goals", title: "Goals", icon: <TrendingUp className="h-6 w-6 text-white" />, color: "bg-gradient-to-br from-green-400 to-emerald-500" },
  { appKey: "resources", title: "Resources", icon: <FolderOpen className="h-6 w-6 text-white" />, color: "bg-gradient-to-br from-sky-400 to-indigo-500" },
  { appKey: "settings", title: "Settings", icon: <Settings className="h-6 w-6 text-white" />, color: "bg-gradient-to-br from-gray-400 to-slate-500" },
];
