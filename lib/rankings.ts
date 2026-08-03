import type { ColdRankingWeights, RankingWeights } from '@/types/scoring';
import type { PublicSchool } from '@/types/school';

export type RankingKey = 'cold' | 'village' | 'white' | 'combined' | 'warm';
export type ReversibleRankingKey = 'cold' | 'village' | 'white';

export interface RankedSchoolRow {
  slug: string;
  name: string;
  city: string;
  stateCode: string;
  januaryAverageLowF: number;
  annualSnowfallMm: number;
  populationWithin30Km: number;
  whiteUndergraduateShare: number;
  coldRank: number;
  coldReverseRank: number;
  villageRank: number;
  villageReverseRank: number;
  whiteRank: number;
  whiteReverseRank: number;
  combinedRank: number;
  warmRank: number;
  januaryColdScore: number;
  snowfallScore: number;
  coldScore: number;
  villageScore: number;
  whiteScore: number;
  combinedScore: number;
}

type WorkingRow = Pick<
  RankedSchoolRow,
  'slug' | 'name' | 'city' | 'stateCode' | 'januaryAverageLowF' | 'annualSnowfallMm' | 'populationWithin30Km' | 'whiteUndergraduateShare'
>;

type MetricResult = { rank: number; score: number };

function rankMetric<T extends { slug: string }>(
  rows: T[],
  valueFor: (row: T) => number,
  direction: 'ascending' | 'descending',
) {
  const sorted = [...rows].sort((left, right) => {
    const difference = valueFor(left) - valueFor(right);
    if (difference !== 0) return direction === 'ascending' ? difference : -difference;
    return left.slug.localeCompare(right.slug);
  });
  const result = new Map<string, MetricResult>();

  for (let start = 0; start < sorted.length;) {
    const value = valueFor(sorted[start]);
    let end = start;
    while (end + 1 < sorted.length && valueFor(sorted[end + 1]) === value) end += 1;
    const averageIndex = (start + end) / 2;
    const score = sorted.length === 1 ? 100 : 100 * (1 - averageIndex / (sorted.length - 1));
    for (let index = start; index <= end; index += 1) {
      result.set(sorted[index].slug, { rank: start + 1, score: Number(score.toFixed(4)) });
    }
    start = end + 1;
  }

  return result;
}

export function buildRankings(
  schools: PublicSchool[],
  rankingWeights: RankingWeights,
  coldRankingWeights: ColdRankingWeights,
): RankedSchoolRow[] {
  const eligible: WorkingRow[] = schools.flatMap((school) => {
    const january = school.climate?.monthly[0];
    const snowfall = school.climate?.annualSnowfallMm;
    const population = school.demographics.campus.populationWithin30Km;
    const whiteShare = school.demographics.campus.white;
    if (!january || snowfall == null || population == null || whiteShare == null) return [];
    return [{
      slug: school.slug,
      name: school.name,
      city: school.city,
      stateCode: school.stateCode,
      januaryAverageLowF: january.lowF,
      annualSnowfallMm: snowfall,
      populationWithin30Km: population,
      whiteUndergraduateShare: whiteShare,
    }];
  });

  const januaryCold = rankMetric(eligible, (row) => row.januaryAverageLowF, 'ascending');
  const snowfall = rankMetric(eligible, (row) => row.annualSnowfallMm, 'descending');
  const village = rankMetric(eligible, (row) => row.populationWithin30Km, 'ascending');
  const white = rankMetric(eligible, (row) => row.whiteUndergraduateShare, 'descending');

  const dimensionScores = eligible.map((row) => {
    const januaryColdScore = januaryCold.get(row.slug)!.score;
    const snowfallScore = snowfall.get(row.slug)!.score;
    const coldScore = Number((
      januaryColdScore * coldRankingWeights.januaryTemperature
      + snowfallScore * coldRankingWeights.annualSnowfall
    ).toFixed(4));
    const villageScore = village.get(row.slug)!.score;
    const whiteScore = white.get(row.slug)!.score;
    const combinedScore = Number((
      coldScore * rankingWeights.cold
      + villageScore * rankingWeights.village
      + whiteScore * rankingWeights.white
    ).toFixed(4));
    return { ...row, januaryColdScore, snowfallScore, coldScore, villageScore, whiteScore, combinedScore };
  });

  const cold = rankMetric(dimensionScores, (row) => row.coldScore, 'descending');
  const coldReverse = rankMetric(dimensionScores, (row) => row.coldScore, 'ascending');
  const villageReverse = rankMetric(dimensionScores, (row) => row.populationWithin30Km, 'descending');
  const whiteReverse = rankMetric(dimensionScores, (row) => row.whiteUndergraduateShare, 'ascending');
  const combined = rankMetric(dimensionScores, (row) => row.combinedScore, 'descending');
  const warm = rankMetric(dimensionScores, (row) => row.combinedScore, 'ascending');

  return dimensionScores.map((row) => ({
    ...row,
    coldRank: cold.get(row.slug)!.rank,
    coldReverseRank: coldReverse.get(row.slug)!.rank,
    villageRank: village.get(row.slug)!.rank,
    villageReverseRank: villageReverse.get(row.slug)!.rank,
    whiteRank: white.get(row.slug)!.rank,
    whiteReverseRank: whiteReverse.get(row.slug)!.rank,
    combinedRank: combined.get(row.slug)!.rank,
    warmRank: warm.get(row.slug)!.rank,
  }));
}

export function rankFor(row: RankedSchoolRow, key: RankingKey, reversed = false) {
  if (reversed && (key === 'cold' || key === 'village' || key === 'white')) {
    return row[`${key}ReverseRank`];
  }
  return row[`${key}Rank`];
}

export function scoreForRanking(row: RankedSchoolRow, key: RankingKey, reversed = false) {
  if (key === 'combined') return row.combinedScore;
  if (key === 'warm') return Number((100 - row.combinedScore).toFixed(4));
  const score = row[`${key}Score`];
  return reversed ? Number((100 - score).toFixed(4)) : score;
}

export function sortRankings(rows: RankedSchoolRow[], key: RankingKey, reversed = false) {
  if (key === 'warm') {
    return [...rows].sort((left, right) => left.combinedScore - right.combinedScore || right.slug.localeCompare(left.slug));
  }
  return [...rows].sort((left, right) => rankFor(left, key, reversed) - rankFor(right, key, reversed) || left.slug.localeCompare(right.slug));
}
