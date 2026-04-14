export type Locale = 'zh' | 'en' | 'ja';
export type Grade = 'A' | 'B' | 'C' | 'D' | 'F';

export type SchoolType = 'national_university' | 'liberal_arts_college';
export type SchoolControl = 'public' | 'private';
export type SchoolSetting = 'urban' | 'suburban' | 'town' | 'rural';

export type HumidityBand = 'dry' | 'balanced' | 'humid';
export type HeatIntensity = 'mild' | 'warm' | 'hot' | 'very_hot';
export type WinterSeverity = 'mild' | 'cool' | 'cold' | 'severe';
export type SunshineCloudinessBand = 'mostly_sunny' | 'mixed' | 'cloudier';
export type PopulationDensityBand = 'low_density' | 'suburban_mix' | 'urban_accessible';

export type FoodCategory =
  | 'fast_food'
  | 'grocery_store'
  | 'starbucks'
  | 'walmart'
  | 'costco'
  | 'chinese_restaurant'
  | 'asian_grocery'
  | 'dim_sum';

export type LifeCategory =
  | 'dmv'
  | 'social_security'
  | 'bank_of_america'
  | 'toyota_dealership'
  | 'hospital_urgent_care'
  | 'usps'
  | 'major_shopping'
  | 'target_costco_anchor';

export type AsiaAirportConnectivityLevel = 'excellent' | 'strong' | 'moderate' | 'limited';

export interface LocalizedText {
  zh: string;
  en: string;
  ja: string;
}

export interface SchoolRow {
  id: string;
  slug: string;
  names: LocalizedText;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  school_type: SchoolType;
  control: SchoolControl;
  ranking_source: string;
  ranking_year: number;
  ranking_value: number;
  undergraduate_enrollment: number;
  setting: SchoolSetting;
  short_summaries: LocalizedText;
}

export interface ClimateRow {
  school_id: string;
  average_monthly_highs: [number, number, number, number, number, number, number, number, number, number, number, number];
  average_monthly_lows: [number, number, number, number, number, number, number, number, number, number, number, number];
  annual_precipitation_in: number;
  annual_snowfall_in: number;
  humidity_band: HumidityBand;
  summer_heat_intensity: HeatIntensity;
  winter_severity: WinterSeverity;
  sunshine_cloudiness_band: SunshineCloudinessBand;
  severe_weather_note: LocalizedText;
  seasonal_summary: LocalizedText;
  climate_score: number;
  climate_grade: Grade;
}

export interface CampusDemographicsRow {
  school_id: string;
  pct_white: number;
  pct_black: number;
  pct_hispanic: number;
  pct_asian: number;
  pct_international: number;
  note: LocalizedText;
}

export interface LocalDemographics30miRow {
  school_id: string;
  pct_white: number;
  pct_black: number;
  pct_hispanic: number;
  pct_asian: number;
  foreign_born_pct: number;
  median_household_income: number;
  population_density_band: PopulationDensityBand;
  note: LocalizedText;
  demographics_score: number;
  demographics_grade: Grade;
}

export interface FoodConvenienceRow {
  school_id: string;
  category: FoodCategory;
  nearest_place_name: string;
  distance_miles: number;
  drive_minutes: number;
  transit_minutes: number | null;
  count_within_5_miles: number;
  count_within_10_miles: number;
  count_within_30_miles: number;
  uber_available: boolean;
  uber_eats_available: boolean;
}

export interface LifeConvenienceRow {
  school_id: string;
  category: LifeCategory;
  nearest_place_name: string;
  distance_miles: number;
  drive_minutes: number;
  transit_minutes: number | null;
}

export interface AirportAccessAsiaRow {
  school_id: string;
  airport_name: string;
  distance_miles: number;
  drive_minutes: number;
  transit_minutes: number | null;
  connectivity_level: AsiaAirportConnectivityLevel;
  travel_summary: LocalizedText;
  airport_score: number;
  airport_grade: Grade;
}

export interface DerivedSchoolScoresRow {
  school_id: string;
  climate_score: number;
  demographics_score: number;
  food_score: number;
  life_score: number;
  airport_score: number;
  overall_score: number;
  climate_grade: Grade;
  demographics_grade: Grade;
  food_grade: Grade;
  life_grade: Grade;
  airport_grade: Grade;
  overall_grade: Grade;
}

export interface CollegeDataBundle {
  schools: SchoolRow[];
  climate: ClimateRow[];
  campus_demographics: CampusDemographicsRow[];
  local_demographics_30mi: LocalDemographics30miRow[];
  food_convenience: FoodConvenienceRow[];
  life_convenience: LifeConvenienceRow[];
  airport_access_asia: AirportAccessAsiaRow[];
  derived_scores: DerivedSchoolScoresRow[];
}
