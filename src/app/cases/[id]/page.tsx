'use client';

import React from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';
import { Avatar } from '@/components/atoms/Avatar';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Select } from '@/components/atoms/Select';
import { StatusPill } from '@/components/atoms/StatusPill';
import { DatePicker } from '@/components/molecules/DatePicker';
import { CaseStatus } from '@/types';
import { CASE_STATUS_LIST } from '@/constants';
import { mockStaff } from '@/mocks/staff';
import {
  getCustomerFullName,
  getVehicleName,
  formatDate,
} from '@/utils';
import { useCaseDetail } from '@/hooks/cases';
import { useI18n } from '@/hooks/common';
import {
  ArrowLeft,
  Calendar,
  Car,
  Clock,
  Edit2,
  FileText,
  Shield,
  User,
  X,
  Check,
} from 'lucide-react';

export default function CaseDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t, interpolate } = useI18n();

  const isEditParam = searchParams.get('edit') === 'true';
  const {
    caseItem,
    loading,
    saving,
    daysOpen,
    isEditing,
    setIsEditing,
    editForm,
    setEditForm,
    handleSave,
  } = useCaseDetail(params.id as string, isEditParam);

  if (loading) {
    return <div className={styles.loading}>{t.common.loading}</div>;
  }

  if (!caseItem) {
    return (
      <div className={styles.notFound}>
        <h2>{t.cases.detail.notFoundTitle}</h2>
        <p>{t.cases.detail.notFoundSubtitle}</p>
        <Button onClick={() => router.push('/cases')}>
          {t.cases.detail.backBtn}
        </Button>
      </div>
    );
  }

  const staffOptions = mockStaff.map((st) => ({
    value: st.id,
    label: st.name,
  }));

  const statusOptions = CASE_STATUS_LIST.map((st) => ({
    value: st,
    label: st,
  }));

  const daysOpenText =
    daysOpen === 1
      ? t.cases.detail.daysOpenSingular
      : interpolate(t.cases.detail.daysOpen, { days: daysOpen });

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => router.push('/cases')}>
          <ArrowLeft size={18} />
          <span>{t.cases.detail.backBtn}</span>
        </button>

        <div className={styles.titleRow}>
          <div className={styles.titleGroup}>
            <h1 className={styles.title}>{interpolate(t.cases.detail.title, { id: caseItem.id })}</h1>
            <StatusPill status={caseItem.status} />
            <div className={`${styles.daysOpenBadge} ${daysOpen > 7 ? styles.daysOpenAlert : ''}`}>
              <Clock size={14} />
              <span>{daysOpenText}</span>
            </div>
          </div>

          <div className={styles.actionBtns}>
            {isEditing ? (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsEditing(false)}
              >
                <X size={15} />
                <span>{t.cases.detail.cancelEditBtn}</span>
              </Button>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                <Edit2 size={15} />
                <span>{t.cases.detail.editBtn}</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {isEditing ? (
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>
              <Edit2 size={18} />
              {t.cases.detail.sections.editCaseInfo}
            </h2>
          </div>

          <div className={styles.editForm}>
            <div className={styles.grid2}>
              <Select
                label={t.cases.detail.fields.status}
                options={statusOptions}
                value={editForm.status}
                onChange={(e) =>
                  setEditForm((prev) => ({
                    ...prev,
                    status: e.target.value as CaseStatus,
                  }))
                }
              />

              <Select
                label={t.cases.detail.fields.assignee}
                options={staffOptions}
                value={editForm.assigneeId}
                onChange={(e) =>
                  setEditForm((prev) => ({
                    ...prev,
                    assigneeId: e.target.value,
                  }))
                }
              />
            </div>

            <div className={styles.grid2}>
              <DatePicker
                label={t.cases.detail.fields.inspectionDate}
                value={editForm.inspectionDate}
                onChange={(date) =>
                  setEditForm((prev) => ({
                    ...prev,
                    inspectionDate: date,
                  }))
                }
                placeholder="mm/dd/yyyy"
              />

              <Input
                label={t.cases.detail.fields.claimType}
                value={editForm.reasons}
                onChange={(e) =>
                  setEditForm((prev) => ({
                    ...prev,
                    reasons: e.target.value,
                  }))
                }
              />
            </div>

            <div className={styles.textareaWrapper}>
              <label className={styles.textareaLabel}>
                {t.cases.detail.fields.notes}
              </label>
              <textarea
                className={styles.textarea}
                value={editForm.notes}
                onChange={(e) =>
                  setEditForm((prev) => ({
                    ...prev,
                    notes: e.target.value,
                  }))
                }
                placeholder={t.cases.detail.fields.notesPlaceholder}
              />
            </div>

            <div className={styles.formActions}>
              <Button
                variant="secondary"
                onClick={() => setIsEditing(false)}
                disabled={saving}
              >
                {t.cases.detail.cancelEditBtn}
              </Button>
              <Button
                variant="primary"
                onClick={handleSave}
                disabled={saving}
              >
                <Check size={16} />
                <span>{saving ? t.cases.detail.savingBtn : t.cases.detail.saveBtn}</span>
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.contentGrid}>
          <div className={styles.mainColumn}>
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>
                  <Shield size={18} />
                  {t.cases.detail.sections.insuranceInfo}
                </h2>
              </div>
              <div className={styles.grid2}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>{t.cases.detail.fields.insuranceCompany}</span>
                  <span className={styles.infoValue}>{caseItem.insurance.insuranceCompany}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>{t.cases.detail.fields.claimNumber}</span>
                  <span className={`${styles.infoValue} ${styles.mono}`}>{caseItem.insurance.claimNumber}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>{t.cases.detail.fields.policyNumber}</span>
                  <span className={`${styles.infoValue} ${styles.mono}`}>{caseItem.insurance.policyNumber || '—'}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>{t.cases.detail.fields.dateOfLoss}</span>
                  <span className={styles.infoValue}>
                    {caseItem.insurance.dateOfLoss ? formatDate(caseItem.insurance.dateOfLoss) : '—'}
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>{t.cases.detail.fields.claimType}</span>
                  <span className={styles.infoValue}>{caseItem.reasons}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>{t.cases.detail.linkedBooking}</span>
                  <Link href={`/bookings/${caseItem.bookingId}`} className={styles.linkValue}>
                    {caseItem.bookingId} ({t.cases.detail.viewBooking})
                  </Link>
                </div>
              </div>
            </section>

            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>
                  <Calendar size={18} />
                  {t.cases.detail.sections.workflowInfo}
                </h2>
              </div>
              <div className={styles.grid2}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>{t.cases.detail.fields.startDate}</span>
                  <span className={styles.infoValue}>{formatDate(caseItem.startDate)}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>{t.cases.detail.fields.inspectionDate}</span>
                  <span className={styles.infoValue}>
                    {caseItem.inspectionDate ? formatDate(caseItem.inspectionDate) : t.common.pending}
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>{t.cases.detail.fields.paymentType}</span>
                  <span className={styles.infoValue}>{caseItem.paymentType || 'insurance'}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>{t.cases.detail.daysOpenBadge}</span>
                  <span className={styles.infoValue}>{daysOpenText}</span>
                </div>
              </div>

              {caseItem.notes && (
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>{t.cases.detail.fields.notes}</span>
                  <div className={styles.notesBox}>{caseItem.notes}</div>
                </div>
              )}
            </section>
          </div>

          <div className={styles.sideColumn}>
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>
                  <User size={18} />
                  {t.cases.detail.sections.customerInfo}
                </h2>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>{t.cases.detail.fields.customerName}</span>
                <span className={styles.infoValue}>
                  <Link href={`/customers/${caseItem.customer.id}`} className={styles.linkValue}>
                    {getCustomerFullName(caseItem.customer)}
                  </Link>
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>{t.cases.detail.fields.phone}</span>
                <span className={styles.infoValue}>{caseItem.customer.phone || '—'}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>{t.cases.detail.fields.email}</span>
                <span className={styles.infoValue}>{caseItem.customer.email || '—'}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>{t.cases.detail.fields.address}</span>
                <span className={styles.infoValue}>{caseItem.customer.address || '—'}</span>
              </div>
            </section>

            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>
                  <Car size={18} />
                  {t.cases.detail.sections.vehicleInfo}
                </h2>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>{t.cases.detail.fields.vehicle}</span>
                <span className={styles.infoValue}>{getVehicleName(caseItem.vehicle)}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>{t.cases.detail.fields.vin}</span>
                <span className={`${styles.infoValue} ${styles.mono}`}>{caseItem.vehicle.vin}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>{t.cases.detail.fields.mileage}</span>
                <span className={styles.infoValue}>
                  {caseItem.vehicle.mileage ? `${caseItem.vehicle.mileage.toLocaleString()} mi` : '—'}
                </span>
              </div>
            </section>

            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>
                  <FileText size={18} />
                  {t.cases.detail.fields.assignee}
                </h2>
              </div>
              <div className={styles.assigneeBox}>
                <Avatar
                  name={caseItem.assignee.name}
                  initials={caseItem.assignee.initials}
                  avatarUrl={caseItem.assignee.avatarUrl}
                  color={caseItem.assignee.color}
                  size="md"
                />
                <div className={styles.assigneeInfo}>
                  <span className={styles.assigneeName}>{caseItem.assignee.name}</span>
                  <span className={styles.assigneeRole}>{caseItem.assignee.role}</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}
