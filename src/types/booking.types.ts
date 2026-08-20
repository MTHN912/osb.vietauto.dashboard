import { Customer } from './customer.types';
import { Vehicle } from './vehicle.types';
import { Insurance } from './insurance.types';
import { RentalCar } from './rentalCar.types';
import { Service, PackageType } from './service.types';
import { TimeFilterValue } from './filter.types';

export enum BookingStatus {
  BOOKED_IN = 'BookedIn',
  CHECK_IN = 'CheckIn',
  COMPLETE = 'Complete',
  CANCELLED = 'Cancelled',
  NEED_ESTIMATE = 'Need Estimate',
}

export interface Booking {
  id: string;
  customer: Customer;
  packageType: PackageType;
  service: Service;
  services?: Service[];
  bookingDate?: string;
  bookingTime?: string;
  rentalStartDate?: string;
  rentalEndDate?: string;
  status: BookingStatus;
  dealerId: string;
  vehicle?: Vehicle;
  insurance?: Insurance;
  rentalCar?: RentalCar;
  checkInPhotos: string[];
  customerSignature?: string;
  depositCheckUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookingFilters {
  vin?: string;
  claimNumber?: string;
  dateOfLoss?: string;
  bookingDateFrom?: string;
  bookingDateTo?: string;
  customerName?: string;
  vehicleName?: string;
  statuses?: BookingStatus[];
  insuranceCompanies?: string[];
  claimTypes?: string[];
  timeFilter?: TimeFilterValue;
}

export interface NewBookingFormData {
  customer?: Customer;
  isNewCustomer: boolean;
  newCustomerData?: Omit<Customer, 'id'>;
  packageType?: PackageType;
  service?: Service;
  services?: Service[];
  insurance?: Omit<Insurance, 'id'>;
  vehicle?: Omit<Vehicle, 'id'>;
  rentalCarId?: string;
  bookingDate?: string;
  bookingTime?: string;
  rentalStartDate?: string;
  rentalEndDate?: string;
}
