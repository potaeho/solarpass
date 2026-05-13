/** Vworld 주소 검색 API — 지번·도로명 주소 검색 (공공데이터 무료) */

export interface AddressResult {
  id: string;
  displayName: string;   // 짧은 표시용 (동/리 + 번지)
  fullAddress: string;   // 전체 주소
  province: string;      // 도/특별시/광역시
  city: string;          // 시/군/구
  district: string;      // 읍/면/동
  latitude: number;
  longitude: number;
}

// 도 이름 정규화 (Vworld 반환값 → 우리 DB 키)
const PROVINCE_NORMALIZE: Record<string, string> = {
  '전라북도':        '전라북도',
  '전북특별자치도':  '전라북도',
  '강원도':          '강원도',
  '강원특별자치도':  '강원도',
  '제주도':          '제주특별자치도',
  '제주특별자치도':  '제주특별자치도',
};

export function normalizeProvince(raw: string): string {
  return PROVINCE_NORMALIZE[raw] ?? raw;
}

/** 주소 문자열에서 도·시/군 파싱 ("전라남도 나주시 금천면 …" → { province, city, district }) */
function parseAddressParts(addr: string) {
  const parts = addr.split(' ').filter(Boolean);
  // 첫 번째 토큰: 도/특별시/광역시
  const province = parts[0] ?? '';
  // 두 번째 토큰: 시/군/구
  const city = parts[1] ?? '';
  // 세 번째 토큰: 읍/면/동
  const district = parts[2] ?? '';
  return { province: normalizeProvince(province), city, district };
}

export async function searchAddress(query: string): Promise<AddressResult[]> {
  const key = process.env.EXPO_PUBLIC_LAND_USE_API_KEY; // 기존 Vworld 키 재사용
  if (!key || query.trim().length < 2) return [];

  try {
    const params = new URLSearchParams({
      service:     'search',
      request:     'search',
      version:     '2.0',
      crs:         'EPSG:4326',
      size:        '10',
      page:        '1',
      query:       query.trim(),
      type:        'address',
      format:      'json',
      errorformat: 'json',
      key,
    });

    const res = await fetch(`https://api.vworld.kr/req/search?${params}`);
    if (!res.ok) return [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const json = (await res.json()) as Record<string, any>;
    const status = json?.response?.status;
    if (status !== 'OK') return [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const items: any[] = json?.response?.result?.items ?? [];

    return items.map((item, i) => {
      // 지번 주소 우선, 없으면 도로명
      const fullAddress: string = item.address?.parcel ?? item.address?.road ?? item.title ?? '';
      const { province, city, district } = parseAddressParts(fullAddress);
      const lat = parseFloat(item.point?.y ?? '0');
      const lon = parseFloat(item.point?.x ?? '0');

      // 표시명: "나주시 금천면 123번지" 형태로 압축
      const titleShort = fullAddress.split(' ').slice(1).join(' '); // 도 이름 제거

      return {
        id:          `vw_${i}_${item.point?.x}_${item.point?.y}`,
        displayName: titleShort || fullAddress,
        fullAddress,
        province,
        city,
        district,
        latitude:  lat,
        longitude: lon,
      };
    });
  } catch {
    return [];
  }
}
