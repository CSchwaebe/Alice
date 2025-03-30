import { Theme, ThemeMode } from './types';
import { darkTheme, lightTheme } from './themes';

/**
 * Gets the theme object based on the mode
 */
export function getTheme(mode: ThemeMode): Theme {
  return mode === 'dark' ? darkTheme : lightTheme;
}

/**
 * Applies the theme to CSS variables
 */
export function applyTheme(theme: Theme): void {
  if (typeof document === 'undefined') return;
  
  const root = document.documentElement;
  
  // Base colors
  root.style.setProperty('--background', theme.colors.background);
  root.style.setProperty('--foreground', theme.colors.foreground);
  
  // Border colors
  root.style.setProperty('--border', theme.colors.border.DEFAULT);
  root.style.setProperty('--border-hover', theme.colors.border.hover);
  
  // Content colors
  root.style.setProperty('--content-1', theme.colors.content[1]);
  root.style.setProperty('--content-2', theme.colors.content[2]);
  root.style.setProperty('--content-3', theme.colors.content[3]);
  root.style.setProperty('--content-4', theme.colors.content[4]);
  
  // Primary colors
  root.style.setProperty('--primary-50', theme.colors.primary[50]);
  root.style.setProperty('--primary-100', theme.colors.primary[100]);
  root.style.setProperty('--primary-200', theme.colors.primary[200]);
  root.style.setProperty('--primary-300', theme.colors.primary[300]);
  root.style.setProperty('--primary-400', theme.colors.primary[400]);
  root.style.setProperty('--primary-500', theme.colors.primary[500]);
  root.style.setProperty('--primary-600', theme.colors.primary[600]);
  root.style.setProperty('--primary-700', theme.colors.primary[700]);
  root.style.setProperty('--primary-800', theme.colors.primary[800]);
  root.style.setProperty('--primary-900', theme.colors.primary[900]);
  
  // Overlay colors
  root.style.setProperty('--overlay-light', theme.colors.overlay.light);
  root.style.setProperty('--overlay-medium', theme.colors.overlay.medium);
  root.style.setProperty('--overlay-dark', theme.colors.overlay.dark);
  
  // Status colors
  root.style.setProperty('--status-success', theme.colors.status.success);
  root.style.setProperty('--status-warning', theme.colors.status.warning);
  root.style.setProperty('--status-danger', theme.colors.status.danger);
  root.style.setProperty('--status-info', theme.colors.status.info);
  
  // Accent colors
  root.style.setProperty('--accent-1', theme.colors.accent[1]);
  root.style.setProperty('--accent-2', theme.colors.accent[2]);
  root.style.setProperty('--accent-3', theme.colors.accent[3]);
  root.style.setProperty('--accent-4', theme.colors.accent[4]);
  
  // UI Elements
  root.style.setProperty('--scrollbar-track', theme.colors.ui.scrollbar.track);
  root.style.setProperty('--scrollbar-thumb', theme.colors.ui.scrollbar.thumb);
  root.style.setProperty('--scrollbar-thumb-hover', theme.colors.ui.scrollbar.thumbHover);
  
  // Effects
  root.style.setProperty('--glitch-primary', theme.colors.effects.glitch.primary);
  root.style.setProperty('--glitch-secondary', theme.colors.effects.glitch.secondary);
  root.style.setProperty('--glitch-tertiary', theme.colors.effects.glitch.tertiary);
  root.style.setProperty('--scanlines', theme.colors.effects.scanlines);
}

/**
 * Detects the preferred color scheme from system settings
 */
export function getPreferredColorScheme(): ThemeMode {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
} 