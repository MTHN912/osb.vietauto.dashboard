'use client';

import React from 'react';
import { List, CalendarDays } from 'lucide-react';
import styles from './ViewToggle.module.css';
import { useI18n } from '@/hooks/common';

export type ViewMode = 'list' | 'calendar';

export interface ViewToggleProps {
  value: ViewMode;
  onChange: (mode: ViewMode) => void;
  className?: string;
}

export function ViewToggle({ value, onChange, className = '' }: ViewToggleProps) {
  const { t } = useI18n();

  return (
    <div className={`${styles.viewToggle} ${className}`} role="group" aria-label="View toggle">
      <button
        type="button"
        className={`${styles.toggleBtn} ${value === 'list' ? styles.active : ''}`}
        onClick={() => onChange('list')}
        title={t.viewToggle.viewAsList}
        aria-pressed={value === 'list'}
      >
        <List size={15} />
        <span className={styles.btnText}>{t.viewToggle.list}</span>
      </button>

      <button
        type="button"
        className={`${styles.toggleBtn} ${value === 'calendar' ? styles.active : ''}`}
        onClick={() => onChange('calendar')}
        title={t.viewToggle.viewAsCalendar}
        aria-pressed={value === 'calendar'}
      >
        <CalendarDays size={15} />
        <span className={styles.btnText}>{t.viewToggle.calendar}</span>
      </button>
    </div>
  );
}
