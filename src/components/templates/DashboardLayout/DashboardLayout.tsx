'use client';

import React, { useState } from 'react';
import styles from './DashboardLayout.module.css';
import { Sidebar } from '@/components/organisms/Sidebar';
import { Navbar } from '@/components/organisms/Navbar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className={styles.layout}>
      <Sidebar
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />
      <div className={styles.contentContainer}>
        <Navbar
          onToggleMobileMenu={() => setIsMobileSidebarOpen((prev) => !prev)}
        />
        <main className={styles.main}>
          {children}
        </main>
      </div>
    </div>
  );
}

