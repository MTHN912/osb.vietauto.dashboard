'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import styles from './TimeFilterPopover.module.css';
import { TimeFilterValue, TimeQuickRange } from '@/types';
import { DatePicker } from '@/components/molecules/DatePicker';
import { formatDate } from '@/utils';
import { Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { useOnClickOutside, useI18n } from '@/hooks/common';

export interface TimeFilterPopoverProps {
  value: TimeFilterValue;
  onChange: (val: TimeFilterValue) => void;
  className?: string;
}

export function TimeFilterPopover({ value, onChange, className = '' }: TimeFilterPopoverProps) {
  const { t, interpolate } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(containerRef, () => setIsOpen(false), isOpen);

  const [activeTab, setActiveTab] = useState<'specific' | 'range'>(
    value.mode === 'specific' ? 'specific' : 'range'
  );
  const [specificDate, setSpecificDate] = useState<string>(value.specificDate || '');
  const [fromDate, setFromDate] = useState<string>(value.startDate || '');
  const [toDate, setToDate] = useState<string>(value.endDate || '');

  const quickRanges: { id: TimeQuickRange; label: string }[] = useMemo(
    () => [
      { id: 'today', label: t.timeFilter.today },
      { id: 'this_week', label: t.timeFilter.thisWeek },
      { id: 'this_month', label: t.timeFilter.thisMonth },
      { id: 'this_year', label: t.timeFilter.thisYear },
      { id: 'all_time', label: t.timeFilter.allTime },
    ],
    [t]
  );

  useEffect(() => {
    if (isOpen) {
      setActiveTab(value.mode === 'specific' ? 'specific' : 'range');
      setSpecificDate(value.specificDate || '');
      setFromDate(value.startDate || '');
      setToDate(value.endDate || '');
    }
  }, [isOpen, value]);

  const handleQuickRangeClick = (range: TimeQuickRange) => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    if (range === 'all_time') {
      onChange({
        mode: 'quick',
        quickRange: 'all_time',
        label: t.timeFilter.allTime,
      });
      setIsOpen(false);
      return;
    }

    if (range === 'today') {
      onChange({
        mode: 'quick',
        quickRange: 'today',
        startDate: todayStr,
        endDate: todayStr,
        label: t.timeFilter.today,
      });
      setIsOpen(false);
      return;
    }

    if (range === 'this_week') {
      const day = now.getDay();
      const diffToMonday = now.getDate() - day + (day === 0 ? -6 : 1);
      const monday = new Date(now.setDate(diffToMonday));
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      
      onChange({
        mode: 'quick',
        quickRange: 'this_week',
        startDate: monday.toISOString().split('T')[0],
        endDate: sunday.toISOString().split('T')[0],
        label: t.timeFilter.thisWeek,
      });
      setIsOpen(false);
      return;
    }

    if (range === 'this_month') {
      const year = now.getFullYear();
      const month = now.getMonth();
      const firstDay = new Date(year, month, 1).toISOString().split('T')[0];
      const lastDay = new Date(year, month + 1, 0).toISOString().split('T')[0];
      
      onChange({
        mode: 'quick',
        quickRange: 'this_month',
        startDate: firstDay,
        endDate: lastDay,
        label: t.timeFilter.thisMonth,
      });
      setIsOpen(false);
      return;
    }

    if (range === 'this_year') {
      const year = now.getFullYear();
      const firstDay = `${year}-01-01`;
      const lastDay = `${year}-12-31`;

      onChange({
        mode: 'quick',
        quickRange: 'this_year',
        startDate: firstDay,
        endDate: lastDay,
        label: t.timeFilter.thisYear,
      });
      setIsOpen(false);
      return;
    }
  };

  const handleApply = () => {
    if (activeTab === 'specific') {
      if (!specificDate) {
        onChange({
          mode: 'quick',
          quickRange: 'all_time',
          label: t.timeFilter.allTime,
        });
      } else {
        onChange({
          mode: 'specific',
          specificDate,
          startDate: specificDate,
          endDate: specificDate,
          label: formatDate(specificDate),
        });
      }
    } else {
      if (fromDate && toDate) {
        onChange({
          mode: 'range',
          startDate: fromDate,
          endDate: toDate,
          label: `${formatDate(fromDate)} - ${formatDate(toDate)}`,
        });
      } else if (fromDate) {
        onChange({
          mode: 'range',
          startDate: fromDate,
          label: interpolate(t.timeFilter.fromLabel, { date: formatDate(fromDate) }),
        });
      } else if (toDate) {
        onChange({
          mode: 'range',
          endDate: toDate,
          label: interpolate(t.timeFilter.upToLabel, { date: formatDate(toDate) }),
        });
      } else {
        onChange({
          mode: 'quick',
          quickRange: 'all_time',
          label: t.timeFilter.allTime,
        });
      }
    }
    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  const displayLabel = useMemo(() => {
    if (value.mode === 'quick' && value.quickRange) {
      switch (value.quickRange) {
        case 'today':
          return t.timeFilter.today;
        case 'this_week':
          return t.timeFilter.thisWeek;
        case 'this_month':
          return t.timeFilter.thisMonth;
        case 'this_year':
          return t.timeFilter.thisYear;
        case 'all_time':
        default:
          return t.timeFilter.allTime;
      }
    }
    return value.label || t.timeFilter.allTime;
  }, [value, t]);

  return (
    <div className={`${styles.wrapper} ${className}`} ref={containerRef}>
      <button
        type="button"
        className={`${styles.triggerBtn} ${isOpen ? styles.triggerBtnActive : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <Calendar size={15} className={styles.calendarIcon} />
        <span className={styles.btnLabel}>{displayLabel}</span>
        {isOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
      </button>

      {isOpen && (
        <div className={styles.popover} role="dialog" onClick={(e) => e.stopPropagation()}>
          <div className={styles.sectionHeader}>{t.timeFilter.quickRange}</div>
          <div className={styles.quickRangeList}>
            {quickRanges.map((item) => {
              const isSelected =
                value.mode === 'quick' && value.quickRange === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`${styles.pillBtn} ${isSelected ? styles.pillBtnSelected : ''}`}
                  onClick={() => handleQuickRangeClick(item.id)}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className={styles.divider} />

          <div className={styles.segmentedControl}>
            <button
              type="button"
              className={`${styles.segmentBtn} ${activeTab === 'specific' ? styles.segmentBtnActive : ''}`}
              onClick={() => setActiveTab('specific')}
            >
              {t.timeFilter.specificDate}
            </button>
            <button
              type="button"
              className={`${styles.segmentBtn} ${activeTab === 'range' ? styles.segmentBtnActive : ''}`}
              onClick={() => setActiveTab('range')}
            >
              {t.timeFilter.dateRange}
            </button>
          </div>

          <div className={styles.formContainer}>
            {activeTab === 'specific' ? (
              <div className={styles.singleField}>
                <DatePicker
                  label={t.timeFilter.date}
                  value={specificDate}
                  onChange={setSpecificDate}
                  placeholder="mm/dd/yyyy"
                />
              </div>
            ) : (
              <div className={styles.rangeFields}>
                <div className={styles.rangeField}>
                  <DatePicker
                    label={t.timeFilter.startDate}
                    value={fromDate}
                    onChange={setFromDate}
                    placeholder="mm/dd/yyyy"
                  />
                </div>
                <div className={styles.rangeField}>
                  <DatePicker
                    label={t.timeFilter.endDate}
                    value={toDate}
                    onChange={setToDate}
                    placeholder="mm/dd/yyyy"
                    popoverAlign="right"
                  />
                </div>
              </div>
            )}
          </div>

          <div className={styles.footer}>
            <button type="button" className={styles.cancelBtn} onClick={handleCancel}>
              {t.common.cancel}
            </button>
            <button type="button" className={styles.applyBtn} onClick={handleApply}>
              {t.common.apply}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
