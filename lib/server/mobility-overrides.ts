import { promises as fs } from 'fs';
import path from 'path';

import type { MobilityProfile } from '@/types/mobility';

type MobilityOverride = Partial<MobilityProfile>;
type OverrideMap = Record<string, MobilityOverride>;

const OVERRIDES_PATH = path.join(process.cwd(), 'data', 'mobility-overrides.json');

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

async function ensureOverrideFile() {
  try {
    await fs.access(OVERRIDES_PATH);
  } catch {
    await fs.mkdir(path.dirname(OVERRIDES_PATH), { recursive: true });
    await fs.writeFile(OVERRIDES_PATH, JSON.stringify({}, null, 2), 'utf-8');
  }
}

export async function getAllMobilityOverrides(): Promise<OverrideMap> {
  await ensureOverrideFile();
  const raw = await fs.readFile(OVERRIDES_PATH, 'utf-8');

  try {
    const parsed = JSON.parse(raw);
    if (!isPlainObject(parsed)) return {};
    return parsed as OverrideMap;
  } catch {
    return {};
  }
}

export async function getMobilityOverride(slug: string): Promise<MobilityOverride | null> {
  const all = await getAllMobilityOverrides();
  return all[slug] ?? null;
}

export async function upsertMobilityOverride(slug: string, patch: MobilityOverride) {
  const all = await getAllMobilityOverrides();
  const current = all[slug] ?? {};
  all[slug] = mergeDeep(current, patch);
  await fs.writeFile(OVERRIDES_PATH, JSON.stringify(all, null, 2), 'utf-8');
  return all[slug];
}
