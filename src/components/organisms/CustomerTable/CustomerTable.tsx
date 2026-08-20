'use client';

import React from 'react';
import Link from 'next/link';
import styles from './CustomerTable.module.css';
import { Customer } from '@/types';
import { Avatar } from '@/components/atoms/Avatar';
import { getCustomerFullName } from '@/utils';
import { useI18n } from '@/hooks/common';
import { Eye, Car, Calendar } from 'lucide-react';

interface CustomerTableProps {
  customers: Customer[];
  loading?: boolean;
  getBookingsCount: (customerId: string) => number;
}

export function CustomerTable({
  customers,
  loading = false,
  getBookingsCount,
}: CustomerTableProps) {
  const { t } = useI18n();

  if (loading) {
    return (
      <div className={styles.tableContainer}>
        <div className={styles.loading}>{t.customers.table.loading}</div>
      </div>
    );
  }

  if (customers.length === 0) {
    return (
      <div className={styles.tableContainer}>
        <div className={styles.empty}>
          <div className={styles.emptyTitle}>{t.customers.table.emptyTitle}</div>
          <div className={styles.emptySubtitle}>{t.customers.table.emptySubtitle}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.tableContainer}>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>{t.customers.table.customer}</th>
              <th className={styles.th}>{t.customers.table.phone}</th>
              <th className={styles.th}>{t.customers.table.email}</th>
              <th className={styles.th}>{t.customers.table.address}</th>
              <th className={styles.th}>{t.customers.table.vehicles}</th>
              <th className={styles.th}>{t.customers.table.bookings}</th>
              <th className={styles.th}>{t.customers.table.actions}</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => {
              const fullName = getCustomerFullName(c);
              const vehiclesCount = c.vehicles ? c.vehicles.length : 0;
              const bookingsCount = getBookingsCount(c.id);

              return (
                <tr key={c.id} className={styles.tr}>
                  <td className={styles.td}>
                    <div className={styles.customerCell}>
                      <Avatar name={fullName} size="md" />
                      <div className={styles.customerInfo}>
                        <span className={styles.customerName}>{fullName}</span>
                        <span className={styles.customerId}>{c.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className={styles.td}>
                    <span className={styles.phone}>{c.phone || '—'}</span>
                  </td>
                  <td className={styles.td}>
                    <span className={styles.email}>{c.email || '—'}</span>
                  </td>
                  <td className={styles.td}>
                    <span className={styles.address}>{c.address || '—'}</span>
                  </td>
                  <td className={styles.td}>
                    <span className={styles.badgeCell}>
                      <Car size={14} />
                      {vehiclesCount}
                    </span>
                  </td>
                  <td className={styles.td}>
                    <span className={styles.badgeCell}>
                      <Calendar size={14} />
                      {bookingsCount}
                    </span>
                  </td>
                  <td className={styles.td}>
                    <div className={styles.actionsCell}>
                      <Link href={`/customers/${c.id}`} className={styles.actionBtn}>
                        <Eye size={14} />
                        <span>{t.customers.table.viewDetail}</span>
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
