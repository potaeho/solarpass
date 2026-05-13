import type { Vendor } from '../types/vendor';
import type { PermitStepId } from '../types/permit';
import { getVendorsByStep } from '../constants/vendors';

export const fetchVendorsByStep = async (
  stepId: PermitStepId,
  _region: string,
): Promise<Vendor[]> => {
  const all = getVendorsByStep(stepId);
  // 추천 업체를 상단으로 정렬
  return [...all].sort((a, b) => {
    if (a.isRecommended !== b.isRecommended) return a.isRecommended ? -1 : 1;
    return (b.score ?? b.successRate) - (a.score ?? a.successRate);
  });
};
