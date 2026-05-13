import type { FeasibilityCheckId, FeasibilityStatus, SolarGrade } from '../types/region';
import { Colors } from './colors';

export const FEASIBILITY_CHECK_LABELS: Record<FeasibilityCheckId, string> = {
  land_use: '토지이용계획',
  grid_capacity: '한전 계통망 용량',
  setback_distance: '이격거리',
  national_law: '전국 공통 법규',
  local_ordinance: '지자체 조례',
};

export const FEASIBILITY_STATUS_CONFIG: Record<
  FeasibilityStatus,
  { label: string; bg: string; text: string }
> = {
  available: { label: '설치 가능', bg: Colors.availableBg, text: '#0D7A38' },
  conditional: { label: '조건부 가능', bg: Colors.conditionalBg, text: '#8A6500' },
  unavailable: { label: '설치 불가', bg: Colors.unavailableBg, text: '#B71C1C' },
};

export const CHECK_STATUS_CONFIG = {
  pass: { icon: 'checkmark-circle', bg: Colors.availableBg, color: '#0D7A38' },
  warning: { icon: 'alert-circle', bg: Colors.conditionalBg, color: '#8A6500' },
  fail: { icon: 'close-circle', bg: Colors.unavailableBg, color: '#B71C1C' },
} as const;

export const GRADE_OPACITY: Record<SolarGrade, number> = {
  excellent: 1.0,
  good: 0.80,
  fair: 0.60,
  average: 0.40,
  low: 0.25,
};
