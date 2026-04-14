export type LocationType = 'urban' | 'suburban' | 'rural';
export type UberTier = 'tier_1' | 'tier_2' | 'tier_3';
export type MobilityGrade = 'A' | 'B' | 'C' | 'D' | 'F';

export interface MobilityProfile {
  school_name: string;
  location_type: LocationType;
  uber_tier: UberTier;
  uber_wait_time_day: number;
  uber_wait_time_night: number;
  uber_eats_score: number;
  public_transit_score: number;
  walkability_score: number;
  car_dependency_score: number;
  mobility_score: number;
  mobility_grade: MobilityGrade;
  tags: string[];
  summary: string;
}
