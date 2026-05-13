import { useQuery } from '@tanstack/react-query';
import { fetchPermitFlow } from '../api/permits';

export const usePermitFlow = (regionId: string) =>
  useQuery({
    queryKey: ['permit-flow', regionId],
    queryFn: () => fetchPermitFlow(regionId),
    enabled: !!regionId,
    staleTime: 1000 * 60 * 5,
  });
