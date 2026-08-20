'use client';

import React from 'react';
import styles from './BookingFilterPanel.module.css';
import { Input } from '@/components/atoms/Input';
import { Button } from '@/components/atoms/Button';
import { DatePicker } from '@/components/molecules/DatePicker';
import { BookingFilters } from '@/types';
import { Filter } from 'lucide-react';
import { useI18n } from '@/hooks/common';

interface BookingFilterPanelProps {
  filters: BookingFilters;
  onFilterChange: <K extends keyof BookingFilters>(key: K, value: BookingFilters[K]) => void;
  onClear: () => void;
  isOpen: boolean;
  onToggle: () => void;
  hasActiveFilters: boolean;
}

export function BookingFilterPanel({
  filters,
  onFilterChange,
  onClear,
  isOpen,
  onToggle,
  hasActiveFilters,
}: BookingFilterPanelProps) {
  const { t } = useI18n();

  return (
    <div className={styles.wrapper}>
      <button className={styles.toggleBtn} onClick={onToggle}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
          <Filter size={16} /> {t.bookings.filterPanel.filters}
        </span>
        {hasActiveFilters && <span className={styles.activeDot} />}
        <span className={`${styles.chevron} ${isOpen ? styles.chevronUp : ''}`}>▾</span>
      </button>

      {isOpen && (
        <div className={styles.panel}>
          <div className={styles.grid}>
            <Input
              label={t.bookings.filterPanel.customerName}
              placeholder={t.bookings.filterPanel.customerNamePlaceholder}
              value={filters.customerName || ''}
              onChange={(e) => onFilterChange('customerName', e.target.value)}
            />
            <Input
              label={t.bookings.filterPanel.vin}
              placeholder={t.bookings.filterPanel.vinPlaceholder}
              value={filters.vin || ''}
              onChange={(e) => onFilterChange('vin', e.target.value)}
            />
            <Input
              label={t.bookings.filterPanel.vehicleName}
              placeholder={t.bookings.filterPanel.vehicleNamePlaceholder}
              value={filters.vehicleName || ''}
              onChange={(e) => onFilterChange('vehicleName', e.target.value)}
            />
            <Input
              label={t.bookings.filterPanel.claimNumber}
              placeholder={t.bookings.filterPanel.claimNumberPlaceholder}
              value={filters.claimNumber || ''}
              onChange={(e) => onFilterChange('claimNumber', e.target.value)}
            />
            <DatePicker
              label={t.bookings.filterPanel.dateOfLoss}
              value={filters.dateOfLoss || ''}
              onChange={(date) => onFilterChange('dateOfLoss', date || undefined)}
              placeholder="mm/dd/yyyy"
            />
            <DatePicker
              label={t.bookings.filterPanel.bookingDateFrom}
              value={filters.bookingDateFrom || ''}
              onChange={(date) => onFilterChange('bookingDateFrom', date || undefined)}
              placeholder="mm/dd/yyyy"
            />
            <DatePicker
              label={t.bookings.filterPanel.bookingDateTo}
              value={filters.bookingDateTo || ''}
              onChange={(date) => onFilterChange('bookingDateTo', date || undefined)}
              placeholder="mm/dd/yyyy"
              popoverAlign="right"
            />
          </div>
          {hasActiveFilters && (
            <div className={styles.actions}>
              <Button variant="ghost" size="sm" onClick={onClear}>
                {t.bookings.filterPanel.clearAllFilters}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
