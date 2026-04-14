export const locales = ['zh', 'en', 'ja'] as const;

export type Locale = (typeof locales)[number];

export type Grade = 'A' | 'B' | 'C' | 'D' | 'F';
export type SchoolType = 'National University' | 'Liberal Arts College';
export type Sector = 'Public' | 'Private';
export type Region = 'Northeast' | 'Midwest' | 'South' | 'West';
export type ClimateBand = 'Cold Winter' | 'Four Seasons' | 'Mild' | 'Warm';
export type HumidityBand = 'Dry' | 'Balanced' | 'Humid';
export type DensityBand = 'Low density' | 'Suburban mix' | 'Urban-accessible';
export type AsiaAccessLevel = 'easy' | 'moderate' | 'inconvenient';

export type ScoreKey =
  | 'climate'
  | 'demographics'
  | 'food'
  | 'life'
  | 'airport'
  | 'overall';

export type LocalizedString = Record<Locale, string>;

export type CategoryKey =
  | 'fast_food'
  | 'grocery_store'
  | 'starbucks'
  | 'walmart'
  | 'costco'
  | 'chinese_restaurant'
  | 'asian_grocery'
  | 'dim_sum'
  | 'dmv'
  | 'social_security'
  | 'bank_of_america'
  | 'toyota_dealership'
  | 'hospital'
  | 'usps'
  | 'shopping_destination'
  | 'target_anchor';

export type FoodCategoryKey = Extract<
  CategoryKey,
  | 'fast_food'
  | 'grocery_store'
  | 'starbucks'
  | 'walmart'
  | 'costco'
  | 'chinese_restaurant'
  | 'asian_grocery'
  | 'dim_sum'
>;

export type LifeCategoryKey = Exclude<CategoryKey, FoodCategoryKey>;

export type TagKey =
  | 'walkable_town'
  | 'major_air_hub'
  | 'mild_winter'
  | 'asian_grocery_access'
  | 'dense_asian_corridor'
  | 'car_optional'
  | 'research_intensive'
  | 'quiet_residential';

export interface SchoolScoreSet {
  climate: number;
  demographics: number;
  food: number;
  life: number;
  airport: number;
  overall: number;
}

export interface MonthlyClimate {
  month: string;
  highF: number;
  lowF: number;
}

export interface ClimateProfile {
  monthly: MonthlyClimate[];
  annualPrecipitationIn: number;
  annualSnowfallIn: number;
  humidityBand: HumidityBand;
  summerHeatIntensity: LocalizedString;
  winterSeverity: LocalizedString;
  sunshineSummary: LocalizedString;
  severeWeatherNotes: LocalizedString;
  seasonalLifestyleSummary: LocalizedString;
}

export interface DemographicBreakdown {
  white: number;
  black: number;
  hispanicLatino: number;
  asian: number;
  internationalStudents?: number;
  foreignBornShare?: number;
  medianHouseholdIncomeUsd?: number;
  populationDensityBand: DensityBand;
}

export interface AccessibilityPoint {
  name: string;
  distanceMiles: number;
  driveMinutes: number;
  publicTransitMinutes: number | null;
  countWithin5?: number;
  countWithin10?: number;
  countWithin30?: number;
  uberAvailable: boolean;
  uberEatsAvailable?: boolean;
  note?: LocalizedString;
}

export interface AirportAccess {
  airportName: string;
  distanceMiles: number;
  driveMinutes: number;
  publicTransitMinutes: number | null;
  connectivitySummary: LocalizedString;
  practicalTravelSummary: LocalizedString;
  accessLevel: AsiaAccessLevel;
}

export interface School {
  id: string;
  slug: string;
  name: string;
  city: string;
  state: string;
  stateCode: string;
  schoolType: SchoolType;
  sector: Sector;
  region: Region;
  climateBand: ClimateBand;
  rankingLabel: string;
  rankingBand: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  scores: SchoolScoreSet;
  summary: LocalizedString;
  methodologyNote: LocalizedString;
  tags: TagKey[];
  climate: ClimateProfile;
  demographics: {
    campus: DemographicBreakdown;
    area30mi: DemographicBreakdown;
    note: LocalizedString;
  };
  foodConvenience: Record<FoodCategoryKey, AccessibilityPoint>;
  lifeConvenience: Record<LifeCategoryKey, AccessibilityPoint>;
  airportAccess: AirportAccess;
}

export interface DiscoveryCollection {
  slug: string;
  title: LocalizedString;
  description: LocalizedString;
  rationale: LocalizedString;
  schoolSlugs: string[];
  icon: 'Snowflake' | 'Bus' | 'Plane' | 'Store' | 'Leaf';
}
