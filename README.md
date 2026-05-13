# ☀️ SolarPass

> **태양광 인허가 플랫폼 모바일 앱**
> 복잡한 태양광 발전 인허가 과정을 지도 기반 UI로 단순화합니다.

---

## 소개

SolarPass는 태양광 발전 사업을 준비하는 사용자가 **전국 지도에서 원하는 지역을 선택하면**, 해당 지역의 설치 가능 여부를 즉시 확인하고 인허가 7단계 전 과정을 단계별로 안내받을 수 있는 모바일 앱입니다.

### 핵심 문제 해결

- 토지 용도·계통망 용량·이격 거리·법령·조례 등 **5가지 기준을 한눈에** 파악
- 인허가 7단계의 병렬/순차 관계를 시각화해 **불필요한 대기 시간 제거**
- 전국 **122,907개 실발전소 데이터** 기반의 지역별 발전 실적 등급 제공
- 검증된 **인허가 업체·토목사무소를 지역별로 연결**

---

## 주요 기능

| 기능 | 설명 |
|------|------|
| 🗺️ 지도 기반 지역 탐색 | 전국 시·군·구 선택 → 설치 가능 여부 즉시 확인 |
| ✅ 5가지 인허가 기준 체크 | 토지 용도 / 계통망 용량 / 이격 거리 / 국가 법령 / 지자체 조례 |
| 📋 7단계 인허가 가이드 | 단계별 소요 기간·필요 서류·리스크 안내, 병렬 진행 가능 단계 표시 |
| 🏢 업체·사무소 연결 | 인허가 전문 업체 & 토목사무소 지역별 검색·전화 연결 |
| 📊 발전소 실적 데이터 | 전국 122,907개 발전소 기반 지역 등급(excellent~low) 표시 |
| 👤 회원 시스템 | 로그인·회원가입·세션 유지 (expo-secure-store) |

---

## 스크린샷

> 추가 예정

---

## 기술 스택

| 항목 | 기술 |
|------|------|
| 프레임워크 | React Native (Expo SDK 54) |
| 언어 | TypeScript (strict mode) |
| 내비게이션 | Expo Router v3 (파일 기반 라우팅) |
| 지도 | react-native-maps |
| 상태관리 | Zustand |
| 서버 상태 | TanStack Query v5 |
| 폼 검증 | React Hook Form + Zod |
| 인증 저장 | expo-secure-store |
| 아이콘 | @expo/vector-icons (Ionicons) |
| HTTP | axios |

---

## 시작하기

### 사전 요구사항

- Node.js 18+
- Expo Go 앱 (iOS / Android)
- 공공데이터포털 API 키 ([data.go.kr](https://data.go.kr))

### 설치

```bash
git clone https://github.com/potaeho/solarpass.git
cd solarpass
npm install
```

### 환경변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 아래 내용을 입력합니다.

```bash
# 공공데이터포털 — 태양광 발전소 현황 API
EXPO_PUBLIC_SOLAR_API_KEY=your_key_here

# Google Maps API (지도 표시)
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here

# 토지이용계획 API (vworld.kr)
EXPO_PUBLIC_LAND_USE_API_KEY=your_key_here
```

> API 키 발급: [공공데이터포털](https://data.go.kr) → 태양광 발전 현황 API 신청

### 실행

```bash
npx expo start
```

터미널에 표시되는 QR 코드를 Expo Go 앱으로 스캔하면 앱이 실행됩니다.

---

## 프로젝트 구조

```
solarpass/
├── app/                        # 화면 (Expo Router 파일 기반 라우팅)
│   ├── (tabs)/
│   │   ├── index.tsx           # 지도 홈
│   │   ├── permit.tsx          # 인허가 현황
│   │   ├── office.tsx          # 토목사무소 목록
│   │   └── my.tsx              # 마이페이지
│   ├── province/[id].tsx       # 시·군 목록
│   ├── region/[id].tsx         # 지역 상세 (5가지 체크)
│   ├── permit-flow/[regionId]/ # 인허가 7단계 플로우
│   ├── login.tsx
│   └── register.tsx
│
├── src/
│   ├── components/             # 재사용 컴포넌트
│   ├── constants/              # 상수 (지역 데이터, 발전소 실적, 색상 등)
│   ├── stores/                 # Zustand 스토어
│   ├── hooks/                  # 커스텀 훅
│   ├── api/                    # API 레이어
│   ├── types/                  # TypeScript 타입
│   └── utils/                  # 유틸 함수
│
└── scripts/
    └── fetchAllSolarFacilities.js  # 전국 발전소 데이터 수집 스크립트
```

---

## 인허가 7단계 흐름

```
[1단계] 사전 부지검토
    ↓
[2단계] 발전사업허가 ─┐  (병렬 진행 가능)
[3단계] 개발행위허가 ─┘
    ↓
[4단계] 산지·농지전용 ─┐  (병렬 진행 가능)
[5단계] 환경영향평가  ─┘
    ↓
[6단계] 공사계획 신고 및 시공
    ↓
[7단계] 계통연계 및 사용전검사
        (한전 / KESCO / KPX / 에너지공단 동시 대응)
```

---

## 데이터 수집

전국 태양광 발전소 데이터는 공공데이터포털 API를 통해 수집합니다.

```bash
node scripts/fetchAllSolarFacilities.js
```

- 총 **122,907개** 발전소 레코드 (123페이지 × 1,000건)
- 출력: `src/constants/solarFacilityData.ts` (17개 도·285개 시·군 통계)
- 지역별 집계: 총 발전소 수 / 총 용량(kW) / 가동 중 / 공사 중 / 용량 상위 시설

---

## 라이선스

MIT

---

<p align="center">
  Made with ☀️ by <a href="https://github.com/potaeho">potaeho</a>
</p>
