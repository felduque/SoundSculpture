import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Globe } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { useTranslation } from '@/hooks/useTranslation';
import { languages } from '@/constants/translations';
import { Language } from '@/types/i18n';

export function LanguageSelector() {
  const { colorScheme } = useColorScheme();
  const { t, language, setLanguage } = useTranslation();

  const showLanguageSelector = () => {
    Alert.alert(
      t.settings.app.language,
      '',
      [
        { text: t.common.cancel, style: 'cancel' },
        ...languages.map((lang) => ({
          text: lang.nativeName,
          onPress: () => setLanguage(lang.code as Language),
          style: language === lang.code ? 'default' : 'default' as any,
        })),
      ]
    );
  };

  const currentLanguage = languages.find(lang => lang.code === language);

  return (
    <TouchableOpacity
      onPress={showLanguageSelector}
      style={[
        styles.container,
        {
          backgroundColor: colorScheme === "dark" ? '#1a1a1a' : '#f8fafc',
          borderColor: colorScheme === "dark" ? '#334155' : '#e2e8f0',
        }
      ]}
    >
      <View style={styles.iconContainer}>
        <Globe
          size={20}
          color={colorScheme === "dark" ? '#a78bfa' : '#8b5cf6'}
        />
      </View>
      <View style={styles.content}>
        <Text style={[
          styles.title,
          { color: colorScheme === "dark" ? '#f8fafc' : '#0f172a' }
        ]}>
          {t.settings.app.language}
        </Text>
        <Text style={[
          styles.description,
          { color: colorScheme === "dark" ? '#cbd5e1' : '#475569' }
        ]}>
          {currentLanguage?.nativeName}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    marginHorizontal: 4,
  },
  iconContainer: {
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    marginTop: 4,
  },
});