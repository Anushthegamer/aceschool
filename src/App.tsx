import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import CalendarPage from "./pages/CalendarPage";
import AssignmentsPage from "./pages/AssignmentsPage";
import AssessmentsPage from "./pages/AssessmentsPage";
import PomodoroPage from "./pages/PomodoroPage";
import NotesPage from "./pages/NotesPage";
import GoalsPage from "./pages/GoalsPage";
import GradesPage from "./pages/GradesPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/assignments" element={<AssignmentsPage />} />
          <Route path="/assessments" element={<AssessmentsPage />} />
          <Route path="/pomodoro" element={<PomodoroPage />} />
          <Route path="/notes" element={<NotesPage />} />
          <Route path="/goals" element={<GoalsPage />} />
          <Route path="/grades" element={<GradesPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
