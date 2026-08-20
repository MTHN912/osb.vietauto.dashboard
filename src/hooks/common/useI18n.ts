'use client';

import { useLanguage } from '@/context/LanguageContext';

export function useI18n() {
  return useLanguage();
}
