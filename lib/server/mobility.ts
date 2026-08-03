import { buildMobilityProfile } from '@/lib/mobility';
import { getAdminSchoolBySlug } from '@/lib/data';
import { getMobilityOverride } from '@/lib/server/mobility-overrides';
import type { School } from '@/types/school';
import type { MobilityProfile } from '@/types/mobility';

export async function getMobilityProfileForSchool(school: School) {
  const override = await getMobilityOverride(school.slug);
  return await buildMobilityProfile(school, override ?? undefined);
}

export async function getVerifiedMobilityProfileForSlug(slug: string): Promise<MobilityProfile | null> {
  const override = await getMobilityOverride(slug);
  if (!override?.source?.label?.trim() || !override.source.url?.trim()) return null;

  const numericKeys = [
    'uber_wait_time_day',
    'uber_wait_time_night',
    'uber_eats_score',
    'public_transit_score',
    'walkability_score',
    'car_dependency_score',
    'mobility_score',
  ] as const;
  if (numericKeys.some((key) => typeof override[key] !== 'number' || !Number.isFinite(override[key]))) return null;
  if (!override.school_name || !override.location_type || !override.uber_tier || !override.mobility_grade) return null;
  if (!Array.isArray(override.tags) || typeof override.summary !== 'string') return null;

  return override as MobilityProfile;
}

export async function getPublicMobilityProfileForSlug(slug: string): Promise<MobilityProfile | null> {
  const verified = await getVerifiedMobilityProfileForSlug(slug);
  if (verified) return verified;

  const school = await getAdminSchoolBySlug(slug);
  if (!school) return null;

  const override = await getMobilityOverride(slug);
  return await buildMobilityProfile(school, override ? { ...override, source: undefined } : undefined);
}
