'use client';

import React from 'react';
import styles from './Toggle.module.css';
import { Moon, Sun } from 'lucide-react';

interface ToggleProps {
  checked: boolean;
  onChange: () => void;
  label?: string;
  id?: string;
}

export function Toggle({ checked, onChange, label, id = 'theme-toggle' }: ToggleProps) {
  return (
    <label className={styles.toggle} htmlFor={id}>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className={styles.input}
      />
      <span className={styles.slider}>
        <span className={styles.icon}>{checked ? <Moon size={14} /> : <Sun size={14} />}</span>
      </span>
      {label && <span className={styles.label}>{label}</span>}
    </label>
  );
}
