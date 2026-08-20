export interface OperatingHours {
  dayOfWeek: string;
  open: string;
  close: string;
  isClosed: boolean;
}

export interface Dealer {
  id: string;
  name: string;
  address: string;
  phone: string;
  operatingHours: OperatingHours[];
}

export type DealerSelection = string | 'global';
