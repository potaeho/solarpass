import type { FeasibilityCheck, Region } from '../types/region';
import { computeFeasibilityStatus } from '../utils/feasibilityScore';
import { getSolarGrade } from './solarStats';

function makeCity(
  id: string,
  name: string,
  shortName: string,
  province: string,
  lat: number,
  lon: number,
  solarMWh: number,
  checks: FeasibilityCheck[],
): Region {
  return {
    id,
    name,
    shortName,
    province,
    latitude: lat,
    longitude: lon,
    checks,
    feasibilityStatus: computeFeasibilityStatus(checks),
    solarGrade: getSolarGrade(solarMWh),
    updatedAt: '2025-01-01',
  };
}

// ─── 전라남도 ──────────────────────────────────────────────────────────────
const JEONNAM_CITIES: Region[] = [
  makeCity('jeonnam-naju', '전라남도 나주시', '나주시', '전라남도', 35.016, 126.711, 980000, [
    { id: 'land_use', status: 'pass', title: '토지이용계획', description: '농지전용 가능 지역 다수' },
    { id: 'grid_capacity', status: 'warning', title: '한전 계통망 용량', description: '접속 대기 발생 중', gridCapacity: { totalMW: 1200, usedMW: 980, availableMW: 220, waitingQueue: 34 } },
    { id: 'setback_distance', status: 'pass', title: '이격거리', description: '이격 기준 충족 가능' },
    { id: 'national_law', status: 'pass', title: '공통법규', description: '허가 요건 충족' },
    { id: 'local_ordinance', status: 'warning', title: '지자체 조례', description: '경관심의 추가 요구' },
  ]),
  makeCity('jeonnam-yeongam', '전라남도 영암군', '영암군', '전라남도', 34.801, 126.696, 1100000, [
    { id: 'land_use', status: 'pass', title: '토지이용계획', description: '솔라파크 지정 구역' },
    { id: 'grid_capacity', status: 'pass', title: '한전 계통망 용량', description: '154kV 전용 선로 확보', gridCapacity: { totalMW: 2000, usedMW: 1450, availableMW: 550, waitingQueue: 12 } },
    { id: 'setback_distance', status: 'pass', title: '이격거리', description: '충족' },
    { id: 'national_law', status: 'pass', title: '공통법규', description: '허가 요건 충족' },
    { id: 'local_ordinance', status: 'pass', title: '지자체 조례', description: '별도 제한 없음' },
  ]),
  makeCity('jeonnam-haenam', '전라남도 해남군', '해남군', '전라남도', 34.571, 126.599, 1050000, [
    { id: 'land_use', status: 'pass', title: '토지이용계획', description: '임야·농지 전용 가능' },
    { id: 'grid_capacity', status: 'warning', title: '한전 계통망 용량', description: '일부 지역 포화', gridCapacity: { totalMW: 900, usedMW: 750, availableMW: 150, waitingQueue: 22 } },
    { id: 'setback_distance', status: 'pass', title: '이격거리', description: '충족' },
    { id: 'national_law', status: 'pass', title: '공통법규', description: '허가 요건 충족' },
    { id: 'local_ordinance', status: 'pass', title: '지자체 조례', description: '별도 제한 없음' },
  ]),
  makeCity('jeonnam-sinan', '전라남도 신안군', '신안군', '전라남도', 34.841, 126.107, 900000, [
    { id: 'land_use', status: 'pass', title: '토지이용계획', description: '수상태양광 적합 지역' },
    { id: 'grid_capacity', status: 'fail', title: '한전 계통망 용량', description: '계통 포화 - 대기 多', gridCapacity: { totalMW: 600, usedMW: 590, availableMW: 10, waitingQueue: 61 } },
    { id: 'setback_distance', status: 'pass', title: '이격거리', description: '충족' },
    { id: 'national_law', status: 'pass', title: '공통법규', description: '허가 요건 충족' },
    { id: 'local_ordinance', status: 'warning', title: '지자체 조례', description: '수상태양광 특별 심의' },
  ]),
  makeCity('jeonnam-yeonggwang', '전라남도 영광군', '영광군', '전라남도', 35.277, 126.512, 870000, [
    { id: 'land_use', status: 'pass', title: '토지이용계획', description: '농지 전용 가능' },
    { id: 'grid_capacity', status: 'pass', title: '한전 계통망 용량', description: '여유 용량 확보', gridCapacity: { totalMW: 800, usedMW: 500, availableMW: 300, waitingQueue: 8 } },
    { id: 'setback_distance', status: 'pass', title: '이격거리', description: '충족' },
    { id: 'national_law', status: 'pass', title: '공통법규', description: '허가 요건 충족' },
    { id: 'local_ordinance', status: 'pass', title: '지자체 조례', description: '별도 제한 없음' },
  ]),
  makeCity('jeonnam-goheung', '전라남도 고흥군', '고흥군', '전라남도', 34.611, 127.282, 820000, [
    { id: 'land_use', status: 'pass', title: '토지이용계획', description: '임야 전용 가능' },
    { id: 'grid_capacity', status: 'warning', title: '한전 계통망 용량', description: '용량 여유 제한적', gridCapacity: { totalMW: 500, usedMW: 390, availableMW: 110, waitingQueue: 19 } },
    { id: 'setback_distance', status: 'pass', title: '이격거리', description: '충족' },
    { id: 'national_law', status: 'pass', title: '공통법규', description: '허가 요건 충족' },
    { id: 'local_ordinance', status: 'warning', title: '지자체 조례', description: '환경영향평가 필요' },
  ]),
  makeCity('jeonnam-muan', '전라남도 무안군', '무안군', '전라남도', 34.994, 126.481, 760000, [
    { id: 'land_use', status: 'pass', title: '토지이용계획', description: '농지 전용 가능' },
    { id: 'grid_capacity', status: 'pass', title: '한전 계통망 용량', description: '여유 충분', gridCapacity: { totalMW: 600, usedMW: 350, availableMW: 250, waitingQueue: 5 } },
    { id: 'setback_distance', status: 'pass', title: '이격거리', description: '충족' },
    { id: 'national_law', status: 'pass', title: '공통법규', description: '허가 요건 충족' },
    { id: 'local_ordinance', status: 'pass', title: '지자체 조례', description: '별도 제한 없음' },
  ]),
  makeCity('jeonnam-wando', '전라남도 완도군', '완도군', '전라남도', 34.311, 126.755, 700000, [
    { id: 'land_use', status: 'warning', title: '토지이용계획', description: '도서지역 개발 제한' },
    { id: 'grid_capacity', status: 'warning', title: '한전 계통망 용량', description: '도서 계통 제약', gridCapacity: { totalMW: 300, usedMW: 240, availableMW: 60, waitingQueue: 14 } },
    { id: 'setback_distance', status: 'pass', title: '이격거리', description: '충족' },
    { id: 'national_law', status: 'pass', title: '공통법규', description: '허가 요건 충족' },
    { id: 'local_ordinance', status: 'warning', title: '지자체 조례', description: '도서 개발 특별 심의' },
  ]),
];

// ─── 충청남도 ──────────────────────────────────────────────────────────────
const CHUNGNAM_CITIES: Region[] = [
  makeCity('chungnam-dangjin', '충청남도 당진시', '당진시', '충청남도', 36.890, 126.645, 580000, [
    { id: 'land_use', status: 'pass', title: '토지이용계획', description: '농지·산지 전용 가능' },
    { id: 'grid_capacity', status: 'pass', title: '한전 계통망 용량', description: '서해안 변전소 여유', gridCapacity: { totalMW: 900, usedMW: 560, availableMW: 340, waitingQueue: 7 } },
    { id: 'setback_distance', status: 'pass', title: '이격거리', description: '충족' },
    { id: 'national_law', status: 'pass', title: '공통법규', description: '허가 요건 충족' },
    { id: 'local_ordinance', status: 'pass', title: '지자체 조례', description: '별도 제한 없음' },
  ]),
  makeCity('chungnam-taean', '충청남도 태안군', '태안군', '충청남도', 36.745, 126.298, 620000, [
    { id: 'land_use', status: 'pass', title: '토지이용계획', description: '염전·유휴지 활용 가능' },
    { id: 'grid_capacity', status: 'warning', title: '한전 계통망 용량', description: '접속 대기 증가', gridCapacity: { totalMW: 800, usedMW: 650, availableMW: 150, waitingQueue: 28 } },
    { id: 'setback_distance', status: 'pass', title: '이격거리', description: '충족' },
    { id: 'national_law', status: 'pass', title: '공통법규', description: '허가 요건 충족' },
    { id: 'local_ordinance', status: 'warning', title: '지자체 조례', description: '국립공원 인접 심의' },
  ]),
  makeCity('chungnam-seosan', '충청남도 서산시', '서산시', '충청남도', 36.784, 126.450, 540000, [
    { id: 'land_use', status: 'pass', title: '토지이용계획', description: '농지 전용 가능' },
    { id: 'grid_capacity', status: 'pass', title: '한전 계통망 용량', description: '여유 충분', gridCapacity: { totalMW: 700, usedMW: 400, availableMW: 300, waitingQueue: 6 } },
    { id: 'setback_distance', status: 'pass', title: '이격거리', description: '충족' },
    { id: 'national_law', status: 'pass', title: '공통법규', description: '허가 요건 충족' },
    { id: 'local_ordinance', status: 'pass', title: '지자체 조례', description: '별도 제한 없음' },
  ]),
  makeCity('chungnam-hongseong', '충청남도 홍성군', '홍성군', '충청남도', 36.601, 126.661, 460000, [
    { id: 'land_use', status: 'pass', title: '토지이용계획', description: '농지 전용 가능' },
    { id: 'grid_capacity', status: 'pass', title: '한전 계통망 용량', description: '여유 충분', gridCapacity: { totalMW: 500, usedMW: 290, availableMW: 210, waitingQueue: 4 } },
    { id: 'setback_distance', status: 'pass', title: '이격거리', description: '충족' },
    { id: 'national_law', status: 'pass', title: '공통법규', description: '허가 요건 충족' },
    { id: 'local_ordinance', status: 'pass', title: '지자체 조례', description: '별도 제한 없음' },
  ]),
  makeCity('chungnam-boryeong', '충청남도 보령시', '보령시', '충청남도', 36.333, 126.612, 420000, [
    { id: 'land_use', status: 'pass', title: '토지이용계획', description: '농지 전용 가능' },
    { id: 'grid_capacity', status: 'warning', title: '한전 계통망 용량', description: '일부 지역 제약', gridCapacity: { totalMW: 400, usedMW: 310, availableMW: 90, waitingQueue: 15 } },
    { id: 'setback_distance', status: 'pass', title: '이격거리', description: '충족' },
    { id: 'national_law', status: 'pass', title: '공통법규', description: '허가 요건 충족' },
    { id: 'local_ordinance', status: 'warning', title: '지자체 조례', description: '해안경관 심의' },
  ]),
];

// ─── 경상북도 ──────────────────────────────────────────────────────────────
const GYEONGBUK_CITIES: Region[] = [
  makeCity('gyeongbuk-gyeongju', '경상북도 경주시', '경주시', '경상북도', 35.856, 129.225, 510000, [
    { id: 'land_use', status: 'pass', title: '토지이용계획', description: '농지 전용 가능' },
    { id: 'grid_capacity', status: 'pass', title: '한전 계통망 용량', description: '원전 연계 변전소 여유', gridCapacity: { totalMW: 1000, usedMW: 620, availableMW: 380, waitingQueue: 9 } },
    { id: 'setback_distance', status: 'pass', title: '이격거리', description: '충족' },
    { id: 'national_law', status: 'pass', title: '공통법규', description: '허가 요건 충족' },
    { id: 'local_ordinance', status: 'warning', title: '지자체 조례', description: '문화재 인접 심의' },
  ]),
  makeCity('gyeongbuk-yeongdeok', '경상북도 영덕군', '영덕군', '경상북도', 36.415, 129.365, 480000, [
    { id: 'land_use', status: 'pass', title: '토지이용계획', description: '임야 전용 가능' },
    { id: 'grid_capacity', status: 'pass', title: '한전 계통망 용량', description: '여유 충분', gridCapacity: { totalMW: 600, usedMW: 370, availableMW: 230, waitingQueue: 6 } },
    { id: 'setback_distance', status: 'pass', title: '이격거리', description: '충족' },
    { id: 'national_law', status: 'pass', title: '공통법규', description: '허가 요건 충족' },
    { id: 'local_ordinance', status: 'pass', title: '지자체 조례', description: '별도 제한 없음' },
  ]),
  makeCity('gyeongbuk-uljin', '경상북도 울진군', '울진군', '경상북도', 36.993, 129.400, 450000, [
    { id: 'land_use', status: 'pass', title: '토지이용계획', description: '임야 전용 가능' },
    { id: 'grid_capacity', status: 'pass', title: '한전 계통망 용량', description: '원전 연계 여유', gridCapacity: { totalMW: 700, usedMW: 420, availableMW: 280, waitingQueue: 5 } },
    { id: 'setback_distance', status: 'pass', title: '이격거리', description: '충족' },
    { id: 'national_law', status: 'pass', title: '공통법규', description: '허가 요건 충족' },
    { id: 'local_ordinance', status: 'pass', title: '지자체 조례', description: '별도 제한 없음' },
  ]),
  makeCity('gyeongbuk-pohang', '경상북도 포항시', '포항시', '경상북도', 36.019, 129.343, 430000, [
    { id: 'land_use', status: 'warning', title: '토지이용계획', description: '산업단지 인접 제약' },
    { id: 'grid_capacity', status: 'warning', title: '한전 계통망 용량', description: '산업 수요 경합', gridCapacity: { totalMW: 1500, usedMW: 1200, availableMW: 300, waitingQueue: 31 } },
    { id: 'setback_distance', status: 'pass', title: '이격거리', description: '충족' },
    { id: 'national_law', status: 'pass', title: '공통법규', description: '허가 요건 충족' },
    { id: 'local_ordinance', status: 'warning', title: '지자체 조례', description: '항만구역 심의' },
  ]),
];

// ─── 경상남도 ──────────────────────────────────────────────────────────────
const GYEONGNAM_CITIES: Region[] = [
  makeCity('gyeongnam-miryang', '경상남도 밀양시', '밀양시', '경상남도', 35.503, 128.746, 420000, [
    { id: 'land_use', status: 'pass', title: '토지이용계획', description: '농지 전용 가능' },
    { id: 'grid_capacity', status: 'pass', title: '한전 계통망 용량', description: '765kV 변전소 인접', gridCapacity: { totalMW: 800, usedMW: 490, availableMW: 310, waitingQueue: 7 } },
    { id: 'setback_distance', status: 'pass', title: '이격거리', description: '충족' },
    { id: 'national_law', status: 'pass', title: '공통법규', description: '허가 요건 충족' },
    { id: 'local_ordinance', status: 'pass', title: '지자체 조례', description: '별도 제한 없음' },
  ]),
  makeCity('gyeongnam-goseong', '경상남도 고성군', '고성군', '경상남도', 34.973, 128.283, 390000, [
    { id: 'land_use', status: 'pass', title: '토지이용계획', description: '농지 전용 가능' },
    { id: 'grid_capacity', status: 'warning', title: '한전 계통망 용량', description: '제한적 여유', gridCapacity: { totalMW: 400, usedMW: 310, availableMW: 90, waitingQueue: 17 } },
    { id: 'setback_distance', status: 'pass', title: '이격거리', description: '충족' },
    { id: 'national_law', status: 'pass', title: '공통법규', description: '허가 요건 충족' },
    { id: 'local_ordinance', status: 'warning', title: '지자체 조례', description: '공룡화석지 인접 심의' },
  ]),
  makeCity('gyeongnam-haman', '경상남도 함안군', '함안군', '경상남도', 35.273, 128.406, 360000, [
    { id: 'land_use', status: 'pass', title: '토지이용계획', description: '농지 전용 가능' },
    { id: 'grid_capacity', status: 'pass', title: '한전 계통망 용량', description: '여유 충분', gridCapacity: { totalMW: 500, usedMW: 290, availableMW: 210, waitingQueue: 5 } },
    { id: 'setback_distance', status: 'pass', title: '이격거리', description: '충족' },
    { id: 'national_law', status: 'pass', title: '공통법규', description: '허가 요건 충족' },
    { id: 'local_ordinance', status: 'pass', title: '지자체 조례', description: '별도 제한 없음' },
  ]),
];

// ─── 전라북도 ──────────────────────────────────────────────────────────────
const JEONBUK_CITIES: Region[] = [
  makeCity('jeonbuk-gunsan', '전라북도 군산시', '군산시', '전라북도', 35.967, 126.737, 520000, [
    { id: 'land_use', status: 'pass', title: '토지이용계획', description: '새만금 수상 적합' },
    { id: 'grid_capacity', status: 'warning', title: '한전 계통망 용량', description: '새만금 사업 경합', gridCapacity: { totalMW: 1000, usedMW: 820, availableMW: 180, waitingQueue: 42 } },
    { id: 'setback_distance', status: 'pass', title: '이격거리', description: '충족' },
    { id: 'national_law', status: 'pass', title: '공통법규', description: '허가 요건 충족' },
    { id: 'local_ordinance', status: 'warning', title: '지자체 조례', description: '새만금 특구 별도 규정' },
  ]),
  makeCity('jeonbuk-jeongeup', '전라북도 정읍시', '정읍시', '전라북도', 35.570, 126.856, 460000, [
    { id: 'land_use', status: 'pass', title: '토지이용계획', description: '농지 전용 가능' },
    { id: 'grid_capacity', status: 'pass', title: '한전 계통망 용량', description: '여유 충분', gridCapacity: { totalMW: 600, usedMW: 360, availableMW: 240, waitingQueue: 8 } },
    { id: 'setback_distance', status: 'pass', title: '이격거리', description: '충족' },
    { id: 'national_law', status: 'pass', title: '공통법규', description: '허가 요건 충족' },
    { id: 'local_ordinance', status: 'pass', title: '지자체 조례', description: '별도 제한 없음' },
  ]),
  makeCity('jeonbuk-gochang', '전라북도 고창군', '고창군', '전라북도', 35.435, 126.702, 430000, [
    { id: 'land_use', status: 'pass', title: '토지이용계획', description: '농지 전용 가능' },
    { id: 'grid_capacity', status: 'pass', title: '한전 계통망 용량', description: '여유 충분', gridCapacity: { totalMW: 500, usedMW: 290, availableMW: 210, waitingQueue: 6 } },
    { id: 'setback_distance', status: 'pass', title: '이격거리', description: '충족' },
    { id: 'national_law', status: 'pass', title: '공통법규', description: '허가 요건 충족' },
    { id: 'local_ordinance', status: 'warning', title: '지자체 조례', description: '유네스코 생물권 인접' },
  ]),
];

// ─── 제주특별자치도 ────────────────────────────────────────────────────────
const JEJU_CITIES: Region[] = [
  makeCity('jeju-jeju', '제주특별자치도 제주시', '제주시', '제주특별자치도', 33.499, 126.531, 240000, [
    { id: 'land_use', status: 'warning', title: '토지이용계획', description: '중산간 개발 제한' },
    { id: 'grid_capacity', status: 'fail', title: '한전 계통망 용량', description: '출력제한 상시 발생', gridCapacity: { totalMW: 500, usedMW: 495, availableMW: 5, waitingQueue: 88 } },
    { id: 'setback_distance', status: 'pass', title: '이격거리', description: '충족' },
    { id: 'national_law', status: 'pass', title: '공통법규', description: '허가 요건 충족' },
    { id: 'local_ordinance', status: 'warning', title: '지자체 조례', description: '경관 심의 강화' },
  ]),
  makeCity('jeju-seogwipo', '제주특별자치도 서귀포시', '서귀포시', '제주특별자치도', 33.253, 126.560, 260000, [
    { id: 'land_use', status: 'warning', title: '토지이용계획', description: '관광지 인접 제한' },
    { id: 'grid_capacity', status: 'fail', title: '한전 계통망 용량', description: '계통 포화 심각', gridCapacity: { totalMW: 400, usedMW: 398, availableMW: 2, waitingQueue: 73 } },
    { id: 'setback_distance', status: 'pass', title: '이격거리', description: '충족' },
    { id: 'national_law', status: 'pass', title: '공통법규', description: '허가 요건 충족' },
    { id: 'local_ordinance', status: 'fail', title: '지자체 조례', description: '세계자연유산 인근 불가' },
  ]),
];

// ─── 강원도 (18개 시·군) ───────────────────────────────────────────────────
const GANGWON_CITIES: Region[] = [
  // ── 시 (7개) ──
  makeCity('gangwon-chuncheon', '강원특별자치도 춘천시', '춘천시', '강원도', 37.882, 127.730, 250000, [
    { id: 'land_use', status: 'pass', title: '토지이용계획', description: '관리지역·임야 활용 가능' },
    { id: 'grid_capacity', status: 'warning', title: '한전 계통망 용량', description: '계통 대기 발생 중', gridCapacity: { totalMW: 800, usedMW: 620, availableMW: 180, waitingQueue: 28 } },
    { id: 'setback_distance', status: 'pass', title: '이격거리', description: '이격 기준 충족' },
    { id: 'national_law', status: 'pass', title: '공통법규', description: '허가 요건 충족' },
    { id: 'local_ordinance', status: 'warning', title: '지자체 조례', description: '경관심의 필요 구역 있음' },
  ]),
  makeCity('gangwon-wonju', '강원특별자치도 원주시', '원주시', '강원도', 37.342, 127.921, 280000, [
    { id: 'land_use', status: 'pass', title: '토지이용계획', description: '농지·임야 전용 가능' },
    { id: 'grid_capacity', status: 'pass', title: '한전 계통망 용량', description: '여유 충분', gridCapacity: { totalMW: 500, usedMW: 260, availableMW: 240, waitingQueue: 3 } },
    { id: 'setback_distance', status: 'pass', title: '이격거리', description: '충족' },
    { id: 'national_law', status: 'pass', title: '공통법규', description: '허가 요건 충족' },
    { id: 'local_ordinance', status: 'pass', title: '지자체 조례', description: '별도 제한 없음' },
  ]),
  makeCity('gangwon-gangneung', '강원특별자치도 강릉시', '강릉시', '강원도', 37.751, 128.876, 310000, [
    { id: 'land_use', status: 'pass', title: '토지이용계획', description: '동해안 인근 임야 전용 가능' },
    { id: 'grid_capacity', status: 'pass', title: '한전 계통망 용량', description: '동해안 선로 여유 충분', gridCapacity: { totalMW: 600, usedMW: 310, availableMW: 290, waitingQueue: 4 } },
    { id: 'setback_distance', status: 'pass', title: '이격거리', description: '충족' },
    { id: 'national_law', status: 'pass', title: '공통법규', description: '허가 요건 충족' },
    { id: 'local_ordinance', status: 'pass', title: '지자체 조례', description: '별도 제한 없음' },
  ]),
  makeCity('gangwon-donghae', '강원특별자치도 동해시', '동해시', '강원도', 37.524, 129.114, 290000, [
    { id: 'land_use', status: 'pass', title: '토지이용계획', description: '임야·농지 전용 가능' },
    { id: 'grid_capacity', status: 'pass', title: '한전 계통망 용량', description: '동해안 선로 여유', gridCapacity: { totalMW: 450, usedMW: 260, availableMW: 190, waitingQueue: 8 } },
    { id: 'setback_distance', status: 'pass', title: '이격거리', description: '충족' },
    { id: 'national_law', status: 'pass', title: '공통법규', description: '허가 요건 충족' },
    { id: 'local_ordinance', status: 'pass', title: '지자체 조례', description: '별도 제한 없음' },
  ]),
  makeCity('gangwon-taebaek', '강원특별자치도 태백시', '태백시', '강원도', 37.164, 128.985, 220000, [
    { id: 'land_use', status: 'warning', title: '토지이용계획', description: '고지대·임야 비율 높아 개발행위 까다로움' },
    { id: 'grid_capacity', status: 'pass', title: '한전 계통망 용량', description: '여유 있음', gridCapacity: { totalMW: 350, usedMW: 180, availableMW: 170, waitingQueue: 5 } },
    { id: 'setback_distance', status: 'pass', title: '이격거리', description: '충족' },
    { id: 'national_law', status: 'pass', title: '공통법규', description: '허가 요건 충족' },
    { id: 'local_ordinance', status: 'pass', title: '지자체 조례', description: '별도 제한 없음' },
  ]),
  makeCity('gangwon-sokcho', '강원특별자치도 속초시', '속초시', '강원도', 38.208, 128.592, 270000, [
    { id: 'land_use', status: 'warning', title: '토지이용계획', description: '설악산 국립공원 인근 개발 제한' },
    { id: 'grid_capacity', status: 'pass', title: '한전 계통망 용량', description: '해안 선로 여유', gridCapacity: { totalMW: 320, usedMW: 180, availableMW: 140, waitingQueue: 10 } },
    { id: 'setback_distance', status: 'pass', title: '이격거리', description: '충족' },
    { id: 'national_law', status: 'warning', title: '공통법규', description: '국립공원 인접 구역 개발 제한 적용' },
    { id: 'local_ordinance', status: 'warning', title: '지자체 조례', description: '관광·경관 보호 조례 강화' },
  ]),
  makeCity('gangwon-samcheok', '강원특별자치도 삼척시', '삼척시', '강원도', 37.450, 129.165, 300000, [
    { id: 'land_use', status: 'pass', title: '토지이용계획', description: '해안·임야 전용 가능' },
    { id: 'grid_capacity', status: 'pass', title: '한전 계통망 용량', description: '동해안 선로 여유', gridCapacity: { totalMW: 420, usedMW: 250, availableMW: 170, waitingQueue: 7 } },
    { id: 'setback_distance', status: 'pass', title: '이격거리', description: '충족' },
    { id: 'national_law', status: 'pass', title: '공통법규', description: '허가 요건 충족' },
    { id: 'local_ordinance', status: 'pass', title: '지자체 조례', description: '별도 제한 없음' },
  ]),
  // ── 군 (11개) ──
  makeCity('gangwon-hongcheon', '강원특별자치도 홍천군', '홍천군', '강원도', 37.697, 127.889, 240000, [
    { id: 'land_use', status: 'pass', title: '토지이용계획', description: '임야 전용 가능' },
    { id: 'grid_capacity', status: 'warning', title: '한전 계통망 용량', description: '용량 여유 제한적', gridCapacity: { totalMW: 320, usedMW: 245, availableMW: 75, waitingQueue: 14 } },
    { id: 'setback_distance', status: 'pass', title: '이격거리', description: '충족' },
    { id: 'national_law', status: 'pass', title: '공통법규', description: '허가 요건 충족' },
    { id: 'local_ordinance', status: 'pass', title: '지자체 조례', description: '별도 제한 없음' },
  ]),
  makeCity('gangwon-hoengseong', '강원특별자치도 횡성군', '횡성군', '강원도', 37.492, 127.984, 230000, [
    { id: 'land_use', status: 'pass', title: '토지이용계획', description: '농지·임야 전용 가능' },
    { id: 'grid_capacity', status: 'pass', title: '한전 계통망 용량', description: '여유 충분', gridCapacity: { totalMW: 280, usedMW: 155, availableMW: 125, waitingQueue: 5 } },
    { id: 'setback_distance', status: 'pass', title: '이격거리', description: '충족' },
    { id: 'national_law', status: 'pass', title: '공통법규', description: '허가 요건 충족' },
    { id: 'local_ordinance', status: 'pass', title: '지자체 조례', description: '별도 제한 없음' },
  ]),
  makeCity('gangwon-yeongwol', '강원특별자치도 영월군', '영월군', '강원도', 37.183, 128.462, 260000, [
    { id: 'land_use', status: 'pass', title: '토지이용계획', description: '임야 전용 가능' },
    { id: 'grid_capacity', status: 'pass', title: '한전 계통망 용량', description: '여유 충분', gridCapacity: { totalMW: 300, usedMW: 165, availableMW: 135, waitingQueue: 6 } },
    { id: 'setback_distance', status: 'pass', title: '이격거리', description: '충족' },
    { id: 'national_law', status: 'pass', title: '공통법규', description: '허가 요건 충족' },
    { id: 'local_ordinance', status: 'warning', title: '지자체 조례', description: '석탄산업 전환지역 특별 심의 대상' },
  ]),
  makeCity('gangwon-pyeongchang', '강원특별자치도 평창군', '평창군', '강원도', 37.370, 128.488, 210000, [
    { id: 'land_use', status: 'warning', title: '토지이용계획', description: '오대산 국립공원 인근 개발 제한' },
    { id: 'grid_capacity', status: 'pass', title: '한전 계통망 용량', description: '여유 있음', gridCapacity: { totalMW: 280, usedMW: 155, availableMW: 125, waitingQueue: 5 } },
    { id: 'setback_distance', status: 'pass', title: '이격거리', description: '충족' },
    { id: 'national_law', status: 'warning', title: '공통법규', description: '오대산 국립공원 인접 구역 개발 제한' },
    { id: 'local_ordinance', status: 'warning', title: '지자체 조례', description: '동계올림픽 유산지구 경관 조례' },
  ]),
  makeCity('gangwon-jeongseon', '강원특별자치도 정선군', '정선군', '강원도', 37.380, 128.661, 220000, [
    { id: 'land_use', status: 'warning', title: '토지이용계획', description: '산악 지형·임야 비율 높아 개발 까다로움' },
    { id: 'grid_capacity', status: 'pass', title: '한전 계통망 용량', description: '여유 충분', gridCapacity: { totalMW: 240, usedMW: 130, availableMW: 110, waitingQueue: 4 } },
    { id: 'setback_distance', status: 'pass', title: '이격거리', description: '충족' },
    { id: 'national_law', status: 'pass', title: '공통법규', description: '허가 요건 충족' },
    { id: 'local_ordinance', status: 'warning', title: '지자체 조례', description: '폐광지역 특별 관리 구역 심의' },
  ]),
  makeCity('gangwon-cheorwon', '강원특별자치도 철원군', '철원군', '강원도', 38.147, 127.314, 200000, [
    { id: 'land_use', status: 'pass', title: '토지이용계획', description: '농지·관리지역 전용 가능' },
    { id: 'grid_capacity', status: 'pass', title: '한전 계통망 용량', description: '여유 있음', gridCapacity: { totalMW: 280, usedMW: 155, availableMW: 125, waitingQueue: 7 } },
    { id: 'setback_distance', status: 'warning', title: '이격거리', description: '군사시설 이격거리 추가 검토 필요' },
    { id: 'national_law', status: 'warning', title: '공통법규', description: '군사시설보호구역 내 개발행위 허가 제한' },
    { id: 'local_ordinance', status: 'pass', title: '지자체 조례', description: '별도 제한 없음' },
  ]),
  makeCity('gangwon-hwacheon', '강원특별자치도 화천군', '화천군', '강원도', 38.106, 127.708, 190000, [
    { id: 'land_use', status: 'pass', title: '토지이용계획', description: '임야·관리지역 활용 가능' },
    { id: 'grid_capacity', status: 'pass', title: '한전 계통망 용량', description: '여유 충분', gridCapacity: { totalMW: 200, usedMW: 105, availableMW: 95, waitingQueue: 3 } },
    { id: 'setback_distance', status: 'warning', title: '이격거리', description: '군사시설 이격거리 추가 검토 필요' },
    { id: 'national_law', status: 'warning', title: '공통법규', description: '군사시설보호구역 범위 넓어 개발 제한' },
    { id: 'local_ordinance', status: 'pass', title: '지자체 조례', description: '별도 제한 없음' },
  ]),
  makeCity('gangwon-yanggu', '강원특별자치도 양구군', '양구군', '강원도', 38.109, 127.989, 185000, [
    { id: 'land_use', status: 'pass', title: '토지이용계획', description: '임야 전용 가능' },
    { id: 'grid_capacity', status: 'pass', title: '한전 계통망 용량', description: '여유 충분', gridCapacity: { totalMW: 180, usedMW: 90, availableMW: 90, waitingQueue: 2 } },
    { id: 'setback_distance', status: 'warning', title: '이격거리', description: '군사시설 이격거리 적용 구역 다수' },
    { id: 'national_law', status: 'warning', title: '공통법규', description: '군사시설보호구역 비율 높아 입지 제한' },
    { id: 'local_ordinance', status: 'pass', title: '지자체 조례', description: '별도 제한 없음' },
  ]),
  makeCity('gangwon-inje', '강원특별자치도 인제군', '인제군', '강원도', 38.069, 128.171, 195000, [
    { id: 'land_use', status: 'pass', title: '토지이용계획', description: '임야 전용 가능 구역 있음' },
    { id: 'grid_capacity', status: 'pass', title: '한전 계통망 용량', description: '여유 충분', gridCapacity: { totalMW: 210, usedMW: 110, availableMW: 100, waitingQueue: 4 } },
    { id: 'setback_distance', status: 'pass', title: '이격거리', description: '충족' },
    { id: 'national_law', status: 'warning', title: '공통법규', description: '설악산 국립공원 인접 구역 개발 제한' },
    { id: 'local_ordinance', status: 'pass', title: '지자체 조례', description: '별도 제한 없음' },
  ]),
  makeCity('gangwon-goseong', '강원특별자치도 고성군', '고성군', '강원도', 38.380, 128.468, 260000, [
    { id: 'land_use', status: 'pass', title: '토지이용계획', description: '동해안 인근 개발 가능' },
    { id: 'grid_capacity', status: 'pass', title: '한전 계통망 용량', description: '해안 선로 여유', gridCapacity: { totalMW: 240, usedMW: 140, availableMW: 100, waitingQueue: 6 } },
    { id: 'setback_distance', status: 'pass', title: '이격거리', description: '충족' },
    { id: 'national_law', status: 'warning', title: '공통법규', description: 'DMZ 인근 접경지역 개발 사전 협의 필요' },
    { id: 'local_ordinance', status: 'pass', title: '지자체 조례', description: '별도 제한 없음' },
  ]),
  makeCity('gangwon-yangyang', '강원특별자치도 양양군', '양양군', '강원도', 38.075, 128.619, 280000, [
    { id: 'land_use', status: 'pass', title: '토지이용계획', description: '동해안 임야·농지 전용 가능' },
    { id: 'grid_capacity', status: 'pass', title: '한전 계통망 용량', description: '여유 충분', gridCapacity: { totalMW: 290, usedMW: 160, availableMW: 130, waitingQueue: 7 } },
    { id: 'setback_distance', status: 'pass', title: '이격거리', description: '충족' },
    { id: 'national_law', status: 'pass', title: '공통법규', description: '허가 요건 충족' },
    { id: 'local_ordinance', status: 'pass', title: '지자체 조례', description: '별도 제한 없음' },
  ]),
];

// ─── 경기도 ────────────────────────────────────────────────────────────────
const GYEONGGI_CITIES: Region[] = [
  makeCity('gyeonggi-hwaseong', '경기도 화성시', '화성시', '경기도', 37.200, 126.830, 380000, [
    { id: 'land_use', status: 'warning', title: '토지이용계획', description: '개발압력 높아 제한' },
    { id: 'grid_capacity', status: 'warning', title: '한전 계통망 용량', description: '수도권 부하 경합', gridCapacity: { totalMW: 1200, usedMW: 950, availableMW: 250, waitingQueue: 38 } },
    { id: 'setback_distance', status: 'pass', title: '이격거리', description: '충족' },
    { id: 'national_law', status: 'pass', title: '공통법규', description: '허가 요건 충족' },
    { id: 'local_ordinance', status: 'warning', title: '지자체 조례', description: '경관 조례 강화' },
  ]),
  makeCity('gyeonggi-anseong', '경기도 안성시', '안성시', '경기도', 37.008, 127.280, 340000, [
    { id: 'land_use', status: 'pass', title: '토지이용계획', description: '농지 전용 가능' },
    { id: 'grid_capacity', status: 'warning', title: '한전 계통망 용량', description: '용량 제한적', gridCapacity: { totalMW: 700, usedMW: 540, availableMW: 160, waitingQueue: 21 } },
    { id: 'setback_distance', status: 'pass', title: '이격거리', description: '충족' },
    { id: 'national_law', status: 'pass', title: '공통법규', description: '허가 요건 충족' },
    { id: 'local_ordinance', status: 'pass', title: '지자체 조례', description: '별도 제한 없음' },
  ]),
];

// ─── 전체 매핑 ─────────────────────────────────────────────────────────────
export const CITIES_BY_PROVINCE: Record<string, Region[]> = {
  '전라남도':         JEONNAM_CITIES,
  '충청남도':         CHUNGNAM_CITIES,
  '경상북도':         GYEONGBUK_CITIES,
  '경상남도':         GYEONGNAM_CITIES,
  '전라북도':         JEONBUK_CITIES,
  '전북특별자치도':   JEONBUK_CITIES,
  '제주특별자치도':   JEJU_CITIES,
  '강원도':           GANGWON_CITIES,
  '강원특별자치도':   GANGWON_CITIES,
  '경기도':           GYEONGGI_CITIES,
};

export function getCitiesByProvince(province: string): Region[] {
  return CITIES_BY_PROVINCE[province] ?? [];
}
