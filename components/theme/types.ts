export type ThemeMode = 'light' | 'dark';

export type ThemeColors = {
  // Base colors
  background: string;
  foreground: string;
  
  // Border colors
  border: {
    DEFAULT: string;
    hover: string;
  };
  
  // Content colors (for panels, cards, etc)
  content: {
    1: string;
    2: string;
    3: string;
    4: string;
  };
  
  // Primary colors (with opacity variations)
  primary: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
  
  // Overlay colors
  overlay: {
    light: string;
    medium: string;
    dark: string;
  };
  
  // Status colors (consistent across themes)
  status: {
    success: string;
    warning: string;
    danger: string;
    info: string;
  };
  
  // Accent colors (for highlights, focus states)
  accent: {
    1: string;
    2: string;
    3: string;
    4: string;
  };
  
  // UI Elements
  ui: {
    scrollbar: {
      track: string;
      thumb: string;
      thumbHover: string;
    }
  };
  
  // Effects
  effects: {
    glitch: {
      primary: string;
      secondary: string;
      tertiary: string;
    };
    scanlines: string;
  };
};

export type Theme = {
  colors: ThemeColors;
}; 