import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  CalendarDays, 
  BookOpen, 
  ClipboardCheck,
  Timer,
  StickyNote,
  Target,
  BarChart3,
  Menu, 
  X,
  Sparkles, Settings, GraduationCap, ChevronDown, Layers, FolderOpen, Brain, Calendar,
  Award, TrendingUp, Utensils, Bus, KeyRound, ScrollText, LogOut, School
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const mainNav = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: CalendarDays, label: "Calendar", path: "/calendar" },
  { icon: Calendar, label: "Class Schedule", path: "/schedule" },
];

const academicNav = [
  { icon: BookOpen, label: "Assignments", path: "/assignments" },
  { icon: ClipboardCheck, label: "Assessments", path: "/assessments" },
  { icon: BarChart3, label: "Grades", path: "/grades" },
  { icon: Award, label: "Report Card", path: "/report-card" },
  { icon: TrendingUp, label: "GPA Projector", path: "/gpa-projector" },
];

const toolsNav = [
  { icon: Timer, label: "Pomodoro", path: "/pomodoro" },
  { icon: StickyNote, label: "Study Notes", path: "/notes" },
  { icon: Layers, label: "Flashcards", path: "/flashcards" },
  { icon: Brain, label: "Study Planner", path: "/study-planner" },
  { icon: FolderOpen, label: "Resources", path: "/resources" },
  { icon: Target, label: "Goals & Habits", path: "/goals" },
];

const schoolLifeNav = [
  { icon: Utensils, label: "Lunch Menu", path: "/lunch" },
  { icon: Bus, label: "Bus Tracker", path: "/bus" },
  { icon: KeyRound, label: "Locker Vault", path: "/locker" },
  { icon: ScrollText, label: "Hall Pass Log", path: "/hall-pass" },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [academicOpen, setAcademicOpen] = useState(true);
  const [toolsOpen, setToolsOpen] = useState(true);
  const [schoolOpen, setSchoolOpen] = useState(true);
  const location = useLocation();
  const { signOut, user } = useAuth();

  const NavItem = ({ icon: Icon, label, path }: { icon: typeof LayoutDashboard; label: string; path: string }) => {
    const isActive = location.pathname === path;
    return (
      <Link
        to={path}
        onClick={() => setIsOpen(false)}
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
          isActive
            ? "bg-sidebar-accent text-sidebar-primary shadow-soft"
            : "text-sidebar-foreground hover:bg-sidebar-accent/50"
        )}
      >
        <Icon className={cn("h-5 w-5", isActive && "text-sidebar-primary")} />
        {label}
      </Link>
    );
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 h-full w-64 bg-sidebar border-r border-sidebar-border z-50 transform transition-transform duration-300 ease-out lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full p-4 overflow-y-auto">
          {/* Logo */}
          <div className="flex items-center gap-3 px-3 py-4 mb-4">
            <div className="w-10 h-10 rounded-xl gradient-calm flex items-center justify-center shadow-glow">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-sidebar-foreground">FocusFlow</h1>
              <p className="text-xs text-muted-foreground">8th Grade • Edison</p>
            </div>
          </div>

          {/* Main Nav */}
          <nav className="flex-1 space-y-1">
            {mainNav.map((item) => (
              <NavItem key={item.path} {...item} />
            ))}

            {/* Academic Section */}
            <Collapsible open={academicOpen} onOpenChange={setAcademicOpen}>
              <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2 mt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors">
                <span className="flex items-center gap-2">
                  <GraduationCap className="h-3.5 w-3.5" />
                  Academic
                </span>
                <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", academicOpen && "rotate-180")} />
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-1 mt-1">
                {academicNav.map((item) => (
                  <NavItem key={item.path} {...item} />
                ))}
              </CollapsibleContent>
            </Collapsible>

            {/* Tools Section */}
            <Collapsible open={toolsOpen} onOpenChange={setToolsOpen}>
              <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2 mt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors">
                <span className="flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5" />
                  Tools
                </span>
                <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", toolsOpen && "rotate-180")} />
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-1 mt-1">
                {toolsNav.map((item) => (
                  <NavItem key={item.path} {...item} />
                ))}
              </CollapsibleContent>
            </Collapsible>
          </nav>

          {/* Bottom */}
          <div className="pt-4 border-t border-sidebar-border">
            <NavItem icon={Settings} label="Settings" path="/settings" />
            <p className="px-3 pt-3 text-[10px] text-muted-foreground/60 text-center leading-tight">
              Developed by Ramskandh Thirandasu
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
