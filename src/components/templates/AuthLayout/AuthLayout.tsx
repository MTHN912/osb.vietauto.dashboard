'use client';

import React from 'react';
import styles from './AuthLayout.module.css';
import { useI18n } from '@/hooks/common';
import { useThemeContext } from '@/context/ThemeContext';
import { LanguageSwitcher } from '@/components/molecules/LanguageSwitcher';
import {
  Car,
  Calendar,
  ShieldCheck,
  CarFront,
  TrendingUp,
  Moon,
  Sun,
} from 'lucide-react';

export interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  const { t } = useI18n();
  const { theme, toggleTheme } = useThemeContext();

  return (
    <div className={styles.container}>
      <aside className={styles.heroSide}>
        <div className={styles.heroHeader}>
          <div className={styles.logoIcon}>
            <Car size={26} />
          </div>
          <span className={styles.brandName}>VietAuto Operations</span>
        </div>

        <div className={styles.heroContent}>
          <h1 className={styles.heroTagline}>
            {t.auth.brand.tagline}
          </h1>
          <p className={styles.heroDescription}>
            {t.auth.brand.description}
          </p>

          <div className={styles.featureList}>
            <div className={styles.featureItem}>
              <div className={styles.featureIconWrap}>
                <Calendar size={18} />
              </div>
              <span>{t.auth.brand.feature1}</span>
            </div>
            <div className={styles.featureItem}>
              <div className={styles.featureIconWrap}>
                <ShieldCheck size={18} />
              </div>
              <span>{t.auth.brand.feature2}</span>
            </div>
            <div className={styles.featureItem}>
              <div className={styles.featureIconWrap}>
                <CarFront size={18} />
              </div>
              <span>{t.auth.brand.feature3}</span>
            </div>
            <div className={styles.featureItem}>
              <div className={styles.featureIconWrap}>
                <TrendingUp size={18} />
              </div>
              <span>{t.auth.brand.feature4}</span>
            </div>
          </div>
        </div>

        <div className={styles.heroFooter}>
          <div className={styles.statsChip}>
            <span className={styles.statsDot} />
            <span className={styles.statsText}>{t.auth.brand.statValue}</span>
          </div>
        </div>
      </aside>

      <main className={styles.formSide}>
        <div className={styles.topBar}>
          <button
            type="button"
            className={styles.themeBtn}
            onClick={toggleTheme}
            title={t.nav.toggleTheme}
            aria-label={t.nav.toggleTheme}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <LanguageSwitcher />
        </div>

        <div className={styles.formWrapper}>
          {children}
        </div>

        <footer className={styles.footer}>
          © {new Date().getFullYear()} VietAuto Operations Platform. All rights reserved.
        </footer>
      </main>
    </div>
  );
}
