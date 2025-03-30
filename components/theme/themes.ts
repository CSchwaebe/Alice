import { Theme } from './types';

// Dark theme configuration (current default look)
export const darkTheme: Theme = {
  colors: {
    background: 'rgb(0, 0, 0)',
    foreground: 'rgb(255, 255, 255)',
    
    border: {
      DEFAULT: 'rgba(255, 255, 255, 0.2)',
      hover: 'rgba(255, 255, 255, 0.4)',
    },
    
    content: {
      1: 'rgba(255, 255, 255, 0.05)',
      2: 'rgba(255, 255, 255, 0.1)',
      3: 'rgba(255, 255, 255, 0.15)',
      4: 'rgba(255, 255, 255, 0.4)',
    },
    
    primary: {
      50: 'rgba(255, 255, 255, 0.05)',
      100: 'rgba(255, 255, 255, 0.1)',
      200: 'rgba(255, 255, 255, 0.2)',
      300: 'rgba(255, 255, 255, 0.3)',
      400: 'rgba(255, 255, 255, 0.4)',
      500: 'rgba(255, 255, 255, 0.5)',
      600: 'rgba(255, 255, 255, 0.6)',
      700: 'rgba(255, 255, 255, 0.7)',
      800: 'rgba(255, 255, 255, 0.8)',
      900: 'rgba(255, 255, 255, 0.9)',
    },
    
    overlay: {
      light: 'rgba(255, 255, 255, 0.05)',
      medium: 'rgba(0, 0, 0, 0.3)',
      dark: 'rgba(0, 0, 0, 0.5)',
    },
    
    status: {
      success: '#10B981', // Green
      warning: '#F59E0B', // Amber
      danger: '#EF4444',  // Red
      info: '#3B82F6',    // Blue
    },
    
    accent: {
      1: 'rgba(255, 255, 255, 0.3)',
      2: 'rgba(255, 255, 255, 0.5)',
      3: 'rgba(255, 255, 255, 0.7)',
      4: 'rgba(255, 255, 255, 0.9)',
    },
    
    ui: {
      scrollbar: {
        track: '#1F1F23',
        thumb: 'rgba(255, 255, 255, 0.3)',
        thumbHover: 'rgba(255, 255, 255, 0.5)',
      }
    },
    
    effects: {
      glitch: {
        primary: 'rgba(255, 0, 0, 0.75)',
        secondary: 'rgba(0, 255, 0, 0.75)',
        tertiary: 'rgba(0, 0, 255, 0.75)',
      },
      scanlines: 'rgba(255, 255, 255, 0.05)',
    }
  }
};

// Light theme configuration (inverse of dark theme)
export const lightTheme: Theme = {
  colors: {
    background: 'rgb(255, 255, 255)',
    foreground: 'rgb(0, 0, 0)',
    
    border: {
      DEFAULT: 'rgba(0, 0, 0, 0.2)',
      hover: 'rgba(0, 0, 0, 0.4)',
    },
    
    content: {
      1: 'rgba(0, 0, 0, 0.05)',
      2: 'rgba(0, 0, 0, 0.1)',
      3: 'rgba(0, 0, 0, 0.15)',
      4: 'rgba(0, 0, 0, 0.4)',
    },
    
    primary: {
      50: 'rgba(0, 0, 0, 0.05)',
      100: 'rgba(0, 0, 0, 0.1)',
      200: 'rgba(0, 0, 0, 0.2)',
      300: 'rgba(0, 0, 0, 0.3)',
      400: 'rgba(0, 0, 0, 0.4)',
      500: 'rgba(0, 0, 0, 0.5)',
      600: 'rgba(0, 0, 0, 0.6)',
      700: 'rgba(0, 0, 0, 0.7)',
      800: 'rgba(0, 0, 0, 0.8)',
      900: 'rgba(0, 0, 0, 0.9)',
    },
    
    overlay: {
      light: 'rgba(0, 0, 0, 0.05)',
      medium: 'rgba(255, 255, 255, 0.3)',
      dark: 'rgba(255, 255, 255, 0.5)',
    },
    
    // Status colors remain consistent between themes
    status: {
      success: '#10B981', // Green
      warning: '#F59E0B', // Amber
      danger: '#EF4444',  // Red
      info: '#3B82F6',    // Blue
    },
    
    accent: {
      1: 'rgba(0, 0, 0, 0.3)',
      2: 'rgba(0, 0, 0, 0.5)',
      3: 'rgba(0, 0, 0, 0.7)',
      4: 'rgba(0, 0, 0, 0.9)',
    },
    
    ui: {
      scrollbar: {
        track: '#EAEAEA',
        thumb: 'rgba(0, 0, 0, 0.3)',
        thumbHover: 'rgba(0, 0, 0, 0.5)',
      }
    },
    
    effects: {
      glitch: {
        primary: 'rgba(255, 0, 0, 0.75)',
        secondary: 'rgba(0, 255, 0, 0.75)',
        tertiary: 'rgba(0, 0, 255, 0.75)',
      },
      scanlines: 'rgba(0, 0, 0, 0.05)',
    }
  }
}; 