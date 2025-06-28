import { useLanguageStore } from '@/store/languageStore';
import { translations } from '@/constants/translations';
import { TranslationKeys } from '@/types/i18n';

export const useTranslation = () => {
  const language = useLanguageStore((state) => state.language);
  const setLanguage = useLanguageStore((state) => state.setLanguage);

  const t = translations[language] as TranslationKeys;

  return {
    t,
    language,
    setLanguage,
  };
};