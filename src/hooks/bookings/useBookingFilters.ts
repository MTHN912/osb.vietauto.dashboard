'use client';

import { useState, useCallback } from 'react';
import { BookingFilters, TimeFilterValue } from '@/types';

const DEFAULT_TIME_FILTER: TimeFilterValue = {
  mode: 'quick',
  quickRange: 'all_time',
  label: 'All time',
};

const emptyFilters: BookingFilters = {
  vin: undefined,
  claimNumber: undefined,
  dateOfLoss: undefined,
  bookingDateFrom: undefined,
  bookingDateTo: undefined,
  customerName: undefined,
  vehicleName: undefined,
  statuses: undefined,
  insuranceCompanies: undefined,
  claimTypes: undefined,
  timeFilter: DEFAULT_TIME_FILTER,
};

export function useBookingFilters() {
  const [filters, setFilters] = useState<BookingFilters>({ ...emptyFilters });
  const [isOpen, setIsOpen] = useState(false);

  const updateFilter = useCallback(
    <K extends keyof BookingFilters>(key: K, value: BookingFilters[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value || undefined }));
    },
    []
  );

  const clearFilters = useCallback(() => {
    setFilters({
      ...emptyFilters,
      timeFilter: DEFAULT_TIME_FILTER,
    });
  }, []);

  const togglePanel = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const hasActiveFilters = Object.entries(filters).some(([k, v]) => {
    if (k === 'timeFilter') {
      const tf = v as TimeFilterValue | undefined;
      return tf && tf.mode === 'quick' ? tf.quickRange !== 'all_time' : Boolean(tf);
    }
    return v !== undefined && v !== '';
  });

  return {
    filters,
    setFilters,
    updateFilter,
    clearFilters,
    isOpen,
    togglePanel,
    hasActiveFilters,
    defaultTimeFilter: DEFAULT_TIME_FILTER,
  };
}
