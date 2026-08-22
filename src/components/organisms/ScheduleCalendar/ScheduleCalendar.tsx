'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  ExternalLink,
  CalendarDays,
} from 'lucide-react';
import styles from './ScheduleCalendar.module.css';
import { StatusPill } from '@/components/atoms/StatusPill';
import { formatDate } from '@/utils';
import { useI18n } from '@/hooks/common';

export interface CalendarEvent<T = unknown> {
  id: string;
  date: string; // YYYY-MM-DD
  time?: string; // HH:mm
  title: string;
  subtitle?: string;
  status: string;
  statusVariant?: 'primary' | 'warning' | 'success' | 'danger' | 'purple' | 'gray';
  badge?: string;
  data: T;
  href?: string;
}

export interface ScheduleCalendarProps<T = unknown> {
  events: CalendarEvent<T>[];
  initialDate?: string;
  onEventClick?: (event: CalendarEvent<T>) => void;
  className?: string;
  agendaTitle?: string;
}

export function ScheduleCalendar<T = unknown>({
  events,
  initialDate,
  onEventClick,
  className = '',
  agendaTitle,
}: ScheduleCalendarProps<T>) {
  const { t, language, interpolate } = useI18n();

  // If there are events and no initialDate, default to the month of the first event, or today
  const [currentDate, setCurrentDate] = useState(() => {
    if (initialDate) return new Date(initialDate);
    if (events.length > 0 && events[0].date) {
      const parsed = new Date(events[0].date);
      if (!isNaN(parsed.getTime())) return parsed;
    }
    return new Date();
  });

  const todayStr = useMemo(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(
      today.getDate()
    ).padStart(2, '0')}`;
  }, []);

  const [selectedDate, setSelectedDate] = useState<string>(() => {
    if (initialDate) return initialDate;
    if (events.length > 0 && events[0].date) return events[0].date;
    return todayStr;
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

  // Group events by date (YYYY-MM-DD)
  const eventsByDate = useMemo(() => {
    const map = new Map<string, CalendarEvent<T>[]>();
    events.forEach((ev) => {
      if (!ev.date) return;
      const dateKey = ev.date.split('T')[0];
      const list = map.get(dateKey) || [];
      list.push(ev);
      map.set(dateKey, list);
    });
    return map;
  }, [events]);

  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const startingDayOfWeek = firstDayOfMonth.getDay();
    const totalDaysInMonth = lastDayOfMonth.getDate();

    const days = [];

    // Previous month filler days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevYear = month === 0 ? year - 1 : year;
      const prevMonth = month === 0 ? 11 : month - 1;
      const dayNum = prevMonthLastDay - i;
      const dateStr = `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(
        dayNum
      ).padStart(2, '0')}`;

      days.push({
        day: dayNum,
        dateStr,
        isCurrentMonth: false,
        events: eventsByDate.get(dateStr) || [],
      });
    }

    // Current month days
    for (let i = 1; i <= totalDaysInMonth; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      days.push({
        day: i,
        dateStr,
        isCurrentMonth: true,
        events: eventsByDate.get(dateStr) || [],
      });
    }

    // Next month filler days (to complete 35 or 42 grid cells)
    const totalCells = days.length > 35 ? 42 : 35;
    const remainingCells = totalCells - days.length;
    for (let i = 1; i <= remainingCells; i++) {
      const nextYear = month === 11 ? year + 1 : year;
      const nextMonth = month === 11 ? 0 : month + 1;
      const dateStr = `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(i).padStart(
        2,
        '0'
      )}`;

      days.push({
        day: i,
        dateStr,
        isCurrentMonth: false,
        events: eventsByDate.get(dateStr) || [],
      });
    }

    return days;
  }, [currentDate, eventsByDate]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleToday = () => {
    const now = new Date();
    setCurrentDate(now);
    setSelectedDate(todayStr);
  };

  const monthLabel = useMemo(() => {
    const locale = language === 'vi' ? 'vi-VN' : 'en-US';
    return currentDate.toLocaleString(locale, { month: 'long', year: 'numeric' });
  }, [currentDate, language]);

  // Events in currently active month
  const totalEventsInView = useMemo(() => {
    return calendarDays.reduce((acc, day) => acc + (day.isCurrentMonth ? day.events.length : 0), 0);
  }, [calendarDays]);

  const selectedDayEvents = useMemo(() => {
    return eventsByDate.get(selectedDate) || [];
  }, [eventsByDate, selectedDate]);

  const getPillVariantClass = (variant?: string) => {
    switch (variant) {
      case 'warning':
        return styles.eventPillWarning;
      case 'success':
        return styles.eventPillSuccess;
      case 'danger':
        return styles.eventPillDanger;
      case 'purple':
        return styles.eventPillPurple;
      case 'gray':
        return styles.eventPillGray;
      default:
        return styles.eventPillPrimary;
    }
  };

  return (
    <div className={`${styles.calendarWrapper} ${className}`}>
      {/* Calendar Top Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.monthNav}>
          <button
            type="button"
            className={styles.navBtn}
            onClick={handlePrevMonth}
            title={t.calendarView.prevMonth}
            aria-label={t.calendarView.prevMonth}
          >
            <ChevronLeft size={18} />
          </button>

          <span className={styles.currentMonthTitle}>{monthLabel}</span>

          <button
            type="button"
            className={styles.navBtn}
            onClick={handleNextMonth}
            title={t.calendarView.nextMonth}
            aria-label={t.calendarView.nextMonth}
          >
            <ChevronRight size={18} />
          </button>

          <button type="button" className={styles.todayBtn} onClick={handleToday}>
            {t.calendarView.today}
          </button>
        </div>

        <div className={styles.statsText}>
          {interpolate(t.calendarView.totalEvents, { count: totalEventsInView })}
        </div>
      </div>

      {/* Calendar Month Grid */}
      <div className={styles.grid}>
        {weekdays.map((dayName, idx) => (
          <div key={idx} className={styles.weekdayHeader}>
            {dayName}
          </div>
        ))}

        {calendarDays.map((d, index) => {
          const isToday = d.dateStr === todayStr;
          const isSelected = d.dateStr === selectedDate;

          let cellClass = styles.dayCell;
          if (!d.isCurrentMonth) cellClass += ` ${styles.otherMonth}`;
          if (isSelected) cellClass += ` ${styles.selectedDay}`;

          return (
            <div
              key={index}
              className={cellClass}
              onClick={() => setSelectedDate(d.dateStr)}
            >
              <div className={styles.dayHeader}>
                <span className={`${styles.dayNumber} ${isToday ? styles.todayNumber : ''}`}>
                  {d.day}
                </span>

                {d.events.length > 0 && (
                  <span className={styles.dayEventsCount}>{d.events.length}</span>
                )}
              </div>

              {/* Day events preview (Desktop) */}
              <div className={styles.eventsList}>
                {d.events.slice(0, 2).map((ev) => {
                  const content = (
                    <div
                      key={ev.id}
                      className={`${styles.eventPill} ${getPillVariantClass(ev.statusVariant)}`}
                      onClick={(e) => {
                        if (onEventClick) {
                          e.stopPropagation();
                          onEventClick(ev);
                        }
                      }}
                      title={`${ev.title} - ${ev.status}`}
                    >
                      <div className={styles.eventTop}>
                        <span className={styles.eventTitle}>{ev.title}</span>
                        {ev.time && <span className={styles.eventTime}>{ev.time}</span>}
                      </div>
                      {ev.subtitle && <span className={styles.eventSubtitle}>{ev.subtitle}</span>}
                    </div>
                  );

                  if (ev.href && !onEventClick) {
                    return (
                      <Link
                        key={ev.id}
                        href={ev.href}
                        onClick={(e) => e.stopPropagation()}
                        style={{ textDecoration: 'none' }}
                      >
                        {content}
                      </Link>
                    );
                  }
                  return content;
                })}

                {d.events.length > 2 && (
                  <span className={styles.moreEventsBadge}>
                    +{d.events.length - 2} {t.calendarView.daySummary}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Day Agenda Section */}
      <div className={styles.agendaSection}>
        <div className={styles.agendaHeader}>
          <h4 className={styles.agendaTitle}>
            <CalendarDays size={18} color="var(--accent)" />
            <span>
              {agendaTitle ||
                interpolate(t.calendarView.eventsForDate, {
                  date: formatDate(selectedDate),
                })}
            </span>
          </h4>
          <span className={styles.statsText}>
            {interpolate(t.calendarView.totalEvents, { count: selectedDayEvents.length })}
          </span>
        </div>

        {selectedDayEvents.length === 0 ? (
          <div className={styles.noEventsBox}>
            <CalendarIcon size={24} style={{ opacity: 0.5, marginBottom: '0.25rem' }} />
            <p>{t.calendarView.noEvents}</p>
          </div>
        ) : (
          <div className={styles.agendaList}>
            {selectedDayEvents.map((ev) => {
              const cardContent = (
                <div key={ev.id} className={styles.agendaCard}>
                  <div className={styles.agendaCardTop}>
                    <div>
                      <div className={styles.agendaItemTitle}>{ev.title}</div>
                      {ev.subtitle && (
                        <div className={styles.agendaItemSubtitle}>{ev.subtitle}</div>
                      )}
                    </div>
                    <StatusPill status={ev.status} />
                  </div>


                  <div className={styles.agendaMeta}>
                    {ev.time && (
                      <div className={styles.metaItem}>
                        <Clock size={13} />
                        <span>{ev.time}</span>
                      </div>
                    )}
                    {ev.badge && <span className={styles.metaItem}>• {ev.badge}</span>}
                    {ev.href && (
                      <div className={styles.metaItem} style={{ marginLeft: 'auto', color: 'var(--accent)' }}>
                        <ExternalLink size={13} />
                      </div>
                    )}
                  </div>
                </div>
              );

              if (ev.href) {
                return (
                  <Link key={ev.id} href={ev.href} style={{ textDecoration: 'none' }}>
                    {cardContent}
                  </Link>
                );
              }

              return (
                <div
                  key={ev.id}
                  onClick={() => onEventClick?.(ev)}
                  style={{ cursor: onEventClick ? 'pointer' : 'default' }}
                >
                  {cardContent}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
