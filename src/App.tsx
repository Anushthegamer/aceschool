import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { WindowManagerProvider } from "@/contexts/WindowManagerContext";
import { Desktop } from "@/components/desktop/Desktop";

export default function App() {
  return (
    <ThemeProvider>
      <WindowManagerProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Desktop />
        </TooltipProvider>
      </WindowManagerProvider>
    </ThemeProvider>
  );
}
