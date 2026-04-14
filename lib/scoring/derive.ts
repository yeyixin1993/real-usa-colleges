import type {
  AirportAccessAsiaRow,
  CollegeDataBundle,
  DerivedSchoolScoresRow,
  FoodConvenienceRow,
  LifeConvenienceRow,
} from '@/types/data-model/college';

import { calculateAirportScore, calculateFoodScore, calculateLifeScore, calculateOverallScore } from '@/lib/scoring/calculators';
import { scoreToGrade } from '@/lib/scoring/grades';

export function deriveSchoolScores(input: {
  school_id: string;
  climate_score: number;
  demographics_score: number;
  food_rows: FoodConvenienceRow[];
  life_rows: LifeConvenienceRow[];
  airport_row: AirportAccessAsiaRow;
}): DerivedSchoolScoresRow {
  const food = calculateFoodScore(input.food_rows);
  const life = calculateLifeScore(input.life_rows);
  const airport = calculateAirportScore(input.airport_row);

  const overall = calculateOverallScore({
    climate_score: input.climate_score,
    demographics_score: input.demographics_score,
    food_score: food.score,
    life_score: life.score,
    airport_score: airport.score,
  });

  return {
    school_id: input.school_id,
    climate_score: input.climate_score,
    demographics_score: input.demographics_score,
    food_score: food.score,
    life_score: life.score,
    airport_score: airport.score,
    overall_score: overall.score,
    climate_grade: scoreToGrade(input.climate_score),
    demographics_grade: scoreToGrade(input.demographics_score),
    food_grade: food.grade,
    life_grade: life.grade,
    airport_grade: airport.grade,
    overall_grade: overall.grade,
  };
}

export function deriveAllSchoolScores(bundle: Omit<CollegeDataBundle, 'derived_scores'>): DerivedSchoolScoresRow[] {
  return bundle.schools.map((school) => {
    const climate = bundle.climate.find((row) => row.school_id === school.id);
    const local = bundle.local_demographics_30mi.find((row) => row.school_id === school.id);
    const airport = bundle.airport_access_asia.find((row) => row.school_id === school.id);
    const foodRows = bundle.food_convenience.filter((row) => row.school_id === school.id);
    const lifeRows = bundle.life_convenience.filter((row) => row.school_id === school.id);

    if (!climate || !local || !airport || !foodRows.length || !lifeRows.length) {
      throw new Error(`Missing score dependencies for school_id=${school.id}`);
    }

    return deriveSchoolScores({
      school_id: school.id,
      climate_score: climate.climate_score,
      demographics_score: local.demographics_score,
      food_rows: foodRows,
      life_rows: lifeRows,
      airport_row: airport,
    });
  });
}
