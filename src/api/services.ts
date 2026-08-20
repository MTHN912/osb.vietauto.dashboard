import { Service, Package, PackageType } from '@/types';
import { mockServices, mockPackages } from '@/mocks/services';

let services = [...mockServices];

function delay(ms = 200): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getPackages(): Promise<Package[]> {
  await delay();
  return [...mockPackages];
}

export async function getServices(dealerId?: string): Promise<Service[]> {
  await delay();
  if (dealerId && dealerId !== 'global') {
    return services.filter((s) => s.dealerId === dealerId);
  }
  return [...services];
}

export async function getServicesByPackage(
  packageType: PackageType,
  dealerId?: string
): Promise<Service[]> {
  await delay();
  let result = services.filter((s) => s.packageType === packageType);
  if (dealerId && dealerId !== 'global') {
    result = result.filter((s) => s.dealerId === dealerId);
  }
  return result;
}

export async function createService(
  data: Omit<Service, 'id'>
): Promise<Service> {
  await delay(300);
  const newService: Service = {
    ...data,
    id: `svc-${services.length + 1}`,
  };
  services = [...services, newService];
  return newService;
}

export async function deleteService(id: string): Promise<boolean> {
  await delay(300);
  const len = services.length;
  services = services.filter((s) => s.id !== id);
  return services.length < len;
}
