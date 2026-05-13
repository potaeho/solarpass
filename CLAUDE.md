# SolarMap — Claude Code 프로젝트 컨텍스트
## 프로젝트 개요
태양광 발전 인허가 플랫폼 모바일 앱.
사용자가 전국 지도에서 특정 지역을 선택하면 태양광 설치 가능 여부를 분석하고,
인허가 프로세스 전체를 단계별로 안내하며 전문 업체를 연결해주는 서비스다.
**핵심 가치**: 복잡한 태양광 인허가 과정을 지도 기반 UI로 단순화
---
## 기술 스택
| 항목 | 기술 |
|------|------|
| 프레임워크 | React Native 0.74+ |
| 개발 환경 | Expo SDK 51 (Expo Go 호환) |
| 언어 | TypeScript (strict mode) |
| 내비게이션 | Expo Router v3 (파일 기반 라우팅) |
| 지도 | react-native-maps (네이버 지도 UX 레퍼런스) |
| 상태관리 | Zustand |
| 서버 상태 | TanStack Query v5 |
| 스타일링 | StyleSheet (NativeWind 미사용, 일관성 위해 StyleSheet만) |
| 폼 | React Hook Form + Zod |
| 아이콘 | @expo/vector-icons (Ionicons) |
| HTTP | axios |
| 테스트 | Jest + React Native Testing Library |
---
## 폴더 구조
```
solarmap/
├── app/                          # Expo Router 라우트 (화면 파일)
│   ├── (tabs)/
│   │   ├── index.tsx             # 지도 홈 탭
│   │   ├── permit.tsx            # 인허가 현황 탭
│   │   ├── status.tsx            # 진행현황 탭
│   │   ├── office.tsx            # 토목사무소 탭
│   │   └── my.tsx                # MY 탭
│   ├── region/
│   │   └── [id].tsx              # 지역 상세 화면
│   ├── permit-flow/
│   │   ├── [regionId]/
│   │   │   ├── index.tsx         # 인허가 단계 목록
│   │   │   ├── step/[stepId].tsx # 단계별 업체 선택
│   │   │   └── office.tsx        # 토목사무소 연결
│   └── _layout.tsx
│
├── src/
│   ├── components/               # 재사용 컴포넌트
│   │   ├── map/
│   │   │   ├── SolarZoneMarker.tsx     # 지도 위 가능여부 마커
│   │   │   ├── RegionBottomSheet.tsx   # 지역 선택 시 하단 시트
│   │   │   └── MapLegend.tsx           # 범례
│   │   ├── region/
│   │   │   ├── FeasibilityCheckList.tsx  # 5가지 기준 체크리스트
│   │   │   ├── GridCapacityBar.tsx       # 한전 계통망 용량 바
│   │   │   └── FeasibilityBadge.tsx      # 가능/조건부/불가 뱃지
│   │   ├── permit/
│   │   │   ├── PermitStepCard.tsx        # 인허가 단계 카드
│   │   │   ├── VendorCard.tsx            # 업체 추천 카드
│   │   │   ├── PermitProgressBar.tsx     # 전체 진행률
│   │   │   └── OfficeConnectCard.tsx     # 토목사무소 연결 카드
│   │   └── common/
│   │       ├── StatusBadge.tsx
│   │       ├── SectionHeader.tsx
│   │       └── LoadingOverlay.tsx
│   │
│   ├── stores/                   # Zustand 스토어
│   │   ├── useMapStore.ts        # 지도 상태 (선택 지역, 필터 등)
│   │   ├── usePermitStore.ts     # 인허가 진행 상태
│   │   └── useUserStore.ts       # 사용자 정보
│   │
│   ├── hooks/                    # 커스텀 훅
│   │   ├── useRegionFeasibility.ts   # 지역 가능여부 조회
│   │   ├── usePermitFlow.ts          # 인허가 단계 조회
│   │   └── useVendorList.ts          # 업체 목록 조회
│   │
│   ├── api/                      # API 레이어
│   │   ├── client.ts             # axios 인스턴스
│   │   ├── regions.ts            # 지역 관련 API
│   │   ├── permits.ts            # 인허가 관련 API
│   │   └── vendors.ts            # 업체 관련 API
│   │
│   ├── types/                    # TypeScript 타입 정의
│   │   ├── region.ts
│   │   ├── permit.ts
│   │   └── vendor.ts
│   │
│   ├── constants/
│   │   ├── colors.ts             # 브랜드 컬러 (네이버 초록 #03C75A)
│   │   ├── feasibility.ts        # 5가지 판단 기준 레이블
│   │   ├── permitSteps.ts        # 인허가 단계 정의
│   │   └── solarStats.ts         # 지역별 실발전 데이터 (한국전력거래소 2025년)
│   │
│   └── utils/
│       ├── feasibilityScore.ts   # 가능여부 판단 로직
│       └── formatters.ts         # 날짜, 용량 포맷터
│
├── assets/
├── app.json
├── package.json
└── tsconfig.json
```
---
## 핵심 타입 정의 (반드시 이 타입을 기반으로 구현)
```typescript
// 태양광 설치 가능 여부
type FeasibilityStatus = 'available' | 'conditional' | 'unavailable';
// 5가지 판단 기준
type FeasibilityCheck = {
  id: 'land_use' | 'grid_capacity' | 'setback_distance' | 'national_law' | 'local_ordinance';
  status: 'pass' | 'warning' | 'fail';
  title: string;
  description: string;
  gridCapacity?: {         // id === 'grid_capacity' 일 때만
    totalMW: number;
    usedMW: number;
    availableMW: number;
    waitingQueue: number;  // 접속 대기 건수
  };
};
// 발전 실적 등급 (한국전력거래소 2025년 연간 데이터 기반)
type SolarGrade = 'excellent' | 'good' | 'fair' | 'average' | 'low';
// 지역 정보
type Region = {
  id: string;
  name: string;            // "전라남도 나주시"
  shortName: string;       // "나주시"
  province: string;        // "전라남도" — solarGrade 매핑 키
  latitude: number;
  longitude: number;
  feasibilityStatus: FeasibilityStatus;
  solarGrade: SolarGrade;  // 실발전 실적 기반 등급 (마커 진하기 결정)
  checks: FeasibilityCheck[];
  updatedAt: string;
};
// 인허가 단계
type PermitStepId =
  | 'site_review'        // 1단계: 사전 부지검토
  | 'power_license'      // 2단계: 발전사업허가
  | 'development_permit' // 3단계: 개발행위허가
  | 'land_conversion'    // 4단계: 산지·농지전용
  | 'env_assessment'     // 5단계: 환경영향평가
  | 'construction'       // 6단계: 공사계획 신고 및 시공
  | 'grid_connection';   // 7단계: 계통연계 및 사용전검사
type PermitStepRelation =
  | 'sequential'         // 순차 진행
  | 'independent_parallel' // 독립 병행 (2·3단계)
  | 'parallel_possible'  // 병행 가능 (3·4·5단계)
  | 'prerequisite';      // 선행 의존
type PermitStep = {
  id: PermitStepId;
  order: number;           // 1~7
  title: string;
  type: 'self' | 'agency' | 'office' | 'multi_agency'; // self=자체수행, multi=복수기관
  estimatedDays: { min: number; max: number };
  relation: PermitStepRelation;
  prerequisiteSteps?: PermitStepId[];  // 선행 완료 필요 단계
  parallelWith?: PermitStepId[];       // 병행 가능 단계
  vendors?: Vendor[];
  office?: CivilOffice;                // 3단계 전용
  agencies?: Agency[];                 // 7단계 등 복수 기관
  criticalRisks: string[];             // 핵심 리스크 목록
  requiredDocuments: string[];
  status: 'pending' | 'in_progress' | 'parallel' | 'completed' | 'delayed';
};
// 인허가 기관 (7단계처럼 복수 기관 대응 시)
type Agency = {
  name: string;            // "한국전력공사(KEPCO)"
  role: string;            // "계통 접속 신청"
  deadline?: string;       // "거래 6개월 전 신청 필수"
  contactUrl?: string;
};
// 업체 정보
type Vendor = {
  id: string;
  name: string;
  successRate: number;     // 0~100
  region: string;
  specialization: string[];
  contactPhone: string;
  isRecommended: boolean;
};
// 토목사무소
type CivilOffice = {
  id: string;
  name: string;            // "나주시청 앞 토목사무소"
  address: string;
  phone: string;
  latitude: number;
  longitude: number;
  cityHall: string;        // 연결된 시청/군청
};
```
---
## 컴포넌트 작성 규칙
```typescript
// ✅ 올바른 패턴
const FeasibilityBadge = ({ status }: { status: FeasibilityStatus }) => {
  const config = BADGE_CONFIG[status];
  return (
    <View style={[styles.badge, { backgroundColor: config.bg }]}>
      <Text style={[styles.badgeText, { color: config.text }]}>
        {config.label}
      </Text>
    </View>
  );
};
// ❌ 금지: inline style 객체 남발 (리렌더 성능 저하)
// ❌ 금지: any 타입 사용
// ❌ 금지: 컴포넌트 내부에서 직접 API 호출 (반드시 훅을 통해)
// ❌ 금지: useEffect로 데이터 페칭 (TanStack Query 사용)
```
---
## 브랜드 컬러 (constants/colors.ts 기준)
```typescript
export const Colors = {
  primary: '#03C75A',        // 네이버 초록 — 브랜드 메인
  primaryDark: '#02A84A',
  available: '#19A050',      // 설치 가능 (초록)
  availableBg: '#E6F7EE',
  conditional: '#FAB400',    // 조건부 (노란)
  conditionalBg: '#FFF8E1',
  unavailable: '#DC3232',    // 불가 (빨간)
  unavailableBg: '#FDECEA',
  textPrimary: '#1A1A1A',
  textSecondary: '#666666',
  textTertiary: '#999999',
  border: '#E5E5E5',
  background: '#F5F5F5',
  surface: '#FFFFFF',
};
```
---
## 절대 하지 말 것
- `expo-maps` 대신 `react-native-maps` 사용 (Expo Go 호환성)
- `@gorhom/bottom-sheet` 없이 지역 하단 시트 구현 금지 (반드시 이 라이브러리)
- 지도 마커를 이미지로 처리 금지 (커스텀 `<Marker>` 컴포넌트로)
- 하드코딩된 위도/경도 금지 (constants 또는 API 응답에서만)
- `console.log` 커밋 금지
- **API 키 코드 내 하드코딩 절대 금지** — 반드시 환경변수로만
---
## 환경변수 및 외부 API
### .env 파일 구성 (프로젝트 루트)
```bash
# 지도
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here
# 공공데이터포털
EXPO_PUBLIC_LAND_USE_API_KEY=your_key_here
# 한국전력거래소
EXPO_PUBLIC_SOLAR_STATS_API_KEY=your_key_here
```
`.env` 는 `.gitignore` 에 반드시 포함. `.env.example` 은 커밋해도 됨.
### 외부 API 목록
| 환경변수 | API | 용도 | 호출 위치 |
|----------|-----|------|----------|
| `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Maps (Google Cloud) | 지도 표시 | `app/_layout.tsx` 초기화 |
| `EXPO_PUBLIC_LAND_USE_API_KEY` | 공공데이터포털 (data.go.kr) | 토지이용계획 데이터 조회 | `src/api/regions.ts` |
| `EXPO_PUBLIC_SOLAR_STATS_API_KEY` | 한국전력거래소 (kpx.or.kr) | 지역별 시간별 태양광 발전량 | `src/api/solarStats.ts` |
### 환경변수 접근 방법
```typescript
// Expo에서 환경변수 접근 — EXPO_PUBLIC_ 접두사 필수
const googleMapsKey  = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
const landUseKey     = process.env.EXPO_PUBLIC_LAND_USE_API_KEY;
const solarStatsKey  = process.env.EXPO_PUBLIC_SOLAR_STATS_API_KEY;
```
### Google Maps 초기화 (`react-native-maps`)
```typescript
// PROVIDER_GOOGLE 지정 필수 (기본값은 Apple Maps)
<MapView provider="google" />
```
```json
// app.json에 추가 필요
{
  "expo": {
    "android": {
      "config": { "googleMaps": { "apiKey": "EXPO_PUBLIC_GOOGLE_MAPS_API_KEY" } }
    },
    "ios": {
      "config": { "googleMapsApiKey": "EXPO_PUBLIC_GOOGLE_MAPS_API_KEY" }
    }
  }
}
```
### 공공데이터포털 토지이용계획 API (`src/api/regions.ts`)
```typescript
const LAND_USE_BASE_URL = 'https://api.vworld.kr/req/data';
export const fetchLandUseInfo = async (lat: number, lng: number) => {
  const params = new URLSearchParams({
    service: 'data',
    request: 'GetFeature',
    data: 'LT_C_UQ111',          // 토지이용계획 레이어
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
```
### 한국전력거래소 태양광 발전량 API (`src/api/solarStats.ts`)
```typescript
const KPX_BASE_URL = 'https://openapi.kpx.or.kr/openapi/sukub5mAct/getSukub5mAct';
export const fetchRegionalSolarStats = async (
  date: string,   // "20250101" 형식
  region: string  // "전라남도"
) => {
  const params = new URLSearchParams({
    serviceKey: process.env.EXPO_PUBLIC_SOLAR_STATS_API_KEY!,
    pageNo: '1',
    numOfRows: '24',
    startDate: date,
    endDate: date,
  });
  const res = await fetch(`${KPX_BASE_URL}?${params}`);
  return res.json();
};
```
> ⚠️ MVP에서는 한국전력거래소 데이터를 `constants/solarStats.ts`에 정적으로 탑재.
> API는 2차 출시 시 실시간 연동. 키는 미리 발급받아 .env에 보관.
---
## 인허가 단계 간 연계 관계 (반드시 숙지)
```
[1단계] 사전 부지검토 → 완료 후 → [2단계] + [3단계] 동시 착수 가능
[2단계] 발전사업허가  ─┐ 독립 병행 — 둘 다 완료되어야 진행 가능
[3단계] 개발행위허가  ─┘
    ↓ (3단계 착수 후)
[4단계] 산지·농지전용  ─┐
[5단계] 환경영향평가   ─┘ 병행 가능 (단, 5단계 통과가 3·4단계 전제 조건)
2·3·4·5단계 전부 완료 → [6단계] 착공
[7단계] 계통연계 — 4개 기관 동시 대응 (한전, KESCO, KPX, 에너지공단)
         ⚠ REC 설비 확인은 사용전검사 후 1개월 이내 필수
```
## 개발 순서 가이드
Claude Code에게 작업 요청 시 이 순서를 따를 것:
1. `types/` — 타입 먼저 정의 (특히 PermitStepId, PermitStepRelation)
2. `constants/` — 상수 정의 (permitSteps.ts에 7단계 전체 연계 관계 포함)
3. `api/` — API 함수 작성
4. `hooks/` — 커스텀 훅 작성
5. `components/` — 컴포넌트 작성
6. `app/` — 화면 조립
