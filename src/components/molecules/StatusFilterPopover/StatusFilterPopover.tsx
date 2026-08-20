'use client';

import React, { useRef } from 'react';
import styles from './StatusFilterPopover.module.css';
import { CaseStatus } from '@/types';
import { CASE_STATUS_LIST } from '@/constants';
import { StatusPill } from '@/components/atoms/StatusPill';
import { useOnClickOutside, useI18n } from '@/hooks/common';

export interface StatusFilterPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  selectedStatuses: CaseStatus[];
  onChange: (statuses: CaseStatus[]) => void;
  anchorRef?: React.RefObject<HTMLElement | null>;
}

export function StatusFilterPopover({
  isOpen,
  onClose,
  selectedStatuses,
  onChange,
}: StatusFilterPopoverProps) {
  const { t } = useI18n();
  const popoverRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(popoverRef, onClose, isOpen);

  if (!isOpen) return null;

  const toggleStatus = (status: CaseStatus) => {
    if (selectedStatuses.includes(status)) {
      onChange(selectedStatuses.filter((s) => s !== status));
    } else {
      onChange([...selectedStatuses, status]);
    }
  };

  const handleClearAll = () => {
    onChange([]);
  };

  const handleSelectAll = () => {
    onChange([...CASE_STATUS_LIST]);
  };

  return (
    <div className={styles.popover} ref={popoverRef} role="dialog">
      <div className={styles.header}>
        <span className={styles.title}>{t.cases.table.statusFilter}</span>
        <div className={styles.actions}>
          {selectedStatuses.length < CASE_STATUS_LIST.length && (
            <button type="button" className={styles.clearBtn} onClick={handleSelectAll}>
              {t.common.selectAll}
            </button>
          )}
          {selectedStatuses.length > 0 && (
            <button type="button" className={styles.clearBtn} onClick={handleClearAll}>
              {t.common.clearAll}
            </button>
          )}
        </div>
      </div>

      <div className={styles.list}>
        {CASE_STATUS_LIST.map((status) => {
          const isChecked = selectedStatuses.length === 0 || selectedStatuses.includes(status);
          return (
            <label key={status} className={styles.item}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={isChecked}
                onChange={() => toggleStatus(status)}
              />
              <StatusPill status={status} className={styles.pill} />
            </label>
          );
        })}
      </div>
    </div>
  );
}
