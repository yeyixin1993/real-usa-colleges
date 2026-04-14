import type { School } from '@/types/school';
import type { LocationType, MobilityGrade, MobilityProfile, UberTier } from '@/types/mobility';
import type { MobilityTierRules, MobilityWeights } from '@/types/scoring';
import { getScoringConfig } from '@/lib/server/scoring-config';

function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function toLocationType(school: School): LocationType {
  const density = school.demographics.area30mi.populationDensityBand;
  if (density === 'Urban-accessible') return 'urban';
  if (density === 'Suburban mix') return 'suburban';
  return 'rural';
}

function getUberTierFromWait(
  day: number,
  night: number,
  uberEatsScore: number,
  locationType: LocationType,
  rules: MobilityTierRules,
): UberTier {
  if (locationType === 'rural' && night > rules.ruralNightTier3Min) return 'tier_3';
  if (day <= rules.tier1DayMax && night <= rules.tier1NightMax && uberEatsScore >= rules.tier1UberEatsMin) return 'tier_1';
  if (night > rules.tier3NightMin || day > rules.tier3DayMin || uberEatsScore < rules.tier3UberEatsMax) return 'tier_3';
  return 'tier_2';
}

export function getMobilityGrade(
  score: number,
  thresholds: { A: number; B: number; C: number; D: number } = { A: 90, B: 75, C: 60, D: 40 },
): MobilityGrade {
  if (score >= thresholds.A) return 'A';
  if (score >= thresholds.B) return 'B';
  if (score >= thresholds.C) return 'C';
  if (score >= thresholds.D) return 'D';
  return 'F';
}

function getAutoTags(profile: Omit<MobilityProfile, 'tags' | 'summary' | 'school_name'>): string[] {
  const tags: string[] = [];

  if (profile.uber_tier === 'tier_1') {
    tags.push('Car-free friendly', 'Uber reliable');
  }

  if (profile.uber_wait_time_night > 30) {
    tags.push('Uber unreliable', 'Night transport risk');
  }

  if (profile.mobility_score < 60) {
    tags.push('Car recommended');
  }

  if (profile.mobility_score < 40) {
    tags.push('Car strongly recommended');
  }

  if (profile.public_transit_score > 80) {
    tags.push('Transit accessible');
  }

  if (profile.location_type === 'rural') {
    tags.push('Remote campus');
  }

  return [...new Set(tags)];
}

function getSummary(profile: Omit<MobilityProfile, 'school_name' | 'summary' | 'tags'>) {
  if (profile.uber_tier === 'tier_1') {
    return 'Uber and Uber Eats are consistently available. Most daily trips can be completed without a private car.';
  }

  if (profile.uber_tier === 'tier_2') {
    return 'Uber works in daytime but is less reliable at night. Late trips require planning and backup options.';
  }

  return 'Uber coverage is weak and often unavailable during key hours. Daily life typically depends on car access.';
}

function estimateBaseProfile(
  school: School,
  rules: MobilityTierRules,
): Omit<MobilityProfile, 'school_name' | 'summary' | 'tags' | 'mobility_grade' | 'mobility_score'> {
  const locationType = toLocationType(school);
  const avgConvenience = (school.scores.food + school.scores.life) / 2;

  const dayBase = 28 - avgConvenience / 4;
  const locationDayPenalty = locationType === 'urban' ? -6 : locationType === 'suburban' ? 0 : 12;
  const uberWaitDay = Math.max(1, Math.round(dayBase + locationDayPenalty));

  const nightMultiplier = locationType === 'urban' ? 1.4 : locationType === 'suburban' ? 2.0 : 3.0;
  const uberWaitNight = Math.round(uberWaitDay * nightMultiplier + 2);

  const uberAvailabilityScore = clamp(100 - (uberWaitDay * 2.2 + uberWaitNight * 1.4));

  const uberEatsScore = clamp(
    school.scores.food + (locationType === 'urban' ? 18 : locationType === 'suburban' ? 5 : -18),
  );

  const publicTransitScore = clamp(
    ((school.scores.life + school.scores.airport) / 2) + (locationType === 'urban' ? 15 : locationType === 'suburban' ? 3 : -20),
  );

  const walkabilityScore = clamp(
    school.scores.food + (school.tags.includes('walkable_town') ? 10 : 0) + (locationType === 'urban' ? 10 : locationType === 'rural' ? -18 : 0),
  );

  const carDependencyScore = clamp(
    100 - (locationType === 'urban' ? 12 : locationType === 'suburban' ? 35 : 68) - Math.max(0, (uberWaitNight - 20) * 1.2),
  );

  const tier = getUberTierFromWait(uberWaitDay, uberWaitNight, uberEatsScore, locationType, rules);

  return {
    location_type: locationType,
    uber_tier: tier,
    uber_wait_time_day: uberWaitDay,
    uber_wait_time_night: uberWaitNight,
    uber_eats_score: Math.round(uberEatsScore),
    public_transit_score: Math.round(publicTransitScore),
    walkability_score: Math.round(walkabilityScore),
    car_dependency_score: Math.round(carDependencyScore),
  };
}

function computeMobilityScore(
  profile: Omit<MobilityProfile, 'school_name' | 'summary' | 'tags' | 'mobility_grade' | 'mobility_score'>,
  weights: MobilityWeights,
) {
  const uberAvailabilityScore = clamp(100 - (profile.uber_wait_time_day * 2 + profile.uber_wait_time_night * 1.2));

  return Math.round(
    uberAvailabilityScore * weights.uberAvailability +
      profile.uber_eats_score * weights.uberEats +
      profile.public_transit_score * weights.publicTransit +
      profile.walkability_score * weights.walkability +
      profile.car_dependency_score * weights.carDependency,
  );
}

const hardcodedSeeds: Record<string, Partial<MobilityProfile>> = {
  ucla: {
    uber_tier: 'tier_1',
    uber_wait_time_day: 4,
    uber_wait_time_night: 8,
    uber_eats_score: 95,
    public_transit_score: 88,
    walkability_score: 90,
    car_dependency_score: 84,
    mobility_score: 92,
    tags: ['Car-free friendly', 'Uber reliable', 'Transit accessible'],
    summary: 'Uber is fast and consistent throughout the day. Most errands can be completed without owning a car.',
  },
  'university-of-washington-seattle': {
    uber_tier: 'tier_1',
    uber_wait_time_day: 3,
    uber_wait_time_night: 7,
    uber_eats_score: 95,
    public_transit_score: 96,
    walkability_score: 89,
    car_dependency_score: 88,
    mobility_score: 95,
    tags: ['Car-free friendly', 'Uber reliable', 'Transit accessible'],
  },
  'princeton-university': {
    uber_tier: 'tier_2',
    uber_wait_time_day: 9,
    uber_wait_time_night: 28,
    uber_eats_score: 62,
    public_transit_score: 71,
    walkability_score: 68,
    car_dependency_score: 57,
    mobility_score: 70,
    tags: ['Night transport risk'],
  },
  'amherst-college': {
    uber_tier: 'tier_3',
    uber_wait_time_day: 26,
    uber_wait_time_night: 70,
    uber_eats_score: 28,
    public_transit_score: 48,
    walkability_score: 52,
    car_dependency_score: 34,
    mobility_score: 45,
    tags: ['Uber unreliable', 'Car recommended'],
  },
  'colgate-university': {
    uber_tier: 'tier_3',
    uber_wait_time_day: 35,
    uber_wait_time_night: 95,
    uber_eats_score: 15,
    public_transit_score: 24,
    walkability_score: 40,
    car_dependency_score: 18,
    mobility_score: 30,
    tags: ['Car strongly recommended', 'Remote campus', 'Uber unreliable'],
  },
};

export async function buildMobilityProfile(
  school: School,
  override?: Partial<MobilityProfile>,
): Promise<MobilityProfile> {
  const config = await getScoringConfig();
  const base = estimateBaseProfile(school, config.mobilityTierRules);
  const seeded = hardcodedSeeds[school.slug] ?? {};

  const mergedCore = {
    ...base,
    ...seeded,
    ...override,
  } as Omit<MobilityProfile, 'school_name' | 'summary' | 'tags' | 'mobility_grade' | 'mobility_score'>;

  const finalTier =
    (override?.uber_tier ?? seeded.uber_tier) ||
    getUberTierFromWait(
      mergedCore.uber_wait_time_day,
      mergedCore.uber_wait_time_night,
      mergedCore.uber_eats_score,
      mergedCore.location_type,
      config.mobilityTierRules,
    );

  const computedScore =
    override?.mobility_score ??
    seeded.mobility_score ??
    computeMobilityScore({ ...mergedCore, uber_tier: finalTier }, config.mobilityWeights);

  const grade = getMobilityGrade(computedScore, config.mobilityGradeThresholds);

  const autoTags = getAutoTags({ ...mergedCore, uber_tier: finalTier, mobility_score: computedScore, mobility_grade: grade });
  const finalTags = [...new Set([...(seeded.tags ?? []), ...(override?.tags ?? []), ...autoTags])];

  const summary = override?.summary ?? seeded.summary ?? getSummary({ ...mergedCore, uber_tier: finalTier, mobility_score: computedScore, mobility_grade: grade });

  return {
    school_name: school.name,
    location_type: mergedCore.location_type,
    uber_tier: finalTier,
    uber_wait_time_day: mergedCore.uber_wait_time_day,
    uber_wait_time_night: mergedCore.uber_wait_time_night,
    uber_eats_score: mergedCore.uber_eats_score,
    public_transit_score: mergedCore.public_transit_score,
    walkability_score: mergedCore.walkability_score,
    car_dependency_score: mergedCore.car_dependency_score,
    mobility_score: computedScore,
    mobility_grade: grade,
    tags: finalTags,
    summary,
  };
}
