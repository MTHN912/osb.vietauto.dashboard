import { Customer, Vehicle, RentalCar, Booking } from '@/types';

export function getCustomerFullName(customer: Customer): string {
  return `${customer.firstName} ${customer.lastName}`;
}

export function getVehicleName(vehicle: Vehicle): string {
  return `${vehicle.year} ${vehicle.make} ${vehicle.model}`;
}

export function getRentalCarName(car: RentalCar): string {
  return `${car.year} ${car.make} ${car.model}`;
}

export function getBookingVehicleName(booking: Booking): string {
  if (booking.vehicle) return getVehicleName(booking.vehicle);
  if (booking.rentalCar) return getRentalCarName(booking.rentalCar);
  return '—';
}

export function getBookingVin(booking: Booking): string {
  if (booking.vehicle) return booking.vehicle.vin;
  if (booking.rentalCar) return booking.rentalCar.vin;
  return '—';
}

export function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString('en-US')}.00`;
}
