'use client';

import { useState, useEffect, useCallback } from 'react';
import { OverviewRevenueData } from '@/types';
import * as overviewApi from '@/api/overview';
import { useDealerContext } from '@/context/DealerContext';

export function useOverviewRevenue() {
  const { selectedDealer, setSelectedDealer } = useDealerContext();
  const [data, setData] = useState<OverviewRevenueData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'month' | 'quarter' | 'year'>('month');

  const fetchRevenue = useCallback(async () => {
    setLoading(true);
    try {
      const res = await overviewApi.getOverviewRevenue(selectedDealer);
      setData(res);
    } catch (err) {
      console.error('Failed to fetch overview revenue', err);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [selectedDealer]);

  useEffect(() => {
    fetchRevenue();
  }, [fetchRevenue]);

  return {
    revenueData: data,
    loading,
    selectedDealer,
    setSelectedDealer,
    timeRange,
    setTimeRange,
    refresh: fetchRevenue,
  };
}
