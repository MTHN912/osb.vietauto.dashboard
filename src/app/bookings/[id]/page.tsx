'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';
import { StatusPill } from '@/components/atoms/StatusPill';
import { Button } from '@/components/atoms/Button';
import { Badge } from '@/components/atoms/Badge';
import {
  getCustomerFullName,
  getVehicleName,
  getRentalCarName,
  formatDate,
  formatTime,
  packageRequiresVehicle,
  packageRequiresInsurance,
  packageRequiresRentalCar,
} from '@/utils';
import { useBookingDetail } from '@/hooks/bookings';
import { useI18n } from '@/hooks/common';

export default function BookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { t, interpolate } = useI18n();
  const { booking, loading } = useBookingDetail(params.id as string);

  if (loading) {
    return <div className={styles.loading}>{t.common.loading}</div>;
  }

  if (!booking) {
    return (
      <div className={styles.notFound}>
        <h2>{t.bookings.detail.notFoundTitle}</h2>
        <p>{t.bookings.detail.notFoundSubtitle}</p>
        <Button onClick={() => router.push('/bookings')}>{t.bookings.detail.backBtn}</Button>
      </div>
    );
  }

  const bookingTitle = interpolate(t.bookings.detail.bookingTitle, { id: booking.id });

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <button className={styles.backBtn} onClick={() => router.push('/bookings')}>
            {t.bookings.detail.backBtn}
          </button>
          <div className={styles.titleRow}>
            <h1>{bookingTitle}</h1>
            <StatusPill status={booking.status} />
          </div>
          <Badge variant="accent">{booking.packageType}</Badge>
        </div>
        <Link href={`/bookings/${booking.id}/edit`}>
          <Button variant="secondary">{t.bookings.detail.editBtn}</Button>
        </Link>
      </div>

      <div className={styles.sections}>
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>{t.bookings.detail.customerInfo}</h3>
          <div className={styles.fieldGrid}>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>{t.bookings.detail.fullName}</span>
              <span className={styles.fieldValue}>{getCustomerFullName(booking.customer)}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>{t.bookings.detail.email}</span>
              <span className={styles.fieldValue}>{booking.customer.email}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>{t.bookings.detail.phone}</span>
              <span className={styles.fieldValue}>{booking.customer.phone}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>{t.bookings.detail.address}</span>
              <span className={styles.fieldValue}>{booking.customer.address}</span>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>{t.bookings.detail.serviceInfo}</h3>
          <div className={styles.fieldGrid}>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>{t.bookings.detail.package}</span>
              <span className={styles.fieldValue}>{booking.packageType}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>{t.bookings.detail.service}</span>
              <span className={styles.fieldValue}>{booking.service.name}</span>
            </div>
          </div>
        </section>

        {packageRequiresVehicle(booking.packageType) && booking.vehicle && (
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>{t.bookings.detail.vehicleInfo}</h3>
            <div className={styles.fieldGrid}>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>{t.bookings.detail.vehicle}</span>
                <span className={styles.fieldValue}>{getVehicleName(booking.vehicle)}</span>
              </div>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>{t.bookings.detail.vin}</span>
                <span className={`${styles.fieldValue} ${styles.mono}`}>{booking.vehicle.vin}</span>
              </div>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>{t.bookings.detail.mileage}</span>
                <span className={styles.fieldValue}>{booking.vehicle.mileage.toLocaleString()} mi</span>
              </div>
            </div>
          </section>
        )}

        {packageRequiresInsurance(booking.packageType) && booking.insurance && (
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>{t.bookings.detail.insuranceInfo}</h3>
            <div className={styles.fieldGrid}>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>{t.bookings.detail.insuranceCompany}</span>
                <span className={styles.fieldValue}>{booking.insurance.insuranceCompany}</span>
              </div>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>{t.bookings.detail.claimNumber}</span>
                <span className={`${styles.fieldValue} ${styles.mono}`}>{booking.insurance.claimNumber}</span>
              </div>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>{t.bookings.detail.policyNumber}</span>
                <span className={`${styles.fieldValue} ${styles.mono}`}>{booking.insurance.policyNumber}</span>
              </div>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>{t.bookings.detail.dateOfLoss}</span>
                <span className={styles.fieldValue}>{formatDate(booking.insurance.dateOfLoss)}</span>
              </div>
            </div>
          </section>
        )}

        {packageRequiresRentalCar(booking.packageType) && booking.rentalCar && (
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>{t.bookings.detail.rentalInfo}</h3>
            <div className={styles.fieldGrid}>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>{t.bookings.detail.vehicle}</span>
                <span className={styles.fieldValue}>{getRentalCarName(booking.rentalCar)}</span>
              </div>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>{t.bookings.detail.vin}</span>
                <span className={`${styles.fieldValue} ${styles.mono}`}>{booking.rentalCar.vin}</span>
              </div>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>{t.bookings.detail.carType}</span>
                <span className={styles.fieldValue}>{booking.rentalCar.carType}</span>
              </div>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>{t.bookings.detail.fuelType}</span>
                <span className={styles.fieldValue}>{booking.rentalCar.fuelType}</span>
              </div>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>{t.bookings.detail.mileage}</span>
                <span className={styles.fieldValue}>{booking.rentalCar.mileage.toLocaleString()} mi</span>
              </div>
            </div>
          </section>
        )}

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>{t.bookings.detail.bookingInfo}</h3>
          <div className={styles.fieldGrid}>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>{t.bookings.detail.bookingDate}</span>
              <span className={styles.fieldValue}>{formatDate(booking.bookingDate)}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>{t.bookings.detail.bookingTime}</span>
              <span className={styles.fieldValue}>{formatTime(booking.bookingTime)}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>{t.bookings.detail.status}</span>
              <StatusPill status={booking.status} />
            </div>
            {booking.depositCheckUrl && (
              <div className={styles.field}>
                <span className={styles.fieldLabel}>{t.bookings.detail.depositCheck}</span>
                <span className={styles.fieldValue}>✅ {t.common.uploaded}</span>
              </div>
            )}
            {booking.checkInPhotos.length > 0 && (
              <div className={styles.field}>
                <span className={styles.fieldLabel}>{t.bookings.detail.checkInPhotos}</span>
                <span className={styles.fieldValue}>
                  {interpolate(t.common.photoCount, { count: booking.checkInPhotos.length })}
                </span>
              </div>
            )}
            {booking.customerSignature && (
              <div className={styles.field}>
                <span className={styles.fieldLabel}>{t.bookings.detail.customerSignature}</span>
                <span className={styles.fieldValue}>✅ {t.common.signed}</span>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
