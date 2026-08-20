'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { RentalCar, RentalCarStatus } from '@/types';
import * as rentalCarApi from '@/api/rentalCars';
import { useDealerContext } from '@/context/DealerContext';

export function useRentalCars() {
  const { selectedDealer } = useDealerContext();
  const [rentalCars, setRentalCars] = useState<RentalCar[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [newCar, setNewCar] = useState({
    carType: '',
    fuelType: '',
    model: '',
    make: '',
    year: new Date().getFullYear(),
    mileage: 0,
    vin: '',
  });

  const fetchRentalCars = useCallback(async () => {
    setLoading(true);
    try {
      const dealerId = selectedDealer === 'global' ? undefined : selectedDealer;
      const data = await rentalCarApi.getRentalCars(dealerId);
      setRentalCars(data);
    } catch (err) {
      console.error('Failed to fetch rental cars', err);
    } finally {
      setLoading(false);
    }
  }, [selectedDealer]);

  useEffect(() => {
    fetchRentalCars();
  }, [fetchRentalCars]);

  const filteredCars = useMemo(() => {
    return rentalCars.filter((car) => {
      if (filter === 'active') return car.status === RentalCarStatus.ACTIVE;
      if (filter === 'inactive') return car.status === RentalCarStatus.INACTIVE;
      return true;
    });
  }, [rentalCars, filter]);

  const handleToggleStatus = useCallback(async (car: RentalCar) => {
    const newStatus =
      car.status === RentalCarStatus.ACTIVE
        ? RentalCarStatus.INACTIVE
        : RentalCarStatus.ACTIVE;
    const updated = await rentalCarApi.updateRentalCar(car.id, { status: newStatus });
    if (updated) {
      setRentalCars((prev) => prev.map((c) => (c.id === car.id ? updated : c)));
    }
  }, []);

  const handleAddCar = useCallback(async () => {
    const created = await rentalCarApi.createRentalCar({
      ...newCar,
      status: RentalCarStatus.ACTIVE,
      dealerId: selectedDealer === 'global' ? 'dealer-1' : selectedDealer,
    });
    setRentalCars((prev) => [...prev, created]);
    setShowAdd(false);
    setNewCar({
      carType: '',
      fuelType: '',
      model: '',
      make: '',
      year: new Date().getFullYear(),
      mileage: 0,
      vin: '',
    });
  }, [newCar, selectedDealer]);

  const activeCt = useMemo(
    () => rentalCars.filter((c) => c.status === RentalCarStatus.ACTIVE).length,
    [rentalCars]
  );
  const inactiveCt = useMemo(
    () => rentalCars.filter((c) => c.status === RentalCarStatus.INACTIVE).length,
    [rentalCars]
  );

  return {
    rentalCars,
    filteredCars,
    loading,
    showAdd,
    setShowAdd,
    filter,
    setFilter,
    newCar,
    setNewCar,
    handleToggleStatus,
    handleAddCar,
    activeCt,
    inactiveCt,
    fetchRentalCars,
  };
}
