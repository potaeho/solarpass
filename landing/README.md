# 솔라패스 (SolarPass) — 프리토타입 랜딩 페이지

> 이 폴더는 원래 `potaeho/solar-power-problem` 저장소였고, 커밋 이력째 `solarpass/landing/`으로 옮겨졌습니다.

> **"그 땅, 태양광 됩니까?"**  
> 태양광 발전 사업자를 위한 부지 자동 추천 · 인허가 관리 플랫폼 사전 신청 페이지

## 개요

태양광 발전 사업자가 부지 탐색 → 지자체 조례 확인 → 인허가 진행을 수작업으로 처리하는 구조적 비효율을 검증하기 위한 **프리토타이핑(Pretotype)** 페이지입니다.

- 계통 연계 가능 부지 탐색 자동화
- 229개 지자체 조례 통합 비교
- 인허가 성공률 데이터 제공
- 복수 프로젝트 현황 대시보드

## 배포 URL

| 페이지 | URL |
|--------|-----|
| 메인 랜딩 (사전 신청) | https://potaeho.github.io/solarpass/ |
| 어드민 대시보드 | https://potaeho.github.io/solarpass/admin.html |

## 기술 스택

| 구분 | 도구 |
|------|------|
| 호스팅 | GitHub Pages (`.github/workflows/landing-pages.yml`) |
| DB / 폼 수집 | Supabase (PostgreSQL) |
| 방문자 분석 | Google Analytics GA4 |
| 프론트엔드 | Vanilla HTML / CSS / JS |

## 파일 구조

```
landing/
├── index.html                  # 메인 랜딩 페이지 (사전 신청 폼)
├── admin.html                  # 신청자 현황 어드민 대시보드
├── supabase/admin_access.sql   # signups RLS · 관리자 권한 · 신청자 수 함수
└── README.md
```

## 어드민 대시보드

`/admin.html` 접속 후 관리자 계정(Supabase Auth 이메일·비밀번호)으로 로그인:

- 총 신청자 수 · 오늘 신청 수 확인
- 신청자 테이블 (이름 · 이메일 · 연락처 · 관심 항목 · 페인포인트)
- CSV 내보내기 (한글 지원)

접근 제어는 브라우저가 아니라 Supabase RLS가 담당합니다. 방문자는 신청서 제출과 신청자 수 조회만 할 수 있고, `admin_users`에 등록된 계정만 신청자 목록을 읽을 수 있습니다.

관리자 추가 방법:

1. Supabase 대시보드 → Authentication → Users → Add user로 계정 생성
2. SQL Editor에서 등록: `insert into public.admin_users (user_id) select id from auth.users where email = '관리자 이메일';`

## Supabase 테이블 구조

```sql
CREATE TABLE signups (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now(),
  name       text,
  email      text,
  phone      text,
  interests  text[],
  pain       text
);
```

## 배경 · 문제 정의

| 지표 | 수치 |
|------|------|
| 부지 1개 탐색 수작업 시간 | 10시간+ |
| 계통연계 누적 대기 물량 | 10GW+ |
| 지자체 수 (각기 다른 조례) | 229개 |
| 이격거리 규제 법제화 시행 | 2026년 8월 |
| 인허가 총 소요기간 | 단순 6~12개월 / 복합 2~4년 |

---

*본 페이지는 프리토타이핑 검증 목적으로 제작되었습니다.*  
*GCS 2차 팀 · 가천대학교*
