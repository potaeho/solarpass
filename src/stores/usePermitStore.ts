import { create } from 'zustand';
import type { PermitFlow, PermitStepId, PermitStepStatus } from '../types/permit';

type PermitStore = {
  activeFlows: Record<string, PermitFlow>;
  setFlow: (regionId: string, flow: PermitFlow) => void;
  updateStepStatus: (regionId: string, stepId: PermitStepId, status: PermitStepStatus) => void;
};

export const usePermitStore = create<PermitStore>(set => ({
  activeFlows: {},
  setFlow: (regionId, flow) =>
    set(state => ({ activeFlows: { ...state.activeFlows, [regionId]: flow } })),
  updateStepStatus: (regionId, stepId, status) =>
    set(state => {
      const flow = state.activeFlows[regionId];
      if (!flow) return state;
      return {
        activeFlows: {
          ...state.activeFlows,
          [regionId]: {
            ...flow,
            steps: flow.steps.map(s => (s.id === stepId ? { ...s, status } : s)),
          },
        },
      };
    }),
}));
