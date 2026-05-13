import type { FeasibilityCheck, FeasibilityStatus } from '../types/region';

export const computeFeasibilityStatus = (checks: FeasibilityCheck[]): FeasibilityStatus => {
  if (checks.some(c => c.status === 'fail')) return 'unavailable';
  if (checks.some(c => c.status === 'warning')) return 'conditional';
  return 'available';
};

export const computeVendorScore = (params: {
  successRate: number;
  regionMatch: number;
  responseSpeed: number;
  userRating: number;
}): number =>
  params.successRate * 0.5 +
  params.regionMatch * 0.2 +
  params.responseSpeed * 0.15 +
  params.userRating * 0.15;
