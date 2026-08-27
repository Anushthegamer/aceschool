// WindowManager — tracks all open windows on the desktop.
// Each window has a position, size, z-index, and minimize/maximize state.
// Clicking a window brings it to front. Double-clicking title bar maximizes.

import { createContext, useContext, useState, useCallback, ReactNode, useRef } from "react";

export interface WindowState {
  id: string;
  title: string;
  appKey: string;
  x: number;
  y: number;
  width: number;
  height: number;
  minWidth: number;
  minHeight: number;
  zIndex: number;
  minimized: boolean;
  maximized: boolean;
  prevBounds?: { x: number; y: number; width: number; height: number };
}

interface WindowManagerCtx {
  windows: WindowState[];
  activeWindowId: string | null;
  openWindow: (appKey: string, title: string, opts?: { width?: number; height?: number }) => void;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  updatePosition: (id: string, x: number, y: number) => void;
  updateSize: (id: string, width: number, height: number) => void;
}

const Ctx = createContext<WindowManagerCtx>(null!);

let zCounter = 100;

export const WindowManagerProvider = ({ children }: { children: ReactNode }) => {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  // ref so callbacks can read current windows without stale closures
  const winRef = useRef(windows);
  winRef.current = windows;

  const openWindow = useCallback((appKey: string, title: string, opts?: { width?: number; height?: number }) => {
    setWindows(prev => {
      // if already open (visible), just bring to front
      const existing = prev.find(w => w.appKey === appKey && !w.minimized);
      if (existing) {
        zCounter++;
        setActiveWindowId(existing.id);
        return prev.map(w => w.id === existing.id ? { ...w, zIndex: zCounter } : w);
      }
      // if minimized, restore it
      const minimized = prev.find(w => w.appKey === appKey && w.minimized);
      if (minimized) {
        zCounter++;
        setActiveWindowId(minimized.id);
        return prev.map(w => w.id === minimized.id ? { ...w, zIndex: zCounter, minimized: false } : w);
      }
      // otherwise, create a new window — stagger position so they don't stack perfectly
      zCounter++;
      const offset = (prev.length % 6) * 30;
      const win: WindowState = {
        id: `${appKey}-${Date.now()}`,
        title,
        appKey,
        x: 80 + offset,
        y: 40 + offset,
        width: opts?.width ?? 800,
        height: opts?.height ?? 550,
        minWidth: 400,
        minHeight: 300,
        zIndex: zCounter,
        minimized: false,
        maximized: false,
      };
      setActiveWindowId(win.id);
      return [...prev, win];
    });
  }, []);

  const closeWindow = useCallback((id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
    setActiveWindowId(prev => prev === id ? null : prev);
  }, []);

  const focusWindow = useCallback((id: string) => {
    zCounter++;
    setWindows(prev => prev.map(w => w.id === id ? { ...w, zIndex: zCounter } : w));
    setActiveWindowId(id);
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, minimized: true } : w));
    setActiveWindowId(prev => prev === id ? null : prev);
  }, []);

  const maximizeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => {
      if (w.id !== id) return w;
      // restore from maximized
      if (w.maximized && w.prevBounds) {
        return { ...w, maximized: false, ...w.prevBounds, prevBounds: undefined };
      }
      // maximize
      return {
        ...w,
        maximized: true,
        prevBounds: { x: w.x, y: w.y, width: w.width, height: w.height },
        x: 0, y: 0,
        width: window.innerWidth,
        height: window.innerHeight - 52, // leave room for taskbar
      };
    }));
  }, []);

  const updatePosition = useCallback((id: string, x: number, y: number) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, x, y, maximized: false } : w));
  }, []);

  const updateSize = useCallback((id: string, width: number, height: number) => {
    setWindows(prev => prev.map(w => w.id === id
      ? { ...w, width: Math.max(w.minWidth, width), height: Math.max(w.minHeight, height) }
      : w
    ));
  }, []);

  return (
    <Ctx.Provider value={{ windows, activeWindowId, openWindow, closeWindow, focusWindow, minimizeWindow, maximizeWindow, updatePosition, updateSize }}>
      {children}
    </Ctx.Provider>
  );
};

export const useWindowManager = () => useContext(Ctx);
