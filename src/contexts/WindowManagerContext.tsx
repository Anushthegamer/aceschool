import { createContext, useContext, useState, useCallback, ReactNode, useRef } from "react";

export interface WindowState {
  id: string;
  title: string;
  icon: string;
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
  openWindow: (appKey: string, title: string, icon: string, opts?: Partial<Pick<WindowState, "width" | "height" | "minWidth" | "minHeight">>) => void;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  updatePosition: (id: string, x: number, y: number) => void;
  updateSize: (id: string, width: number, height: number) => void;
  isWindowOpen: (appKey: string) => boolean;
}

const Ctx = createContext<WindowManagerCtx>({
  windows: [],
  activeWindowId: null,
  openWindow: () => {},
  closeWindow: () => {},
  focusWindow: () => {},
  minimizeWindow: () => {},
  maximizeWindow: () => {},
  updatePosition: () => {},
  updateSize: () => {},
  isWindowOpen: () => false,
});

let zCounter = 100;

export const WindowManagerProvider = ({ children }: { children: ReactNode }) => {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const windowsRef = useRef(windows);
  windowsRef.current = windows;

  const openWindow = useCallback((
    appKey: string,
    title: string,
    icon: string,
    opts?: Partial<Pick<WindowState, "width" | "height" | "minWidth" | "minHeight">>
  ) => {
    setWindows((prev) => {
      const existing = prev.find((w) => w.appKey === appKey && !w.minimized);
      if (existing) {
        zCounter++;
        setActiveWindowId(existing.id);
        return prev.map((w) =>
          w.id === existing.id ? { ...w, zIndex: zCounter, minimized: false } : w
        );
      }
      const minimized = prev.find((w) => w.appKey === appKey && w.minimized);
      if (minimized) {
        zCounter++;
        setActiveWindowId(minimized.id);
        return prev.map((w) =>
          w.id === minimized.id ? { ...w, zIndex: zCounter, minimized: false } : w
        );
      }
      zCounter++;
      const w = opts?.width ?? 800;
      const h = opts?.height ?? 550;
      const offsetX = (prev.length % 6) * 30;
      const offsetY = (prev.length % 6) * 30;
      const newWin: WindowState = {
        id: `${appKey}-${Date.now()}`,
        title,
        icon,
        appKey,
        x: 80 + offsetX,
        y: 40 + offsetY,
        width: w,
        height: h,
        minWidth: opts?.minWidth ?? 400,
        minHeight: opts?.minHeight ?? 300,
        zIndex: zCounter,
        minimized: false,
        maximized: false,
      };
      setActiveWindowId(newWin.id);
      return [...prev, newWin];
    });
  }, []);

  const closeWindow = useCallback((id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
    setActiveWindowId((prev) => (prev === id ? null : prev));
  }, []);

  const focusWindow = useCallback((id: string) => {
    zCounter++;
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, zIndex: zCounter } : w))
    );
    setActiveWindowId(id);
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, minimized: true } : w))
    );
    setActiveWindowId((prev) => (prev === id ? null : prev));
  }, []);

  const maximizeWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) => {
        if (w.id !== id) return w;
        if (w.maximized && w.prevBounds) {
          return {
            ...w,
            maximized: false,
            x: w.prevBounds.x,
            y: w.prevBounds.y,
            width: w.prevBounds.width,
            height: w.prevBounds.height,
            prevBounds: undefined,
          };
        }
        return {
          ...w,
          maximized: true,
          prevBounds: { x: w.x, y: w.y, width: w.width, height: w.height },
          x: 0,
          y: 0,
          width: window.innerWidth,
          height: window.innerHeight - 48,
        };
      })
    );
  }, []);

  const updatePosition = useCallback((id: string, x: number, y: number) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, x, y, maximized: false } : w))
    );
  }, []);

  const updateSize = useCallback((id: string, width: number, height: number) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, width: Math.max(w.minWidth, width), height: Math.max(w.minHeight, height) } : w))
    );
  }, []);

  const isWindowOpen = useCallback(
    (appKey: string) => windowsRef.current.some((w) => w.appKey === appKey),
    []
  );

  return (
    <Ctx.Provider
      value={{
        windows,
        activeWindowId,
        openWindow,
        closeWindow,
        focusWindow,
        minimizeWindow,
        maximizeWindow,
        updatePosition,
        updateSize,
        isWindowOpen,
      }}
    >
      {children}
    </Ctx.Provider>
  );
};

export const useWindowManager = () => useContext(Ctx);
