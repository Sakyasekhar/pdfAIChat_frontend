// Theme Configuration - Define different themes for the application
// This allows for easy theme switching and customization

export interface ThemeColors {
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
  gray: {
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
  success: {
    50: string;
    500: string;
    600: string;
  };
  warning: {
    50: string;
    500: string;
    600: string;
  };
  error: {
    50: string;
    500: string;
    600: string;
  };
}

export interface Theme {
  name: string;
  colors: ThemeColors;
  backgrounds: {
    primary: string;
    secondary: string;
    tertiary: string;
  };
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
  };
  borders: {
    primary: string;
    secondary: string;
  };
}

// Default Blue Theme
export const blueTheme: Theme = {
  name: 'blue',
  colors: {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
    },
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
    success: {
      50: '#f0fdf4',
      500: '#22c55e',
      600: '#16a34a',
    },
    warning: {
      50: '#fffbeb',
      500: '#f59e0b',
      600: '#d97706',
    },
    error: {
      50: '#fef2f2',
      500: '#ef4444',
      600: '#dc2626',
    },
  },
  backgrounds: {
    primary: '#ffffff',
    secondary: '#f8fafc',
    tertiary: '#f1f5f9',
  },
  text: {
    primary: '#0f172a',
    secondary: '#334155',
    tertiary: '#64748b',
  },
  borders: {
    primary: '#e2e8f0',
    secondary: '#cbd5e1',
  },
};

// Green Theme
export const greenTheme: Theme = {
  name: 'green',
  colors: {
    primary: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
    },
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
    success: {
      50: '#f0fdf4',
      500: '#22c55e',
      600: '#16a34a',
    },
    warning: {
      50: '#fffbeb',
      500: '#f59e0b',
      600: '#d97706',
    },
    error: {
      50: '#fef2f2',
      500: '#ef4444',
      600: '#dc2626',
    },
  },
  backgrounds: {
    primary: '#ffffff',
    secondary: '#f8fafc',
    tertiary: '#f1f5f9',
  },
  text: {
    primary: '#0f172a',
    secondary: '#334155',
    tertiary: '#64748b',
  },
  borders: {
    primary: '#e2e8f0',
    secondary: '#cbd5e1',
  },
};

// Purple Theme
export const purpleTheme: Theme = {
  name: 'purple',
  colors: {
    primary: {
      50: '#faf5ff',
      100: '#f3e8ff',
      200: '#e9d5ff',
      300: '#d8b4fe',
      400: '#c084fc',
      500: '#a855f7',
      600: '#9333ea',
      700: '#7c3aed',
      800: '#6b21a8',
      900: '#581c87',
    },
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
    success: {
      50: '#f0fdf4',
      500: '#22c55e',
      600: '#16a34a',
    },
    warning: {
      50: '#fffbeb',
      500: '#f59e0b',
      600: '#d97706',
    },
    error: {
      50: '#fef2f2',
      500: '#ef4444',
      600: '#dc2626',
    },
  },
  backgrounds: {
    primary: '#ffffff',
    secondary: '#f8fafc',
    tertiary: '#f1f5f9',
  },
  text: {
    primary: '#0f172a',
    secondary: '#334155',
    tertiary: '#64748b',
  },
  borders: {
    primary: '#e2e8f0',
    secondary: '#cbd5e1',
  },
};

// Dark Theme
export const darkTheme: Theme = {
  name: 'dark',
  colors: {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
    },
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
    success: {
      50: '#f0fdf4',
      500: '#22c55e',
      600: '#16a34a',
    },
    warning: {
      50: '#fffbeb',
      500: '#f59e0b',
      600: '#d97706',
    },
    error: {
      50: '#fef2f2',
      500: '#ef4444',
      600: '#dc2626',
    },
  },
  backgrounds: {
    primary: '#0f172a',
    secondary: '#1e293b',
    tertiary: '#334155',
  },
  text: {
    primary: '#f8fafc',
    secondary: '#cbd5e1',
    tertiary: '#94a3b8',
  },
  borders: {
    primary: '#334155',
    secondary: '#475569',
  },
};

// Theme registry
export const themes = {
  blue: blueTheme,
  green: greenTheme,
  purple: purpleTheme,
  dark: darkTheme,
} as const;

export type ThemeName = keyof typeof themes;

// Theme utility functions
export const getTheme = (themeName: ThemeName): Theme => {
  return themes[themeName];
};

export const applyTheme = (theme: Theme): void => {
  const root = document.documentElement;
  
  // Apply color variables
  Object.entries(theme.colors.primary).forEach(([key, value]) => {
    root.style.setProperty(`--color-primary-${key}`, value);
  });
  
  Object.entries(theme.colors.gray).forEach(([key, value]) => {
    root.style.setProperty(`--color-gray-${key}`, value);
  });
  
  // Apply background variables
  root.style.setProperty('--color-bg-primary', theme.backgrounds.primary);
  root.style.setProperty('--color-bg-secondary', theme.backgrounds.secondary);
  root.style.setProperty('--color-bg-tertiary', theme.backgrounds.tertiary);
  
  // Apply text variables
  root.style.setProperty('--color-text-primary', theme.text.primary);
  root.style.setProperty('--color-text-secondary', theme.text.secondary);
  root.style.setProperty('--color-text-tertiary', theme.text.tertiary);
  
  // Apply border variables
  root.style.setProperty('--color-border-primary', theme.borders.primary);
  root.style.setProperty('--color-border-secondary', theme.borders.secondary);
  
  // Apply success, warning, error colors
  Object.entries(theme.colors.success).forEach(([key, value]) => {
    root.style.setProperty(`--color-success-${key}`, value);
  });
  
  Object.entries(theme.colors.warning).forEach(([key, value]) => {
    root.style.setProperty(`--color-warning-${key}`, value);
  });
  
  Object.entries(theme.colors.error).forEach(([key, value]) => {
    root.style.setProperty(`--color-error-${key}`, value);
  });
};

// Theme switcher hook (for use in React components)
export const useTheme = () => {
  const switchTheme = (themeName: ThemeName) => {
    const theme = getTheme(themeName);
    applyTheme(theme);
    
    // Save theme preference to localStorage
    localStorage.setItem('app-theme', themeName);
    
    // Toggle dark class for Tailwind dark mode
    if (themeName === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };
  
  const getCurrentTheme = (): ThemeName => {
    const saved = localStorage.getItem('app-theme') as ThemeName;
    return saved && themes[saved] ? saved : 'blue';
  };
  
  const initializeTheme = () => {
    const currentTheme = getCurrentTheme();
    switchTheme(currentTheme);
  };
  
  return {
    switchTheme,
    getCurrentTheme,
    initializeTheme,
    themes: Object.keys(themes) as ThemeName[],
  };
};
