import type { RegionSolarStats, SolarGrade } from '../types/region';

export const REGION_SOLAR_STATS: Record<string, RegionSolarStats> = {
  '전라남도': { region: '전라남도', annualGenerationMWh: 4214000, nationalRank: 1,  totalRegions: 17, installedCapacityMW: 0 },
  '충청남도': { region: '충청남도', annualGenerationMWh: 1975000, nationalRank: 2,  totalRegions: 17, installedCapacityMW: 0 },
  '전라북도': { region: '전라북도', annualGenerationMWh: 1178000, nationalRank: 3,  totalRegions: 17, installedCapacityMW: 0 },
  '경상북도': { region: '경상북도', annualGenerationMWh: 1176000, nationalRank: 4,  totalRegions: 17, installedCapacityMW: 0 },
  '강원도':   { region: '강원도',   annualGenerationMWh:  912000, nationalRank: 5,  totalRegions: 17, installedCapacityMW: 0 },
  '경상남도': { region: '경상남도', annualGenerationMWh:  832000, nationalRank: 6,  totalRegions: 17, installedCapacityMW: 0 },
  '경기도':   { region: '경기도',   annualGenerationMWh:  552000, nationalRank: 7,  totalRegions: 17, installedCapacityMW: 0 },
  '충청북도': { region: '충청북도', annualGenerationMWh:  511000, nationalRank: 8,  totalRegions: 17, installedCapacityMW: 0 },
  '제주도':   { region: '제주도',   annualGenerationMWh:  466000, nationalRank: 9,  totalRegions: 17, installedCapacityMW: 0 },
  '부산시':   { region: '부산시',   annualGenerationMWh:  206000, nationalRank: 10, totalRegions: 17, installedCapacityMW: 0 },
  '대구시':   { region: '대구시',   annualGenerationMWh:  151000, nationalRank: 11, totalRegions: 17, installedCapacityMW: 0 },
  '광주시':   { region: '광주시',   annualGenerationMWh:   93000, nationalRank: 12, totalRegions: 17, installedCapacityMW: 0 },
  '울산시':   { region: '울산시',   annualGenerationMWh:   91000, nationalRank: 13, totalRegions: 17, installedCapacityMW: 0 },
  '인천시':   { region: '인천시',   annualGenerationMWh:   79000, nationalRank: 14, totalRegions: 17, installedCapacityMW: 0 },
  '세종시':   { region: '세종시',   annualGenerationMWh:   43000, nationalRank: 15, totalRegions: 17, installedCapacityMW: 0 },
  '서울시':   { region: '서울시',   annualGenerationMWh:   22000, nationalRank: 16, totalRegions: 17, installedCapacityMW: 0 },
  '대전시':   { region: '대전시',   annualGenerationMWh:   22000, nationalRank: 17, totalRegions: 17, installedCapacityMW: 0 },
};

export const NATIONAL_INSTALLED_CAPACITY_MW = 230752;

export const SOLAR_GRADE_THRESHOLDS: { grade: SolarGrade; minMWh: number }[] = [
  { grade: 'excellent', minMWh: 1000000 },
  { grade: 'good',      minMWh: 500000  },
  { grade: 'fair',      minMWh: 200000  },
  { grade: 'average',   minMWh: 50000   },
  { grade: 'low',       minMWh: 0       },
];

export const getSolarGrade = (annualMWh: number): SolarGrade => {
  for (const { grade, minMWh } of SOLAR_GRADE_THRESHOLDS) {
    if (annualMWh >= minMWh) return grade;
  }
  return 'low';
};
