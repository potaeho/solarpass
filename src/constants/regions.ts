import type { FeasibilityCheck, Region } from '../types/region';
import { getSolarGrade, REGION_SOLAR_STATS } from './solarStats';
import { computeFeasibilityStatus } from '../utils/feasibilityScore';

const makeRegion = (
  id: string,
  name: string,
  shortName: string,
  province: string,
  latitude: number,
  longitude: number,
  checks: FeasibilityCheck[],
): Region => ({
  id,
  name,
  shortName,
  province,
  latitude,
  longitude,
  checks,
  feasibilityStatus: computeFeasibilityStatus(checks),
  solarGrade: getSolarGrade(REGION_SOLAR_STATS[province]?.annualGenerationMWh ?? 0),
  updatedAt: '2025-01-01',
});

export const MOCK_REGIONS: Region[] = [
  makeRegion('jeonnam', '전라남도', '전남', '전라남도', 34.8679, 126.9910, [
    { id: 'land_use',        status: 'pass',    title: '토지이용계획', description: '농지·임야 전용 가능 지역 다수 분포' },
    { id: 'grid_capacity',   status: 'warning', title: '한전 계통망 용량', description: '기존 설비 포화로 접속 대기 발생 중',
      gridCapacity: { totalMW: 4200, usedMW: 3900, availableMW: 300, waitingQueue: 87 } },
    { id: 'setback_distance',status: 'pass',    title: '이격거리', description: '주거지·도로 이격 기준 충족 가능 지역 많음' },
    { id: 'national_law',    status: 'pass',    title: '전국 공통 법규', description: '태양광 발전사업 허가 요건 충족' },
    { id: 'local_ordinance', status: 'warning', title: '지자체 조례', description: '일부 시·군 경관심의 추가 요구' },
  ]),

  makeRegion('chungnam', '충청남도', '충남', '충청남도', 36.5184, 126.8000, [
    { id: 'land_use',        status: 'pass',    title: '토지이용계획', description: '농업진흥지역 외 전용 가능' },
    { id: 'grid_capacity',   status: 'warning', title: '한전 계통망 용량', description: '서부 해안 일부 지역 계통 포화',
      gridCapacity: { totalMW: 2800, usedMW: 2400, availableMW: 400, waitingQueue: 52 } },
    { id: 'setback_distance',status: 'pass',    title: '이격거리', description: '이격거리 기준 충족 가능' },
    { id: 'national_law',    status: 'pass',    title: '전국 공통 법규', description: '허가 요건 충족' },
    { id: 'local_ordinance', status: 'pass',    title: '지자체 조례', description: '별도 강화 조례 없음' },
  ]),

  makeRegion('jeonbuk', '전라북도', '전북', '전라북도', 35.7175, 127.1530, [
    { id: 'land_use',        status: 'pass',    title: '토지이용계획', description: '관리지역·임야 활용 가능' },
    { id: 'grid_capacity',   status: 'warning', title: '한전 계통망 용량', description: '동부 산간 지역 계통 용량 제한',
      gridCapacity: { totalMW: 1800, usedMW: 1500, availableMW: 300, waitingQueue: 34 } },
    { id: 'setback_distance',status: 'pass',    title: '이격거리', description: '기준 충족 가능' },
    { id: 'national_law',    status: 'pass',    title: '전국 공통 법규', description: '허가 요건 충족' },
    { id: 'local_ordinance', status: 'warning', title: '지자체 조례', description: '새만금 인접 일부 지역 추가 심의' },
  ]),

  makeRegion('gyeongbuk', '경상북도', '경북', '경상북도', 36.4919, 128.8889, [
    { id: 'land_use',        status: 'pass',    title: '토지이용계획', description: '내륙 관리지역 활용 가능' },
    { id: 'grid_capacity',   status: 'warning', title: '한전 계통망 용량', description: '안동·영주 등 내륙 지역 용량 부족',
      gridCapacity: { totalMW: 2200, usedMW: 1900, availableMW: 300, waitingQueue: 41 } },
    { id: 'setback_distance',status: 'pass',    title: '이격거리', description: '기준 충족 가능' },
    { id: 'national_law',    status: 'pass',    title: '전국 공통 법규', description: '허가 요건 충족' },
    { id: 'local_ordinance', status: 'pass',    title: '지자체 조례', description: '별도 강화 조례 없음' },
  ]),

  makeRegion('gangwon', '강원도', '강원', '강원도', 37.8228, 128.1555, [
    { id: 'land_use',        status: 'warning', title: '토지이용계획', description: '산림·보전지역 비율 높아 전용 제한' },
    { id: 'grid_capacity',   status: 'pass',    title: '한전 계통망 용량', description: '개발 밀도 낮아 계통 여유 있음',
      gridCapacity: { totalMW: 1200, usedMW: 600, availableMW: 600, waitingQueue: 8 } },
    { id: 'setback_distance',status: 'pass',    title: '이격거리', description: '저밀도 지역으로 이격 확보 용이' },
    { id: 'national_law',    status: 'pass',    title: '전국 공통 법규', description: '허가 요건 충족' },
    { id: 'local_ordinance', status: 'warning', title: '지자체 조례', description: '백두대간 인근 경관 보호 구역 조례 적용' },
  ]),

  makeRegion('gyeongnam', '경상남도', '경남', '경상남도', 35.4606, 128.2132, [
    { id: 'land_use',        status: 'pass',    title: '토지이용계획', description: '관리지역 활용 가능' },
    { id: 'grid_capacity',   status: 'warning', title: '한전 계통망 용량', description: '창원·진주 인근 계통 여유 제한',
      gridCapacity: { totalMW: 1900, usedMW: 1600, availableMW: 300, waitingQueue: 28 } },
    { id: 'setback_distance',status: 'pass',    title: '이격거리', description: '기준 충족 가능' },
    { id: 'national_law',    status: 'pass',    title: '전국 공통 법규', description: '허가 요건 충족' },
    { id: 'local_ordinance', status: 'pass',    title: '지자체 조례', description: '별도 강화 조례 없음' },
  ]),

  makeRegion('gyeonggi', '경기도', '경기', '경기도', 37.4138, 127.5183, [
    { id: 'land_use',        status: 'warning', title: '토지이용계획', description: '개발제한구역(그린벨트) 및 도시지역 비율 높음' },
    { id: 'grid_capacity',   status: 'warning', title: '한전 계통망 용량', description: '수도권 집중으로 접속 대기 다수',
      gridCapacity: { totalMW: 3500, usedMW: 3200, availableMW: 300, waitingQueue: 63 } },
    { id: 'setback_distance',status: 'warning', title: '이격거리', description: '주거 밀도 높아 이격거리 확보 어려운 곳 다수' },
    { id: 'national_law',    status: 'pass',    title: '전국 공통 법규', description: '허가 요건 충족' },
    { id: 'local_ordinance', status: 'warning', title: '지자체 조례', description: '시·군별 태양광 규제 강화 추세' },
  ]),

  makeRegion('chungbuk', '충청북도', '충북', '충청북도', 36.6357, 127.4914, [
    { id: 'land_use',        status: 'pass',    title: '토지이용계획', description: '관리지역·임야 활용 가능' },
    { id: 'grid_capacity',   status: 'pass',    title: '한전 계통망 용량', description: '내륙 지역 계통 여유 있음',
      gridCapacity: { totalMW: 1100, usedMW: 750, availableMW: 350, waitingQueue: 12 } },
    { id: 'setback_distance',status: 'pass',    title: '이격거리', description: '기준 충족 가능' },
    { id: 'national_law',    status: 'pass',    title: '전국 공통 법규', description: '허가 요건 충족' },
    { id: 'local_ordinance', status: 'warning', title: '지자체 조례', description: '충주호 인근 수변구역 규제 적용' },
  ]),

  makeRegion('jeju', '제주도', '제주', '제주도', 33.4890, 126.4983, [
    { id: 'land_use',        status: 'warning', title: '토지이용계획', description: '절대보전지역·경관보전지구 비율 높음' },
    { id: 'grid_capacity',   status: 'fail',    title: '한전 계통망 용량', description: '섬 계통 포화 — 신규 접속 사실상 중단',
      gridCapacity: { totalMW: 800, usedMW: 790, availableMW: 10, waitingQueue: 142 } },
    { id: 'setback_distance',status: 'pass',    title: '이격거리', description: '이격기준 충족 가능' },
    { id: 'national_law',    status: 'pass',    title: '전국 공통 법규', description: '허가 요건 충족' },
    { id: 'local_ordinance', status: 'warning', title: '지자체 조례', description: '경관심의 필수, 오름·해안 인근 설치 제한' },
  ]),

  makeRegion('busan', '부산시', '부산', '부산시', 35.1796, 129.0756, [
    { id: 'land_use',        status: 'warning', title: '토지이용계획', description: '도시지역·항만 비율 높아 가용 부지 제한' },
    { id: 'grid_capacity',   status: 'pass',    title: '한전 계통망 용량', description: '대규모 공단 인근 계통 여유',
      gridCapacity: { totalMW: 1400, usedMW: 900, availableMW: 500, waitingQueue: 15 } },
    { id: 'setback_distance',status: 'warning', title: '이격거리', description: '주거 밀집 지역 이격거리 확보 어려움' },
    { id: 'national_law',    status: 'pass',    title: '전국 공통 법규', description: '허가 요건 충족' },
    { id: 'local_ordinance', status: 'warning', title: '지자체 조례', description: '해안·산지 경관지구 설치 제한' },
  ]),

  makeRegion('daegu', '대구시', '대구', '대구시', 35.8714, 128.6014, [
    { id: 'land_use',        status: 'warning', title: '토지이용계획', description: '도시지역 비율 높아 설치 가능 부지 제한' },
    { id: 'grid_capacity',   status: 'pass',    title: '한전 계통망 용량', description: '공단 지역 계통 여유 있음',
      gridCapacity: { totalMW: 1000, usedMW: 650, availableMW: 350, waitingQueue: 9 } },
    { id: 'setback_distance',status: 'warning', title: '이격거리', description: '도심 인접지 이격 확보 어려움' },
    { id: 'national_law',    status: 'pass',    title: '전국 공통 법규', description: '허가 요건 충족' },
    { id: 'local_ordinance', status: 'warning', title: '지자체 조례', description: '팔공산 주변 경관 보호 구역 적용' },
  ]),

  makeRegion('gwangju', '광주시', '광주', '광주시', 35.1595, 126.8526, [
    { id: 'land_use',        status: 'warning', title: '토지이용계획', description: '도시지역 중심, 외곽 관리지역 활용 가능' },
    { id: 'grid_capacity',   status: 'pass',    title: '한전 계통망 용량', description: '계통 여유 있음',
      gridCapacity: { totalMW: 900, usedMW: 550, availableMW: 350, waitingQueue: 7 } },
    { id: 'setback_distance',status: 'pass',    title: '이격거리', description: '외곽 지역 이격 기준 충족 가능' },
    { id: 'national_law',    status: 'pass',    title: '전국 공통 법규', description: '허가 요건 충족' },
    { id: 'local_ordinance', status: 'warning', title: '지자체 조례', description: '무등산 인근 경관보호구역 규제' },
  ]),

  makeRegion('ulsan', '울산시', '울산', '울산시', 35.5384, 129.3114, [
    { id: 'land_use',        status: 'warning', title: '토지이용계획', description: '공단·항만 용도 비율 높음' },
    { id: 'grid_capacity',   status: 'pass',    title: '한전 계통망 용량', description: '대형 공단 전용 계통으로 용량 확보',
      gridCapacity: { totalMW: 1100, usedMW: 700, availableMW: 400, waitingQueue: 6 } },
    { id: 'setback_distance',status: 'pass',    title: '이격거리', description: '공단 외곽 지역 이격 충족 가능' },
    { id: 'national_law',    status: 'pass',    title: '전국 공통 법규', description: '허가 요건 충족' },
    { id: 'local_ordinance', status: 'warning', title: '지자체 조례', description: '태화강 생태경관보전지역 인근 제한' },
  ]),

  makeRegion('incheon', '인천시', '인천', '인천시', 37.4563, 126.7052, [
    { id: 'land_use',        status: 'warning', title: '토지이용계획', description: '도서 제외 도심 용도지역 대부분' },
    { id: 'grid_capacity',   status: 'warning', title: '한전 계통망 용량', description: '수도권 과부하로 접속 대기 발생',
      gridCapacity: { totalMW: 2000, usedMW: 1750, availableMW: 250, waitingQueue: 47 } },
    { id: 'setback_distance',status: 'warning', title: '이격거리', description: '주거 밀집으로 이격 확보 어려움' },
    { id: 'national_law',    status: 'pass',    title: '전국 공통 법규', description: '허가 요건 충족' },
    { id: 'local_ordinance', status: 'warning', title: '지자체 조례', description: '강화·옹진 도서지역 별도 경관 조례 적용' },
  ]),

  makeRegion('sejong', '세종시', '세종', '세종시', 36.4801, 127.2890, [
    { id: 'land_use',        status: 'warning', title: '토지이용계획', description: '행정중심복합도시 개발지역 편입 가능성' },
    { id: 'grid_capacity',   status: 'pass',    title: '한전 계통망 용량', description: '신도시 전용 계통 여유 있음',
      gridCapacity: { totalMW: 600, usedMW: 300, availableMW: 300, waitingQueue: 4 } },
    { id: 'setback_distance',status: 'pass',    title: '이격거리', description: '외곽 농업지역 이격 충족 가능' },
    { id: 'national_law',    status: 'pass',    title: '전국 공통 법규', description: '허가 요건 충족' },
    { id: 'local_ordinance', status: 'warning', title: '지자체 조례', description: '행정중심복합도시 미관지구 내 설치 제한' },
  ]),

  makeRegion('seoul', '서울시', '서울', '서울시', 37.5665, 126.9780, [
    { id: 'land_use',        status: 'fail',    title: '토지이용계획', description: '전 지역 도시지역 — 지상 설치 가능 부지 없음' },
    { id: 'grid_capacity',   status: 'warning', title: '한전 계통망 용량', description: '도심 지중 계통 과부하',
      gridCapacity: { totalMW: 4000, usedMW: 3800, availableMW: 200, waitingQueue: 31 } },
    { id: 'setback_distance',status: 'fail',    title: '이격거리', description: '주거 초밀집으로 이격거리 기준 충족 불가' },
    { id: 'national_law',    status: 'pass',    title: '전국 공통 법규', description: '허가 요건 충족' },
    { id: 'local_ordinance', status: 'fail',    title: '지자체 조례', description: '서울시 건축물 옥상 외 지상 태양광 사실상 불허' },
  ]),

  makeRegion('daejeon', '대전시', '대전', '대전시', 36.3504, 127.3845, [
    { id: 'land_use',        status: 'warning', title: '토지이용계획', description: '도시 외곽 관리지역 일부 활용 가능' },
    { id: 'grid_capacity',   status: 'pass',    title: '한전 계통망 용량', description: '계통 여유 있음',
      gridCapacity: { totalMW: 800, usedMW: 500, availableMW: 300, waitingQueue: 5 } },
    { id: 'setback_distance',status: 'warning', title: '이격거리', description: '도심 인접지 이격 확보 제한' },
    { id: 'national_law',    status: 'pass',    title: '전국 공통 법규', description: '허가 요건 충족' },
    { id: 'local_ordinance', status: 'warning', title: '지자체 조례', description: '계룡산 인근 자연환경보전지역 규제' },
  ]),
];
