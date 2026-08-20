'use client';

import React, { useState, useRef } from 'react';
import styles from './ColumnFilterPopover.module.css';
import { Search } from 'lucide-react';
import { useOnClickOutside, useI18n } from '@/hooks/common';

export interface FilterOption {
  id: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
}

export interface ColumnFilterPopoverProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  options: FilterOption[];
  selectedIds: string[];
  onChange: (selectedIds: string[]) => void;
  searchable?: boolean;
  align?: 'left' | 'right';
  className?: string;
}

export function ColumnFilterPopover({
  title,
  isOpen,
  onClose,
  options,
  selectedIds,
  onChange,
  searchable = false,
  align = 'left',
  className = '',
}: ColumnFilterPopoverProps) {
  const { t } = useI18n();
  const popoverRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState('');

  useOnClickOutside(popoverRef, onClose, isOpen);

  if (!isOpen) return null;

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(query.toLowerCase().trim())
  );

  const toggleOption = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((item) => item !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  const handleClearAll = () => {
    onChange([]);
  };

  const handleSelectAll = () => {
    onChange(options.map((opt) => opt.id));
  };

  return (
    <div
      className={`${styles.popover} ${styles[align]} ${className}`}
      ref={popoverRef}
      role="dialog"
      onClick={(e) => e.stopPropagation()}
    >
      <div className={styles.header}>
        <span className={styles.title}>{title}</span>
        <div className={styles.actions}>
          {selectedIds.length < options.length && (
            <button type="button" className={styles.actionBtn} onClick={handleSelectAll}>
              {t.common.selectAll}
            </button>
          )}
          {selectedIds.length > 0 && (
            <button type="button" className={styles.actionBtn} onClick={handleClearAll}>
              {t.common.clearAll}
            </button>
          )}
        </div>
      </div>

      {(searchable || options.length > 6) && (
        <div className={styles.searchBox}>
          <Search size={13} className={styles.searchIcon} />
          <input
            type="text"
            placeholder={`${t.common.search} ${title.toLowerCase()}...`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      )}

      <div className={styles.list}>
        {filteredOptions.length === 0 ? (
          <div className={styles.empty}>{t.common.noMatches}</div>
        ) : (
          filteredOptions.map((opt) => {
            const isChecked = selectedIds.length === 0 || selectedIds.includes(opt.id);
            return (
              <label key={opt.id} className={styles.item}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={isChecked}
                  onChange={() => toggleOption(opt.id)}
                />
                <div className={styles.itemContent}>
                  {opt.icon && <span className={styles.itemIcon}>{opt.icon}</span>}
                  <span className={styles.itemLabel}>{opt.label}</span>
                  {opt.badge && <span className={styles.itemBadge}>{opt.badge}</span>}
                </div>
                {typeof opt.count === 'number' && (
                  <span className={styles.itemCount}>{opt.count}</span>
                )}
              </label>
            );
          })
        )}
      </div>
    </div>
  );
}
