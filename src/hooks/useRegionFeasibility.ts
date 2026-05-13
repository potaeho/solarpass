import { useQuery } from '@tanstack/react-query';
import { fetchRegionById } from '../api/regions';

export const useRegionFeasibility = (regionId: string) =>
  useQuery({
    queryKey: ['region', regionId],
    queryFn: () => fetchRegionById(regionId),
    enabled: !!regionId,
    staleTime: 1000 * 60 * 10,
  });
