'use client';

import React, { useState, useRef } from 'react';
import styles from './LanguageSwitcher.module.css';
import { useLanguage } from '@/context/LanguageContext';
import { SUPPORTED_LANGUAGES, SupportedLanguage } from '@/i18n';
import { ChevronDown, Check } from 'lucide-react';
import { useOnClickOutside } from '@/hooks/common';

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(containerRef, () => setIsOpen(false), isOpen);

  const currentConfig =
    SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  const handleSelect = (code: SupportedLanguage) => {
    setLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className={styles.container} ref={containerRef}>
      <button
        type="button"
        className={styles.toggleBtn}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        title={t.common.changeLanguageTooltip}
      >
        <span className={styles.flag}>{currentConfig.flag}</span>
        <span className={styles.code}>{currentConfig.code.toUpperCase()}</span>
        <ChevronDown
          size={13}
          className={`${styles.chevron} ${isOpen ? styles.chevronRotated : ''}`}
        />
      </button>

      {isOpen && (
        <div className={styles.dropdown} role="menu">
          {SUPPORTED_LANGUAGES.map((item) => {
            const isSelected = item.code === language;
            return (
              <button
                key={item.code}
                type="button"
                className={`${styles.option} ${isSelected ? styles.optionActive : ''}`}
                onClick={() => handleSelect(item.code)}
                role="menuitem"
              >
                <div className={styles.optionContent}>
                  <span className={styles.flag}>{item.flag}</span>
                  <span>{item.label}</span>
                </div>
                {isSelected && <Check size={14} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
