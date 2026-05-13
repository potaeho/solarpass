import type { Region } from '../types/region';
import { MOCK_REGIONS } from '../constants/regions';

const LAND_USE_BASE_URL = 'https://api.vworld.kr/req/data';

export const fetchLandUseInfo = async (lat: number, lng: number) => {
  const params = new URLSearchParams({
    service: 'data',
    request: 'GetFeature',
    data: 'LT_C_UQ111',
    key: process.env.EXPO_PUBLIC_LAND_USE_API_KEY!,
    format: 'json',
    geometry: 'false',
    attribute: 'true',
    point: `${lng},${lat}`,
    crs: 'EPSG:4326',
  });
  const res = await fetch(`${LAND_USE_BASE_URL}?${params}`);
  return res.json();
};

export const fetchRegions = async (): Promise<Region[]> => {
  return MOCK_REGIONS;
};

export const fetchRegionById = async (id: string): Promise<Region | null> => {
  return MOCK_REGIONS.find(r => r.id === id) ?? null;
};
