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
  Award, TrendingUp, Utensils, Bus, KeyRound, ScrollText, LogOut, School, Users, Clock, ShieldAlert
} from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole";
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
  { icon: Clock, label: "Time Manager", path: "/time-manager" },
];

const schoolLifeNav = [
  { icon: Utensils, label: "Lunch Menu", path: "/lunch" },
  { icon: Bus, label: "Bus Tracker", path: "/bus" },
  { icon: KeyRound, label: "Locker Vault", path: "/locker" },
  { icon: ScrollText, label: "Hall Pass Log", path: "/hall-pass" },
  { icon: Users, label: "Clubs & Electives", path: "/clubs" },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [academicOpen, setAcademicOpen] = useState(true);
  const [toolsOpen, setToolsOpen] = useState(true);
  const [schoolOpen, setSchoolOpen] = useState(true);
  const location = useLocation();
  const { signOut, user } = useAuth();
  const { isAdmin } = useUserRole();

  const NavItem = ({ icon: Icon, label, path }: { icon: typeof LayoutDashboard; label: string; path: string }) => {
    const isActive = location.pathname === path;
    return (
      <Link
        to={path}
        onClick={() => setIsOpen(false)}
        className={cn(
          "flex items-center gap-3 px-3 h-10 rounded-lg text-sm transition-all duration-150",
          isActive
            ? "bg-sidebar-accent text-foreground font-semibold"
            : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground font-medium"
        )}
      >
        <Icon className={cn("h-[18px] w-[18px] shrink-0", isActive ? "text-primary" : "opacity-70")} strokeWidth={isActive ? 2.25 : 1.75} />
        <span className="truncate">{label}</span>
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
          "lg:relative lg:translate-x-0 lg:h-screen lg:w-full",
          "fixed left-0 top-0 h-full w-64 bg-sidebar border-r border-sidebar-border z-50 transform transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full p-4 overflow-y-auto">
          <div className="flex items-center gap-3 px-2 py-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-soft">
              <Sparkles className="h-[18px] w-[18px] text-primary-foreground" strokeWidth={2.25} />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="font-bold text-[15px] text-foreground leading-tight tracking-tight">The Planner</h1>
              <p className="text-[11px] text-muted-foreground truncate font-medium">8th Grade · Edison</p>
            </div>
          </div>


          <nav className="flex-1 space-y-1">
            {mainNav.map((item) => <NavItem key={item.path} {...item} />)}

            <Collapsible open={academicOpen} onOpenChange={setAcademicOpen}>
              <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2 mt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors">
                <span className="flex items-center gap-2"><GraduationCap className="h-3.5 w-3.5" />Academic</span>
                <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", academicOpen && "rotate-180")} />
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-1 mt-1">
                {academicNav.map((item) => <NavItem key={item.path} {...item} />)}
              </CollapsibleContent>
            </Collapsible>

            <Collapsible open={toolsOpen} onOpenChange={setToolsOpen}>
              <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2 mt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors">
                <span className="flex items-center gap-2"><Sparkles className="h-3.5 w-3.5" />Tools</span>
                <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", toolsOpen && "rotate-180")} />
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-1 mt-1">
                {toolsNav.map((item) => <NavItem key={item.path} {...item} />)}
              </CollapsibleContent>
            </Collapsible>

            <Collapsible open={schoolOpen} onOpenChange={setSchoolOpen}>
              <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2 mt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors">
                <span className="flex items-center gap-2"><School className="h-3.5 w-3.5" />School Life</span>
                <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", schoolOpen && "rotate-180")} />
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-1 mt-1">
                {schoolLifeNav.map((item) => <NavItem key={item.path} {...item} />)}
              </CollapsibleContent>
            </Collapsible>
          </nav>

          <div className="pt-4 border-t border-sidebar-border space-y-1">
            <NavItem icon={Settings} label="Settings" path="/settings" />
            {isAdmin && <NavItem icon={ShieldAlert} label="Admin" path="/admin" />}
            {user && (
              <button onClick={() => signOut()} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium w-full text-sidebar-foreground hover:bg-sidebar-accent/50 transition-all">
                <LogOut className="h-5 w-5" />Sign out
              </button>
            )}
            <p className="px-3 pt-3 text-[10px] text-muted-foreground/60 text-center leading-tight">
              Developed by Ramskandh Thirandasu
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
