'use client';

import { useState, useEffect, useRef, useCallback, ChangeEvent, MouseEvent } from 'react';
import { Booking, BookingStatus, PackageType } from '@/types';
import * as bookingApi from '@/api/bookings';

export type EditTab = 'details' | 'checkin' | 'status';

export function useEditBooking(bookingId?: string) {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<EditTab>('details');
  const [saving, setSaving] = useState(false);

  const [editCustomer, setEditCustomer] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
  });
  const [editDate, setEditDate] = useState('');
  const [editTime, setEditTime] = useState('');
  const [editInsurance, setEditInsurance] = useState({
    claimNumber: '',
    policyNumber: '',
    dateOfLoss: '',
    insuranceCompany: '',
  });
  const [editVehicle, setEditVehicle] = useState({
    vin: '',
    make: '',
    model: '',
    year: 0,
    mileage: 0,
  });

  const [checkInPhotos, setCheckInPhotos] = useState<string[]>([]);
  const [signature, setSignature] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [depositFile, setDepositFile] = useState<File | null>(null);

  useEffect(() => {
    async function load() {
      if (!bookingId) {
        setLoading(false);
        return;
      }
      const data = await bookingApi.getBookingById(bookingId);
      if (data) {
        setBooking(data);
        setEditCustomer({
          firstName: data.customer.firstName,
          lastName: data.customer.lastName,
          email: data.customer.email,
          phone: data.customer.phone,
          address: data.customer.address,
        });
        setEditDate(data.bookingDate);
        setEditTime(data.bookingTime);
        if (data.insurance) {
          setEditInsurance({
            claimNumber: data.insurance.claimNumber,
            policyNumber: data.insurance.policyNumber,
            dateOfLoss: data.insurance.dateOfLoss,
            insuranceCompany: data.insurance.insuranceCompany,
          });
        }
        if (data.vehicle) {
          setEditVehicle({
            vin: data.vehicle.vin,
            make: data.vehicle.make,
            model: data.vehicle.model,
            year: data.vehicle.year,
            mileage: data.vehicle.mileage,
          });
        }
        setCheckInPhotos(data.checkInPhotos || []);
      }
      setLoading(false);
    }
    load();
  }, [bookingId]);

  const handleSaveDetails = useCallback(async () => {
    if (!booking) return;
    setSaving(true);
    const updates: Partial<Booking> = {
      customer: { ...booking.customer, ...editCustomer },
      bookingDate: editDate,
      bookingTime: editTime,
    };
    if (booking.vehicle) {
      updates.vehicle = { ...booking.vehicle, ...editVehicle };
    }
    if (booking.insurance) {
      updates.insurance = { ...booking.insurance, ...editInsurance };
    }
    const updated = await bookingApi.updateBooking(booking.id, updates);
    if (updated) setBooking(updated);
    setSaving(false);
  }, [booking, editCustomer, editDate, editTime, editVehicle, editInsurance]);

  const handleStatusChange = useCallback(async (newStatus: BookingStatus) => {
    if (!booking) return;

    if (newStatus === BookingStatus.CHECK_IN) {
      setActiveTab('checkin');
      return;
    }

    if (newStatus === BookingStatus.COMPLETE && !booking.depositCheckUrl) {
      alert('Please upload a deposit check PDF before marking as Complete.');
      return;
    }

    setSaving(true);
    const updated = await bookingApi.updateBookingStatus(booking.id, newStatus);
    if (updated) setBooking(updated);
    setSaving(false);
  }, [booking]);

  const handleDepositUpload = useCallback(async () => {
    if (!booking || !depositFile) return;
    setSaving(true);
    const updated = await bookingApi.uploadDepositCheck(booking.id, depositFile);
    if (updated) setBooking(updated);
    setDepositFile(null);
    setSaving(false);
  }, [booking, depositFile]);

  const handlePhotoCapture = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setCheckInPhotos((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const startDraw = useCallback((e: MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  }, []);

  const draw = useCallback((e: MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.strokeStyle =
      getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim() ||
      '#000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  }, [isDrawing]);

  const endDraw = useCallback(() => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      setSignature(canvas.toDataURL());
    }
  }, []);

  const clearSignature = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    setSignature(null);
  }, []);

  const handleCheckInSubmit = useCallback(async () => {
    if (!booking) return;
    if (checkInPhotos.length === 0) {
      alert('Please capture at least one photo before checking in.');
      return;
    }
    if (!signature) {
      alert('Please obtain customer signature before checking in.');
      return;
    }
    setSaving(true);
    const updated = await bookingApi.checkInBooking(booking.id, checkInPhotos, signature);
    if (updated) setBooking(updated);
    setSaving(false);
    setActiveTab('status');
  }, [booking, checkInPhotos, signature]);

  const getAvailableStatuses = useCallback(() => {
    if (!booking) return [];
    const all = Object.values(BookingStatus);
    if (booking.packageType !== PackageType.INSURANCE_CLAIMS) {
      return all.filter((s) => s !== BookingStatus.NEED_ESTIMATE);
    }
    return all;
  }, [booking]);

  return {
    booking,
    loading,
    activeTab,
    setActiveTab,
    saving,
    editCustomer,
    setEditCustomer,
    editDate,
    setEditDate,
    editTime,
    setEditTime,
    editInsurance,
    setEditInsurance,
    editVehicle,
    setEditVehicle,
    checkInPhotos,
    signature,
    canvasRef,
    depositFile,
    setDepositFile,
    handleSaveDetails,
    handleStatusChange,
    handleDepositUpload,
    handlePhotoCapture,
    startDraw,
    draw,
    endDraw,
    clearSignature,
    handleCheckInSubmit,
    getAvailableStatuses,
  };
}
