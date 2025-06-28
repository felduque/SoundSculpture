import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface NotificationSettings {
  pushNotifications: boolean;
  emailNotifications: boolean;
  soundAlerts: boolean;
  vibration: boolean;
}

interface PrivacySettings {
  analytics: boolean;
  crashReporting: boolean;
  personalizedAds: boolean;
}

interface AppSettings {
  language: string;
  autoSave: boolean;
  highQualityAudio: boolean;
  offlineMode: boolean;
}

interface SettingsState {
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  app: AppSettings;
  updateNotificationSetting: (key: keyof NotificationSettings, value: boolean) => void;
  updatePrivacySetting: (key: keyof PrivacySettings, value: boolean) => void;
  updateAppSetting: (key: keyof AppSettings, value: boolean | string) => void;
  resetToDefaults: () => void;
}

const defaultSettings = {
  notifications: {
    pushNotifications: true,
    emailNotifications: false,
    soundAlerts: true,
    vibration: true,
  },
  privacy: {
    analytics: true,
    crashReporting: true,
    personalizedAds: false,
  },
  app: {
    language: 'en',
    autoSave: true,
    highQualityAudio: true,
    offlineMode: false,
  },
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaultSettings,
      updateNotificationSetting: (key, value) =>
        set((state) => ({
          notifications: { ...state.notifications, [key]: value },
        })),
      updatePrivacySetting: (key, value) =>
        set((state) => ({
          privacy: { ...state.privacy, [key]: value },
        })),
      updateAppSetting: (key, value) =>
        set((state) => ({
          app: { ...state.app, [key]: value },
        })),
      resetToDefaults: () => set(defaultSettings),
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);