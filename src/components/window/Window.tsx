import { useRef, useCallback, useEffect, useState } from "react";
import { Minus, Square, X, Copy } from "lucide-react";
import { useWindowManager, WindowState } from "@/contexts/WindowManagerContext";
import { cn } from "@/lib/utils";

interface WindowProps {
  window: WindowState;
  children: React.ReactNode;
}

export function Window({ window: win, children }: WindowProps) {
  const { closeWindow, focusWindow, minimizeWindow, maximizeWindow, updatePosition, updateSize, activeWindowId } = useWindowManager();
  const dragRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const resizeStart = useRef({ x: 0, y: 0, w: 0, h: 0 });

  const isActive = activeWindowId === win.id;

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);

  const handleDragStart = useCallback(
    (e: React.MouseEvent) => {
      if (win.maximized) return;
      e.preventDefault();
      focusWindow(win.id);
      dragOffset.current = { x: e.clientX - win.x, y: e.clientY - win.y };
      setIsDragging(true);
    },
    [win.id, win.x, win.y, win.maximized, focusWindow]
  );

  useEffect(() => {
    if (!isDragging) return;
    const handleMove = (e: MouseEvent) => {
      updatePosition(win.id, e.clientX - dragOffset.current.x, e.clientY - dragOffset.current.y);
    };
    const handleUp = () => setIsDragging(false);
    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseup", handleUp);
    return () => {
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseup", handleUp);
    };
  }, [isDragging, win.id, updatePosition]);

  const handleResizeStart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      focusWindow(win.id);
      resizeStart.current = { x: e.clientX, y: e.clientY, w: win.width, h: win.height };
      setIsResizing(true);
    },
    [win.id, win.width, win.height, focusWindow]
  );

  useEffect(() => {
    if (!isResizing) return;
    const handleMove = (e: MouseEvent) => {
      const dx = e.clientX - resizeStart.current.x;
      const dy = e.clientY - resizeStart.current.y;
      updateSize(win.id, resizeStart.current.w + dx, resizeStart.current.h + dy);
    };
    const handleUp = () => setIsResizing(false);
    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseup", handleUp);
    return () => {
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseup", handleUp);
    };
  }, [isResizing, win.id, updateSize]);

  if (win.minimized) return null;

  return (
    <div
      className={cn(
        "absolute flex flex-col rounded-xl overflow-hidden shadow-2xl border transition-all duration-200",
        isActive
          ? "border-white/15 shadow-glow"
          : "border-white/5 shadow-medium",
        win.maximized && "!rounded-none !duration-0",
        mounted ? "opacity-100 scale-100" : "opacity-0 scale-95"
      )}
      style={{
        left: win.x,
        top: win.y,
        width: win.width,
        height: win.height,
        zIndex: win.zIndex,
        transition: mounted ? "opacity 0.2s, transform 0.2s" : "none",
      }}
      onMouseDown={() => focusWindow(win.id)}
    >
      {/* Title bar */}
      <div
        ref={dragRef}
        className={cn(
          "flex items-center h-10 px-3 backdrop-blur-xl border-b border-white/5 shrink-0 select-none",
          !win.maximized && "cursor-grab active:cursor-grabbing",
          isActive ? "bg-white/8" : "bg-white/4"
        )}
        onMouseDown={handleDragStart}
        onDoubleClick={() => maximizeWindow(win.id)}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-xs font-semibold text-white/80 truncate">{win.title}</span>
        </div>
        <div className="flex items-center gap-0.5">
          <button
            onClick={(e) => { e.stopPropagation(); minimizeWindow(win.id); }}
            className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-white/10 transition-colors"
          >
            <Minus className="h-3 w-3 text-white/50" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); maximizeWindow(win.id); }}
            className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-white/10 transition-colors"
          >
            {win.maximized ? <Copy className="h-3 w-3 text-white/50" /> : <Square className="h-2.5 w-2.5 text-white/50" />}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); closeWindow(win.id); }}
            className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-red-500/30 transition-colors group"
          >
            <X className="h-3 w-3 text-white/50 group-hover:text-red-400" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto bg-card/95 backdrop-blur-xl">
        {children}
      </div>

      {/* Resize handle */}
      {!win.maximized && (
        <div
          className="absolute bottom-0 right-0 w-5 h-5 cursor-se-resize group"
          onMouseDown={handleResizeStart}
        >
          <div className="absolute bottom-1.5 right-1.5 w-2.5 h-2.5 border-r-2 border-b-2 border-white/10 group-hover:border-white/25 rounded-br transition-colors" />
        </div>
      )}
    </div>
  );
}
