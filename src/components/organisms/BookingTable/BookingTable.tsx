'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import styles from './BookingTable.module.css';
import { Booking, BookingStatus, PackageType } from '@/types';
import { StatusPill } from '@/components/atoms/StatusPill';
import { ColumnFilterPopover, FilterOption } from '@/components/molecules/ColumnFilterPopover';
import { getCustomerFullName, getVehicleName, getRentalCarName, formatDate } from '@/utils';
import { ChevronDown, Eye, Edit2 } from 'lucide-react';
import { BOOKING_STATUS_LIST, INSURANCE_COMPANIES, SERVICES_BY_PACKAGE } from '@/constants';
import { useI18n } from '@/hooks/common';

interface BookingTableProps {
  bookings: Booking[];
  packageType: PackageType;
  loading?: boolean;
  selectedStatuses?: BookingStatus[];
  onStatusFilterChange?: (statuses: BookingStatus[]) => void;
  selectedInsurance?: string[];
  onInsuranceFilterChange?: (ins: string[]) => void;
  selectedClaimTypes?: string[];
  onClaimTypeFilterChange?: (claims: string[]) => void;
}

export function BookingTable({
  bookings,
  packageType,
  loading,
  selectedStatuses = [],
  onStatusFilterChange,
  selectedInsurance = [],
  onInsuranceFilterChange,
  selectedClaimTypes = [],
  onClaimTypeFilterChange,
}: BookingTableProps) {
  const { t } = useI18n();
  const [openPopover, setOpenPopover] = useState<string | null>(null);

  const showVehicle = packageType !== PackageType.RENT_A_CAR;
  const showRentalVehicle = packageType === PackageType.RENT_A_CAR;
  const showInsurance = packageType === PackageType.INSURANCE_CLAIMS;

  const togglePopover = (name: string) => {
    setOpenPopover((prev) => (prev === name ? null : name));
  };

  const statusOptions: FilterOption[] = BOOKING_STATUS_LIST.map((st) => ({
    id: st,
    label: st,
    badge: <StatusPill status={st} />,
  }));

  const insuranceOptions: FilterOption[] = INSURANCE_COMPANIES.map((ins) => ({
    id: ins,
    label: ins,
  }));

  const servicesForPackage = SERVICES_BY_PACKAGE[packageType] || [];
  const claimTypeOptions: FilterOption[] = servicesForPackage.map((svc) => ({
    id: svc,
    label: svc,
  }));

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <p>{t.bookings.table.loading}</p>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className={styles.empty}>
        <p>{t.bookings.table.empty}</p>
      </div>
    );
  }

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>{t.bookings.table.bookingId}</th>
            <th>{t.bookings.table.customer}</th>
            <th>
              <div className={styles.headerDropdownWrapper}>
                <button
                  type="button"
                  className={styles.headerDropdownBtn}
                  onClick={() => togglePopover('status')}
                >
                  <span>{t.bookings.table.status}</span>
                  <ChevronDown size={14} className={`${styles.thIcon} ${openPopover === 'status' ? styles.rotated : ''}`} />
                  {selectedStatuses.length > 0 && <span className={styles.filterDot} />}
                </button>

                {onStatusFilterChange && (
                  <ColumnFilterPopover
                    title={t.bookings.table.statusFilterTitle}
                    isOpen={openPopover === 'status'}
                    onClose={() => setOpenPopover(null)}
                    options={statusOptions}
                    selectedIds={selectedStatuses}
                    onChange={(ids) => onStatusFilterChange(ids as BookingStatus[])}
                  />
                )}
              </div>
            </th>

            {showVehicle && <th>{t.bookings.table.vehicle}</th>}
            {showVehicle && <th>{t.bookings.table.vin}</th>}
            {showRentalVehicle && <th>{t.bookings.table.rentalVehicle}</th>}

            {showInsurance && (
              <th>
                <div className={styles.headerDropdownWrapper}>
                  <button
                    type="button"
                    className={styles.headerDropdownBtn}
                    onClick={() => togglePopover('insurance')}
                  >
                    <span>{t.bookings.table.insurance}</span>
                    <ChevronDown size={14} className={`${styles.thIcon} ${openPopover === 'insurance' ? styles.rotated : ''}`} />
                    {selectedInsurance.length > 0 && <span className={styles.filterDot} />}
                  </button>

                  {onInsuranceFilterChange && (
                    <ColumnFilterPopover
                      title={t.bookings.table.insuranceFilterTitle}
                      isOpen={openPopover === 'insurance'}
                      onClose={() => setOpenPopover(null)}
                      options={insuranceOptions}
                      selectedIds={selectedInsurance}
                      onChange={onInsuranceFilterChange}
                      searchable
                    />
                  )}
                </div>
              </th>
            )}

            {showInsurance && (
              <th>
                <div className={styles.headerDropdownWrapper}>
                  <button
                    type="button"
                    className={styles.headerDropdownBtn}
                    onClick={() => togglePopover('claimType')}
                  >
                    <span>{t.bookings.table.claimType}</span>
                    <ChevronDown size={14} className={`${styles.thIcon} ${openPopover === 'claimType' ? styles.rotated : ''}`} />
                    {selectedClaimTypes.length > 0 && <span className={styles.filterDot} />}
                  </button>

                  {onClaimTypeFilterChange && (
                    <ColumnFilterPopover
                      title={t.bookings.table.claimTypeFilterTitle}
                      isOpen={openPopover === 'claimType'}
                      onClose={() => setOpenPopover(null)}
                      options={claimTypeOptions}
                      selectedIds={selectedClaimTypes}
                      onChange={onClaimTypeFilterChange}
                    />
                  )}
                </div>
              </th>
            )}

            <th>{t.bookings.table.bookingDate}</th>
            <th>{t.bookings.table.actions}</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id}>
              <td className={styles.idCell}>{booking.id}</td>
              <td>
                <div className={styles.customerCell}>
                  <span className={styles.customerName}>{getCustomerFullName(booking.customer)}</span>
                  <span className={styles.customerPhone}>{booking.customer.phone}</span>
                </div>
              </td>
              <td>
                <StatusPill status={booking.status} />
              </td>
              {showVehicle && (
                <td>{booking.vehicle ? getVehicleName(booking.vehicle) : '—'}</td>
              )}
              {showVehicle && (
                <td className={styles.vinCell}>{booking.vehicle?.vin || '—'}</td>
              )}
              {showRentalVehicle && (
                <td>{booking.rentalCar ? getRentalCarName(booking.rentalCar) : '—'}</td>
              )}
              {showInsurance && (
                <td>{booking.insurance?.insuranceCompany || '—'}</td>
              )}
              {showInsurance && (
                <td>{booking.service.name}</td>
              )}
              <td>{formatDate(booking.bookingDate)}</td>
              <td className={styles.actions}>
                <Link
                  href={`/bookings/${booking.id}`}
                  className={styles.actionBtn}
                  title={t.bookings.table.viewTooltip}
                >
                  <Eye size={15} />
                </Link>
                <Link
                  href={`/bookings/${booking.id}/edit`}
                  className={styles.actionBtn}
                  title={t.bookings.table.editTooltip}
                >
                  <Edit2 size={15} />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
