import { Theme, useTheme } from '@/store/themeStore';
import { useTranslation } from '@/hooks/useTranslation';
import { Moon, Sun } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export function ThemeSelector() {
  const { theme, isDark, setTheme } = useTheme();
  const {colorScheme, setColorScheme} = useColorScheme();
  const { t } = useTranslation();

  const themes: { key: Theme; label: string; icon: React.ReactNode }[] = [
    {
      key: 'light',
      label: t.settings.appearance.light,
      icon: <Sun size={20} color={colorScheme === "dark" ? '#f8fafc' : '#0f172a'} />,
    },
    {
      key: 'dark',
      label: t.settings.appearance.dark,
      icon: <Moon size={20} color={colorScheme === "dark" ? '#f8fafc' : '#0f172a'} />,
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={[
        styles.title,
        { color: colorScheme === "dark" ? '#f8fafc' : '#0f172a' }
      ]}>
        {t.settings.appearance.theme}
      </Text>
      <View style={styles.optionsContainer}>
        {themes.map((themeOption) => (
          <TouchableOpacity
            key={themeOption.key}
            onPress={() => setColorScheme(themeOption.key)}
            style={[
              styles.option,
              {
                borderColor: colorScheme === themeOption.key
                  ? (colorScheme === "dark" ? '#34d399' : '#10b981')
                  : (colorScheme === "dark" ? '#334155' : '#e2e8f0'),
                backgroundColor: colorScheme === themeOption.key
                  ? (colorScheme === "dark" ? 'rgba(52, 211, 153, 0.1)' : 'rgba(16, 185, 129, 0.1)')
                  : (colorScheme === "dark" ? '#1a1a1a' : '#f8fafc'),
              }
            ]}
          >
            {themeOption.icon}
            <Text style={[
              styles.optionLabel,
              {
                color: colorScheme === themeOption.key
                  ? (colorScheme === "dark" ? '#34d399' : '#10b981')
                  : (colorScheme === "dark" ? '#cbd5e1' : '#475569')
              }
            ]}>
              {themeOption.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 16,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  option: {
    flex: 1,
    marginHorizontal: 4,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 8,
  },
});