'use client';

import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './Calendar.module.css';
import { useI18n } from '@/hooks/common';

interface CalendarProps {
  value?: string;
  onChange: (date: string) => void;
  minDate?: string;
}

export function Calendar({ value, onChange, minDate }: CalendarProps) {
  const { t, language } = useI18n();
  const [currentMonth, setCurrentMonth] = useState(() => {
    if (value) return new Date(value);
    return new Date();
  });

  const weekdays = useMemo(
    () => [
      t.days.short.su,
      t.days.short.mo,
      t.days.short.tu,
      t.days.short.we,
      t.days.short.th,
      t.days.short.fr,
      t.days.short.sa,
    ],
    [t]
  );

  const days = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    
    const startingDayOfWeek = firstDayOfMonth.getDay();
    const totalDaysInMonth = lastDayOfMonth.getDate();
    
    const daysArray = [];
    
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      daysArray.push({
        day: prevMonthLastDay - i,
        month: month - 1,
        year: month === 0 ? year - 1 : year,
        isCurrentMonth: false,
      });
    }
    
    for (let i = 1; i <= totalDaysInMonth; i++) {
      daysArray.push({
        day: i,
        month: month,
        year: year,
        isCurrentMonth: true,
      });
    }
    
    const remainingCells = 42 - daysArray.length;
    for (let i = 1; i <= remainingCells; i++) {
      daysArray.push({
        day: i,
        month: month + 1,
        year: month === 11 ? year + 1 : year,
        isCurrentMonth: false,
      });
    }
    
    return daysArray;
  }, [currentMonth]);

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleDateClick = (dayObj: { day: number; month: number; year: number }) => {
    const dateStr = `${dayObj.year}-${String(dayObj.month + 1).padStart(2, '0')}-${String(dayObj.day).padStart(2, '0')}`;
    if (minDate && dateStr < minDate) return;
    onChange(dateStr);
  };

  const monthLabel = useMemo(() => {
    const locale = language === 'vi' ? 'vi-VN' : 'en-US';
    return currentMonth.toLocaleString(locale, { month: 'long', year: 'numeric' });
  }, [currentMonth, language]);

  return (
    <div className={styles.calendar}>
      <div className={styles.header}>
        <button type="button" className={styles.navButton} onClick={handlePrevMonth}>
          <ChevronLeft size={20} />
        </button>
        <div className={styles.monthLabel}>
          {monthLabel}
        </div>
        <button type="button" className={styles.navButton} onClick={handleNextMonth}>
          <ChevronRight size={20} />
        </button>
      </div>

      <div className={styles.grid}>
        {weekdays.map((day, idx) => (
          <div key={idx} className={styles.weekday}>
            {day}
          </div>
        ))}

        {days.map((d, index) => {
          const dateStr = `${d.year}-${String(d.month + 1).padStart(2, '0')}-${String(d.day).padStart(2, '0')}`;
          const isSelected = value === dateStr;
          const isDisabled = minDate ? dateStr < minDate : false;

          let cellClass = styles.dayCell;
          if (isDisabled || !d.isCurrentMonth) {
            cellClass += ` ${styles.dayDisabled}`;
          } else {
            cellClass += ` ${styles.daySelectable}`;
          }

          if (isSelected) {
            cellClass += ` ${styles.daySelected}`;
          }

          return (
            <button
              key={index}
              type="button"
              className={cellClass}
              onClick={() => handleDateClick(d)}
              disabled={isDisabled}
            >
              {d.day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
