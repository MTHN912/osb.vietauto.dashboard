import { Customer } from '@/types';
import { mockCustomers } from '@/mocks/customers';

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

export async function createCustomer(
  data: Omit<Customer, 'id'>
): Promise<Customer> {
  await delay(300);
  const newCustomer: Customer = {
    ...data,
    id: `cust-${customers.length + 1}`,
  };
  customers = [...customers, newCustomer];
  return newCustomer;
}
