'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';
import { Avatar } from '@/components/atoms/Avatar';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { StatusPill } from '@/components/atoms/StatusPill';
import {
  getCustomerFullName,
  getVehicleName,
  getRentalCarName,
  formatDate,
  formatTime,
} from '@/utils';
import { useCustomerDetail } from '@/hooks/customers';
import { useI18n } from '@/hooks/common';
import {
  ArrowLeft,
  Car,
  Calendar,
  KeyRound,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  Check,
  ChevronRight,
  X,
} from 'lucide-react';

export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { t, interpolate } = useI18n();
  const {
    customer,
    loading,
    selectedVehicleId,
    setSelectedVehicleId,
    filteredServiceBookings,
    filteredCases,
    selectedVehicle,
    vehicleStats,
  } = useCustomerDetail(params.id as string);

  if (loading) {
    return <div className={styles.loading}>{t.common.loading}</div>;
  }

  if (!customer) {
    return (
      <div className={styles.notFound}>
        <h2>{t.customers.detail.notFoundTitle}</h2>
        <p>{t.customers.detail.notFoundSubtitle}</p>
        <Button onClick={() => router.push('/customers')}>
          {t.customers.detail.backBtn}
        </Button>
      </div>
    );
  }

  const fullName = getCustomerFullName(customer);
  const totalServiceBookingsCount = customer.serviceBookings.length;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <button
          className={styles.backBtn}
          onClick={() => router.push('/customers')}
        >
          <ArrowLeft size={18} />
          <span>{t.customers.detail.backBtn}</span>
        </button>

        <div className={styles.customerCard}>
          <div className={styles.customerMain}>
            <Avatar name={fullName} size="lg" />
            <div className={styles.customerInfo}>
              <h1 className={styles.customerName}>{fullName}</h1>
              <div className={styles.customerContact}>
                {customer.phone && (
                  <span className={styles.contactItem}>
                    <Phone size={14} />
                    {customer.phone}
                  </span>
                )}
                {customer.email && (
                  <span className={styles.contactItem}>
                    <Mail size={14} />
                    {customer.email}
                  </span>
                )}
                {customer.address && (
                  <span className={styles.contactItem}>
                    <MapPin size={14} />
                    {customer.address}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className={styles.customerMetrics}>
            <div className={styles.metricItem}>
              <span className={styles.metricValue}>{customer.vehicles.length}</span>
              <span className={styles.metricLabel}>{t.customers.detail.totalVehicles}</span>
            </div>
            <div className={styles.metricItem}>
              <span className={styles.metricValue}>{customer.totalBookingsCount}</span>
              <span className={styles.metricLabel}>{t.customers.detail.totalBookings}</span>
            </div>
            <div className={styles.metricItem}>
              <span className={styles.metricValue}>{customer.cases.length}</span>
              <span className={styles.metricLabel}>{t.customers.detail.totalCases}</span>
            </div>
            <div className={styles.metricItem}>
              <span className={styles.metricValue}>{customer.rentalHistory.length}</span>
              <span className={styles.metricLabel}>{t.customers.detail.totalRentals}</span>
            </div>
          </div>
        </div>
      </div>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitleGroup}>
            <h2 className={styles.sectionTitle}>
              <Car size={20} />
              {t.customers.detail.vehiclesSection.title}
            </h2>
            <p className={styles.sectionSubtitle}>
              {t.customers.detail.vehiclesSection.subtitle}
            </p>
          </div>
          {selectedVehicleId !== 'all' && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setSelectedVehicleId('all')}
            >
              {t.customers.detail.showAllVehiclesBtn}
            </Button>
          )}
        </div>

        {customer.vehicles.length === 0 ? (
          <div className={styles.emptySection}>
            {t.customers.detail.vehiclesSection.noVehicles}
          </div>
        ) : (
          <div className={styles.vehicleGrid}>
            {customer.vehicles.map((v) => {
              const isSelected = selectedVehicleId === v.id;
              const stats = vehicleStats[v.id] || { totalBookings: 0 };
              const bookingsLabel = interpolate(t.customers.detail.vehicleBookingsCount, {
                count: stats.totalBookings,
              });

              return (
                <div
                  key={v.id}
                  className={`${styles.vehicleCard} ${isSelected ? styles.vehicleCardSelected : ''}`}
                  onClick={() =>
                    setSelectedVehicleId(isSelected ? 'all' : v.id)
                  }
                  title={t.customers.detail.clickToFilter}
                >
                  <div className={styles.vehicleCardHeader}>
                    <div className={styles.vehicleCardNameGroup}>
                      <Badge variant="accent">{v.year}</Badge>
                      <span className={styles.vehicleCardName}>{getVehicleName(v)}</span>
                    </div>
                    <div className={styles.vehicleCardStats}>
                      <span className={styles.vehicleBookingsBadge}>
                        <Calendar size={12} />
                        {bookingsLabel}
                      </span>
                      {isSelected && <Check size={16} color="var(--primary, #2563eb)" />}
                    </div>
                  </div>

                  <div className={styles.vehicleDetails}>
                    <div className={styles.vehicleDetailItem}>
                      <span className={styles.vehicleDetailLabel}>
                        {t.customers.detail.vehiclesSection.vin}
                      </span>
                      <span className={`${styles.vehicleDetailValue} ${styles.mono}`}>
                        {v.vin}
                      </span>
                    </div>
                    <div className={styles.vehicleDetailItem}>
                      <span className={styles.vehicleDetailLabel}>
                        {t.customers.detail.vehiclesSection.mileage}
                      </span>
                      <span className={styles.vehicleDetailValue}>
                        {v.mileage.toLocaleString()} mi
                      </span>
                    </div>
                  </div>

                  <div className={styles.vehicleCardFooter}>
                    <span>
                      {stats.lastServiced
                        ? interpolate(t.customers.detail.lastService, {
                            date: formatDate(stats.lastServiced),
                          })
                        : t.customers.detail.neverServiced}
                    </span>
                    <span className={styles.filterActionText}>
                      {isSelected ? t.common.clear : t.customers.table.viewDetail}
                      <ChevronRight size={12} />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitleGroup}>
            <h2 className={styles.sectionTitle}>
              <Calendar size={20} />
              {t.customers.detail.serviceHistorySection.title}
            </h2>
            <p className={styles.sectionSubtitle}>
              {t.customers.detail.serviceHistorySection.subtitle}
            </p>
          </div>
        </div>

        {customer.vehicles.length > 0 && (
          <div className={styles.filterBar}>
            <div className={styles.filterPills}>
              <button
                type="button"
                className={`${styles.filterPill} ${selectedVehicleId === 'all' ? styles.filterPillActive : ''}`}
                onClick={() => setSelectedVehicleId('all')}
              >
                {interpolate(t.customers.detail.allVehiclesTab, {
                  count: totalServiceBookingsCount,
                })}
              </button>

              {customer.vehicles.map((v) => {
                const count = (vehicleStats[v.id]?.totalBookings) || 0;
                const isSelected = selectedVehicleId === v.id;

                return (
                  <button
                    key={v.id}
                    type="button"
                    className={`${styles.filterPill} ${isSelected ? styles.filterPillActive : ''}`}
                    onClick={() => setSelectedVehicleId(v.id)}
                  >
                    <Car size={13} />
                    <span>{v.year} {v.make} {v.model} ({count})</span>
                  </button>
                );
              })}
            </div>

            {selectedVehicle && (
              <div className={styles.activeFilterNotice}>
                <span>
                  {interpolate(t.customers.detail.activeFilterNotice, {
                    count: filteredServiceBookings.length,
                    vehicle: `${selectedVehicle.year} ${selectedVehicle.make} ${selectedVehicle.model}`,
                  })}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedVehicleId('all')}
                  className={styles.backBtn}
                  title={t.customers.detail.showAllVehiclesBtn}
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>
        )}

        {selectedVehicle && (
          <div className={styles.selectedVehicleBanner}>
            <div className={styles.selectedVehicleInfo}>
              <Badge variant="accent">{t.customers.detail.selectedVehicleBanner}</Badge>
              <span className={styles.selectedVehicleName}>
                {selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model}
              </span>
              <div className={styles.selectedVehicleMeta}>
                <span>VIN: <strong className={styles.mono}>{selectedVehicle.vin}</strong></span>
                <span>•</span>
                <span>Odo: <strong>{selectedVehicle.mileage.toLocaleString()} mi</strong></span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedVehicleId('all')}
            >
              {t.customers.detail.showAllVehiclesBtn}
            </Button>
          </div>
        )}

        {filteredServiceBookings.length === 0 ? (
          <div className={styles.emptySection}>
            {selectedVehicleId === 'all'
              ? t.customers.detail.serviceHistorySection.noBookings
              : t.customers.detail.serviceHistorySection.noVehicleBookings}
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>{t.customers.detail.serviceHistorySection.bookingId}</th>
                  <th className={styles.th}>{t.customers.detail.serviceHistorySection.package}</th>
                  <th className={styles.th}>{t.customers.detail.serviceHistorySection.service}</th>
                  <th className={styles.th}>{t.customers.detail.serviceHistorySection.vehicle}</th>
                  <th className={styles.th}>{t.customers.detail.serviceHistorySection.date}</th>
                  <th className={styles.th}>{t.customers.detail.serviceHistorySection.status}</th>
                </tr>
              </thead>
              <tbody>
                {filteredServiceBookings.map((b) => (
                  <tr key={b.id} className={styles.tr}>
                    <td className={styles.td}>
                      <Link href={`/bookings/${b.id}`} className={styles.linkBooking}>
                        {b.id}
                      </Link>
                    </td>
                    <td className={styles.td}>
                      <Badge variant="default">{b.packageType}</Badge>
                    </td>
                    <td className={styles.td}>{b.service?.name || '—'}</td>
                    <td className={styles.td}>
                      {b.vehicle ? (
                        <button
                          type="button"
                          className={styles.backBtn}
                          onClick={() => b.vehicle && setSelectedVehicleId(b.vehicle.id)}
                          title={t.customers.detail.clickToFilter}
                        >
                          <strong>{getVehicleName(b.vehicle)}</strong>
                        </button>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className={styles.td}>
                      {formatDate(b.bookingDate)} {formatTime(b.bookingTime)}
                    </td>
                    <td className={styles.td}>
                      <StatusPill status={b.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitleGroup}>
            <h2 className={styles.sectionTitle}>
              <ShieldCheck size={20} />
              {t.customers.detail.casesSection.title}
            </h2>
            <p className={styles.sectionSubtitle}>
              {t.customers.detail.casesSection.subtitle}
            </p>
          </div>
        </div>

        {filteredCases.length === 0 ? (
          <div className={styles.emptySection}>
            {selectedVehicleId === 'all'
              ? t.customers.detail.casesSection.noCases
              : t.customers.detail.casesSection.noVehicleCases}
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>{t.customers.detail.casesSection.caseId}</th>
                  <th className={styles.th}>{t.customers.detail.casesSection.bookingId}</th>
                  <th className={styles.th}>{t.customers.detail.casesSection.insurance}</th>
                  <th className={styles.th}>{t.customers.detail.casesSection.vehicle}</th>
                  <th className={styles.th}>{t.customers.detail.casesSection.claimType}</th>
                  <th className={styles.th}>{t.customers.detail.casesSection.inspectionDate}</th>
                  <th className={styles.th}>{t.customers.detail.casesSection.assignee}</th>
                  <th className={styles.th}>{t.customers.detail.casesSection.status}</th>
                </tr>
              </thead>
              <tbody>
                {filteredCases.map((c) => (
                  <tr key={c.id} className={styles.tr}>
                    <td className={styles.td}>
                      <Link href="/cases" className={styles.linkBooking}>
                        {c.id}
                      </Link>
                    </td>
                    <td className={styles.td}>
                      <Link href={`/bookings/${c.bookingId}`} className={styles.linkBooking}>
                        {c.bookingId}
                      </Link>
                    </td>
                    <td className={styles.td}>
                      <div>
                        <strong>{c.insurance.insuranceCompany}</strong>
                        <div className={`${styles.mono} ${styles.vehicleDetailLabel}`}>
                          {c.insurance.claimNumber}
                        </div>
                      </div>
                    </td>
                    <td className={styles.td}>
                      {c.vehicle ? (
                        <button
                          type="button"
                          className={styles.backBtn}
                          onClick={() => c.vehicle && setSelectedVehicleId(c.vehicle.id)}
                          title={t.customers.detail.clickToFilter}
                        >
                          <strong>{getVehicleName(c.vehicle)}</strong>
                        </button>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className={styles.td}>
                      <Badge variant="default">{c.reasons}</Badge>
                    </td>
                    <td className={styles.td}>
                      {c.inspectionDate ? formatDate(c.inspectionDate) : '—'}
                    </td>
                    <td className={styles.td}>
                      <div className={styles.contactItem}>
                        <Avatar name={c.assignee.name} size="sm" />
                        <span>{c.assignee.name}</span>
                      </div>
                    </td>
                    <td className={styles.td}>
                      <StatusPill status={c.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitleGroup}>
            <h2 className={styles.sectionTitle}>
              <KeyRound size={20} />
              {t.customers.detail.rentalHistorySection.title}
            </h2>
            <p className={styles.sectionSubtitle}>
              {t.customers.detail.rentalHistorySection.subtitle}
            </p>
          </div>
        </div>

        {customer.rentalHistory.length === 0 ? (
          <div className={styles.emptySection}>
            {t.customers.detail.rentalHistorySection.noRentals}
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>{t.customers.detail.rentalHistorySection.bookingId}</th>
                  <th className={styles.th}>{t.customers.detail.rentalHistorySection.rentalCar}</th>
                  <th className={styles.th}>{t.customers.detail.rentalHistorySection.carType}</th>
                  <th className={styles.th}>{t.customers.detail.rentalHistorySection.fuelType}</th>
                  <th className={styles.th}>{t.customers.detail.rentalHistorySection.period}</th>
                  <th className={styles.th}>{t.customers.detail.rentalHistorySection.status}</th>
                </tr>
              </thead>
              <tbody>
                {customer.rentalHistory.map((r) => (
                  <tr key={r.bookingId} className={styles.tr}>
                    <td className={styles.td}>
                      <Link href={`/bookings/${r.bookingId}`} className={styles.linkBooking}>
                        {r.bookingId}
                      </Link>
                    </td>
                    <td className={styles.td}>
                      <strong>{getRentalCarName(r.rentalCar)}</strong>
                      <div className={`${styles.mono} ${styles.vehicleDetailLabel}`}>
                        {r.rentalCar.vin}
                      </div>
                    </td>
                    <td className={styles.td}>{r.rentalCar.carType}</td>
                    <td className={styles.td}>{r.rentalCar.fuelType}</td>
                    <td className={styles.td}>
                      {formatDate(r.rentalStartDate)} {t.common.to} {formatDate(r.rentalEndDate)}
                    </td>
                    <td className={styles.td}>
                      <StatusPill status={r.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
