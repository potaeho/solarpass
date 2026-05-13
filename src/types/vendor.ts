export type Vendor = {
  id: string;
  name: string;
  successRate: number;
  region: string;
  specialization: string[];
  contactPhone: string;
  isRecommended: boolean;
  responseHours?: number;
  userRating?: number;
  score?: number;
};

export type CivilOffice = {
  id: string;
  name: string;
  address: string;
  phone: string;
  latitude: number;
  longitude: number;
  cityHall: string;
  permitExperienceCount?: number;
};
