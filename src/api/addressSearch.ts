/** 카카오 주소 검색 API — 지번·도로명 주소 검색 */

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

// 카카오가 반환하는 도 이름 → 우리 DB 키 정규화
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

export async function searchAddress(query: string): Promise<AddressResult[]> {
  const key = process.env.EXPO_PUBLIC_KAKAO_REST_KEY;
  if (!key || query.trim().length < 2) return [];

  try {
    const res = await fetch(
      `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(query.trim())}&size=10`,
      { headers: { Authorization: `KakaoAK ${key}` } },
    );
    if (!res.ok) return [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { documents = [] } = (await res.json()) as { documents: any[] };

    return documents.map((d, i) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const a = (d.address ?? d.road_address) as Record<string, any> | null;
      const r2 = a?.region_2depth_name ?? '';
      const r3 = a?.region_3depth_name ?? '';
      const main = d.address?.main_address_no ?? '';
      const sub  = d.address?.sub_address_no  ?? '';
      const jibun = main ? `${main}${sub ? `-${sub}` : ''}번지` : '';

      return {
        id:          `addr_${i}_${d.x}_${d.y}`,
        displayName: r3 ? `${r2} ${r3}${jibun ? ' ' + jibun : ''}` : d.address_name,
        fullAddress: d.address_name,
        province:    normalizeProvince(a?.region_1depth_name ?? ''),
        city:        r2,
        district:    r3,
        latitude:    parseFloat(d.y),
        longitude:   parseFloat(d.x),
      };
    });
  } catch {
    return [];
  }
}
