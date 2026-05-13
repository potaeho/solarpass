import type { PermitFlow } from '../types/permit';
import { PERMIT_STEPS } from '../constants/permitSteps';

export const fetchPermitFlow = async (regionId: string): Promise<PermitFlow> => {
  // MVP: 정적 단계 데이터 반환
  return {
    regionId,
    steps: PERMIT_STEPS.map(step => ({ ...step, status: 'pending' as const })),
    overallProgress: 0,
    estimatedMonths: { min: 12, max: 24 },
  };
};
