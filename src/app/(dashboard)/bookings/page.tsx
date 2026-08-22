'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import { Tabs } from '@/components/atoms/Tabs';
import { Button } from '@/components/atoms/Button';
import { ViewToggle, ViewMode } from '@/components/atoms/ViewToggle';
import { TimeFilterPopover } from '@/components/molecules/TimeFilterPopover';
import { Pagination } from '@/components/molecules/Pagination';
import { BookingTable } from '@/components/organisms/BookingTable';
import { BookingFilterPanel } from '@/components/organisms/BookingFilterPanel';
import { ScheduleCalendar, CalendarEvent } from '@/components/organisms/ScheduleCalendar';
import { PackageType, BookingStatus, Booking } from '@/types';
import { useBookings, useBookingFilters } from '@/hooks/bookings';
import { useI18n, usePagination } from '@/hooks/common';
import { Plus } from 'lucide-react';

export default function BookingsPage() {
  const { t } = useI18n();
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  const {
    activeTab,
    setActiveTab,
    bookings,
    loading,
    fetchBookings,
  } = useBookings(PackageType.INSURANCE_CLAIMS);

  const {
    filters,
    updateFilter,
    clearFilters,
    isOpen: filterOpen,
    togglePanel: toggleFilterOpen,
    hasActiveFilters,
    defaultTimeFilter,
  } = useBookingFilters();

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedItems: paginatedBookings,
    resetPage,
  } = usePagination(bookings);

  const tabs = useMemo(
    () => [
      { id: PackageType.INSURANCE_CLAIMS, label: t.packages.insuranceClaims },
      { id: PackageType.CAR_SERVICE_REPAIR, label: t.packages.carServiceRepair },
      { id: PackageType.RENT_A_CAR, label: t.packages.rentACar },
      { id: PackageType.CAR_DETAILING, label: t.packages.carDetailing },
    ],
    [t]
  );

  useEffect(() => {
    fetchBookings(filters);
    resetPage();
  }, [fetchBookings, filters, activeTab, resetPage]);

  // Map bookings to calendar events
  const calendarEvents: CalendarEvent<Booking>[] = useMemo(() => {
    return bookings.map((b) => {
      const customerName = `${b.customer.firstName} ${b.customer.lastName}`.trim();
      let subtitle = b.service.name;
      if (b.vehicle) {
        subtitle += ` • ${b.vehicle.year} ${b.vehicle.make} ${b.vehicle.model}`;
      } else if (b.rentalCar) {
        subtitle += ` • ${b.rentalCar.year} ${b.rentalCar.make} ${b.rentalCar.model}`;
      }

      let variant: CalendarEvent['statusVariant'] = 'primary';
      if (b.status === BookingStatus.CHECK_IN) variant = 'warning';
      else if (b.status === BookingStatus.COMPLETE) variant = 'success';
      else if (b.status === BookingStatus.CANCELLED) variant = 'danger';
      else if (b.status === BookingStatus.NEED_ESTIMATE) variant = 'purple';

      return {
        id: b.id,
        date: b.bookingDate || b.rentalStartDate || b.createdAt.split('T')[0],
        time: b.bookingTime,
        title: `${customerName} (${b.id})`,

        subtitle,
        status: b.status,
        statusVariant: variant,
        badge: b.packageType,
        data: b,
        href: `/bookings/${b.id}`,
      };
    });
  }, [bookings]);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1>{t.bookings.title}</h1>
          <p className={styles.subtitle}>{t.bookings.subtitle}</p>
        </div>
        <Link href="/bookings/new">
          <Button variant="primary" leftIcon={<Plus size={16} />}>
            {t.bookings.newBooking}
          </Button>
        </Link>
      </div>

      <BookingFilterPanel
        filters={filters}
        onFilterChange={updateFilter}
        onClear={clearFilters}
        isOpen={filterOpen}
        onToggle={toggleFilterOpen}
        hasActiveFilters={hasActiveFilters}
      />

      <div className={styles.toolbar}>
        <div className={styles.toolbarTabs}>
          <Tabs
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={(id) => setActiveTab(id as PackageType)}
          />
        </div>

        <div className={styles.toolbarControls}>
          <ViewToggle value={viewMode} onChange={setViewMode} />

          <TimeFilterPopover
            value={filters.timeFilter || defaultTimeFilter}
            onChange={(tf) => updateFilter('timeFilter', tf)}
          />
        </div>
      </div>

      {viewMode === 'list' ? (
        <div className={styles.tableSection}>
          <BookingTable
            bookings={paginatedBookings}
            packageType={activeTab}
            loading={loading}
            selectedStatuses={filters.statuses}
            onStatusFilterChange={(statuses) =>
              updateFilter(
                'statuses',
                statuses.length > 0 ? (statuses as BookingStatus[]) : undefined
              )
            }
            selectedInsurance={filters.insuranceCompanies}
            onInsuranceFilterChange={(companies) =>
              updateFilter('insuranceCompanies', companies.length > 0 ? companies : undefined)
            }
            selectedClaimTypes={filters.claimTypes}
            onClaimTypeFilterChange={(claims) =>
              updateFilter('claimTypes', claims.length > 0 ? claims : undefined)
            }
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      ) : (
        <ScheduleCalendar<Booking>
          events={calendarEvents}
          initialDate={bookings.length > 0 ? bookings[0].bookingDate : undefined}
          agendaTitle={t.calendarView.allBookingsOnDate}
        />
      )}
    </div>
  );
}

