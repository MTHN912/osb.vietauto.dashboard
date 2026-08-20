'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Booking, CaseStatus, Staff } from '@/types';
import { mockStaff } from '@/mocks/staff';
import * as caseApi from '@/api/cases';

interface UseNewCaseModalProps {
  isOpen: boolean;
  dealerId?: string;
  onClose: () => void;
  onCaseCreated: () => void;
}

export function useNewCaseModal({
  isOpen,
  dealerId,
  onClose,
  onCaseCreated,
}: UseNewCaseModalProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [selectedStaffId, setSelectedStaffId] = useState<string>(mockStaff[0]?.id || '');
  const [startDate, setStartDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [inspectionDate, setInspectionDate] = useState<string>('');
  const [status, setStatus] = useState<CaseStatus>(CaseStatus.DRAFT);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await caseApi.getUnprocessedInsuranceBookings(dealerId);
      setBookings(data);
      if (data.length > 0) {
        setSelectedBookingId((prev) => prev || data[0].id);
      }
    } catch {
      setError('Failed to load insurance bookings');
    } finally {
      setLoading(false);
    }
  }, [dealerId]);

  useEffect(() => {
    if (isOpen) {
      loadBookings();
    }
  }, [isOpen, loadBookings]);

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const q = searchQuery.toLowerCase().trim();
      if (!q) return true;
      const name = `${b.customer.firstName} ${b.customer.lastName}`.toLowerCase();
      const id = b.id.toLowerCase();
      const phone = b.customer.phone.toLowerCase();
      const ins = b.insurance?.insuranceCompany.toLowerCase() || '';
      const claim = b.insurance?.claimNumber.toLowerCase() || '';
      const vehicle = b.vehicle
        ? `${b.vehicle.year} ${b.vehicle.make} ${b.vehicle.model}`.toLowerCase()
        : '';

      return (
        name.includes(q) ||
        id.includes(q) ||
        phone.includes(q) ||
        ins.includes(q) ||
        claim.includes(q) ||
        vehicle.includes(q)
      );
    });
  }, [bookings, searchQuery]);

  const selectedBooking = useMemo(
    () => bookings.find((b) => b.id === selectedBookingId),
    [bookings, selectedBookingId]
  );

  const selectedStaff: Staff = useMemo(
    () => mockStaff.find((s) => s.id === selectedStaffId) || mockStaff[0],
    [selectedStaffId]
  );

  const handleCreateCase = useCallback(async () => {
    if (!selectedBookingId) {
      setError('Please select an insurance booking');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await caseApi.createCase({
        bookingId: selectedBookingId,
        assignee: selectedStaff,
        startDate,
        inspectionDate: inspectionDate || undefined,
        status,
        notes,
      });

      onCaseCreated();
      onClose();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create case';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }, [
    selectedBookingId,
    selectedStaff,
    startDate,
    inspectionDate,
    status,
    notes,
    onCaseCreated,
    onClose,
  ]);

  return {
    bookings,
    filteredBookings,
    loading,
    searchQuery,
    setSearchQuery,
    selectedBookingId,
    setSelectedBookingId,
    selectedStaffId,
    setSelectedStaffId,
    selectedBooking,
    selectedStaff,
    startDate,
    setStartDate,
    inspectionDate,
    setInspectionDate,
    status,
    setStatus,
    notes,
    setNotes,
    submitting,
    error,
    handleCreateCase,
  };
}
