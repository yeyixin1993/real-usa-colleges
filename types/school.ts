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
export type AirportMetricKey = 'airport' | 'distance' | 'drive' | 'transit' | 'connectivity';

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

export type SchoolGradeSet = Partial<Record<ScoreKey, Grade>>;

export interface MonthlyClimate {
  month: string;
  highF: number;
  lowF: number;
}

export interface DataSourceRef {
  label: string;
  url: string;
  release?: string;
  checkedAt?: string;
  notes?: string;
}

export type VerificationGroup = 'climateDetails' | 'convenience' | 'airport' | 'scores';

export interface ClimateMetricEvidence {
  source: DataSourceRef;
  station?: {
    id: string;
    name: string;
    stateCode: string;
    coordinates: { lat: number; lng: number };
    elevationMeters: number;
    distanceMiles: number;
  };
}

export interface PublicClimateProfile {
  monthly: MonthlyClimate[];
  annualPrecipitationMm: number | null;
  annualSnowfallMm: number | null;
  annualMeanRelativeHumidityPercent: number | null;
  humidityBand: HumidityBand | null;
  details: {
    precipitation: ClimateMetricEvidence | null;
    snowfall: ClimateMetricEvidence | null;
    humidity: ClimateMetricEvidence | null;
  };
  station: {
    id: string;
    name: string;
    stateCode: string;
    coordinates: { lat: number; lng: number };
    elevationMeters: number;
    distanceMiles: number;
  };
  source: DataSourceRef & { normalPeriod: string };
  recentObserved: {
    observationPeriod: { startDate: string; endDate: string };
    minimumMonthlyCoverage: number;
    monthly: Array<{
      month: string;
      actualMaxC: number | null;
      actualMaxDate: string | null;
      actualMinC: number | null;
      actualMinDate: string | null;
      maximumObservationCount: number;
      minimumObservationCount: number;
      expectedDays: number;
    }>;
    source: DataSourceRef & { method: string; observationPeriod: string };
  } | null;
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
  source?: DataSourceRef;
  white?: number | null;
  black?: number | null;
  hispanicLatino?: number | null;
  asian?: number | null;
  internationalStudents?: number | null;
  maleUndergraduates?: number | null;
  femaleUndergraduates?: number | null;
  age25OrOlder?: number | null;
  populationWithin30Km?: number | null;
  populationWithin30KmSource?: DataSourceRef;
  campusSetting?: 'Urban' | 'Suburban' | 'Rural' | null;
  campusSettingDetail?: string | null;
  localeCode?: number | null;
  foreignBornShare?: number | null;
  medianHouseholdIncomeUsd?: number | null;
  populationDensityBand?: DensityBand | null;
}

export interface SchoolVerification {
  unitId: string;
  website: string | null;
  undergraduateEnrollment: number | null;
  undergraduateTuitionUsd: number | null;
  totalCostUsd: number | null;
  source: {
    label: string;
    release: string;
    url: string;
    downloadUrl: string;
  };
  verifiedFields: Array<'identity' | 'sector' | 'coordinates' | 'campusDemographics' | 'temperature'>;
}

export interface AccessibilityPoint {
  name: string;
  distanceMiles: number;
  driveMinutes: number;
  publicTransitMinutes: number | null;
  walkingMinutes?: number | null;
  countWithin5?: number;
  countWithin10?: number;
  countWithin30?: number;
  uberAvailable: boolean;
  uberEatsAvailable?: boolean;
  note?: LocalizedString;
  placeSource?: DataSourceRef;
}

export interface NullableAccessibilityPoint {
  name: string | null;
  distanceMiles: number | null;
  driveMinutes: number | null;
  publicTransitMinutes: number | null;
  walkingMinutes: number | null;
  countWithin5: number | null;
  countWithin10: number | null;
  countWithin30: number | null;
  uberAvailable: boolean | null;
  uberEatsAvailable: boolean | null;
  placeSource?: DataSourceRef;
}

export interface NullableAirportAccess {
  airportName: string | null;
  distanceMiles: number | null;
  driveMinutes: number | null;
  publicTransitMinutes: number | null;
  connectivitySummary: LocalizedString | null;
  practicalTravelSummary: LocalizedString | null;
  accessLevel: AsiaAccessLevel | null;
  metricSources?: Partial<Record<AirportMetricKey, DataSourceRef>>;
  routeLinks?: AirportRouteLinks;
}

export interface AirportRouteLinks {
  provider: 'Google Maps';
  airportToCampusUrl: string;
  campusToAirportUrl: string;
  airportToCampusTransitUrl: string;
  campusToAirportTransitUrl: string;
  providerSource: DataSourceRef;
  airportCoordinatesSource: DataSourceRef;
}

export interface AirportAccess {
  airportName: string;
  distanceMiles: number;
  driveMinutes: number;
  publicTransitMinutes: number | null;
  connectivitySummary: LocalizedString;
  practicalTravelSummary: LocalizedString;
  accessLevel: AsiaAccessLevel;
  metricSources?: Partial<Record<AirportMetricKey, DataSourceRef>>;
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
  scoreGrades?: SchoolGradeSet;
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
  verification?: SchoolVerification;
  fieldSources?: Partial<Record<VerificationGroup, DataSourceRef>>;
}

export interface PublicSchool {
  slug: string;
  name: string;
  city: string;
  state: string;
  stateCode: string;
  sector: Sector;
  coordinates: { lat: number; lng: number };
  demographics: { campus: DemographicBreakdown };
  climate: PublicClimateProfile | null;
  foodConvenience: Record<FoodCategoryKey, NullableAccessibilityPoint>;
  lifeConvenience: Record<LifeCategoryKey, NullableAccessibilityPoint>;
  airportAccess: NullableAirportAccess;
  scores: Partial<Record<ScoreKey, number | null>>;
  fieldSources: Partial<Record<VerificationGroup, DataSourceRef>>;
  verification: SchoolVerification;
}

export interface DiscoveryCollection {
  slug: string;
  title: LocalizedString;
  description: LocalizedString;
  rationale: LocalizedString;
  schoolSlugs: string[];
  icon: 'Snowflake' | 'Bus' | 'Plane' | 'Store' | 'Leaf';
}
