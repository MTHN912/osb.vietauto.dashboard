export interface Insurance {
  id: string;
  claimNumber: string;
  policyNumber: string;
  dateOfLoss: string;
  timeOfLoss?: string;
  insuranceCompany: string;
}
