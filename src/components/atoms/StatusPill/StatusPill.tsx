'use client';

import React from 'react';
import styles from './StatusPill.module.css';
import { BookingStatus, CaseStatus, RentalCarStatus } from '@/types';
import { useI18n } from '@/hooks/common';

interface StatusPillProps {
  status: BookingStatus | CaseStatus | RentalCarStatus | string;
  className?: string;
  onClick?: () => void;
  showDot?: boolean;
}

export function StatusPill({
  status,
  className = '',
  onClick,
  showDot = false,
}: StatusPillProps) {
  const { t } = useI18n();

  const getStatusLabel = (s: string) => {
    switch (s) {
      case BookingStatus.BOOKED_IN:
        return t.bookingStatus.bookedIn;
      case BookingStatus.CHECK_IN:
        return t.bookingStatus.checkIn;
      case BookingStatus.COMPLETE:
        return t.bookingStatus.complete;
      case BookingStatus.CANCELLED:
        return t.bookingStatus.cancelled;
      case BookingStatus.NEED_ESTIMATE:
        return t.bookingStatus.needEstimate;

      case CaseStatus.DRAFT:
        return t.caseStatus.draft;
      case CaseStatus.FILED:
        return t.caseStatus.filed;
      case CaseStatus.PENDING_INSPECTION:
        return t.caseStatus.pendingInspection;
      case CaseStatus.WAITING_FOR_CHECK:
        return t.caseStatus.waitingForCheck;
      case CaseStatus.WAITING_ON_PARTS:
        return t.caseStatus.waitingOnParts;
      case CaseStatus.ESTIMATE_SENT:
        return t.caseStatus.estimateSent;
      case CaseStatus.INSPECTED:
        return t.caseStatus.inspected;
      case CaseStatus.SUPPLEMENT_SENT:
        return t.caseStatus.supplementSent;
      case CaseStatus.COMPLETED:
        return t.caseStatus.completed;

      case RentalCarStatus.ACTIVE:
        return t.rentalCarStatus.active;
      case RentalCarStatus.INACTIVE:
        return t.rentalCarStatus.inactive;

      default:
        return s;
    }
  };

  const label = getStatusLabel(status);
  const statusKey = status.replace(/[\s-]+/g, '');

  return (
    <span
      className={`${styles.pill} ${styles[statusKey] || styles.custom} ${onClick ? styles.clickable : ''} ${className}`}
      title={label}
      onClick={onClick}
    >
      {showDot && <span className={styles.dot} />}
      {label}
    </span>
  );
}
