import { useCallback, useEffect, useState } from "react";

type Theme = "light" | "dark";
const KEY = "hissaclub.theme";

function apply(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const stored = window.localStorage.getItem(KEY) as Theme | null;
    const system = window.matchMedia("(prefers-color-scheme: dark)");
    const initial: Theme = stored ?? (system.matches ? "dark" : "light");
    setTheme(initial);
    apply(initial);

    const onChange = (e: MediaQueryListEvent) => {
      if (window.localStorage.getItem(KEY)) return;
      const next: Theme = e.matches ? "dark" : "light";
      setTheme(next);
      apply(next);
    };
    system.addEventListener("change", onChange);
    return () => system.removeEventListener("change", onChange);
  }, []);

  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next: Theme = prev === "dark" ? "light" : "dark";
      window.localStorage.setItem(KEY, next);
      apply(next);
      return next;
    });
  }, []);

  return { theme, toggle };
}
