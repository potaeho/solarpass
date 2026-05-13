/** 전국태양광발전소 전기사업허가정보 표준데이터 (data.go.kr) */
export type SolarFacility = {
  facilityName: string;       // 태양광발전시설명
  roadAddress: string;        // 소재지도로명주소
  lotAddress: string;         // 소재지지번주소
  latitude: number;           // 위도
  longitude: number;          // 경도
  locationDetail: string;     // 설치상세위치구분명 (건물옥상, 지상, 수상 등)
  operationStatus: string;    // 가동상태구분명 (운영, 공사중, 휴지 등)
  capacityKW: number;         // 설비용량 (kW)
  supplyVoltage: string;      // 공급전압
  frequency: string;          // 주파수
  installYear: string;        // 설치연도
  detailPurpose: string;      // 세부용도
  licenseDate: string;        // 허가일자
  licenseAuthority: string;   // 허가기관
  installAreaM2: number;      // 설치면적 (㎡)
};

/** API 원본 응답 item 필드 (data.go.kr snake_case) */
export type SolarFacilityRaw = {
  solarPwrFcltyNm: string;
  rdnmadr: string;
  lnmadr: string;
  latitude: string;
  longitude: string;
  instlDtlPosCdNm: string;
  oprtSttsCdNm: string;
  instlCpcty: string;
  splyCpvlt: string;
  frqnc: string;
  instlYr: string;
  dtlUseNm: string;
  prmsnDe: string;
  prmsnInstitutionNm: string;
  instlAr: string;
};

export type SolarFacilityListResponse = {
  items: SolarFacility[];
  totalCount: number;
  pageNo: number;
  numOfRows: number;
};
