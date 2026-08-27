import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Theme = "light" | "dark" | "system";

interface ThemeCtx {
  theme: Theme;
  setTheme: (t: Theme) => void;
  resolvedTheme: "light" | "dark";
}

const Ctx = createContext<ThemeCtx>({ theme: "dark", setTheme: () => {}, resolvedTheme: "dark" });

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    try { return (localStorage.getItem("edison-theme") as Theme) || "dark"; } catch { return "dark"; }
  });
  const [resolvedTheme, setResolved] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const resolve = () => {
      const resolved = theme === "system" ? (mq.matches ? "dark" : "light") : theme;
      setResolved(resolved);
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(resolved);
    };
    resolve();
    mq.addEventListener("change", resolve);
    return () => mq.removeEventListener("change", resolve);
  }, [theme]);

  const setTheme = (t: Theme) => {
    setThemeState(t);
    try { localStorage.setItem("edison-theme", t); } catch {}
  };

  return <Ctx.Provider value={{ theme, setTheme, resolvedTheme }}>{children}</Ctx.Provider>;
}

export const useTheme = () => useContext(Ctx);
