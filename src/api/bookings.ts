import { Booking, BookingFilters, BookingStatus, PackageType } from '@/types';
import { mockBookings } from '@/mocks/bookings';

let bookings = [...mockBookings];

function delay(ms = 200): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getBookings(
  filters?: BookingFilters,
  dealerId?: string,
  packageType?: PackageType
): Promise<Booking[]> {
  await delay();

  let result = [...bookings];

  if (dealerId && dealerId !== 'global') {
    result = result.filter((b) => b.dealerId === dealerId);
  }

  if (packageType) {
    result = result.filter((b) => b.packageType === packageType);
  }

  if (filters) {
    if (filters.vin) {
      const vin = filters.vin.toLowerCase();
      result = result.filter(
        (b) =>
          b.vehicle?.vin.toLowerCase().includes(vin) ||
          b.rentalCar?.vin.toLowerCase().includes(vin)
      );
    }
    if (filters.claimNumber) {
      const claim = filters.claimNumber.toLowerCase();
      result = result.filter((b) =>
        b.insurance?.claimNumber.toLowerCase().includes(claim)
      );
    }
    if (filters.dateOfLoss) {
      result = result.filter((b) => b.insurance?.dateOfLoss === filters.dateOfLoss);
    }
    if (filters.bookingDateFrom) {
      result = result.filter((b) => !!b.bookingDate && b.bookingDate >= filters.bookingDateFrom!);
    }
    if (filters.bookingDateTo) {
      result = result.filter((b) => !!b.bookingDate && b.bookingDate <= filters.bookingDateTo!);
    }
    if (filters.customerName) {
      const name = filters.customerName.toLowerCase();
      result = result.filter(
        (b) =>
          `${b.customer.firstName} ${b.customer.lastName}`
            .toLowerCase()
            .includes(name)
      );
    }
    if (filters.vehicleName) {
      const vName = filters.vehicleName.toLowerCase();
      result = result.filter((b) => {
        if (b.vehicle) {
          return `${b.vehicle.year} ${b.vehicle.make} ${b.vehicle.model}`
            .toLowerCase()
            .includes(vName);
        }
        if (b.rentalCar) {
          return `${b.rentalCar.year} ${b.rentalCar.make} ${b.rentalCar.model}`
            .toLowerCase()
            .includes(vName);
        }
        return false;
      });
    }
    if (filters.statuses && filters.statuses.length > 0) {
      result = result.filter((b) => filters.statuses!.includes(b.status));
    }
    if (filters.insuranceCompanies && filters.insuranceCompanies.length > 0) {
      result = result.filter(
        (b) =>
          b.insurance &&
          filters.insuranceCompanies!.some(
            (c) => c.toLowerCase() === b.insurance!.insuranceCompany.toLowerCase()
          )
      );
    }
    if (filters.claimTypes && filters.claimTypes.length > 0) {
      result = result.filter((b) =>
        filters.claimTypes!.some((ct) => b.service.name.toLowerCase().includes(ct.toLowerCase()))
      );
    }
    if (filters.timeFilter) {
      const { mode, quickRange, specificDate, startDate, endDate } = filters.timeFilter;
      if (mode === 'quick') {
        if (quickRange && quickRange !== 'all_time') {
          if (startDate && endDate) {
            result = result.filter((b) => !!b.bookingDate && b.bookingDate >= startDate && b.bookingDate <= endDate);
          }
        }
      } else if (mode === 'specific' && specificDate) {
        result = result.filter((b) => b.bookingDate === specificDate);
      } else if (mode === 'range') {
        if (startDate && endDate) {
          result = result.filter((b) => !!b.bookingDate && b.bookingDate >= startDate && b.bookingDate <= endDate);
        } else if (startDate) {
          result = result.filter((b) => !!b.bookingDate && b.bookingDate >= startDate);
        } else if (endDate) {
          result = result.filter((b) => !!b.bookingDate && b.bookingDate <= endDate);
        }
      }
    }
  }

  return result;
}

export async function getBookingById(id: string): Promise<Booking | undefined> {
  await delay();
  return bookings.find((b) => b.id === id);
}

export async function createBooking(
  data: Omit<Booking, 'id' | 'createdAt' | 'updatedAt' | 'checkInPhotos'>
): Promise<Booking> {
  await delay(300);
  const newBooking: Booking = {
    ...data,
    id: `BK-${String(bookings.length + 1).padStart(3, '0')}`,
    checkInPhotos: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  bookings = [newBooking, ...bookings];
  return newBooking;
}

export async function updateBooking(
  id: string,
  data: Partial<Booking>
): Promise<Booking | undefined> {
  await delay(300);
  const index = bookings.findIndex((b) => b.id === id);
  if (index === -1) return undefined;

  bookings[index] = {
    ...bookings[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  return bookings[index];
}

export async function updateBookingStatus(
  id: string,
  status: BookingStatus
): Promise<Booking | undefined> {
  return updateBooking(id, { status });
}

export async function uploadDepositCheck(
  id: string,
  file: File
): Promise<Booking | undefined> {
  await delay(500);
  const fakeUrl = `/deposits/${id}-${file.name}`;
  return updateBooking(id, { depositCheckUrl: fakeUrl });
}

export async function checkInBooking(
  id: string,
  photos: string[],
  signature: string
): Promise<Booking | undefined> {
  await delay(500);
  return updateBooking(id, {
    checkInPhotos: photos,
    customerSignature: signature,
    status: BookingStatus.CHECK_IN,
  });
}
