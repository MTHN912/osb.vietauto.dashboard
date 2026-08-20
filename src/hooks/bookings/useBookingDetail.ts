'use client';

import { useState, useEffect, useCallback } from 'react';
import { Booking } from '@/types';
import * as bookingApi from '@/api/bookings';

export function useBookingDetail(id?: string) {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDetail = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await bookingApi.getBookingById(id);
      setBooking(data || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load booking');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  return {
    booking,
    setBooking,
    loading,
    error,
    refetch: fetchDetail,
  };
}
