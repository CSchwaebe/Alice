import { useContext } from 'react';
import { ThemeContext } from './ThemeProvider';
import { Theme } from './types';
import { darkTheme, lightTheme } from './themes';

/**
 * Hook to access the current theme and theme-related functions
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return {
    ...context,
    // Provide direct access to theme objects
    themes: {
      dark: darkTheme,
      light: lightTheme
    },
    // Get the current theme object
    currentTheme: context.theme === 'dark' ? darkTheme : lightTheme
  };
} 