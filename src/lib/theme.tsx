import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

export type Theme = 'light' | 'dark';
const KEY = 'theme';

function initialTheme(): Theme {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === 'light' || saved === 'dark') return saved;
  } catch {
    /* localStorage недостъпен */
  }
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

const ThemeContext = createContext<{ theme: Theme; toggle: () => void }>({ theme: 'light', toggle: () => {} });

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(initialTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#0b0c0e' : '#f6f6f4');
  }, [theme]);

  const toggle = useCallback(() => {
    setTheme((t) => {
      const next = t === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem(KEY, next);
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
