'use client';

import React from 'react';
import styles from './DashboardLayout.module.css';
import { Sidebar } from '@/components/organisms/Sidebar';
import { Navbar } from '@/components/organisms/Navbar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <div className={styles.contentContainer}>
        <Navbar />
        <main className={styles.main}>
          {children}
        </main>
      </div>
    </div>
  );
}
