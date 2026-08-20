'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { CustomerDetail, Vehicle } from '@/types';
import * as customerApi from '@/api/customers';

export function useCustomerDetail(customerId: string) {
  const [customer, setCustomer] = useState<CustomerDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | 'all'>('all');

  const fetchCustomer = useCallback(async () => {
    if (!customerId) return;
    setLoading(true);
    try {
      const data = await customerApi.getCustomerDetailById(customerId);
      setCustomer(data || null);
    } catch (err) {
      console.error('Failed to fetch customer detail', err);
      setCustomer(null);
    } finally {
      setLoading(false);
    }
  }, [customerId]);

  useEffect(() => {
    fetchCustomer();
  }, [fetchCustomer]);

  const filteredServiceBookings = useMemo(() => {
    if (!customer) return [];
    if (selectedVehicleId === 'all') {
      return customer.serviceBookings;
    }
    return customer.serviceBookings.filter(
      (b) => b.vehicle?.id === selectedVehicleId
    );
  }, [customer, selectedVehicleId]);

  const filteredCases = useMemo(() => {
    if (!customer) return [];
    if (selectedVehicleId === 'all') {
      return customer.cases;
    }
    return customer.cases.filter(
      (c) => c.vehicle?.id === selectedVehicleId
    );
  }, [customer, selectedVehicleId]);

  const selectedVehicle: Vehicle | null = useMemo(() => {
    if (!customer || selectedVehicleId === 'all') return null;
    return customer.vehicles.find((v) => v.id === selectedVehicleId) || null;
  }, [customer, selectedVehicleId]);

  const vehicleStats = useMemo(() => {
    if (!customer) return {};
    const stats: Record<string, { totalBookings: number; lastServiced?: string }> = {};

    customer.vehicles.forEach((v) => {
      const bookingsForVehicle = customer.serviceBookings.filter(
        (b) => b.vehicle?.id === v.id
      );
      const sorted = [...bookingsForVehicle].sort(
        (a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime()
      );
      stats[v.id] = {
        totalBookings: bookingsForVehicle.length,
        lastServiced: sorted[0]?.bookingDate,
      };
    });

    return stats;
  }, [customer]);

  return {
    customer,
    loading,
    selectedVehicleId,
    setSelectedVehicleId,
    filteredServiceBookings,
    filteredCases,
    selectedVehicle,
    vehicleStats,
    refresh: fetchCustomer,
  };
}
