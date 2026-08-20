'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Customer, BookingStatus } from '@/types';
import * as customerApi from '@/api/customers';
import { mockBookings } from '@/mocks/bookings';
import { mockVehicles } from '@/mocks/vehicles';

export interface CustomerStats {
  totalCustomers: number;
  totalVehicles: number;
  activeBookings: number;
}

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await customerApi.getCustomers();
      setCustomers(data);
    } catch (err) {
      console.error('Failed to fetch customers', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const filteredCustomers = useMemo(() => {
    if (!searchQuery.trim()) return customers;
    const query = searchQuery.toLowerCase();
    return customers.filter((c) => {
      const fullName = `${c.firstName} ${c.lastName}`.toLowerCase();
      const phone = (c.phone || '').toLowerCase();
      const email = (c.email || '').toLowerCase();
      const address = (c.address || '').toLowerCase();
      return (
        fullName.includes(query) ||
        phone.includes(query) ||
        email.includes(query) ||
        address.includes(query)
      );
    });
  }, [customers, searchQuery]);

  const stats: CustomerStats = useMemo(() => {
    const totalCustomers = customers.length;
    const totalVehicles = customers.reduce(
      (acc, c) => acc + (c.vehicles ? c.vehicles.length : 0),
      0
    ) || mockVehicles.length;

    const activeBookings = mockBookings.filter(
      (b) =>
        b.status === BookingStatus.BOOKED_IN ||
        b.status === BookingStatus.CHECK_IN ||
        b.status === BookingStatus.NEED_ESTIMATE
    ).length;

    return {
      totalCustomers,
      totalVehicles,
      activeBookings,
    };
  }, [customers]);

  const getCustomerBookingsCount = useCallback((customerId: string) => {
    return mockBookings.filter((b) => b.customer.id === customerId).length;
  }, []);

  return {
    customers,
    filteredCustomers,
    loading,
    searchQuery,
    setSearchQuery,
    stats,
    getCustomerBookingsCount,
    refresh: fetchCustomers,
  };
}
