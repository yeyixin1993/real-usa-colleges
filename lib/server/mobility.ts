import { buildMobilityProfile } from '@/lib/mobility';
import { getMobilityOverride } from '@/lib/server/mobility-overrides';
import type { School } from '@/types/school';

export async function getMobilityProfileForSchool(school: School) {
  const override = await getMobilityOverride(school.slug);
  return await buildMobilityProfile(school, override ?? undefined);
}
