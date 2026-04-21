import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";
import { LayoutDashboard, CalendarDays, BookOpen, ClipboardCheck, Timer, StickyNote, Target, BarChart3, Layers, Brain, FolderOpen, Calendar, Settings, LogOut, Utensils, Bus, KeyRound, ScrollText, Award, TrendingUp } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const routes = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: CalendarDays, label: "Calendar", path: "/calendar" },
  { icon: Calendar, label: "Class Schedule", path: "/schedule" },
  { icon: BookOpen, label: "Assignments", path: "/assignments" },
  { icon: ClipboardCheck, label: "Assessments", path: "/assessments" },
  { icon: BarChart3, label: "Grades", path: "/grades" },
  { icon: Award, label: "Report Card", path: "/report-card" },
  { icon: TrendingUp, label: "GPA Projector", path: "/gpa-projector" },
  { icon: Timer, label: "Pomodoro Timer", path: "/pomodoro" },
  { icon: StickyNote, label: "Study Notes", path: "/notes" },
  { icon: Layers, label: "Flashcards", path: "/flashcards" },
  { icon: Brain, label: "Study Planner", path: "/study-planner" },
  { icon: FolderOpen, label: "Resources", path: "/resources" },
  { icon: Target, label: "Goals & Habits", path: "/goals" },
  { icon: Utensils, label: "Lunch Menu", path: "/lunch" },
  { icon: Bus, label: "Bus Tracker", path: "/bus" },
  { icon: KeyRound, label: "Locker Vault", path: "/locker" },
  { icon: ScrollText, label: "Hall Pass Log", path: "/hall-pass" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export const CommandPalette = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { signOut } = useAuth();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(o => !o);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const go = (path: string) => { setOpen(false); navigate(path); };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Jump anywhere... (try 'grades', 'pomodoro', 'lunch')" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigate">
          {routes.map(r => (
            <CommandItem key={r.path} onSelect={() => go(r.path)}>
              <r.icon className="mr-2 h-4 w-4" />{r.label}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Account">
          <CommandItem onSelect={async () => { await signOut(); toast.success("Signed out"); setOpen(false); }}>
            <LogOut className="mr-2 h-4 w-4" />Sign out
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};
