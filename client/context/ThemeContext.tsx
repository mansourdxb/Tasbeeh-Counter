
import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeMode = 'light' | 'dark' | 'auto';

type ThemeContextType = {
  isDarkMode: boolean;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  toggleDarkMode: () => void;
  colors: {
    // Background colors
    background: string;
    cardBackground: string;
    headerGradient: string[];
    
    // Text colors
    text: string;
    textSecondary: string;
    headerText: string;
    
    // UI elements
    border: string;
    shadow: string;
    
    // Status bar
    statusBarStyle: 'light-content' | 'dark-content';
  };
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@app_theme_mode';

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('auto');
  
  // Load saved theme preference
  useEffect(() => {
    loadThemePreference();
  }, []);
  
  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'auto')) {
        setThemeModeState(savedTheme as ThemeMode);
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
    }
  };
  
  const setThemeMode = async (mode: ThemeMode) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
      setThemeModeState(mode);
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };
  
  const toggleDarkMode = () => {
    const newMode = isDarkMode ? 'light' : 'dark';
    setThemeMode(newMode);
  };
  
  // Determine if dark mode should be active
  const isDarkMode = themeMode === 'dark' || (themeMode === 'auto' && systemColorScheme === 'dark');
  
  const colors = isDarkMode ? {
    // Dark theme colors
    background: '#1A1D23',
    cardBackground: '#2B2B2B',
    headerGradient: ['#4B5563', '#374151'],
    text: '#FFFFFF',
    textSecondary: 'rgba(255,255,255,0.65)',
    headerText: '#FFFFFF',
    border: 'rgba(255,255,255,0.10)',
    shadow: '#000000',
    statusBarStyle: 'light-content' as const,
  } : {
    // Light theme colors
    background: '#E9EFF5',
    cardBackground: '#2B2B2B',
    headerGradient: ['#7EC3E6', '#64B5E1'],
    text: '#FFFFFF',
    textSecondary: 'rgba(255,255,255,0.65)',
    headerText: '#FFFFFF',
    border: 'rgba(255,255,255,0.10)',
    shadow: '#000000',
    statusBarStyle: 'light-content' as const,
  };
  
  return (
    <ThemeContext.Provider value={{ isDarkMode, themeMode, setThemeMode, toggleDarkMode, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};