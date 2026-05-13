import type { Vendor } from './vendor';
import type { CivilOffice } from './vendor';

export type PermitStepId =
  | 'site_review'
  | 'power_license'
  | 'development_permit'
  | 'land_conversion'
  | 'env_assessment'
  | 'construction'
  | 'grid_connection';

export type PermitStepRelation =
  | 'sequential'
  | 'independent_parallel'
  | 'parallel_possible'
  | 'prerequisite';

export type PermitStepStatus =
  | 'pending'
  | 'in_progress'
  | 'parallel'
  | 'completed'
  | 'delayed';

export type Agency = {
  name: string;
  role: string;
  deadline?: string;
  contactUrl?: string;
};

export type PermitStep = {
  id: PermitStepId;
  order: number;
  title: string;
  type: 'self' | 'agency' | 'office' | 'multi_agency';
  estimatedDays: { min: number; max: number };
  relation: PermitStepRelation;
  prerequisiteSteps?: PermitStepId[];
  parallelWith?: PermitStepId[];
  vendors?: Vendor[];
  office?: CivilOffice;
  agencies?: Agency[];
  criticalRisks: string[];
  requiredDocuments: string[];
  status: PermitStepStatus;
};

export type PermitFlow = {
  regionId: string;
  steps: PermitStep[];
  overallProgress: number;
  estimatedMonths: { min: number; max: number };
};
