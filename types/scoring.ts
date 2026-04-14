export interface GradeThresholds {
  A: number;
  B: number;
  C: number;
  D: number;
}

export interface MobilityWeights {
  uberAvailability: number;
  uberEats: number;
  publicTransit: number;
  walkability: number;
  carDependency: number;
}

export interface MobilityTierRules {
  ruralNightTier3Min: number;
  tier1DayMax: number;
  tier1NightMax: number;
  tier1UberEatsMin: number;
  tier3NightMin: number;
  tier3DayMin: number;
  tier3UberEatsMax: number;
}

export interface ScoringConfig {
  schoolGradeThresholds: GradeThresholds;
  mobilityGradeThresholds: GradeThresholds;
  mobilityWeights: MobilityWeights;
  mobilityTierRules: MobilityTierRules;
}
