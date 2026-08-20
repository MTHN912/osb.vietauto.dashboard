'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Customer,
  Service,
  PackageType,
  NewBookingFormData,
  BookingStatus,
  RentalCar,
} from '@/types';
import {
  packageRequiresVehicle,
  packageRequiresInsurance,
  packageRequiresRentalCar,
} from '@/utils';
import { useDealerContext } from '@/context/DealerContext';
import * as customerApi from '@/api/customers';
import * as serviceApi from '@/api/services';
import * as rentalCarApi from '@/api/rentalCars';
import * as bookingApi from '@/api/bookings';

export type WizardStep = 'service' | 'customer' | 'insurance' | 'vehicle' | 'rental' | 'datetime' | 'confirm';

export function getSteps(packageType?: PackageType): WizardStep[] {
  const steps: WizardStep[] = ['service', 'customer'];
  if (packageType) {
    if (packageRequiresInsurance(packageType)) steps.push('insurance');
    if (packageRequiresVehicle(packageType)) steps.push('vehicle');
    if (packageRequiresRentalCar(packageType)) steps.push('rental');
  }
  steps.push('datetime', 'confirm');
  return steps;
}

export function useNewBooking() {
  const router = useRouter();
  const { selectedDealer } = useDealerContext();
  const [activeStep, setActiveStep] = useState<WizardStep>('service');
  const [formData, setFormData] = useState<NewBookingFormData>({
    isNewCustomer: false,
  });
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [rentalCars, setRentalCars] = useState<RentalCar[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const isManyService =
    formData.packageType === PackageType.CAR_SERVICE_REPAIR ||
    formData.packageType === PackageType.CAR_DETAILING;

  const steps = getSteps(formData.packageType);

  const sectionRefs = useRef<Record<WizardStep, HTMLElement | null>>({
    service: null,
    customer: null,
    insurance: null,
    vehicle: null,
    rental: null,
    datetime: null,
    confirm: null,
  });

  const registerSection = useCallback((id: WizardStep) => (el: HTMLElement | null) => {
    sectionRefs.current[id] = el;
  }, []);

  useEffect(() => {
    customerApi.getCustomers().then(setCustomers);
  }, []);

  useEffect(() => {
    if (formData.packageType) {
      const dealerId = selectedDealer === 'global' ? undefined : selectedDealer;
      serviceApi.getServicesByPackage(formData.packageType, dealerId).then(setServices);
    }
  }, [formData.packageType, selectedDealer]);

  useEffect(() => {
    if (formData.packageType === PackageType.RENT_A_CAR) {
      const dealerId = selectedDealer === 'global' ? undefined : selectedDealer;
      rentalCarApi.getActiveRentalCars(dealerId).then(setRentalCars);
    }
  }, [formData.packageType, selectedDealer]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id as WizardStep;
            setActiveStep(id);
          }
        });
      },
      { rootMargin: '-20% 0px -80% 0px' }
    );

    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [steps]);

  const scrollToSection = useCallback((id: WizardStep) => {
    const element = sectionRefs.current[id];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const handleSubmit = useCallback(async () => {
    setSubmitting(true);
    try {
      const customer = formData.isNewCustomer
        ? await customerApi.createCustomer(formData.newCustomerData!)
        : formData.customer!;

      const isRental = formData.packageType === PackageType.RENT_A_CAR;
      const primaryDate = isRental
        ? formData.rentalStartDate || formData.bookingDate || ''
        : formData.bookingDate || '';

      await bookingApi.createBooking({
        customer,
        packageType: formData.packageType!,
        service: formData.services?.[0] || formData.service!,
        services: formData.services || (formData.service ? [formData.service] : []),
        bookingDate: primaryDate || undefined,
        bookingTime: isRental ? undefined : (formData.bookingTime || undefined),
        rentalStartDate: isRental ? formData.rentalStartDate : undefined,
        rentalEndDate: isRental ? formData.rentalEndDate : undefined,
        status: BookingStatus.BOOKED_IN,
        dealerId: selectedDealer === 'global' ? 'dealer-1' : selectedDealer,
        vehicle: formData.vehicle
          ? { id: `veh-new-${Date.now()}`, ...formData.vehicle }
          : undefined,
        insurance: formData.insurance
          ? { id: `ins-new-${Date.now()}`, ...formData.insurance }
          : undefined,
        rentalCar: formData.rentalCarId
          ? rentalCars.find((r) => r.id === formData.rentalCarId)
          : undefined,
        customerSignature: undefined,
        depositCheckUrl: undefined,
      });

      router.push('/bookings');
    } catch (err) {
      console.error('Failed to create booking', err);
    } finally {
      setSubmitting(false);
    }
  }, [formData, selectedDealer, rentalCars, router]);

  return {
    activeStep,
    steps,
    formData,
    setFormData,
    customers,
    services,
    rentalCars,
    submitting,
    isCalendarOpen,
    setIsCalendarOpen,
    isManyService,
    registerSection,
    scrollToSection,
    handleSubmit,
  };
}
