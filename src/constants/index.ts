import { PackageType, BookingStatus, CaseStatus } from '@/types';

export const SERVICES_BY_PACKAGE: Record<PackageType, string[]> = {
  [PackageType.INSURANCE_CLAIMS]: [
    'Hail Damage',
    'Collision Repair',
    'Comprehensive Repair',
    'Liability Repair',
    'Windshield Replacement',
  ],
  [PackageType.CAR_SERVICE_REPAIR]: [
    'Oil Change',
    'Brake Repair',
    'Transmission Service',
    'Engine Repair',
    'Suspension Repair',
    'AC Repair',
    'Electrical Diagnostics',
    'Tire Rotation & Balance',
  ],
  [PackageType.RENT_A_CAR]: [
    'Daily Rental',
    'Weekly Rental',
    'Monthly Rental',
    'Insurance Replacement Rental',
  ],
  [PackageType.CAR_DETAILING]: [
    'Exterior Wash & Wax',
    'Interior Deep Clean',
    'Full Detail Package',
    'Paint Correction',
    'Ceramic Coating',
    'Headlight Restoration',
  ],
};

export const BOOKING_STATUS_LIST = Object.values(BookingStatus);

export const BOOKING_STATUS_CONFIG: Record<BookingStatus, { label: string; colorVar: string }> = {
  [BookingStatus.BOOKED_IN]: { label: 'Booked In', colorVar: '--status-booked-in' },
  [BookingStatus.CHECK_IN]: { label: 'Checked In', colorVar: '--status-check-in' },
  [BookingStatus.COMPLETE]: { label: 'Complete', colorVar: '--status-complete' },
  [BookingStatus.CANCELLED]: { label: 'Cancelled', colorVar: '--status-cancelled' },
  [BookingStatus.NEED_ESTIMATE]: { label: 'Need Estimate', colorVar: '--status-need-estimate' },
};

export const CASE_STATUS_LIST = Object.values(CaseStatus);

export interface CaseStatusInfo {
  label: string;
  colorVar: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  category: 'draft' | 'in_progress' | 'complete';
}

export const CASE_STATUS_CONFIG: Record<CaseStatus, CaseStatusInfo> = {
  [CaseStatus.DRAFT]: {
    label: 'Draft',
    colorVar: '--status-case-draft',
    badgeBg: 'var(--status-case-draft-bg)',
    badgeText: 'var(--status-case-draft-text)',
    badgeBorder: 'var(--status-case-draft-border)',
    category: 'draft',
  },
  [CaseStatus.FILED]: {
    label: 'Filed',
    colorVar: '--status-case-filed',
    badgeBg: 'var(--status-case-filed-bg)',
    badgeText: 'var(--status-case-filed-text)',
    badgeBorder: 'var(--status-case-filed-border)',
    category: 'in_progress',
  },
  [CaseStatus.PENDING_INSPECTION]: {
    label: 'Pending inspection',
    colorVar: '--status-case-pending',
    badgeBg: 'var(--status-case-pending-bg)',
    badgeText: 'var(--status-case-pending-text)',
    badgeBorder: 'var(--status-case-pending-border)',
    category: 'in_progress',
  },
  [CaseStatus.WAITING_FOR_CHECK]: {
    label: 'Waiting for check',
    colorVar: '--status-case-waiting-check',
    badgeBg: 'var(--status-case-waiting-check-bg)',
    badgeText: 'var(--status-case-waiting-check-text)',
    badgeBorder: 'var(--status-case-waiting-check-border)',
    category: 'in_progress',
  },
  [CaseStatus.WAITING_ON_PARTS]: {
    label: 'Waiting on parts',
    colorVar: '--status-case-waiting-parts',
    badgeBg: 'var(--status-case-waiting-parts-bg)',
    badgeText: 'var(--status-case-waiting-parts-text)',
    badgeBorder: 'var(--status-case-waiting-parts-border)',
    category: 'in_progress',
  },
  [CaseStatus.ESTIMATE_SENT]: {
    label: 'Estimate sent',
    colorVar: '--status-case-estimate',
    badgeBg: 'var(--status-case-estimate-bg)',
    badgeText: 'var(--status-case-estimate-text)',
    badgeBorder: 'var(--status-case-estimate-border)',
    category: 'in_progress',
  },
  [CaseStatus.INSPECTED]: {
    label: 'Inspected',
    colorVar: '--status-case-inspected',
    badgeBg: 'var(--status-case-inspected-bg)',
    badgeText: 'var(--status-case-inspected-text)',
    badgeBorder: 'var(--status-case-inspected-border)',
    category: 'in_progress',
  },
  [CaseStatus.SUPPLEMENT_SENT]: {
    label: 'Supplement sent',
    colorVar: '--status-case-supplement',
    badgeBg: 'var(--status-case-supplement-bg)',
    badgeText: 'var(--status-case-supplement-text)',
    badgeBorder: 'var(--status-case-supplement-border)',
    category: 'in_progress',
  },
  [CaseStatus.COMPLETED]: {
    label: 'Completed',
    colorVar: '--status-case-completed',
    badgeBg: 'var(--status-case-completed-bg)',
    badgeText: 'var(--status-case-completed-text)',
    badgeBorder: 'var(--status-case-completed-border)',
    category: 'complete',
  },
};

export const CASE_TABS = [
  { id: 'all', label: 'All' },
  { id: 'draft', label: 'Draft', countKey: 'draft' as const },
  { id: 'in_progress', label: 'In progress', countKey: 'in_progress' as const },
  { id: 'complete', label: 'Complete', countKey: 'complete' as const },
];

export const PACKAGE_TABS = [
  { type: PackageType.INSURANCE_CLAIMS, label: 'Insurance Claims' },
  { type: PackageType.CAR_SERVICE_REPAIR, label: 'Car Service & Repair' },
  { type: PackageType.RENT_A_CAR, label: 'Rent a Car' },
  { type: PackageType.CAR_DETAILING, label: 'Car Detailing' },
];

export const PACKAGES_WITH_VEHICLE: PackageType[] = [
  PackageType.INSURANCE_CLAIMS,
  PackageType.CAR_SERVICE_REPAIR,
  PackageType.CAR_DETAILING,
];

export const DEALER_IDS = {
  VIET_AUTO: 'dealer-1',
  LAM_BODY_AUTO: 'dealer-2',
} as const;

export interface NavSection {
  title: string;
  items: {
    label: string;
    href: string;
    icon: string;
    badge?: number | string;
  }[];
}

export const NAV_SECTIONS: NavSection[] = [
  {
    title: 'MAIN',
    items: [
      { label: 'Overview', href: '/dealers', icon: 'grid' },
      { label: 'Cases', href: '/cases', icon: 'folder', badge: 5 },
      { label: 'Bookings', href: '/bookings', icon: 'calendar' },
      { label: 'Services', href: '/services', icon: 'wrench' },
    ],
  },
  {
    title: 'MANAGE',
    items: [
      { label: 'Rental Cars', href: '/rental-cars', icon: 'car' },
      { label: 'Dealers', href: '/dealers', icon: 'building' },
    ],
  },
];

export const NAV_ITEMS = [
  { label: 'Cases', href: '/cases', icon: 'folder' },
  { label: 'Bookings', href: '/bookings', icon: 'calendar' },
  { label: 'Services', href: '/services', icon: 'wrench' },
  { label: 'Dealers', href: '/dealers', icon: 'building' },
  { label: 'Rental Cars', href: '/rental-cars', icon: 'car' },
] as const;

export const WIZARD_STEPS = [
  'Select Customer',
  'Select Service',
  'Insurance Info',
  'Vehicle Info',
  'Select Rental Car',
  'Select Date & Time',
  'Confirmation',
] as const;

export const INSURANCE_COMPANIES = [
  'State Farm',
  'GEICO',
  'Progressive',
  'Allstate',
  'USAA',
  'Liberty Mutual',
  'Farmers',
  'Nationwide',
  'Travelers',
  'American Family',
  'Out of pocket',
];

export const CAR_TYPES = ['Sedan', 'SUV', 'Truck', 'Van', 'Coupe', 'Convertible', 'Hatchback'];
export const FUEL_TYPES = ['Gasoline', 'Diesel', 'Electric', 'Hybrid'];

export const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

