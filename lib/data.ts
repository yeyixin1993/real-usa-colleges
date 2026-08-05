import { cache } from 'react';

import { collections } from '@/data/collections';
import { extraSchools } from '@/data/schools-top100';
import { schools } from '@/data/schools';
import verifiedClimateData from '@/data/verified-climate.json';
import verifiedClimateDetailsData from '@/data/verified-climate-details.json';
import verifiedHumidityData from '@/data/verified-humidity.json';
import verifiedRecentClimateData from '@/data/verified-recent-climate.json';
import verifiedCollegeData from '@/data/verified-colleges.json';
import airportPetalLinkData from '@/data/airport-petal-links.json';
import verifiedAreaPopulationData from '@/data/verified-area-population.json';
import { applySchoolOverride, getAllSchoolOverrides } from '@/lib/server/school-overrides';
import type {
  AccessibilityPoint,
  DataSourceRef,
  DiscoveryCollection,
  FoodCategoryKey,
  LifeCategoryKey,
  Locale,
  NullableAccessibilityPoint,
  PublicClimateProfile,
  PublicSchool,
  School,
} from '@/types/school';

const foodCategoryKeys: FoodCategoryKey[] = [
  'fast_food',
  'grocery_store',
  'starbucks',
  'walmart',
  'costco',
  'chinese_restaurant',
  'asian_grocery',
  'dim_sum',
];
const lifeCategoryKeys: LifeCategoryKey[] = [
  'dmv',
  'social_security',
  'bank_of_america',
  'toyota_dealership',
  'hospital',
  'usps',
  'shopping_destination',
  'target_anchor',
];

type RecentClimateRecord = {
  observationPeriod: { startDate: string; endDate: string };
  minimumMonthlyCoverage: number;
  monthly: NonNullable<PublicClimateProfile['recentObserved']>['monthly'];
};

const recentClimateRecords = verifiedRecentClimateData.records as Record<string, RecentClimateRecord | undefined>;

function publicHumidityBand(value: unknown): PublicClimateProfile['humidityBand'] {
  return value === 'Dry' || value === 'Balanced' || value === 'Humid' ? value : null;
}

type AirportPetalLinkRecord = {
  airport: {
    coordinates: { lat: number; lng: number };
  };
  campus: {
    lat: number;
    lng: number;
  };
  googleMaps: {
    airportToCampusUrl: string;
    campusToAirportUrl: string;
  };
  petalMaps: {
    airportToCampusUrl: string;
    campusToAirportUrl: string;
  };
};

const airportPetalLinkRecords = airportPetalLinkData.records as Record<string, AirportPetalLinkRecord | undefined>;

function toRad(value: number) {
  return (value * Math.PI) / 180;
}

function greatCircleMiles(lat1: number, lng1: number, lat2: number, lng2: number) {
  const earthRadiusMiles = 3958.8;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2
    + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusMiles * c;
}

function inferAirportMetrics({
  distanceMiles,
  driveMinutes,
  transitMinutes,
  airportLat,
  airportLng,
  campusLat,
  campusLng,
}: {
  distanceMiles: number | null;
  driveMinutes: number | null;
  transitMinutes: number | null;
  airportLat?: number;
  airportLng?: number;
  campusLat?: number;
  campusLng?: number;
}) {
  let resolvedDistance = distanceMiles;
  if (
    resolvedDistance == null
    && airportLat != null
    && airportLng != null
    && campusLat != null
    && campusLng != null
  ) {
    const straightLine = greatCircleMiles(airportLat, airportLng, campusLat, campusLng);
    resolvedDistance = Number((straightLine * 1.22).toFixed(1));
  }

  let resolvedDrive = driveMinutes;
  if (resolvedDrive == null && resolvedDistance != null) {
    resolvedDrive = Math.max(8, Math.round((resolvedDistance / 38) * 60 + 8));
  }

  let resolvedTransit = transitMinutes;
  if (resolvedTransit == null && resolvedDrive != null) {
    resolvedTransit = Math.max(15, Math.round(resolvedDrive * 1.9 + 16));
  }

  return {
    distanceMiles: resolvedDistance,
    driveMinutes: resolvedDrive,
    transitMinutes: resolvedTransit,
  };
}

type VerifiedAreaPopulationRecord = {
  population: number;
  radiusKm: number;
  includedCellCount: number;
};

const verifiedAreaPopulationRecords = verifiedAreaPopulationData.records as Record<string, VerifiedAreaPopulationRecord | undefined>;

function validSource(source?: DataSourceRef): source is DataSourceRef {
  return Boolean(source?.label.trim() && source?.url.trim());
}

function nullablePoint(point?: AccessibilityPoint): NullableAccessibilityPoint {
  return {
    name: point?.name || null,
    distanceMiles: point?.distanceMiles ?? null,
    driveMinutes: point?.driveMinutes ?? null,
    publicTransitMinutes: point?.publicTransitMinutes ?? null,
    walkingMinutes: point?.walkingMinutes ?? null,
    countWithin5: point?.countWithin5 ?? null,
    countWithin10: point?.countWithin10 ?? null,
    countWithin30: point?.countWithin30 ?? null,
    uberAvailable: point?.uberAvailable ?? null,
    uberEatsAvailable: point?.uberEatsAvailable ?? null,
    placeSource: validSource(point?.placeSource) ? point.placeSource : undefined,
  };
}

const localeLabels: Record<number, string> = {
  11: 'City: Large', 12: 'City: Midsize', 13: 'City: Small',
  21: 'Suburb: Large', 22: 'Suburb: Midsize', 23: 'Suburb: Small',
  31: 'Town: Fringe', 32: 'Town: Distant', 33: 'Town: Remote',
  41: 'Rural: Fringe', 42: 'Rural: Distant', 43: 'Rural: Remote',
};

function campusSetting(localeCode: number | null) {
  if (localeCode === null) return { campusSetting: null, campusSettingDetail: null, localeCode: null } as const;
  const category = localeCode >= 11 && localeCode <= 13
    ? 'Urban'
    : localeCode >= 21 && localeCode <= 23
      ? 'Suburban'
      : localeCode >= 31 && localeCode <= 43
        ? 'Rural'
        : null;
  return {
    campusSetting: category as 'Urban' | 'Suburban' | 'Rural' | null,
    campusSettingDetail: localeLabels[localeCode] ?? null,
    localeCode,
  };
}

// Legacy seeds provide stable slugs while verified federal records replace every
// field currently published on public pages.
export async function getAdminSchools(): Promise<School[]> {
  const baseSchools = [...schools, ...extraSchools];
  const overrides = await getAllSchoolOverrides();

  return baseSchools.map((school) => {
    const merged = applySchoolOverride(school, overrides[school.slug]);
    const record = verifiedCollegeData.records[school.slug as keyof typeof verifiedCollegeData.records];
    const areaPopulation = verifiedAreaPopulationRecords[school.slug];

    if (!record) return merged;

    const verifiedSchool: School = {
      ...merged,
      name: record.name,
      city: record.city,
      stateCode: record.stateCode,
      sector: (record.sector ?? merged.sector) as School['sector'],
      coordinates: record.coordinates,
      scoreGrades: undefined,
      demographics: {
        ...merged.demographics,
        campus: {
          source: {
            label: verifiedCollegeData.source.label,
            url: verifiedCollegeData.source.url,
            release: verifiedCollegeData.source.release,
          },
          white: record.campusDemographics.white,
          black: record.campusDemographics.black,
          hispanicLatino: record.campusDemographics.hispanicLatino,
          asian: record.campusDemographics.asian,
          internationalStudents: record.campusDemographics.nonresident,
          maleUndergraduates: record.campusDemographics.men,
          femaleUndergraduates: record.campusDemographics.women,
          age25OrOlder: record.campusDemographics.age25OrOlder,
          populationWithin30Km: areaPopulation?.population ?? null,
          populationWithin30KmSource: areaPopulation ? {
            label: verifiedAreaPopulationData.source.label,
            url: verifiedAreaPopulationData.source.url,
            release: verifiedAreaPopulationData.source.vintage,
            checkedAt: verifiedAreaPopulationData.source.checkedAt ?? undefined,
          } : undefined,
          ...campusSetting(record.localeCode),
        },
      },
      verification: {
        unitId: record.unitId,
        website: record.website,
        undergraduateEnrollment: record.undergraduateEnrollment,
        undergraduateTuitionUsd: record.undergraduateTuitionUsd ?? null,
        totalCostUsd: record.totalCostUsd ?? null,
        source: verifiedCollegeData.source,
        verifiedFields: ['identity', 'sector', 'coordinates', 'campusDemographics'],
      },
    };

    return verifiedSchool;
  });
}

export async function getAdminSchoolBySlug(slug: string) {
  const allSchools = await getAdminSchools();
  return allSchools.find((school) => school.slug === slug);
}

function toPublicSchool(school: School): PublicSchool | null {
  if (!school.verification) return null;
  const climateRecord = verifiedClimateData.records[school.slug as keyof typeof verifiedClimateData.records];
  const climateDetailsRecord = verifiedClimateDetailsData.records[school.slug as keyof typeof verifiedClimateDetailsData.records];
  const humidityRecord = verifiedHumidityData.records[school.slug as keyof typeof verifiedHumidityData.records];
  const recentClimateRecord = recentClimateRecords[school.slug];
  const airportPetalLink = airportPetalLinkRecords[school.slug];
  const inferredAirportMetrics = inferAirportMetrics({
    distanceMiles: school.airportAccess.distanceMiles ?? null,
    driveMinutes: school.airportAccess.driveMinutes ?? null,
    transitMinutes: school.airportAccess.publicTransitMinutes ?? null,
    airportLat: airportPetalLink?.airport?.coordinates?.lat,
    airportLng: airportPetalLink?.airport?.coordinates?.lng,
    campusLat: airportPetalLink?.campus?.lat,
    campusLng: airportPetalLink?.campus?.lng,
  });
  const convenienceSource = validSource(school.fieldSources?.convenience)
    ? school.fieldSources.convenience
    : undefined;
  const airportSource = validSource(school.fieldSources?.airport) ? school.fieldSources.airport : undefined;
  const scoresSource = validSource(school.fieldSources?.scores) ? school.fieldSources.scores : undefined;
  const climateDetailsSource = validSource(school.fieldSources?.climateDetails)
    ? school.fieldSources.climateDetails
    : undefined;

  return {
    slug: school.slug,
    name: school.name,
    city: school.city,
    state: school.state,
    stateCode: school.stateCode,
    sector: school.sector,
    coordinates: { ...school.coordinates },
    demographics: { campus: { ...school.demographics.campus } },
    climate: climateRecord
      ? {
          monthly: climateRecord.monthly,
          annualPrecipitationMm: climateDetailsRecord?.precipitation?.annualMm ?? null,
          annualSnowfallMm: climateDetailsRecord?.snowfall?.annualMm ?? null,
          annualMeanRelativeHumidityPercent: humidityRecord?.annualMeanRelativeHumidityPercent ?? null,
          humidityBand: publicHumidityBand(humidityRecord?.humidityBand),
          details: {
            precipitation: climateDetailsRecord?.precipitation ? {
              station: climateDetailsRecord.precipitation.station,
              source: {
                label: verifiedClimateDetailsData.source.label,
                url: verifiedClimateDetailsData.source.url,
                release: verifiedClimateDetailsData.source.release,
                checkedAt: verifiedClimateDetailsData.source.checkedAt,
              },
            } : null,
            snowfall: climateDetailsRecord?.snowfall ? {
              station: climateDetailsRecord.snowfall.station,
              source: {
                label: verifiedClimateDetailsData.source.label,
                url: verifiedClimateDetailsData.source.url,
                release: verifiedClimateDetailsData.source.release,
                checkedAt: verifiedClimateDetailsData.source.checkedAt,
              },
            } : null,
            humidity: humidityRecord ? {
              source: {
                label: verifiedHumidityData.source.label,
                url: verifiedHumidityData.source.url,
                release: verifiedHumidityData.source.release,
                checkedAt: verifiedHumidityData.source.checkedAt,
              },
            } : null,
          },
          station: climateRecord.station,
          source: {
            label: verifiedClimateData.source.label,
            url: verifiedClimateData.source.url,
            release: verifiedClimateData.source.release,
            normalPeriod: verifiedClimateData.source.normalPeriod,
            checkedAt: verifiedClimateData.generatedAt.slice(0, 10),
          },
          recentObserved: recentClimateRecord
            ? {
                observationPeriod: recentClimateRecord.observationPeriod,
                minimumMonthlyCoverage: recentClimateRecord.minimumMonthlyCoverage,
                monthly: recentClimateRecord.monthly,
                source: {
                  label: verifiedRecentClimateData.source.label,
                  url: verifiedRecentClimateData.source.url,
                  release: verifiedRecentClimateData.source.release,
                  checkedAt: verifiedRecentClimateData.generatedAt.slice(0, 10),
                  method: verifiedRecentClimateData.source.method,
                  observationPeriod: verifiedRecentClimateData.source.observationPeriod,
                },
              }
            : null,
        }
      : null,
    foodConvenience: Object.fromEntries(
      foodCategoryKeys.map((key) => [key, nullablePoint(school.foodConvenience[key])]),
    ) as PublicSchool['foodConvenience'],
    lifeConvenience: Object.fromEntries(
      lifeCategoryKeys.map((key) => [key, nullablePoint(school.lifeConvenience[key])]),
    ) as PublicSchool['lifeConvenience'],
    airportAccess: {
      airportName: school.airportAccess.airportName || null,
      distanceMiles: inferredAirportMetrics.distanceMiles,
      driveMinutes: inferredAirportMetrics.driveMinutes,
      publicTransitMinutes: inferredAirportMetrics.transitMinutes,
      connectivitySummary: school.airportAccess.connectivitySummary,
      practicalTravelSummary: school.airportAccess.practicalTravelSummary,
      accessLevel: school.airportAccess.accessLevel,
      metricSources: Object.fromEntries(
        Object.entries(school.airportAccess.metricSources ?? {}).filter(([, source]) => validSource(source)),
      ) as PublicSchool['airportAccess']['metricSources'],
      routeLinks: airportPetalLink ? {
        provider: 'Google Maps',
        airportToCampusUrl: airportPetalLink.googleMaps.airportToCampusUrl,
        campusToAirportUrl: airportPetalLink.googleMaps.campusToAirportUrl,
        airportToCampusTransitUrl: airportPetalLink.googleMaps.airportToCampusUrl.replace('travelmode=driving', 'travelmode=transit'),
        campusToAirportTransitUrl: airportPetalLink.googleMaps.campusToAirportUrl.replace('travelmode=driving', 'travelmode=transit'),
        providerSource: {
          label: airportPetalLinkData.sources.googleMaps.label,
          url: airportPetalLinkData.sources.googleMaps.url,
          checkedAt: airportPetalLinkData.sources.googleMaps.checkedAt,
        },
        airportCoordinatesSource: {
          label: airportPetalLinkData.sources.airportCoordinates.label,
          url: airportPetalLinkData.sources.airportCoordinates.url,
          checkedAt: airportPetalLinkData.sources.airportCoordinates.checkedAt,
        },
      } : undefined,
    },
    scores: { ...school.scores },
    fieldSources: {
      ...(climateDetailsSource ? { climateDetails: climateDetailsSource } : {}),
      ...(convenienceSource ? { convenience: convenienceSource } : {}),
      ...(airportSource ? { airport: airportSource } : {}),
      ...(scoresSource ? { scores: scoresSource } : {}),
    },
    verification: {
      ...school.verification,
      source: { ...school.verification.source },
      verifiedFields: [
        ...school.verification.verifiedFields,
        ...(climateRecord ? (['temperature'] as const) : []),
      ],
    },
  };
}

export async function getSchools(): Promise<PublicSchool[]> {
  return (await getAdminSchools())
    .map(toPublicSchool)
    .filter((school): school is PublicSchool => school !== null);
}

export async function getSchoolBySlug(slug: string) {
  const allSchools = await getSchools();
  return allSchools.find((school) => school.slug === slug);
}

export async function getFeaturedSchools() {
  return (await getSchools()).slice(0, 4);
}

export const getCollections = cache(async (): Promise<DiscoveryCollection[]> => collections);

export const getCollectionBySlug = cache(async (slug: string) => {
  const allCollections = await getCollections();
  return allCollections.find((collection) => collection.slug === slug);
});

export async function getSchoolsForCollection(slug: string) {
  const [collection, allSchools] = await Promise.all([getCollectionBySlug(slug), getSchools()]);

  if (!collection) return [];

  return collection.schoolSlugs
    .map((schoolSlug) => allSchools.find((school) => school.slug === schoolSlug))
    .filter(Boolean) as PublicSchool[];
}

export async function getSchoolComparisons(slugs: string[]) {
  const allSchools = await getSchools();
  return slugs
    .map((slug) => allSchools.find((school) => school.slug === slug))
    .filter(Boolean) as PublicSchool[];
}

export function getLocalizedText(locale: Locale, value: Record<Locale, string>) {
  return value[locale];
}

export function getStates(allSchools: Array<Pick<PublicSchool, 'state'>>) {
  return [...new Set(allSchools.map((school) => school.state))].sort();
}

export function getRankingBands(allSchools: School[]) {
  return [...new Set(allSchools.map((school) => school.rankingBand))];
}
