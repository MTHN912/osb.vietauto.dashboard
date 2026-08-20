'use client';

import React from 'react';
import styles from './AvatarGroup.module.css';
import { Avatar } from '@/components/atoms/Avatar';
import { Staff } from '@/types';
import { useI18n } from '@/hooks/common';

export interface AvatarGroupProps {
  staffList: Staff[];
  selectedStaffId?: string;
  onSelectStaff: (staffId?: string) => void;
  maxVisible?: number;
  className?: string;
}

export function AvatarGroup({
  staffList,
  selectedStaffId,
  onSelectStaff,
  maxVisible = 3,
  className = '',
}: AvatarGroupProps) {
  const { t } = useI18n();
  const visibleStaff = staffList.slice(0, maxVisible);
  const remainingCount = staffList.length - maxVisible;

  return (
    <div className={`${styles.group} ${className}`}>
      {visibleStaff.map((staff) => {
        const isSelected = selectedStaffId === staff.id;
        return (
          <div
            key={staff.id}
            className={`${styles.avatarWrapper} ${isSelected ? styles.selected : ''}`}
            onClick={() => onSelectStaff(isSelected ? undefined : staff.id)}
            title={`${staff.name} (${staff.role || t.common.staff})`}
          >
            <Avatar
              name={staff.name}
              initials={staff.initials}
              avatarUrl={staff.avatarUrl}
              color={staff.color}
              size="sm"
            />
          </div>
        );
      })}

      {remainingCount > 0 && (
        <button
          type="button"
          className={`${styles.moreBadge} ${selectedStaffId && !visibleStaff.some((s) => s.id === selectedStaffId) ? styles.moreActive : ''}`}
          onClick={() => onSelectStaff(undefined)}
          title={t.common.allStaffTooltip}
        >
          +{remainingCount}
        </button>
      )}
    </div>
  );
}
