// Window — draggable, resizable window frame.
// Handles drag via mousedown on title bar, resize via bottom-right corner.

import { useRef, useCallback, useEffect, useState } from "react";
import { Minus, Square, X, Copy } from "lucide-react";
import { useWindowManager, WindowState } from "@/contexts/WindowManagerContext";
import { cn } from "@/lib/utils";

export function Window({ window: win, children }: { window: WindowState; children: React.ReactNode }) {
  const { closeWindow, focusWindow, minimizeWindow, maximizeWindow, updatePosition, updateSize, activeWindowId } = useWindowManager();
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const resizeStart = useRef({ x: 0, y: 0, w: 0, h: 0 });

  const isActive = activeWindowId === win.id;

  // fade in on mount
  useEffect(() => { requestAnimationFrame(() => setMounted(true)); }, []);

  // --- drag ---
  const onDragStart = useCallback((e: React.MouseEvent) => {
    if (win.maximized) return;
    e.preventDefault();
    focusWindow(win.id);
    dragOffset.current = { x: e.clientX - win.x, y: e.clientY - win.y };
    setIsDragging(true);
  }, [win.id, win.x, win.y, win.maximized, focusWindow]);

  useEffect(() => {
    if (!isDragging) return;
    const move = (e: MouseEvent) => updatePosition(win.id, e.clientX - dragOffset.current.x, e.clientY - dragOffset.current.y);
    const up = () => setIsDragging(false);
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
    return () => { document.removeEventListener("mousemove", move); document.removeEventListener("mouseup", up); };
  }, [isDragging, win.id, updatePosition]);

  // --- resize ---
  const onResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    focusWindow(win.id);
    resizeStart.current = { x: e.clientX, y: e.clientY, w: win.width, h: win.height };
    setIsResizing(true);
  }, [win.id, win.width, win.height, focusWindow]);

  useEffect(() => {
    if (!isResizing) return;
    const move = (e: MouseEvent) => {
      updateSize(win.id, resizeStart.current.w + (e.clientX - resizeStart.current.x), resizeStart.current.h + (e.clientY - resizeStart.current.y));
    };
    const up = () => setIsResizing(false);
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
    return () => { document.removeEventListener("mousemove", move); document.removeEventListener("mouseup", up); };
  }, [isResizing, win.id, updateSize]);

  if (win.minimized) return null;

  return (
    <div
      className={cn(
        "absolute flex flex-col rounded-xl overflow-hidden shadow-2xl border transition-all duration-200",
        isActive ? "border-white/15 shadow-glow" : "border-white/5 shadow-medium",
        win.maximized && "!rounded-none !duration-0",
        mounted ? "opacity-100 scale-100" : "opacity-0 scale-95"
      )}
      style={{ left: win.x, top: win.y, width: win.width, height: win.height, zIndex: win.zIndex }}
      onMouseDown={() => focusWindow(win.id)}
    >
      {/* title bar — drag handle */}
      <div
        className={cn(
          "flex items-center h-10 px-3 backdrop-blur-xl border-b border-white/5 shrink-0 select-none",
          !win.maximized && "cursor-grab active:cursor-grabbing",
          isActive ? "bg-white/8" : "bg-white/4"
        )}
        onMouseDown={onDragStart}
        onDoubleClick={() => maximizeWindow(win.id)}
      >
        <span className="flex-1 text-xs font-semibold text-white/80 truncate">{win.title}</span>
        <div className="flex items-center gap-0.5">
          <button onClick={e => { e.stopPropagation(); minimizeWindow(win.id); }} className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-white/10">
            <Minus className="h-3 w-3 text-white/50" />
          </button>
          <button onClick={e => { e.stopPropagation(); maximizeWindow(win.id); }} className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-white/10">
            {win.maximized ? <Copy className="h-3 w-3 text-white/50" /> : <Square className="h-2.5 w-2.5 text-white/50" />}
          </button>
          <button onClick={e => { e.stopPropagation(); closeWindow(win.id); }} className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-red-500/30 group">
            <X className="h-3 w-3 text-white/50 group-hover:text-red-400" />
          </button>
        </div>
      </div>

      {/* app content */}
      <div className="flex-1 overflow-auto bg-card/95 backdrop-blur-xl">{children}</div>

      {/* resize handle — bottom right corner */}
      {!win.maximized && (
        <div className="absolute bottom-0 right-0 w-5 h-5 cursor-se-resize group" onMouseDown={onResizeStart}>
          <div className="absolute bottom-1.5 right-1.5 w-2.5 h-2.5 border-r-2 border-b-2 border-white/10 group-hover:border-white/25 rounded-br" />
        </div>
      )}
    </div>
  );
}
