import { Service, Package, PackageType } from '@/types';

export const mockPackages: Package[] = [
  {
    id: 'pkg-1',
    name: 'Insurance Claims',
    type: PackageType.INSURANCE_CLAIMS,
    description: 'Handle insurance claims including hail, collision, comprehensive, and liability repairs.',
  },
  {
    id: 'pkg-2',
    name: 'Car Service and Repair',
    type: PackageType.CAR_SERVICE_REPAIR,
    description: 'General car maintenance and repair services.',
  },
  {
    id: 'pkg-3',
    name: 'Rent a Car',
    type: PackageType.RENT_A_CAR,
    description: 'Vehicle rental services for daily, weekly, or monthly periods.',
  },
  {
    id: 'pkg-4',
    name: 'Car Detailing',
    type: PackageType.CAR_DETAILING,
    description: 'Professional car detailing and cosmetic services.',
  },
];

export const mockServices: Service[] = [
  { id: 'svc-1', name: 'Hail Damage', packageType: PackageType.INSURANCE_CLAIMS, dealerId: 'dealer-1' },
  { id: 'svc-2', name: 'Collision Repair', packageType: PackageType.INSURANCE_CLAIMS, dealerId: 'dealer-1' },
  { id: 'svc-3', name: 'Comprehensive Repair', packageType: PackageType.INSURANCE_CLAIMS, dealerId: 'dealer-1' },
  { id: 'svc-4', name: 'Liability Repair', packageType: PackageType.INSURANCE_CLAIMS, dealerId: 'dealer-2' },
  { id: 'svc-5', name: 'Windshield Replacement', packageType: PackageType.INSURANCE_CLAIMS, dealerId: 'dealer-2' },
  { id: 'svc-6', name: 'Oil Change', packageType: PackageType.CAR_SERVICE_REPAIR, dealerId: 'dealer-1' },
  { id: 'svc-7', name: 'Brake Repair', packageType: PackageType.CAR_SERVICE_REPAIR, dealerId: 'dealer-1' },
  { id: 'svc-8', name: 'Transmission Service', packageType: PackageType.CAR_SERVICE_REPAIR, dealerId: 'dealer-2' },
  { id: 'svc-9', name: 'Engine Repair', packageType: PackageType.CAR_SERVICE_REPAIR, dealerId: 'dealer-2' },
  { id: 'svc-10', name: 'Suspension Repair', packageType: PackageType.CAR_SERVICE_REPAIR, dealerId: 'dealer-1' },
  { id: 'svc-11', name: 'AC Repair', packageType: PackageType.CAR_SERVICE_REPAIR, dealerId: 'dealer-2' },
  { id: 'svc-12', name: 'Electrical Diagnostics', packageType: PackageType.CAR_SERVICE_REPAIR, dealerId: 'dealer-1' },
  { id: 'svc-13', name: 'Tire Rotation & Balance', packageType: PackageType.CAR_SERVICE_REPAIR, dealerId: 'dealer-1' },
  { id: 'svc-14', name: 'Daily Rental', packageType: PackageType.RENT_A_CAR, dealerId: 'dealer-1' },
  { id: 'svc-15', name: 'Weekly Rental', packageType: PackageType.RENT_A_CAR, dealerId: 'dealer-1' },
  { id: 'svc-16', name: 'Monthly Rental', packageType: PackageType.RENT_A_CAR, dealerId: 'dealer-2' },
  { id: 'svc-17', name: 'Insurance Replacement Rental', packageType: PackageType.RENT_A_CAR, dealerId: 'dealer-2' },
  { id: 'svc-18', name: 'Exterior Wash & Wax', packageType: PackageType.CAR_DETAILING, dealerId: 'dealer-1' },
  { id: 'svc-19', name: 'Interior Deep Clean', packageType: PackageType.CAR_DETAILING, dealerId: 'dealer-1' },
  { id: 'svc-20', name: 'Full Detail Package', packageType: PackageType.CAR_DETAILING, dealerId: 'dealer-2' },
  { id: 'svc-21', name: 'Paint Correction', packageType: PackageType.CAR_DETAILING, dealerId: 'dealer-2' },
  { id: 'svc-22', name: 'Ceramic Coating', packageType: PackageType.CAR_DETAILING, dealerId: 'dealer-1' },
  { id: 'svc-23', name: 'Headlight Restoration', packageType: PackageType.CAR_DETAILING, dealerId: 'dealer-2' },
];
