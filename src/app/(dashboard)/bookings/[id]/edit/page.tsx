'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './page.module.css';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { StatusPill } from '@/components/atoms/StatusPill';
import { DatePicker } from '@/components/molecules/DatePicker';
import { BookingStatus } from '@/types';
import { packageRequiresInsurance } from '@/utils';
import { useEditBooking, EditTab } from '@/hooks/bookings';
import { useI18n } from '@/hooks/common';

export default function EditBookingPage() {
  const params = useParams();
  const router = useRouter();
  const { t, interpolate } = useI18n();
  const {
    booking,
    loading,
    activeTab,
    setActiveTab,
    saving,
    editCustomer,
    setEditCustomer,
    editDate,
    setEditDate,
    editTime,
    setEditTime,
    editInsurance,
    setEditInsurance,
    editVehicle,
    setEditVehicle,
    checkInPhotos,
    signature,
    canvasRef,
    depositFile,
    setDepositFile,
    handleSaveDetails,
    handleStatusChange,
    handleDepositUpload,
    handlePhotoCapture,
    startDraw,
    draw,
    endDraw,
    clearSignature,
    handleCheckInSubmit,
    getAvailableStatuses,
  } = useEditBooking(params.id as string);

  if (loading) {
    return <div className={styles.loading}>{t.common.loading}</div>;
  }

  if (!booking) {
    return (
      <div className={styles.notFound}>
        <h2>{t.bookings.detail.notFoundTitle}</h2>
        <Button onClick={() => router.push('/bookings')}>{t.bookings.edit.backBtn}</Button>
      </div>
    );
  }

  const title = interpolate(t.bookings.edit.title, { id: booking.id });

  const getStatusLabel = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.BOOKED_IN:
        return t.bookingStatus.bookedIn;
      case BookingStatus.CHECK_IN:
        return t.bookingStatus.checkIn;
      case BookingStatus.COMPLETE:
        return t.bookingStatus.complete;
      case BookingStatus.CANCELLED:
        return t.bookingStatus.cancelled;
      case BookingStatus.NEED_ESTIMATE:
        return t.bookingStatus.needEstimate;
      default:
        return status;
    }
  };

  return (
    <div className={styles.page}>
      <button className={styles.backBtn} onClick={() => router.push('/bookings')}>
        {t.bookings.edit.backBtn}
      </button>
      <div className={styles.titleRow}>
        <h1>{title}</h1>
        <StatusPill status={booking.status} />
      </div>

      <div className={styles.tabRow}>
        {(['details', 'checkin', 'status'] as EditTab[]).map((tab) => (
          <button
            key={tab}
            className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'details' && t.bookings.edit.tabs.details}
            {tab === 'checkin' && t.bookings.edit.tabs.checkIn}
            {tab === 'status' && t.bookings.edit.tabs.status}
          </button>
        ))}
      </div>

      <div className={styles.card}>
        {activeTab === 'details' && (
          <div>
            <h2>{t.bookings.edit.detailsSection.customerInfo}</h2>
            <div className={styles.formGrid}>
              <Input label={t.bookings.new.sections.firstName} value={editCustomer.firstName} onChange={(e) => setEditCustomer((c) => ({ ...c, firstName: e.target.value }))} />
              <Input label={t.bookings.new.sections.lastName} value={editCustomer.lastName} onChange={(e) => setEditCustomer((c) => ({ ...c, lastName: e.target.value }))} />
              <Input label={t.bookings.new.sections.email} value={editCustomer.email} onChange={(e) => setEditCustomer((c) => ({ ...c, email: e.target.value }))} />
              <Input label={t.bookings.new.sections.phone} value={editCustomer.phone} onChange={(e) => setEditCustomer((c) => ({ ...c, phone: e.target.value }))} />
              <Input label={t.bookings.new.sections.address} value={editCustomer.address} onChange={(e) => setEditCustomer((c) => ({ ...c, address: e.target.value }))} />
            </div>

            {booking.vehicle && (
              <>
                <h2 className={styles.subSection}>{t.bookings.edit.detailsSection.vehicleInfo}</h2>
                <div className={styles.formGrid}>
                  <Input label={t.bookings.new.sections.vin} value={editVehicle.vin} onChange={(e) => setEditVehicle((v) => ({ ...v, vin: e.target.value }))} />
                  <Input label={t.bookings.new.sections.make} value={editVehicle.make} onChange={(e) => setEditVehicle((v) => ({ ...v, make: e.target.value }))} />
                  <Input label={t.bookings.new.sections.model} value={editVehicle.model} onChange={(e) => setEditVehicle((v) => ({ ...v, model: e.target.value }))} />
                  <Input label={t.bookings.new.sections.year} type="number" value={editVehicle.year.toString()} onChange={(e) => setEditVehicle((v) => ({ ...v, year: parseInt(e.target.value) || 0 }))} />
                  <Input label={t.bookings.new.sections.mileage} type="number" value={editVehicle.mileage.toString()} onChange={(e) => setEditVehicle((v) => ({ ...v, mileage: parseInt(e.target.value) || 0 }))} />
                </div>
              </>
            )}

            {packageRequiresInsurance(booking.packageType) && booking.insurance && (
              <>
                <h2 className={styles.subSection}>{t.bookings.edit.detailsSection.insuranceInfo}</h2>
                <div className={styles.formGrid}>
                  <Input label={t.bookings.new.sections.claimNumber} value={editInsurance.claimNumber} onChange={(e) => setEditInsurance((i) => ({ ...i, claimNumber: e.target.value }))} />
                  <Input label={t.bookings.new.sections.policyNumber} value={editInsurance.policyNumber} onChange={(e) => setEditInsurance((i) => ({ ...i, policyNumber: e.target.value }))} />
                  <Input label={t.bookings.new.sections.insuranceCompany} value={editInsurance.insuranceCompany} onChange={(e) => setEditInsurance((i) => ({ ...i, insuranceCompany: e.target.value }))} />
                  <DatePicker
                    label={t.bookings.new.sections.dateOfLoss}
                    value={editInsurance.dateOfLoss}
                    onChange={(date) => setEditInsurance((i) => ({ ...i, dateOfLoss: date }))}
                  />
                  <Input
                    label={t.bookings.new.sections.timeOfLoss}
                    type="time"
                    value={editInsurance.timeOfLoss}
                    onChange={(e) => setEditInsurance((i) => ({ ...i, timeOfLoss: e.target.value }))}
                  />
                </div>
              </>
            )}

            <h2 className={styles.subSection}>{t.bookings.edit.detailsSection.bookingDateTime}</h2>
            <div className={styles.formGrid}>
              <DatePicker
                label={t.bookings.new.sections.bookingDate}
                value={editDate}
                onChange={setEditDate}
              />
              <Input label={t.bookings.new.sections.bookingTime} type="time" value={editTime} onChange={(e) => setEditTime(e.target.value)} />
            </div>

            <div className={styles.saveRow}>
              <Button variant="primary" onClick={handleSaveDetails} disabled={saving}>
                {saving ? t.bookings.edit.detailsSection.savingBtn : t.bookings.edit.detailsSection.saveBtn}
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'checkin' && (
          <div>
            <h2>{t.bookings.edit.checkInSection.title}</h2>
            <p className={styles.helpText}>{t.bookings.edit.checkInSection.helpText}</p>

            <div className={styles.checkInSection}>
              <h3>{t.bookings.edit.checkInSection.photosTitle}</h3>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoCapture}
                className={styles.fileInput}
                id="photo-capture"
              />
              <label htmlFor="photo-capture" className={styles.fileLabel}>
                {t.bookings.edit.checkInSection.addPhotosBtn}
              </label>
              {checkInPhotos.length > 0 && (
                <div className={styles.photoGrid}>
                  {checkInPhotos.map((photo, i) => (
                    <div key={i} className={styles.photoThumb}>
                      {photo.startsWith('data:') ? (
                        <Image src={photo} alt={`Check-in photo ${i + 1}`} width={120} height={90} unoptimized style={{ objectFit: 'cover' }} />
                      ) : (
                        <div className={styles.photoPlaceholder}>📷 {photo}</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              <p className={styles.photoCount}>
                {interpolate(t.common.photoCount, { count: checkInPhotos.length })}
              </p>
            </div>

            <div className={styles.checkInSection}>
              <h3>{t.bookings.edit.checkInSection.signatureTitle}</h3>
              <div className={styles.signatureWrapper}>
                <canvas
                  ref={canvasRef}
                  width={500}
                  height={200}
                  className={styles.signatureCanvas}
                  onMouseDown={startDraw}
                  onMouseMove={draw}
                  onMouseUp={endDraw}
                  onMouseLeave={endDraw}
                />
                <div className={styles.signatureActions}>
                  <Button variant="ghost" size="sm" onClick={clearSignature}>{t.bookings.edit.checkInSection.clearBtn}</Button>
                  {signature && <span className={styles.signatureOk}>✅ {t.common.signed}</span>}
                </div>
              </div>
            </div>

            <div className={styles.saveRow}>
              <Button
                variant="primary"
                onClick={handleCheckInSubmit}
                disabled={saving || checkInPhotos.length === 0 || !signature}
              >
                {saving ? t.common.submitting : t.bookings.edit.checkInSection.completeCheckInBtn}
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'status' && (
          <div>
            <h2>{t.bookings.edit.statusSection.title}</h2>
            <div className={styles.statusCurrent}>
              <span>{t.bookings.edit.statusSection.currentStatus}</span>
              <StatusPill status={booking.status} />
            </div>

            <div className={styles.statusGrid}>
              {getAvailableStatuses().map((status) => (
                <button
                  key={status}
                  className={`${styles.statusBtn} ${booking.status === status ? styles.statusBtnActive : ''}`}
                  onClick={() => handleStatusChange(status)}
                  disabled={booking.status === status || saving}
                >
                  {getStatusLabel(status)}
                  {status === BookingStatus.CHECK_IN && ` ${t.bookings.edit.statusSection.requiresCheckIn}`}
                  {status === BookingStatus.COMPLETE && ` ${t.bookings.edit.statusSection.requiresDeposit}`}
                </button>
              ))}
            </div>

            <div className={styles.depositSection}>
              <h3>{t.bookings.edit.statusSection.depositTitle}</h3>
              {booking.depositCheckUrl ? (
                <div className={styles.depositDone}>
                  <span>{t.bookings.edit.statusSection.depositUploaded} {booking.depositCheckUrl}</span>
                </div>
              ) : (
                <div className={styles.depositUpload}>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setDepositFile(e.target.files?.[0] || null)}
                    className={styles.fileInput}
                    id="deposit-upload"
                  />
                  <label htmlFor="deposit-upload" className={styles.fileLabel}>
                    {t.bookings.edit.statusSection.choosePdf}
                  </label>
                  {depositFile && (
                    <div className={styles.depositFileInfo}>
                      <span>📄 {depositFile.name}</span>
                      <Button variant="primary" size="sm" onClick={handleDepositUpload} disabled={saving}>
                        {t.bookings.edit.statusSection.uploadBtn}
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
