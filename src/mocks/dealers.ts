import { Dealer } from '@/types';

export const mockDealers: Dealer[] = [
  {
    id: 'dealer-1',
    name: 'VietAuto',
    address: '9876 Bellaire Blvd, Houston, TX 77036',
    phone: '(713) 555-1000',
    operatingHours: [
      { dayOfWeek: 'Monday', open: '08:00', close: '18:00', isClosed: false },
      { dayOfWeek: 'Tuesday', open: '08:00', close: '18:00', isClosed: false },
      { dayOfWeek: 'Wednesday', open: '08:00', close: '18:00', isClosed: false },
      { dayOfWeek: 'Thursday', open: '08:00', close: '18:00', isClosed: false },
      { dayOfWeek: 'Friday', open: '08:00', close: '18:00', isClosed: false },
      { dayOfWeek: 'Saturday', open: '09:00', close: '14:00', isClosed: false },
      { dayOfWeek: 'Sunday', open: '00:00', close: '00:00', isClosed: true },
    ],
  },
  {
    id: 'dealer-2',
    name: 'LamBodyAuto',
    address: '5432 Westheimer Rd, Houston, TX 77056',
    phone: '(713) 555-2000',
    operatingHours: [
      { dayOfWeek: 'Monday', open: '07:30', close: '17:30', isClosed: false },
      { dayOfWeek: 'Tuesday', open: '07:30', close: '17:30', isClosed: false },
      { dayOfWeek: 'Wednesday', open: '07:30', close: '17:30', isClosed: false },
      { dayOfWeek: 'Thursday', open: '07:30', close: '17:30', isClosed: false },
      { dayOfWeek: 'Friday', open: '07:30', close: '17:30', isClosed: false },
      { dayOfWeek: 'Saturday', open: '08:00', close: '13:00', isClosed: false },
      { dayOfWeek: 'Sunday', open: '00:00', close: '00:00', isClosed: true },
    ],
  },
];
