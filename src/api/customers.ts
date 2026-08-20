import { Customer, CustomerDetail, CustomerRentalHistoryItem, PackageType } from '@/types';
import { mockCustomers } from '@/mocks/customers';
import { mockBookings } from '@/mocks/bookings';
import { mockCases } from '@/mocks/cases';

let customers = [...mockCustomers];

function delay(ms = 200): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getCustomers(): Promise<Customer[]> {
  await delay();
  return [...customers];
}

export async function getCustomerById(id: string): Promise<Customer | undefined> {
  await delay();
  return customers.find((c) => c.id === id);
}

export async function getCustomerDetailById(id: string): Promise<CustomerDetail | undefined> {
  await delay();
  const customer = customers.find((c) => c.id === id);
  if (!customer) return undefined;

  const allCustomerBookings = mockBookings.filter((b) => b.customer.id === id);

  const serviceBookings = allCustomerBookings.filter(
    (b) => b.packageType !== PackageType.RENT_A_CAR
  );

  const rentalHistory: CustomerRentalHistoryItem[] = allCustomerBookings
    .filter((b) => b.packageType === PackageType.RENT_A_CAR && b.rentalCar)
    .map((b) => ({
      bookingId: b.id,
      rentalCar: b.rentalCar!,
      rentalStartDate: b.rentalStartDate || b.bookingDate,
      rentalEndDate: b.rentalEndDate || b.bookingDate,
      status: b.status,
      dealerId: b.dealerId,
      createdAt: b.createdAt,
    }));

  const customerCases = mockCases.filter((c) => c.customer.id === id);

  return {
    ...customer,
    vehicles: customer.vehicles || [],
    serviceBookings,
    rentalHistory,
    cases: customerCases,
    totalBookingsCount: allCustomerBookings.length,
  };
}

export async function createCustomer(
  data: Omit<Customer, 'id'>
): Promise<Customer> {
  await delay(300);
  const newCustomer: Customer = {
    ...data,
    id: `cust-${customers.length + 1}`,
    vehicles: data.vehicles || [],
  };
  customers = [...customers, newCustomer];
  return newCustomer;
}
