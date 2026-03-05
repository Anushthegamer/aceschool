import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="lg:pl-64 min-h-screen flex flex-col">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto flex-1 w-full">
          {children}
        </div>
        <footer className="lg:pl-0 py-3 text-center text-[10px] text-muted-foreground/50">
          Developed by Ramskandh Thirandasu
        </footer>
      </main>
    </div>
  );
}
