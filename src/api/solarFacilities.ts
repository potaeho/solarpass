import type { SolarFacility, SolarFacilityListResponse } from '../types/solarFacility';

/**
 * 전국태양광발전소 전기사업허가정보 표준데이터 (data.go.kr)
 * 엔드포인트: tn_pubr_public_solar_gen_flct_api
 * 응답 필드: 대문자 스네이크케이스 (SOLAR_GEN_FCLT_NM, LATITUDE, CAPA …)
 */
const BASE_URL =
  'https://api.data.go.kr/openapi/tn_pubr_public_solar_gen_flct_api';

const SERVICE_KEY = process.env.EXPO_PUBLIC_SOLAR_FACILITY_API_KEY ?? '';

// ── 응답 item 파서 (실제 camelCase 필드명) ──────────────────────────────────
function parseItem(raw: Record<string, string>): SolarFacility {
  return {
    facilityName:     raw.solarGenFcltNm ?? '',
    roadAddress:      raw.lctnRoadNmAddr ?? '',
    lotAddress:       raw.lctnLotnoAddr ?? '',
    latitude:         parseFloat(raw.latitude) || 0,
    longitude:        parseFloat(raw.longitude) || 0,
    locationDetail:   raw.instlDtlPstnSeNm ?? '',
    operationStatus:  raw.oprtngSttsSeNm ?? '',
    capacityKW:       parseFloat(raw.capa) || 0,
    supplyVoltage:    raw.splyVolt ?? '',
    frequency:        raw.freq ?? '',
    installYear:      raw.instlYr ?? '',
    detailPurpose:    raw.detlsUsg ?? '',
    licenseDate:      raw.prmsnYmd ?? '',
    licenseAuthority: raw.prmsnInst ?? '',
    installAreaM2:    parseFloat(raw.instlArea) || 0,
  };
}

// ── 응답 포맷 자동 판별 ───────────────────────────────────────────────────────
function parseResponse(json: unknown): { items: SolarFacility[]; totalCount: number } {
  const j = json as Record<string, unknown>;

  // 에러 응답 확인
  const header = (j.response as Record<string, unknown>)?.header as Record<string, string> | undefined;
  if (header && header.resultCode !== '00') {
    console.error(`[SolarFacility] API 오류 ${header.resultCode}: ${header.resultMsg}`);
    throw new Error(`API_ERROR_${header.resultCode}`);
  }

  // 신규 포맷: { currentCount, data:[...], totalCount }
  if (Array.isArray(j.data)) {
    return {
      items:      (j.data as Record<string, string>[]).map(parseItem),
      totalCount: Number(j.totalCount) || 0,
    };
  }

  // 구형 포맷: { response.body.items:[...] } 또는 { response.body.items.item:[...] }
  const body = (j.response as Record<string, unknown>)?.body as Record<string, unknown> | undefined;
  if (body) {
    const itemsField = body.items;
    let arr: Record<string, string>[];
    if (Array.isArray(itemsField)) {
      // 실제 API 응답: items 가 바로 배열
      arr = itemsField as Record<string, string>[];
    } else {
      // 레거시: items.item 구조
      const raw = (itemsField as Record<string, unknown>)?.item ?? [];
      arr = Array.isArray(raw) ? raw : [raw];
    }
    return {
      items:      arr.filter(Boolean).map(parseItem),
      totalCount: Number(body.totalCount) || 0,
    };
  }

  console.error('[SolarFacility] 알 수 없는 응답 구조:', JSON.stringify(j).slice(0, 300));
  throw new Error('응답 형식 오류');
}

// ── 공개 API ──────────────────────────────────────────────────────────────────
type FetchParams = {
  province?: string;   // 소재지 시도명 (LCTN_ROAD_NM_ADDR 부분 매칭)
  city?: string;       // 소재지 시군구명
  pageNo?: number;
  numOfRows?: number;
};

export async function fetchSolarFacilities(
  params: FetchParams = {},
): Promise<SolarFacilityListResponse> {
  const { province, city, pageNo = 1, numOfRows = 100 } = params;

  // serviceKey를 URLSearchParams에 넣으면 자동 이중인코딩 → 직접 조합
  // 필터 없이 전체 조회 후 클라이언트 측 필터링 (서버 측 province 필터 미지원)
  const url =
    `${BASE_URL}?serviceKey=${SERVICE_KEY}` +
    `&pageNo=${pageNo}&numOfRows=${numOfRows}&type=json`;

  let text: string;
  try {
    const res = await fetch(url, { headers: { Accept: 'application/json' } });
    text = await res.text();

    if (!res.ok) {
      console.error(`[SolarFacility] HTTP ${res.status}:`, text.slice(0, 200));
      throw new Error(`HTTP ${res.status}`);
    }
  } catch (err) {
    console.warn('[SolarFacility] 네트워크 오류, mock 사용:', err);
    return buildMockResponse(province);
  }

  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    console.error('[SolarFacility] JSON 파싱 실패 (XML?):', text.slice(0, 300));
    return buildMockResponse(province);
  }

  try {
    let { items, totalCount } = parseResponse(json);

    // 시·군명 클라이언트 필터 (도시 단위 조회에서만 적용)
    // 도(province) 단위는 필터 없이 전체 반환 — API 정렬상 province로 나누면 0이 됨
    if (city) {
      const filtered = items.filter(item => {
        const addr = (item.lotAddress || item.roadAddress).trim();
        return addr.includes(city);
      });
      // 시·군 필터 결과가 있으면 사용, 없으면 전체 반환 (fallback)
      if (filtered.length > 0) {
        items = filtered;
        totalCount = filtered.length;
      }
    }

    return { items, totalCount, pageNo, numOfRows };
  } catch (err) {
    if (err instanceof Error && err.message.startsWith('API_ERROR_')) {
      console.warn('[SolarFacility] API 오류, mock 사용:', err.message);
      return buildMockResponse(province);
    }
    throw err;
  }
}

// ── 활용신청 전 / 오프라인 폴백 목업 ─────────────────────────────────────────
const MOCK_FACILITIES: Record<string, SolarFacility[]> = {
  '전라남도': [
    { facilityName: '나주 태양광발전소', roadAddress: '전남 나주시 빛가람동', lotAddress: '', latitude: 35.016, longitude: 126.711, locationDetail: '지상', operationStatus: '운영', capacityKW: 3000, supplyVoltage: '22.9kV', frequency: '60Hz', installYear: '2021', detailPurpose: '일반', licenseDate: '20200901', licenseAuthority: '산업통상자원부', installAreaM2: 25000 },
    { facilityName: '영암 솔라파크', roadAddress: '전남 영암군 삼호읍', lotAddress: '', latitude: 34.801, longitude: 126.437, locationDetail: '지상', operationStatus: '운영', capacityKW: 98000, supplyVoltage: '154kV', frequency: '60Hz', installYear: '2020', detailPurpose: '일반', licenseDate: '20190601', licenseAuthority: '산업통상자원부', installAreaM2: 900000 },
    { facilityName: '해남 태양광단지', roadAddress: '전남 해남군 산이면', lotAddress: '', latitude: 34.571, longitude: 126.434, locationDetail: '지상', operationStatus: '운영', capacityKW: 24000, supplyVoltage: '22.9kV', frequency: '60Hz', installYear: '2019', detailPurpose: '일반', licenseDate: '20180301', licenseAuthority: '전라남도', installAreaM2: 200000 },
    { facilityName: '신안 수상태양광', roadAddress: '전남 신안군 압해읍', lotAddress: '', latitude: 34.897, longitude: 126.367, locationDetail: '수상', operationStatus: '운영', capacityKW: 18000, supplyVoltage: '22.9kV', frequency: '60Hz', installYear: '2022', detailPurpose: '수상', licenseDate: '20210501', licenseAuthority: '전라남도', installAreaM2: 150000 },
    { facilityName: '고흥 태양광발전', roadAddress: '전남 고흥군 포두면', lotAddress: '', latitude: 34.602, longitude: 127.278, locationDetail: '지상', operationStatus: '공사중', capacityKW: 5000, supplyVoltage: '22.9kV', frequency: '60Hz', installYear: '2024', detailPurpose: '일반', licenseDate: '20231001', licenseAuthority: '전라남도', installAreaM2: 42000 },
  ],
  '충청남도': [
    { facilityName: '당진 태양광발전소', roadAddress: '충남 당진시 석문면', lotAddress: '', latitude: 37.001, longitude: 126.618, locationDetail: '지상', operationStatus: '운영', capacityKW: 10000, supplyVoltage: '22.9kV', frequency: '60Hz', installYear: '2020', detailPurpose: '일반', licenseDate: '20190401', licenseAuthority: '산업통상자원부', installAreaM2: 85000 },
    { facilityName: '태안 솔라팜', roadAddress: '충남 태안군 원북면', lotAddress: '', latitude: 36.762, longitude: 126.237, locationDetail: '지상', operationStatus: '운영', capacityKW: 30000, supplyVoltage: '66kV', frequency: '60Hz', installYear: '2021', detailPurpose: '일반', licenseDate: '20200101', licenseAuthority: '충청남도', installAreaM2: 250000 },
  ],
  '경상북도': [
    { facilityName: '영덕 태양광단지', roadAddress: '경북 영덕군 영해면', lotAddress: '', latitude: 36.528, longitude: 129.363, locationDetail: '지상', operationStatus: '운영', capacityKW: 20000, supplyVoltage: '66kV', frequency: '60Hz', installYear: '2022', detailPurpose: '일반', licenseDate: '20210301', licenseAuthority: '산업통상자원부', installAreaM2: 180000 },
    { facilityName: '경주 태양광발전소', roadAddress: '경북 경주시 양남면', lotAddress: '', latitude: 35.601, longitude: 129.478, locationDetail: '지상', operationStatus: '운영', capacityKW: 12000, supplyVoltage: '22.9kV', frequency: '60Hz', installYear: '2020', detailPurpose: '일반', licenseDate: '20190801', licenseAuthority: '경상북도', installAreaM2: 100000 },
  ],
  '전라북도': [
    { facilityName: '새만금 수상태양광', roadAddress: '전북 군산시 새만금', lotAddress: '', latitude: 35.898, longitude: 126.698, locationDetail: '수상', operationStatus: '공사중', capacityKW: 100000, supplyVoltage: '154kV', frequency: '60Hz', installYear: '2024', detailPurpose: '수상', licenseDate: '20220901', licenseAuthority: '산업통상자원부', installAreaM2: 2000000 },
  ],
  '제주특별자치도': [
    { facilityName: '제주 탐라해상풍력', roadAddress: '제주 제주시 한경면', lotAddress: '', latitude: 33.412, longitude: 126.168, locationDetail: '지상', operationStatus: '운영', capacityKW: 30000, supplyVoltage: '66kV', frequency: '60Hz', installYear: '2017', detailPurpose: '일반', licenseDate: '20150901', licenseAuthority: '산업통상자원부', installAreaM2: 300000 },
    { facilityName: '서귀포 태양광발전', roadAddress: '제주 서귀포시 대정읍', lotAddress: '', latitude: 33.241, longitude: 126.265, locationDetail: '지상', operationStatus: '운영', capacityKW: 4500, supplyVoltage: '22.9kV', frequency: '60Hz', installYear: '2019', detailPurpose: '일반', licenseDate: '20180701', licenseAuthority: '제주도', installAreaM2: 37000 },
  ],
};

function buildMockResponse(province?: string): SolarFacilityListResponse {
  const items = MOCK_FACILITIES[province ?? ''] ?? [];
  return { items, totalCount: items.length, pageNo: 1, numOfRows: items.length };
}

/** 지역 반경 내 발전소 필터링 */
export function filterByRadius(
  items: SolarFacility[],
  centerLat: number,
  centerLon: number,
  radiusKm: number,
): SolarFacility[] {
  return items.filter(item => {
    if (!item.latitude && !item.longitude) return true;
    const dlat = (item.latitude - centerLat) * 111;
    const dlon =
      (item.longitude - centerLon) *
      Math.cos((centerLat * Math.PI) / 180) *
      111;
    return Math.sqrt(dlat * dlat + dlon * dlon) <= radiusKm;
  });
}
