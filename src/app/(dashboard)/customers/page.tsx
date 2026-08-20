'use client';

import React, { useEffect } from 'react';
import styles from './page.module.css';
import { CustomerTable } from '@/components/organisms/CustomerTable';
import { Pagination } from '@/components/molecules/Pagination';
import { useCustomers } from '@/hooks/customers';
import { useI18n, usePagination } from '@/hooks/common';
import { Users, Car, Calendar, Search, X } from 'lucide-react';

export default function CustomersPage() {
  const { t } = useI18n();

  const {
    filteredCustomers,
    loading,
    searchQuery,
    setSearchQuery,
    stats,
    getCustomerBookingsCount,
  } = useCustomers();

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedItems: paginatedCustomers,
    resetPage,
  } = usePagination(filteredCustomers);

  useEffect(() => {
    resetPage();
  }, [searchQuery, resetPage]);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1>{t.customers.title}</h1>
          <p className={styles.subtitle}>{t.customers.subtitle}</p>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Users size={24} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statTitle}>{t.customers.stats.totalCustomers}</span>
            <span className={styles.statValue}>{stats.totalCustomers}</span>
            <span className={styles.statDesc}>{t.customers.stats.totalCustomersDesc}</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Car size={24} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statTitle}>{t.customers.stats.totalVehicles}</span>
            <span className={styles.statValue}>{stats.totalVehicles}</span>
            <span className={styles.statDesc}>{t.customers.stats.totalVehiclesDesc}</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Calendar size={24} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statTitle}>{t.customers.stats.activeBookings}</span>
            <span className={styles.statValue}>{stats.activeBookings}</span>
            <span className={styles.statDesc}>{t.customers.stats.activeBookingsDesc}</span>
          </div>
        </div>
      </div>

      <div className={styles.searchBar}>
        <Search size={18} className={styles.searchIcon} />
        <input
          type="text"
          className={styles.searchInput}
          placeholder={t.customers.searchPlaceholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button
            type="button"
            className={styles.clearSearchBtn}
            onClick={() => setSearchQuery('')}
            title={t.common.clear}
          >
            <X size={16} />
          </button>
        )}
      </div>

      <CustomerTable
        customers={paginatedCustomers}
        loading={loading}
        getBookingsCount={getCustomerBookingsCount}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
