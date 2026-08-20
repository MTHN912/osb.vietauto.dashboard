import { SupportedLanguage, TranslationSchema } from './types';
import en from './locales/en.json';
import vi from './locales/vi.json';

export * from './types';

export const translations: Record<SupportedLanguage, TranslationSchema> = {
  en,
  vi,
};

export const DEFAULT_LANGUAGE: SupportedLanguage = 'en';

export const SUPPORTED_LANGUAGES: { code: SupportedLanguage; label: string; flag: string }[] = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
];
