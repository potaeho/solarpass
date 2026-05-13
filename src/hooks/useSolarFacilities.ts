import { useQuery } from '@tanstack/react-query';
import { fetchSolarFacilities, filterByRadius } from '../api/solarFacilities';
import type { SolarFacility } from '../types/solarFacility';

type Options = {
  province?: string;
  city?: string;
  centerLat?: number;
  centerLon?: number;
  radiusKm?: number;
  enabled?: boolean;
};

export function useSolarFacilities(options: Options = {}) {
  const {
    province,
    city,
    centerLat,
    centerLon,
    radiusKm,
    enabled = true,
  } = options;

  return useQuery({
    queryKey: ['solarFacilities', province, city],
    queryFn: () => fetchSolarFacilities({ province, city, numOfRows: 1000 }),
    enabled,
    staleTime: 1000 * 60 * 30,   // 30분 캐시
    select: (data): { items: SolarFacility[]; totalCount: number; totalCapacityKW: number } => {
      // 반경 파라미터가 있을 때만 반경 필터 적용 (특정 지점 선택 시)
      // 도(province) 단위 조회는 반경 없이 그대로 사용
      const filtered =
        centerLat != null && centerLon != null && radiusKm != null
          ? filterByRadius(data.items, centerLat, centerLon, radiusKm)
          : data.items;

      // 설비용량 내림차순 정렬
      const sorted = [...filtered].sort((a, b) => b.capacityKW - a.capacityKW);
      const totalCapacityKW = sorted.reduce((sum, f) => sum + f.capacityKW, 0);

      return {
        items: sorted,
        totalCount: sorted.length,
        totalCapacityKW,
      };
    },
  });
}
