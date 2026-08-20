'use client';

import React, { useState, useRef } from 'react';
import styles from './DatePicker.module.css';
import { Calendar as CalendarMolecule } from '@/components/molecules/Calendar';
import { formatDate } from '@/utils';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import { useOnClickOutside, useI18n } from '@/hooks/common';

export interface DatePickerProps {
  label?: string;
  value?: string;
  onChange: (date: string) => void;
  placeholder?: string;
  minDate?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  className?: string;
  allowClear?: boolean;
  popoverAlign?: 'left' | 'right';
}

export function DatePicker({
  label,
  value,
  onChange,
  placeholder = 'mm/dd/yyyy',
  minDate,
  disabled = false,
  required = false,
  error,
  className = '',
  allowClear = true,
  popoverAlign = 'left',
}: DatePickerProps) {
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(containerRef, () => setIsOpen(false), isOpen);

  const handleSelectDate = (date: string) => {
    onChange(date);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
  };

  const displayValue = value ? formatDate(value) : '';

  return (
    <div className={`${styles.container} ${className}`} ref={containerRef}>
      {label && (
        <label className={styles.label}>
          <span>{label}</span>
          {required && <span className={styles.required}>*</span>}
        </label>
      )}

      <div
        className={`${styles.inputWrapper} ${isOpen ? styles.focused : ''} ${disabled ? styles.disabled : ''} ${error ? styles.hasError : ''}`}
        onClick={() => {
          if (!disabled) setIsOpen(!isOpen);
        }}
      >
        <input
          type="text"
          readOnly
          value={displayValue}
          placeholder={placeholder}
          className={styles.input}
          disabled={disabled}
        />

        <div className={styles.iconActions}>
          {allowClear && value && !disabled && (
            <button
              type="button"
              className={styles.clearBtn}
              onClick={handleClear}
              title={t.common.clear}
            >
              <X size={12} />
            </button>
          )}
          <CalendarIcon size={14} className={styles.calendarIcon} />
        </div>
      </div>

      {error && <span className={styles.errorText}>{error}</span>}

      {isOpen && (
        <div className={`${styles.popover} ${styles[popoverAlign]}`}>
          <CalendarMolecule
            value={value}
            onChange={handleSelectDate}
            minDate={minDate}
          />
        </div>
      )}
    </div>
  );
}
