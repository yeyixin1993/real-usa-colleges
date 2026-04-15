import type { Locale } from '@/types/school';

export interface Dictionary {
  locale: Locale;
  brand: {
    name: string;
    statement: string;
    substatement: string;
  };
  nav: {
    home: string;
    schools: string;
    compare: string;
    methodology: string;
    collections: string;
  };
  common: {
    discover: string;
    exploreSchools: string;
    compare: string;
    save: string;
    score: string;
    grade: string;
    overview: string;
    learnMore: string;
    viewMethodology: string;
    noResults: string;
    resetFilters: string;
    staticDataNote: string;
    updatedLabel: string;
  };
  homepage: {
    eyebrow: string;
    heroTitle: string;
    heroDescription: string;
    primaryCta: string;
    secondaryCta: string;
    stats: [string, string, string];
    mapTitle: string;
    mapDescription: string;
    featuredTitle: string;
    featuredDescription: string;
    collectionsTitle: string;
    methodologyTitle: string;
    methodologyDescription: string;
    trustTitle: string;
    trustDescription: string;
  };
  directory: {
    title: string;
    description: string;
    searchPlaceholder: string;
    allTypes: string;
    allRankingBands: string;
    allStates: string;
    allRegions: string;
    allClimateBands: string;
    allSectors: string;
    resultCount: string;
    mapHint: string;
  };
  detail: {
    quickScores: string;
    climate: string;
    demographics: string;
    food: string;
    life: string;
    airport: string;
    sources: string;
    seasonalSummary: string;
    sourceNotes: string;
    campusDemographics: string;
    areaDemographics: string;
    contextRichness: string;
    climateNarrative: string;
    airportSummary: string;
  };
  compare: {
    title: string;
    description: string;
    matrixTitle: string;
    notesTitle: string;
  };
  methodology: {
    title: string;
    description: string;
    pillarsTitle: string;
    limitationsTitle: string;
    deliveryTitle: string;
  };
  collections: {
    title: string;
    description: string;
    rationale: string;
    includedSchools: string;
  };
  filters: {
    schoolType: string;
    rankingBand: string;
    state: string;
    region: string;
    climateBand: string;
    sector: string;
  };
  metrics: {
    climateScore: string;
    demographicsScore: string;
    foodScore: string;
    lifeScore: string;
    airportScore: string;
    overallScore: string;
    avgMonthlyHigh: string;
    avgMonthlyLow: string;
    annualPrecipitation: string;
    annualSnowfall: string;
    humidityBand: string;
    summerHeat: string;
    winterSeverity: string;
    sunshine: string;
    severeWeather: string;
    white: string;
    black: string;
    hispanicLatino: string;
    asian: string;
    internationalStudents: string;
    foreignBornShare: string;
    medianHouseholdIncome: string;
    populationDensityBand: string;
    nearestPlace: string;
    distance: string;
    drivingTime: string;
    transitTime: string;
    walkingTime: string;
    countWithin5: string;
    countWithin10: string;
    countWithin30: string;
    uber: string;
    uberEats: string;
    practicalAccess: string;
  };
  categoryLabels: Record<string, string>;
  tagLabels: Record<string, string>;
  footer: {
    note: string;
    dataTransparency: string;
    methodology: string;
  };
}
