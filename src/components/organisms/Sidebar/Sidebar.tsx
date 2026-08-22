'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Sidebar.module.css';
import { ShopSwitcher } from '@/components/molecules/ShopSwitcher';
import { useI18n } from '@/hooks/common';
import {
  LayoutGrid,
  FolderKanban,
  Calendar,
  Users,
  Building2,
  Car,
  Wrench,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';

interface NavItemDef {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number | string;
}

interface NavGroupDef {
  title: string;
  items: NavItemDef[];
}

export interface SidebarProps {
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function Sidebar({ isMobileOpen = false, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { t } = useI18n();

  const toggleCollapse = () => {
    setIsCollapsed((prev) => !prev);
  };


  const navGroups: NavGroupDef[] = useMemo(() => [
    {
      title: t.nav.main,
      items: [
        {
          label: t.nav.overview,
          href: '/',
          icon: <LayoutGrid size={18} />,
        },
        {
          label: t.nav.cases,
          href: '/cases',
          icon: <FolderKanban size={18} />,
          badge: 5,
        },
        {
          label: t.nav.bookings,
          href: '/bookings',
          icon: <Calendar size={18} />,
        },
        {
          label: t.nav.customers,
          href: '/customers',
          icon: <Users size={18} />,
        },
        {
          label: t.nav.services,
          href: '/services',
          icon: <Wrench size={18} />,
        },
      ],
    },
    {
      title: t.nav.manage,
      items: [
        {
          label: t.nav.teamDealers,
          href: '/dealers',
          icon: <Building2 size={18} />,
        },
        {
          label: t.nav.inventoryFleet,
          href: '/rental-cars',
          icon: <Car size={18} />,
        },
      ],
    },
  ], [t]);

  return (
    <>
      {isMobileOpen && (
        <div
          className={styles.backdrop}
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}
      <aside
        className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''} ${
          isMobileOpen ? styles.mobileOpen : ''
        }`}
      >
        <div className={styles.brandHeader}>
          {!isCollapsed && (
            <div className={styles.brandLogo}>
              <span className={styles.brandName}>VietAuto</span>
            </div>
          )}
          <button
            type="button"
            className={styles.collapseBtn}
            onClick={toggleCollapse}
            title={isCollapsed ? t.nav.expandSidebar : t.nav.collapseSidebar}
            aria-label={isCollapsed ? t.nav.expandSidebar : t.nav.collapseSidebar}
          >
            {isCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </button>
        </div>

        <ShopSwitcher collapsed={isCollapsed} />

        <nav className={styles.navContainer}>
          {navGroups.map((group) => (
            <div key={group.title} className={styles.navGroup}>
              {!isCollapsed ? (
                <div className={styles.groupTitle}>{group.title}</div>
              ) : (
                <div className={styles.groupDivider} />
              )}
              <div className={styles.groupItems}>
                {group.items.map((item) => {
                  const isActive =
                    item.href === '/cases'
                      ? pathname.startsWith('/cases')
                      : item.href === '/bookings'
                      ? pathname.startsWith('/bookings')
                      : item.href === '/customers'
                      ? pathname.startsWith('/customers')
                      : item.href === '/dealers'
                      ? pathname.startsWith('/dealers')
                      : item.href === '/rental-cars'
                      ? pathname.startsWith('/rental-cars')
                      : item.href === '/services'
                      ? pathname.startsWith('/services')
                      : pathname === item.href;

                  return (
                    <Link
                      key={`${group.title}-${item.label}-${item.href}`}
                      href={item.href}
                      className={`${styles.navItem} ${isActive ? styles.active : ''} ${
                        isCollapsed ? styles.navItemCollapsed : ''
                      }`}
                      title={isCollapsed ? item.label : undefined}
                      onClick={() => onCloseMobile?.()}
                    >
                      <span className={styles.itemIcon}>{item.icon}</span>
                      {!isCollapsed && (
                        <>
                          <span className={styles.itemLabel}>{item.label}</span>
                          {typeof item.badge !== 'undefined' && (
                            <span
                              className={`${styles.itemBadge} ${
                                isActive ? styles.activeBadge : ''
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                      {isCollapsed && typeof item.badge !== 'undefined' && (
                        <span className={styles.itemBadgeDot} />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}

