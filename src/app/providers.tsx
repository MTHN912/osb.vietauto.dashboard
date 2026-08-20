'use client';

import React from 'react';
import { ThemeProvider } from '@/context/ThemeContext';
import { DealerProvider } from '@/context/DealerContext';
import { LanguageProvider } from '@/context/LanguageContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <DealerProvider>
          {children}
        </DealerProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}
