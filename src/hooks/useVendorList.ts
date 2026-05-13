import { useQuery } from '@tanstack/react-query';
import { fetchVendorsByStep } from '../api/vendors';
import type { PermitStepId } from '../types/permit';

export const useVendorList = (stepId: PermitStepId, region: string) =>
  useQuery({
    queryKey: ['vendors', stepId, region],
    queryFn: () => fetchVendorsByStep(stepId, region),
    enabled: !!stepId && !!region,
    staleTime: 1000 * 60 * 30,
  });
