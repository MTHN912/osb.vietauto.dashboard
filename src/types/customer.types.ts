import { Vehicle } from './vehicle.types';
import { Booking } from './booking.types';
import { RentalCar } from './rentalCar.types';
import { Case } from './case.types';

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
  email: string;
  vehicles?: Vehicle[];
}

export interface CustomerRentalHistoryItem {
  bookingId: string;
  rentalCar: RentalCar;
  rentalStartDate: string;
  rentalEndDate: string;
  status: string;
  dealerId: string;
  createdAt: string;
}

export interface CustomerDetail extends Customer {
  vehicles: Vehicle[];
  serviceBookings: Booking[];
  rentalHistory: CustomerRentalHistoryItem[];
  cases: Case[];
  totalBookingsCount: number;
}
