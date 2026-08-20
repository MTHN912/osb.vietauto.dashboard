'use client';

import React from 'react';
import styles from './NewCaseModal.module.css';
import { CaseStatus } from '@/types';
import { mockStaff } from '@/mocks/staff';
import { Avatar } from '@/components/atoms/Avatar';
import { Button } from '@/components/atoms/Button';
import { DatePicker } from '@/components/molecules/DatePicker';
import { CASE_STATUS_LIST } from '@/constants';
import { X, Search, Check, Car, Shield, AlertCircle } from 'lucide-react';
import { useNewCaseModal } from '@/hooks/cases';
import { useI18n } from '@/hooks/common';

export interface NewCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  dealerId?: string;
  onCaseCreated: () => void;
}

export function NewCaseModal({
  isOpen,
  onClose,
  dealerId,
  onCaseCreated,
}: NewCaseModalProps) {
  const { t } = useI18n();
  const {
    filteredBookings,
    loading,
    searchQuery,
    setSearchQuery,
    selectedBookingId,
    setSelectedBookingId,
    selectedStaffId,
    setSelectedStaffId,
    selectedBooking,
    startDate,
    setStartDate,
    inspectionDate,
    setInspectionDate,
    status,
    setStatus,
    notes,
    setNotes,
    submitting,
    error,
    handleCreateCase,
  } = useNewCaseModal({
    isOpen,
    dealerId,
    onClose,
    onCaseCreated,
  });

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>{t.cases.modal.title}</h2>
            <p className={styles.subtitle}>{t.cases.modal.subtitle}</p>
          </div>
          <button type="button" className={styles.closeBtn} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className={styles.errorBanner}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <div className={styles.body}>
          <div className={styles.leftCol}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionTitle}>{t.cases.modal.step1}</span>
              <span className={styles.countText}>
                {filteredBookings.length} {t.cases.modal.available}
              </span>
            </div>

            <div className={styles.searchBox}>
              <Search size={15} className={styles.searchIcon} />
              <input
                type="text"
                placeholder={t.cases.modal.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
            </div>

            <div className={styles.bookingList}>
              {loading ? (
                <div className={styles.loadingState}>{t.cases.modal.loadingBookings}</div>
              ) : filteredBookings.length === 0 ? (
                <div className={styles.emptyState}>{t.cases.modal.noBookingsFound}</div>
              ) : (
                filteredBookings.map((b) => {
                  const isSelected = selectedBookingId === b.id;
                  return (
                    <div
                      key={b.id}
                      className={`${styles.bookingCard} ${isSelected ? styles.bookingSelected : ''}`}
                      onClick={() => setSelectedBookingId(b.id)}
                    >
                      <div className={styles.bookingTop}>
                        <div className={styles.bookingIdBadge}>{b.id}</div>
                        <div className={styles.bookingService}>{b.service.name}</div>
                      </div>

                      <div className={styles.bookingCustomer}>
                        <span className={styles.customerName}>
                          {b.customer.firstName} {b.customer.lastName}
                        </span>
                        <span className={styles.customerPhone}>{b.customer.phone}</span>
                      </div>

                      <div className={styles.bookingDetails}>
                        {b.vehicle && (
                          <div className={styles.detailItem}>
                            <Car size={13} className={styles.detailIcon} />
                            <span>
                              {b.vehicle.year} {b.vehicle.make} {b.vehicle.model}
                            </span>
                          </div>
                        )}
                        {b.insurance && (
                          <div className={styles.detailItem}>
                            <Shield size={13} className={styles.detailIcon} />
                            <span>
                              {b.insurance.insuranceCompany} ({b.insurance.claimNumber})
                            </span>
                          </div>
                        )}
                      </div>

                      {isSelected && (
                        <div className={styles.checkBadge}>
                          <Check size={14} />
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className={styles.rightCol}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionTitle}>{t.cases.modal.step2}</span>
            </div>

            {selectedBooking ? (
              <div className={styles.formContent}>
                <div className={styles.summaryCard}>
                  <div className={styles.summaryLabel}>{t.cases.modal.selectedBooking}</div>
                  <div className={styles.summaryTitle}>
                    {selectedBooking.customer.firstName} {selectedBooking.customer.lastName} •{' '}
                    {selectedBooking.id}
                  </div>
                  <div className={styles.summarySub}>
                    {selectedBooking.vehicle?.year} {selectedBooking.vehicle?.make}{' '}
                    {selectedBooking.vehicle?.model} • {selectedBooking.insurance?.insuranceCompany}
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>{t.cases.modal.assignStaff}</label>
                  <div className={styles.staffGrid}>
                    {mockStaff.map((staff) => {
                      const isSelected = selectedStaffId === staff.id;
                      return (
                        <button
                          key={staff.id}
                          type="button"
                          className={`${styles.staffCard} ${isSelected ? styles.staffSelected : ''}`}
                          onClick={() => setSelectedStaffId(staff.id)}
                        >
                          <Avatar
                            name={staff.name}
                            initials={staff.initials}
                            avatarUrl={staff.avatarUrl}
                            color={staff.color}
                            size="sm"
                          />
                          <div className={styles.staffMeta}>
                            <span className={styles.staffName}>{staff.name}</span>
                            <span className={styles.staffRole}>{staff.role}</span>
                          </div>
                          {isSelected && <Check size={14} className={styles.staffCheck} />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <DatePicker
                      label={t.cases.modal.startDate}
                      value={startDate}
                      onChange={setStartDate}
                      required
                      placeholder="mm/dd/yyyy"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <DatePicker
                      label={t.cases.modal.inspectionDate}
                      value={inspectionDate}
                      onChange={setInspectionDate}
                      placeholder="mm/dd/yyyy"
                      popoverAlign="right"
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>{t.cases.modal.initialStatus}</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as CaseStatus)}
                    className={styles.select}
                  >
                    {CASE_STATUS_LIST.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>{t.cases.modal.notes}</label>
                  <textarea
                    rows={3}
                    placeholder={t.cases.modal.notesPlaceholder}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className={styles.textarea}
                  />
                </div>
              </div>
            ) : (
              <div className={styles.noSelection}>
                {t.cases.modal.noSelection}
              </div>
            )}
          </div>
        </div>

        <div className={styles.footer}>
          <Button variant="outline" onClick={onClose} disabled={submitting}>
            {t.common.cancel}
          </Button>
          <Button
            variant="primary"
            onClick={handleCreateCase}
            disabled={!selectedBookingId || submitting}
          >
            {submitting ? t.cases.modal.submittingBtn : t.cases.modal.submitBtn}
          </Button>
        </div>
      </div>
    </div>
  );
}
