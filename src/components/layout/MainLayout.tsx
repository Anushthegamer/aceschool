import { ReactNode, useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface MainLayoutProps { children: ReactNode; }

export function MainLayout({ children }: MainLayoutProps) {
  const isMobile = useIsMobile();
  const [hint, setHint] = useState(true);
  useEffect(() => { const t = setTimeout(() => setHint(false), 4000); return () => clearTimeout(t); }, []);

  if (isMobile) {
    return (
      <div className="min-h-screen bg-background">
        <Sidebar />
        <main className="min-h-screen flex flex-col">
          <div className="p-4 max-w-7xl mx-auto flex-1 w-full">{children}</div>
          <footer className="py-3 text-center text-[10px] text-muted-foreground/50">Developed by Ramskandh Thirandasu</footer>
        </main>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background overflow-hidden">
      <ResizablePanelGroup direction="horizontal" autoSaveId="ff-main-layout">
        <ResizablePanel defaultSize={18} minSize={12} maxSize={30} className="!overflow-visible">
          <Sidebar />
        </ResizablePanel>
        <ResizableHandle withHandle className="bg-sidebar-border hover:bg-primary/30 transition-colors" />
        <ResizablePanel defaultSize={82} className="!overflow-auto">
          <main className="min-h-screen flex flex-col">
            <header className="sticky top-0 z-30 backdrop-blur-md bg-background/70 border-b border-border/50 px-4 lg:px-6 py-2 flex items-center justify-between">
              <div className="text-xs text-muted-foreground">Drag the divider to resize • Press <kbd className="px-1.5 py-0.5 rounded border bg-muted text-[10px]">⌘K</kbd> to search</div>
              <Button variant="ghost" size="sm" className="h-7 text-xs gap-2" onClick={() => document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }))}>
                <Search className="h-3 w-3" /> Quick search
              </Button>
            </header>
            <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto flex-1 w-full">{children}</div>
            <footer className="py-3 text-center text-[10px] text-muted-foreground/50">Developed by Ramskandh Thirandasu</footer>
          </main>
        </ResizablePanel>
      </ResizablePanelGroup>
      {hint && (
        <div className="fixed bottom-4 right-4 bg-foreground text-background text-xs px-3 py-2 rounded-lg shadow-medium animate-fade-in pointer-events-none">
          ⌘K to jump anywhere
        </div>
      )}
    </div>
  );
}
