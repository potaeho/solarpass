export type FeasibilityStatus = 'available' | 'conditional' | 'unavailable';

export type FeasibilityCheckId =
  | 'land_use'
  | 'grid_capacity'
  | 'setback_distance'
  | 'national_law'
  | 'local_ordinance';

export type FeasibilityCheck = {
  id: FeasibilityCheckId;
  status: 'pass' | 'warning' | 'fail';
  title: string;
  description: string;
  gridCapacity?: {
    totalMW: number;
    usedMW: number;
    availableMW: number;
    waitingQueue: number;
  };
};

export type SolarGrade = 'excellent' | 'good' | 'fair' | 'average' | 'low';

export type RegionSolarStats = {
  region: string;
  annualGenerationMWh: number;
  nationalRank: number;
  totalRegions: number;
  installedCapacityMW: number;
};

export type Region = {
  id: string;
  name: string;
  shortName: string;
  province: string;
  latitude: number;
  longitude: number;
  feasibilityStatus: FeasibilityStatus;
  solarGrade: SolarGrade;
  checks: FeasibilityCheck[];
  updatedAt: string;
};
