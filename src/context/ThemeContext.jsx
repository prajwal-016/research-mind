import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext(null);

/**
 * ThemeProvider — manages light / dark mode for the application.
 * Persists preference to localStorage and respects OS preference on first load.
 *
 * @param {{ children: React.ReactNode, defaultTheme?: 'light' | 'dark' | 'system' }} props
 */
export function ThemeProvider({ children, defaultTheme = 'system' }) {
  const [theme, setThemeState] = useState(() => {
    const stored = localStorage.getItem('researchmind-theme');
    if (stored === 'light' || stored === 'dark') return stored;
    return defaultTheme;
  });

  // Resolve "system" to actual dark/light
  const resolvedTheme =
    theme === 'system'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : theme;

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(resolvedTheme);
  }, [resolvedTheme]);

  const setTheme = (newTheme) => {
    localStorage.setItem('researchmind-theme', newTheme);
    setThemeState(newTheme);
  };

  const toggleTheme = () =>
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');

  const value = { theme, resolvedTheme, setTheme, toggleTheme };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

/**
 * useTheme — consume the ThemeContext.
 * Must be used within a <ThemeProvider>.
 */
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
}

export { ThemeContext };
