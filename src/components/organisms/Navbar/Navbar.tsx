'use client';

import React from 'react';
import styles from './Navbar.module.css';
import { useThemeContext } from '@/context/ThemeContext';
import { useI18n } from '@/hooks/common';
import Link from 'next/link';
import { Search, Bell, Calendar, Moon, Sun, LogOut } from 'lucide-react';
import { Avatar } from '@/components/atoms/Avatar';
import { LanguageSwitcher } from '@/components/molecules/LanguageSwitcher';

export function Navbar() {
  const { theme, toggleTheme } = useThemeContext();
  const { t } = useI18n();

  return (
    <header className={styles.navbar}>
      <div className={styles.left} />

      <div className={styles.right}>
        <div className={styles.searchWrapper}>
          <Search size={15} className={styles.searchIcon} />
          <input
            type="text"
            placeholder={t.nav.searchPlaceholder}
            className={styles.searchInput}
          />
        </div>

        <button
          type="button"
          className={styles.iconBtn}
          title={t.nav.notifications}
          aria-label={t.nav.notifications}
        >
          <Bell size={18} />
          <span className={styles.notificationDot} />
        </button>

        <button
          type="button"
          className={styles.iconBtn}
          title={t.nav.calendar}
          aria-label={t.nav.calendar}
        >
          <Calendar size={18} />
        </button>

        <button
          type="button"
          className={styles.iconBtn}
          onClick={toggleTheme}
          title={t.nav.toggleTheme}
          aria-label={t.nav.toggleTheme}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <LanguageSwitcher />

        <div className={styles.divider} />

        <div className={styles.userProfile}>
          <Avatar
            name="Admin User"
            initials="AU"
            size="sm"
            color="#18181b"
          />
        </div>

        <Link
          href="/login"
          className={styles.iconBtn}
          title="Sign Out"
          aria-label="Sign Out"
        >
          <LogOut size={16} />
        </Link>
      </div>
    </header>
  );
}
