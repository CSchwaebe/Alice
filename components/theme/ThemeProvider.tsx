"use client";

import { createContext, useEffect, useState } from 'react';
import { Theme, ThemeMode } from './types';
import { getTheme, applyTheme, getPreferredColorScheme } from './utils';

// Define the context interface
interface ThemeContextValue {
  theme: ThemeMode;
  toggleTheme: () => void;
}

// Create the theme context
export const ThemeContext = createContext<ThemeContextValue>({
  theme: 'light',
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeMode>('light');

  // Toggle between light and dark theme
  const toggleTheme = () => {
    setTheme((prev) => {
      const newTheme = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', newTheme);
      return newTheme;
    });
  };

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    // Only run this in the browser
    if (typeof window === 'undefined') return;
    
    const stored = localStorage.getItem('theme') as ThemeMode;
    if (stored && (stored === 'dark' || stored === 'light')) {
      setTheme(stored);
    } else {
      // Make light the default, don't use system preference
      setTheme('light');
    }
  }, []);

  // Apply theme whenever it changes
  useEffect(() => {
    const selectedTheme = getTheme(theme);
    applyTheme(selectedTheme);
    
    // Add or remove the 'dark' class on the html element
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
} 