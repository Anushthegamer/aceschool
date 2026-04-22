import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { CommandPalette } from "@/components/CommandPalette";
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import CalendarPage from "./pages/CalendarPage";
import AssignmentsPage from "./pages/AssignmentsPage";
import AssessmentsPage from "./pages/AssessmentsPage";
import PomodoroPage from "./pages/PomodoroPage";
import NotesPage from "./pages/NotesPage";
import GoalsPage from "./pages/GoalsPage";
import GradesPage from "./pages/GradesPage";
import SettingsPage from "./pages/SettingsPage";
import FlashcardsPage from "./pages/FlashcardsPage";
import SchedulePage from "./pages/SchedulePage";
import ResourcesPage from "./pages/ResourcesPage";
import StudyPlannerPage from "./pages/StudyPlannerPage";
import LunchPage from "./pages/LunchPage";
import BusPage from "./pages/BusPage";
import LockerPage from "./pages/LockerPage";
import HallPassPage from "./pages/HallPassPage";
import ReportCardPage from "./pages/ReportCardPage";
import GpaProjectorPage from "./pages/GpaProjectorPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const Protected = ({ el }: { el: JSX.Element }) => (
  <ProtectedRoute>
    {el}
    <CommandPalette />
  </ProtectedRoute>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/" element={<Protected el={<Index />} />} />
            <Route path="/calendar" element={<Protected el={<CalendarPage />} />} />
            <Route path="/assignments" element={<Protected el={<AssignmentsPage />} />} />
            <Route path="/assessments" element={<Protected el={<AssessmentsPage />} />} />
            <Route path="/pomodoro" element={<Protected el={<PomodoroPage />} />} />
            <Route path="/notes" element={<Protected el={<NotesPage />} />} />
            <Route path="/goals" element={<Protected el={<GoalsPage />} />} />
            <Route path="/grades" element={<Protected el={<GradesPage />} />} />
            <Route path="/report-card" element={<Protected el={<ReportCardPage />} />} />
            <Route path="/gpa-projector" element={<Protected el={<GpaProjectorPage />} />} />
            <Route path="/settings" element={<Protected el={<SettingsPage />} />} />
            <Route path="/flashcards" element={<Protected el={<FlashcardsPage />} />} />
            <Route path="/schedule" element={<Protected el={<SchedulePage />} />} />
            <Route path="/resources" element={<Protected el={<ResourcesPage />} />} />
            <Route path="/study-planner" element={<Protected el={<StudyPlannerPage />} />} />
            <Route path="/lunch" element={<Protected el={<LunchPage />} />} />
            <Route path="/bus" element={<Protected el={<BusPage />} />} />
            <Route path="/locker" element={<Protected el={<LockerPage />} />} />
            <Route path="/hall-pass" element={<Protected el={<HallPassPage />} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
