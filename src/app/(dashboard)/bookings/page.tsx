'use client';

import React, { useEffect, useMemo } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import { Tabs } from '@/components/atoms/Tabs';
import { Button } from '@/components/atoms/Button';
import { TimeFilterPopover } from '@/components/molecules/TimeFilterPopover';
import { Pagination } from '@/components/molecules/Pagination';
import { BookingTable } from '@/components/organisms/BookingTable';
import { BookingFilterPanel } from '@/components/organisms/BookingFilterPanel';
import { PackageType, BookingStatus } from '@/types';
import { useBookings, useBookingFilters } from '@/hooks/bookings';
import { useI18n, usePagination } from '@/hooks/common';
import { Plus } from 'lucide-react';

export default function BookingsPage() {
  const { t } = useI18n();

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
          <TimeFilterPopover
            value={filters.timeFilter || defaultTimeFilter}
            onChange={(tf) => updateFilter('timeFilter', tf)}
          />
        </div>
      </div>

      <div className={styles.tableSection}>
        <BookingTable
          bookings={paginatedBookings}
          packageType={activeTab}
          loading={loading}
          selectedStatuses={filters.statuses}
          onStatusFilterChange={(statuses) =>
            updateFilter('statuses', statuses.length > 0 ? (statuses as BookingStatus[]) : undefined)
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
    </div>
  );
}
