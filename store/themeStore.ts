import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { useColorScheme } from 'react-native';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: Theme;
  isDark: boolean;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  updateSystemTheme: (systemColorScheme: 'light' | 'dark' | null) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      isDark: false,
      setTheme: (theme: Theme) => {
        set({ theme });
        
        // Si no es 'system', aplicar directamente
        if (theme === 'dark') {
          set({ isDark: true });
        } else if (theme === 'light') {
          set({ isDark: false });
        }
        // Si es 'system', se actualizará con updateSystemTheme
      },
      toggleTheme: () => {
        const { theme } = get();
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        get().setTheme(newTheme);
      },
      updateSystemTheme: (systemColorScheme: 'light' | 'dark' | null) => {
        const { theme } = get();
        if (theme === 'system') {
          set({ isDark: systemColorScheme === 'dark' });
        }
      },
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Hook personalizado que combina el store con useColorScheme nativo
export const useTheme = () => {
  const systemColorScheme = useColorScheme();
  const store = useThemeStore();
  
  // Actualizar el tema del sistema cuando cambie
  React.useEffect(() => {
    store.updateSystemTheme(systemColorScheme);
  }, [ ]);
  
  return store;
};