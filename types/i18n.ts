export interface TranslationKeys {
  // Common
  common: {
    loading: string;
    error: string;
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    share: string;
    back: string;
    next: string;
    previous: string;
    close: string;
    ok: string;
    yes: string;
    no: string;
  };

  // Navigation
  navigation: {
    record: string;
    gallery: string;
    settings: string;
  };

  // Recording Screen
  recording: {
    title: string;
    subtitle: string;
    firstSculpture: {
      title: string;
      subtitle: string;
    };
    shapes: {
      wave: string;
      spiral: string;
      flower: string;
      mountain: string;
      '3d': string;
    };
    recording: {
      duration: string;
      stop: string;
      start: string;
    };
    sculptureInfo: {
      points: string;
      created: string;
    };
  };

  // Gallery Screen
  gallery: {
    title: string;
    stats: {
      sculptures: string;
      average: string;
      categories: string;
    };
    filters: {
      all: string;
    };
  };

  // Settings Screen
  settings: {
    title: string;
    subtitle: string;
    sections: {
      appearance: string;
      notifications: string;
      privacy: string;
      app: string;
      support: string;
      account: string;
    };
    appearance: {
      theme: string;
      light: string;
      dark: string;
    };
    notifications: {
      push: string;
      pushDesc: string;
      email: string;
      emailDesc: string;
      sound: string;
      soundDesc: string;
      vibration: string;
      vibrationDesc: string;
    };
    privacy: {
      analytics: string;
      analyticsDesc: string;
      crashReporting: string;
      crashReportingDesc: string;
      personalizedAds: string;
      personalizedAdsDesc: string;
    };
    app: {
      autoSave: string;
      autoSaveDesc: string;
      highQualityAudio: string;
      highQualityAudioDesc: string;
      offlineMode: string;
      offlineModeDesc: string;
      language: string;
      languageDesc: string;
    };
    support: {
      helpCenter: string;
      helpCenterDesc: string;
      contactSupport: string;
      contactSupportDesc: string;
      rateApp: string;
      rateAppDesc: string;
    };
    account: {
      signOut: string;
      signOutDesc: string;
      resetSettings: string;
      resetSettingsDesc: string;
    };
    footer: {
      version: string;
      subtitle: string;
    };
    alerts: {
      resetTitle: string;
      resetMessage: string;
      resetConfirm: string;
      signOutTitle: string;
      signOutMessage: string;
      signOutConfirm: string;
      languageTitle: string;
      languageMessage: string;
      helpCenterTitle: string;
      helpCenterMessage: string;
      contactSupportTitle: string;
      contactSupportMessage: string;
      rateAppTitle: string;
      rateAppMessage: string;
    };
  };

  // Errors
  errors: {
    recording: {
      permissionDenied: string;
      startFailed: string;
      stopFailed: string;
      processingFailed: string;
    };
    sculpture: {
      loadFailed: string;
      saveFailed: string;
      filterFailed: string;
    };
  };
}

export type Language = 'en' | 'es';
export type LanguageConfig = {
  code: Language;
  name: string;
  nativeName: string;
};