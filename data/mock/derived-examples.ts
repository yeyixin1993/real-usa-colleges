import { collegeDataMock } from '@/data/mock/college-data';

/**
 * Example output rows for quick inspection in UI/API development.
 * These are computed from raw convenience and airport metrics.
 */
export const derivedScoreExamples = collegeDataMock.derived_scores
  .filter((row) => row.school_id === 'school_ucla' || row.school_id === 'school_amherst')
  .map((row) => ({
    school_id: row.school_id,
    climate_score: row.climate_score,
    demographics_score: row.demographics_score,
    food_score: row.food_score,
    life_score: row.life_score,
    airport_score: row.airport_score,
    overall_score: row.overall_score,
    overall_grade: row.overall_grade,
  }));
