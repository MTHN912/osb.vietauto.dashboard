import { Insurance } from '@/types';

export const mockInsurance: Insurance[] = [
  {
    id: 'ins-1',
    claimNumber: 'CLM-2024-001234',
    policyNumber: 'POL-SF-887766',
    dateOfLoss: '2024-06-15',
    insuranceCompany: 'State Farm',
  },
  {
    id: 'ins-2',
    claimNumber: 'CLM-2024-005678',
    policyNumber: 'POL-GK-445566',
    dateOfLoss: '2024-07-22',
    insuranceCompany: 'GEICO',
  },
  {
    id: 'ins-3',
    claimNumber: 'CLM-2024-009012',
    policyNumber: 'POL-PG-112233',
    dateOfLoss: '2024-08-01',
    insuranceCompany: 'Progressive',
  },
  {
    id: 'ins-4',
    claimNumber: 'CLM-2024-003456',
    policyNumber: 'POL-AS-998877',
    dateOfLoss: '2024-05-10',
    insuranceCompany: 'Allstate',
  },
];
