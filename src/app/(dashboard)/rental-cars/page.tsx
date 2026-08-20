'use client';

import React, { useEffect } from 'react';
import styles from './page.module.css';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Select } from '@/components/atoms/Select';
import { Badge } from '@/components/atoms/Badge';
import { Pagination } from '@/components/molecules/Pagination';
import { RentalCarStatus } from '@/types';
import { CAR_TYPES, FUEL_TYPES } from '@/constants';
import { mockDealers } from '@/mocks/dealers';
import { useRentalCars } from '@/hooks/rental-cars';
import { useI18n, usePagination } from '@/hooks/common';
import { Plus, X } from 'lucide-react';

export default function RentalCarsPage() {
  const { t, interpolate } = useI18n();

  const {
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
  } = useRentalCars();

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedItems: paginatedCars,
    resetPage,
  } = usePagination(filteredCars);

  useEffect(() => {
    resetPage();
  }, [filter, resetPage]);

  const getDealerName = (dealerId: string) =>
    mockDealers.find((d) => d.id === dealerId)?.name || dealerId;

  const subtitleStats = interpolate(t.rentalCars.subtitleStats, {
    total: rentalCars.length,
    active: activeCt,
    inactive: inactiveCt,
  });

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1>{t.rentalCars.title}</h1>
          <p className={styles.subtitle}>{subtitleStats}</p>
        </div>
        <Button
          variant="primary"
          leftIcon={showAdd ? <X size={16} /> : <Plus size={16} />}
          onClick={() => setShowAdd(!showAdd)}
        >
          {showAdd ? t.rentalCars.cancelBtn : t.rentalCars.addVehicleBtn}
        </Button>
      </div>

      {showAdd && (
        <div className={styles.addCard}>
          <h3>{t.rentalCars.addCardTitle}</h3>
          <div className={styles.formGrid}>
            <Input label={t.rentalCars.make} placeholder="e.g. Toyota" value={newCar.make} onChange={(e) => setNewCar((c) => ({ ...c, make: e.target.value }))} />
            <Input label={t.rentalCars.model} placeholder="e.g. Camry" value={newCar.model} onChange={(e) => setNewCar((c) => ({ ...c, model: e.target.value }))} />
            <Input label={t.rentalCars.year} type="number" value={newCar.year.toString()} onChange={(e) => setNewCar((c) => ({ ...c, year: parseInt(e.target.value) || 0 }))} />
            <Input label={t.rentalCars.vin} placeholder="Vehicle ID Number" value={newCar.vin} onChange={(e) => setNewCar((c) => ({ ...c, vin: e.target.value }))} />
            <Input label={t.rentalCars.mileage} type="number" value={newCar.mileage.toString()} onChange={(e) => setNewCar((c) => ({ ...c, mileage: parseInt(e.target.value) || 0 }))} />
            <Select label={t.rentalCars.carType} placeholder={t.rentalCars.selectCarType} options={CAR_TYPES.map((typeOption) => ({ value: typeOption, label: typeOption }))} value={newCar.carType} onChange={(e) => setNewCar((c) => ({ ...c, carType: e.target.value }))} />
            <Select label={t.rentalCars.fuelType} placeholder={t.rentalCars.selectFuelType} options={FUEL_TYPES.map((fuelOption) => ({ value: fuelOption, label: fuelOption }))} value={newCar.fuelType} onChange={(e) => setNewCar((c) => ({ ...c, fuelType: e.target.value }))} />
          </div>
          <div className={styles.addActions}>
            <Button variant="primary" onClick={handleAddCar}>{t.rentalCars.submitAddBtn}</Button>
          </div>
        </div>
      )}

      <div className={styles.filterRow}>
        {(['all', 'active', 'inactive'] as const).map((f) => (
          <button
            key={f}
            className={`${styles.filterBtn} ${filter === f ? styles.filterActive : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? t.rentalCars.filters.all : f === 'active' ? t.rentalCars.filters.active : t.rentalCars.filters.inactive}
            <span className={styles.filterCount}>
              {f === 'all' ? rentalCars.length : f === 'active' ? activeCt : inactiveCt}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className={styles.loading}>{t.rentalCars.loading}</div>
      ) : filteredCars.length === 0 ? (
        <div className={styles.empty}>{t.rentalCars.empty}</div>
      ) : (
        <>
          <div className={styles.carGrid}>
            {paginatedCars.map((car) => (
              <div
                key={car.id}
                className={`${styles.carCard} ${car.status === RentalCarStatus.INACTIVE ? styles.carInactive : ''}`}
              >
                <div className={styles.carHeader}>
                  <div className={styles.carName}>
                    {car.year} {car.make} {car.model}
                  </div>
                  <Badge variant={car.status === RentalCarStatus.ACTIVE ? 'success' : 'danger'}>
                    {car.status === RentalCarStatus.ACTIVE ? t.rentalCarStatus.active : t.rentalCarStatus.inactive}
                  </Badge>
                </div>
                <div className={styles.carDetails}>
                  <div className={styles.carDetail}>
                    <span className={styles.carLabel}>{t.rentalCars.card.type}</span>
                    <span>{car.carType}</span>
                  </div>
                  <div className={styles.carDetail}>
                    <span className={styles.carLabel}>{t.rentalCars.card.fuel}</span>
                    <span>{car.fuelType}</span>
                  </div>
                  <div className={styles.carDetail}>
                    <span className={styles.carLabel}>{t.rentalCars.card.mileage}</span>
                    <span>{car.mileage.toLocaleString()} mi</span>
                  </div>
                  <div className={styles.carDetail}>
                    <span className={styles.carLabel}>{t.rentalCars.card.vin}</span>
                    <span className={styles.mono}>{car.vin}</span>
                  </div>
                  <div className={styles.carDetail}>
                    <span className={styles.carLabel}>{t.rentalCars.card.dealer}</span>
                    <span>{getDealerName(car.dealerId)}</span>
                  </div>
                </div>
                <div className={styles.carActions}>
                  <Button
                    variant={car.status === RentalCarStatus.ACTIVE ? 'danger' : 'primary'}
                    size="sm"
                    onClick={() => handleToggleStatus(car)}
                  >
                    {car.status === RentalCarStatus.ACTIVE ? t.rentalCarStatus.deactivate : t.rentalCarStatus.activate}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
}
