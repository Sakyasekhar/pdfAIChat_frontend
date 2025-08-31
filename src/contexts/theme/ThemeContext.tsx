"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { ThemeName, useTheme } from '../../styles/themes';

interface ThemeContextType {
  currentTheme: ThemeName;
  switchTheme: (theme: ThemeName) => void;
  availableThemes: ThemeName[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { switchTheme, getCurrentTheme, initializeTheme, themes } = useTheme();
  const [currentTheme, setCurrentTheme] = useState<ThemeName>('blue');

  useEffect(() => {
    // Initialize theme on component mount
    initializeTheme();
    setCurrentTheme(getCurrentTheme());
  }, []);

  const handleThemeSwitch = (theme: ThemeName) => {
    switchTheme(theme);
    setCurrentTheme(theme);
  };

  return (
    <ThemeContext.Provider 
      value={{
        currentTheme,
        switchTheme: handleThemeSwitch,
        availableThemes: themes,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};
