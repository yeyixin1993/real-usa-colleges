import type {
  AirportAccessAsiaRow,
  AsiaAirportConnectivityLevel,
  FoodConvenienceRow,
  LifeConvenienceRow,
} from '@/types/data-model/college';

import { scoreToGrade } from '@/lib/scoring/grades';
import { normalizeCount, normalizeDistance, normalizeTime, weightedAverage } from '@/lib/scoring/normalize';

function connectivityBonus(connectivity: AsiaAirportConnectivityLevel) {
  switch (connectivity) {
    case 'excellent':
      return 100;
    case 'strong':
      return 85;
    case 'moderate':
      return 65;
    case 'limited':
      return 45;
    default:
      return 50;
  }
}

/**
 * Food score assumptions:
 * - Public transit is weighted heavily because car ownership is not assumed.
 * - Drive time still matters, but less than transit time.
 * - Category availability in multiple radii captures practical choice density.
 */
export function calculateFoodScore(rows: FoodConvenienceRow[]) {
  const perCategoryScores = rows.map((row) => {
    const distance = normalizeDistance(row.distance_miles, { best: 0.2, worst: 25 });
    const drive = normalizeTime(row.drive_minutes, { best: 3, worst: 60 });
    const transit =
      row.transit_minutes === null
        ? 30
        : normalizeTime(row.transit_minutes, { best: 8, worst: 120 });

    const availability = weightedAverage([
      { value: normalizeCount(row.count_within_5_miles, 25), weight: 0.5 },
      { value: normalizeCount(row.count_within_10_miles, 80), weight: 0.3 },
      { value: normalizeCount(row.count_within_30_miles, 300), weight: 0.2 },
    ]);

    const rideHailing = row.uber_available ? 100 : 60;
    const delivery = row.uber_eats_available ? 100 : 70;

    return weightedAverage([
      { value: transit, weight: 0.4 },
      { value: distance, weight: 0.2 },
      { value: drive, weight: 0.15 },
      { value: availability, weight: 0.15 },
      { value: rideHailing, weight: 0.05 },
      { value: delivery, weight: 0.05 },
    ]);
  });

  const score = Number((perCategoryScores.reduce((sum, item) => sum + item, 0) / rows.length).toFixed(1));
  return { score, grade: scoreToGrade(score) };
}

/**
 * Life score assumptions:
 * - Public service access is sensitive to transit gaps.
 * - Distances and drive time remain meaningful but secondary.
 */
export function calculateLifeScore(rows: LifeConvenienceRow[]) {
  const perCategoryScores = rows.map((row) => {
    const distance = normalizeDistance(row.distance_miles, { best: 0.2, worst: 30 });
    const drive = normalizeTime(row.drive_minutes, { best: 4, worst: 70 });
    const transit =
      row.transit_minutes === null
        ? 25
        : normalizeTime(row.transit_minutes, { best: 10, worst: 140 });

    return weightedAverage([
      { value: transit, weight: 0.5 },
      { value: distance, weight: 0.3 },
      { value: drive, weight: 0.2 },
    ]);
  });

  const score = Number((perCategoryScores.reduce((sum, item) => sum + item, 0) / rows.length).toFixed(1));
  return { score, grade: scoreToGrade(score) };
}

/**
 * Airport score assumptions:
 * - Transit to airport is weighted highest.
 * - Drive and distance matter for airport-day logistics.
 * - Connectivity level rewards airports with broader Asia routing depth.
 */
export function calculateAirportScore(row: AirportAccessAsiaRow) {
  const transit = row.transit_minutes === null ? 25 : normalizeTime(row.transit_minutes, { best: 20, worst: 180 });
  const drive = normalizeTime(row.drive_minutes, { best: 15, worst: 150 });
  const distance = normalizeDistance(row.distance_miles, { best: 5, worst: 120 });
  const connectivity = connectivityBonus(row.connectivity_level);

  const score = weightedAverage([
    { value: transit, weight: 0.45 },
    { value: drive, weight: 0.2 },
    { value: distance, weight: 0.15 },
    { value: connectivity, weight: 0.2 },
  ]);

  return { score, grade: scoreToGrade(score) };
}

/**
 * Overall score intentionally remains easy to inspect and adjust.
 */
export function calculateOverallScore(input: {
  climate_score: number;
  demographics_score: number;
  food_score: number;
  life_score: number;
  airport_score: number;
}) {
  const score = weightedAverage([
    { value: input.climate_score, weight: 0.2 },
    { value: input.demographics_score, weight: 0.2 },
    { value: input.food_score, weight: 0.2 },
    { value: input.life_score, weight: 0.2 },
    { value: input.airport_score, weight: 0.2 },
  ]);

  return { score, grade: scoreToGrade(score) };
}
