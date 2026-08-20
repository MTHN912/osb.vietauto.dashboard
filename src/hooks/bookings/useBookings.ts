'use client';

import { useState, useCallback } from 'react';
import { Booking, BookingFilters, BookingStatus, PackageType } from '@/types';
import * as bookingApi from '@/api/bookings';
import { useDealerContext } from '@/context/DealerContext';

export function useBookings(initialPackageType: PackageType = PackageType.INSURANCE_CLAIMS) {
  const { selectedDealer } = useDealerContext();
  const [activeTab, setActiveTab] = useState<PackageType>(initialPackageType);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = useCallback(
    async (filters?: BookingFilters) => {
      setLoading(true);
      setError(null);
      try {
        const dealerId = selectedDealer === 'global' ? undefined : selectedDealer;
        const data = await bookingApi.getBookings(filters, dealerId, activeTab);
        setBookings(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch bookings');
      } finally {
        setLoading(false);
      }
    },
    [selectedDealer, activeTab]
  );

  const updateStatus = useCallback(
    async (id: string, status: BookingStatus) => {
      const updated = await bookingApi.updateBookingStatus(id, status);
      if (updated) {
        setBookings((prev) => prev.map((b) => (b.id === id ? updated : b)));
      }
      return updated;
    },
    []
  );

  const uploadDeposit = useCallback(
    async (id: string, file: File) => {
      const updated = await bookingApi.uploadDepositCheck(id, file);
      if (updated) {
        setBookings((prev) => prev.map((b) => (b.id === id ? updated : b)));
      }
      return updated;
    },
    []
  );

  return {
    activeTab,
    setActiveTab,
    bookings,
    loading,
    error,
    fetchBookings,
    updateStatus,
    uploadDeposit,
  };
}
