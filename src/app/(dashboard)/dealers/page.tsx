'use client';

import React from 'react';
import styles from './page.module.css';
import { Button } from '@/components/atoms/Button';
import { Pagination } from '@/components/molecules/Pagination';
import { useDealers } from '@/hooks/dealers';
import { useI18n, usePagination } from '@/hooks/common';

export default function DealersPage() {
  const { t } = useI18n();

  const {
    dealers,
    loading,
    editingId,
    editHours,
    saving,
    startEdit,
    cancelEdit,
    handleSave,
    updateHour,
  } = useDealers();

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedItems: paginatedDealers,
  } = usePagination(dealers);

  const getDayName = (day: string) => {
    switch (day.toLowerCase()) {
      case 'monday':
        return t.days.monday;
      case 'tuesday':
        return t.days.tuesday;
      case 'wednesday':
        return t.days.wednesday;
      case 'thursday':
        return t.days.thursday;
      case 'friday':
        return t.days.friday;
      case 'saturday':
        return t.days.saturday;
      case 'sunday':
        return t.days.sunday;
      default:
        return day;
    }
  };

  if (loading) {
    return <div className={styles.loading}>{t.dealers.loading}</div>;
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>{t.dealers.title}</h1>
        <p className={styles.subtitle}>{t.dealers.subtitle}</p>
      </div>

      <div className={styles.dealerGrid}>
        {paginatedDealers.map((dealer) => (
          <div key={dealer.id} className={styles.dealerCard}>
            <div className={styles.dealerHeader}>
              <div>
                <h2 className={styles.dealerName}>{dealer.name}</h2>
                <p className={styles.dealerAddress}>{dealer.address}</p>
                <p className={styles.dealerPhone}>📞 {dealer.phone}</p>
              </div>
              {editingId !== dealer.id && (
                <Button variant="secondary" size="sm" onClick={() => startEdit(dealer)}>
                  {t.dealers.editHoursBtn}
                </Button>
              )}
            </div>

            <div className={styles.hoursSection}>
              <h3>{t.dealers.operatingHours}</h3>
              <div className={styles.hoursList}>
                {(editingId === dealer.id ? editHours : dealer.operatingHours).map(
                  (hours, index) => (
                    <div key={hours.dayOfWeek} className={styles.hoursRow}>
                      <span className={styles.dayName}>{getDayName(hours.dayOfWeek)}</span>
                      {editingId === dealer.id ? (
                        <div className={styles.hoursEdit}>
                          <label className={styles.closedToggle}>
                            <input
                              type="checkbox"
                              checked={hours.isClosed}
                              onChange={(e) => updateHour(index, 'isClosed', e.target.checked)}
                            />
                            {t.dealers.closed}
                          </label>
                          {!hours.isClosed && (
                            <>
                              <input
                                type="time"
                                value={hours.open}
                                onChange={(e) => updateHour(index, 'open', e.target.value)}
                                className={styles.timeInput}
                              />
                              <span>{t.common.to}</span>
                              <input
                                type="time"
                                value={hours.close}
                                onChange={(e) => updateHour(index, 'close', e.target.value)}
                                className={styles.timeInput}
                              />
                            </>
                          )}
                        </div>
                      ) : (
                        <span className={`${styles.hoursValue} ${hours.isClosed ? styles.closed : ''}`}>
                          {hours.isClosed ? t.dealers.closed : `${hours.open} — ${hours.close}`}
                        </span>
                      )}
                    </div>
                  )
                )}
              </div>

              {editingId === dealer.id && (
                <div className={styles.editActions}>
                  <Button variant="ghost" size="sm" onClick={cancelEdit}>
                    {t.common.cancel}
                  </Button>
                  <Button variant="primary" size="sm" onClick={() => handleSave(dealer.id)} disabled={saving}>
                    {saving ? t.dealers.savingBtn : t.dealers.saveBtn}
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
