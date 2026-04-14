import { promises as fs } from 'fs';
import path from 'path';

import type { GradeThresholds, ScoringConfig } from '@/types/scoring';

const CONFIG_PATH = path.join(process.cwd(), 'data', 'scoring-config.json');

export const defaultScoringConfig: ScoringConfig = {
  schoolGradeThresholds: { A: 85, B: 70, C: 55, D: 40 },
  mobilityGradeThresholds: { A: 90, B: 75, C: 60, D: 40 },
  mobilityWeights: {
    uberAvailability: 0.3,
    uberEats: 0.15,
    publicTransit: 0.25,
    walkability: 0.15,
    carDependency: 0.15,
  },
  mobilityTierRules: {
    ruralNightTier3Min: 25,
    tier1DayMax: 10,
    tier1NightMax: 15,
    tier1UberEatsMin: 70,
    tier3NightMin: 30,
    tier3DayMin: 20,
    tier3UberEatsMax: 35,
  },
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function mergeDeep<T>(base: T, patch: Partial<T>): T {
  if (!isPlainObject(base) || !isPlainObject(patch)) {
    return (patch as T) ?? base;
  }

  const result: Record<string, unknown> = { ...base };

  for (const [key, patchValue] of Object.entries(patch)) {
    if (patchValue === undefined) continue;

    const baseValue = result[key];
    if (Array.isArray(patchValue)) {
      result[key] = patchValue;
      continue;
    }

    if (isPlainObject(baseValue) && isPlainObject(patchValue)) {
      result[key] = mergeDeep(baseValue, patchValue);
      continue;
    }

    result[key] = patchValue;
  }

  return result as T;
}

function toFiniteNumber(value: unknown, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizeThresholds(value: Partial<GradeThresholds> | undefined, defaults: GradeThresholds): GradeThresholds {
  return {
    A: toFiniteNumber(value?.A, defaults.A),
    B: toFiniteNumber(value?.B, defaults.B),
    C: toFiniteNumber(value?.C, defaults.C),
    D: toFiniteNumber(value?.D, defaults.D),
  };
}

function normalizeConfig(raw: Partial<ScoringConfig> | undefined): ScoringConfig {
  const merged = mergeDeep(defaultScoringConfig, raw ?? {});

  return {
    schoolGradeThresholds: normalizeThresholds(merged.schoolGradeThresholds, defaultScoringConfig.schoolGradeThresholds),
    mobilityGradeThresholds: normalizeThresholds(merged.mobilityGradeThresholds, defaultScoringConfig.mobilityGradeThresholds),
    mobilityWeights: {
      uberAvailability: toFiniteNumber(merged.mobilityWeights?.uberAvailability, defaultScoringConfig.mobilityWeights.uberAvailability),
      uberEats: toFiniteNumber(merged.mobilityWeights?.uberEats, defaultScoringConfig.mobilityWeights.uberEats),
      publicTransit: toFiniteNumber(merged.mobilityWeights?.publicTransit, defaultScoringConfig.mobilityWeights.publicTransit),
      walkability: toFiniteNumber(merged.mobilityWeights?.walkability, defaultScoringConfig.mobilityWeights.walkability),
      carDependency: toFiniteNumber(merged.mobilityWeights?.carDependency, defaultScoringConfig.mobilityWeights.carDependency),
    },
    mobilityTierRules: {
      ruralNightTier3Min: toFiniteNumber(merged.mobilityTierRules?.ruralNightTier3Min, defaultScoringConfig.mobilityTierRules.ruralNightTier3Min),
      tier1DayMax: toFiniteNumber(merged.mobilityTierRules?.tier1DayMax, defaultScoringConfig.mobilityTierRules.tier1DayMax),
      tier1NightMax: toFiniteNumber(merged.mobilityTierRules?.tier1NightMax, defaultScoringConfig.mobilityTierRules.tier1NightMax),
      tier1UberEatsMin: toFiniteNumber(merged.mobilityTierRules?.tier1UberEatsMin, defaultScoringConfig.mobilityTierRules.tier1UberEatsMin),
      tier3NightMin: toFiniteNumber(merged.mobilityTierRules?.tier3NightMin, defaultScoringConfig.mobilityTierRules.tier3NightMin),
      tier3DayMin: toFiniteNumber(merged.mobilityTierRules?.tier3DayMin, defaultScoringConfig.mobilityTierRules.tier3DayMin),
      tier3UberEatsMax: toFiniteNumber(merged.mobilityTierRules?.tier3UberEatsMax, defaultScoringConfig.mobilityTierRules.tier3UberEatsMax),
    },
  };
}

async function ensureConfigFile() {
  try {
    await fs.access(CONFIG_PATH);
  } catch {
    await fs.mkdir(path.dirname(CONFIG_PATH), { recursive: true });
    await fs.writeFile(CONFIG_PATH, JSON.stringify(defaultScoringConfig, null, 2), 'utf-8');
  }
}

export async function getScoringConfig(): Promise<ScoringConfig> {
  await ensureConfigFile();
  const raw = await fs.readFile(CONFIG_PATH, 'utf-8');

  try {
    const parsed = JSON.parse(raw) as Partial<ScoringConfig>;
    return normalizeConfig(parsed);
  } catch {
    return defaultScoringConfig;
  }
}

export async function upsertScoringConfig(patch: Partial<ScoringConfig>) {
  const current = await getScoringConfig();
  const merged = normalizeConfig(mergeDeep(current, patch));
  await fs.writeFile(CONFIG_PATH, JSON.stringify(merged, null, 2), 'utf-8');
  return merged;
}
