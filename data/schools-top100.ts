import type { School } from '@/types/school';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const ls = (en: string, zh: string, ja: string) => ({ en, zh, ja });
const monthly = (highs: number[], lows: number[]) =>
  months.map((month, index) => ({
    month,
    highF: highs[index],
    lowF: lows[index],
  }));

type Profile = 'urban' | 'suburban' | 'town';

type StateMeta = {
  state: string;
  stateCode: string;
  region: School['region'];
  climateBand: School['climateBand'];
  lat: number;
  lng: number;
  majorAirport: string;
};

const states: Record<string, StateMeta> = {
  CA: { state: 'California', stateCode: 'CA', region: 'West', climateBand: 'Mild', lat: 36.8, lng: -119.4, majorAirport: 'Los Angeles International Airport' },
  CO: { state: 'Colorado', stateCode: 'CO', region: 'West', climateBand: 'Four Seasons', lat: 39.0, lng: -105.5, majorAirport: 'Denver International Airport' },
  CT: { state: 'Connecticut', stateCode: 'CT', region: 'Northeast', climateBand: 'Four Seasons', lat: 41.6, lng: -72.7, majorAirport: 'Bradley International Airport' },
  DC: { state: 'District of Columbia', stateCode: 'DC', region: 'Northeast', climateBand: 'Four Seasons', lat: 38.9, lng: -77.0, majorAirport: 'Washington Dulles International Airport' },
  FL: { state: 'Florida', stateCode: 'FL', region: 'South', climateBand: 'Warm', lat: 27.8, lng: -81.7, majorAirport: 'Orlando International Airport' },
  GA: { state: 'Georgia', stateCode: 'GA', region: 'South', climateBand: 'Warm', lat: 32.2, lng: -83.4, majorAirport: 'Hartsfield-Jackson Atlanta International Airport' },
  IA: { state: 'Iowa', stateCode: 'IA', region: 'Midwest', climateBand: 'Cold Winter', lat: 42.1, lng: -93.5, majorAirport: 'Des Moines International Airport' },
  IL: { state: 'Illinois', stateCode: 'IL', region: 'Midwest', climateBand: 'Cold Winter', lat: 40.0, lng: -89.2, majorAirport: 'Chicago O\'Hare International Airport' },
  IN: { state: 'Indiana', stateCode: 'IN', region: 'Midwest', climateBand: 'Cold Winter', lat: 40.0, lng: -86.1, majorAirport: 'Indianapolis International Airport' },
  KY: { state: 'Kentucky', stateCode: 'KY', region: 'South', climateBand: 'Four Seasons', lat: 37.7, lng: -84.7, majorAirport: 'Cincinnati/Northern Kentucky International Airport' },
  MA: { state: 'Massachusetts', stateCode: 'MA', region: 'Northeast', climateBand: 'Four Seasons', lat: 42.3, lng: -71.8, majorAirport: 'Boston Logan International Airport' },
  MD: { state: 'Maryland', stateCode: 'MD', region: 'Northeast', climateBand: 'Four Seasons', lat: 39.0, lng: -76.7, majorAirport: 'Baltimore/Washington International Airport' },
  ME: { state: 'Maine', stateCode: 'ME', region: 'Northeast', climateBand: 'Cold Winter', lat: 45.1, lng: -69.1, majorAirport: 'Portland International Jetport' },
  MI: { state: 'Michigan', stateCode: 'MI', region: 'Midwest', climateBand: 'Cold Winter', lat: 44.3, lng: -85.6, majorAirport: 'Detroit Metropolitan Wayne County Airport' },
  MN: { state: 'Minnesota', stateCode: 'MN', region: 'Midwest', climateBand: 'Cold Winter', lat: 46.3, lng: -94.2, majorAirport: 'Minneapolis-Saint Paul International Airport' },
  MO: { state: 'Missouri', stateCode: 'MO', region: 'Midwest', climateBand: 'Four Seasons', lat: 38.5, lng: -92.6, majorAirport: 'St. Louis Lambert International Airport' },
  NC: { state: 'North Carolina', stateCode: 'NC', region: 'South', climateBand: 'Warm', lat: 35.5, lng: -79.4, majorAirport: 'Raleigh-Durham International Airport' },
  NH: { state: 'New Hampshire', stateCode: 'NH', region: 'Northeast', climateBand: 'Cold Winter', lat: 43.7, lng: -71.6, majorAirport: 'Manchester-Boston Regional Airport' },
  NJ: { state: 'New Jersey', stateCode: 'NJ', region: 'Northeast', climateBand: 'Four Seasons', lat: 40.1, lng: -74.6, majorAirport: 'Newark Liberty International Airport' },
  NY: { state: 'New York', stateCode: 'NY', region: 'Northeast', climateBand: 'Four Seasons', lat: 42.9, lng: -75.5, majorAirport: 'John F. Kennedy International Airport' },
  OH: { state: 'Ohio', stateCode: 'OH', region: 'Midwest', climateBand: 'Cold Winter', lat: 40.3, lng: -82.8, majorAirport: 'John Glenn Columbus International Airport' },
  OR: { state: 'Oregon', stateCode: 'OR', region: 'West', climateBand: 'Mild', lat: 44.0, lng: -120.5, majorAirport: 'Portland International Airport' },
  PA: { state: 'Pennsylvania', stateCode: 'PA', region: 'Northeast', climateBand: 'Four Seasons', lat: 41.0, lng: -77.6, majorAirport: 'Philadelphia International Airport' },
  RI: { state: 'Rhode Island', stateCode: 'RI', region: 'Northeast', climateBand: 'Four Seasons', lat: 41.7, lng: -71.5, majorAirport: 'T.F. Green International Airport' },
  SC: { state: 'South Carolina', stateCode: 'SC', region: 'South', climateBand: 'Warm', lat: 33.8, lng: -80.9, majorAirport: 'Charlotte Douglas International Airport' },
  TN: { state: 'Tennessee', stateCode: 'TN', region: 'South', climateBand: 'Warm', lat: 35.8, lng: -86.4, majorAirport: 'Nashville International Airport' },
  TX: { state: 'Texas', stateCode: 'TX', region: 'South', climateBand: 'Warm', lat: 31.0, lng: -99.0, majorAirport: 'Dallas/Fort Worth International Airport' },
  VA: { state: 'Virginia', stateCode: 'VA', region: 'South', climateBand: 'Four Seasons', lat: 37.5, lng: -78.7, majorAirport: 'Washington Dulles International Airport' },
  VT: { state: 'Vermont', stateCode: 'VT', region: 'Northeast', climateBand: 'Cold Winter', lat: 44.0, lng: -72.7, majorAirport: 'Burlington International Airport' },
  WA: { state: 'Washington', stateCode: 'WA', region: 'West', climateBand: 'Mild', lat: 47.4, lng: -120.7, majorAirport: 'Seattle-Tacoma International Airport' },
  WI: { state: 'Wisconsin', stateCode: 'WI', region: 'Midwest', climateBand: 'Cold Winter', lat: 44.6, lng: -89.6, majorAirport: 'Milwaukee Mitchell International Airport' },
};

interface Seed {
  slug: string;
  name: string;
  city: string;
  stateCode: keyof typeof states;
  schoolType: School['schoolType'];
  sector: School['sector'];
  rankingBand: string;
  rankingLabel: string;
  profile: Profile;
  tags: School['tags'];
}

function hash(value: string) {
  return [...value].reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
}

function jitter(seed: string, max = 1.4) {
  return ((hash(seed) % 100) / 100 - 0.5) * max;
}

function buildClimate(climateBand: School['climateBand']) {
  if (climateBand === 'Warm') return { highs: [52, 56, 64, 73, 81, 88, 91, 90, 84, 75, 65, 56], lows: [34, 37, 44, 52, 61, 68, 72, 71, 64, 53, 44, 37], precipitation: 48, snowfall: 3, humidity: 'Humid' as const };
  if (climateBand === 'Mild') return { highs: [48, 52, 56, 61, 68, 73, 79, 79, 73, 62, 53, 47], lows: [38, 40, 42, 46, 52, 57, 61, 61, 55, 48, 42, 38], precipitation: 34, snowfall: 6, humidity: 'Balanced' as const };
  if (climateBand === 'Cold Winter') return { highs: [31, 34, 43, 56, 67, 76, 81, 79, 71, 58, 46, 35], lows: [15, 18, 26, 36, 46, 55, 60, 58, 50, 40, 31, 22], precipitation: 42, snowfall: 58, humidity: 'Balanced' as const };
  return { highs: [39, 42, 50, 61, 71, 79, 84, 82, 75, 64, 53, 43], lows: [24, 26, 33, 43, 53, 62, 67, 65, 57, 46, 37, 29], precipitation: 45, snowfall: 24, humidity: 'Balanced' as const };
}

function profileScores(profile: Profile, schoolType: School['schoolType']) {
  const base = schoolType === 'National University' ? 78 : 74;
  if (profile === 'urban') return { food: base + 10, life: base + 9, airport: base + 8 };
  if (profile === 'suburban') return { food: base + 2, life: base + 3, airport: base + 4 };
  return { food: base - 14, life: base - 13, airport: base - 11 };
}

function buildFood(profile: Profile, city: string): School['foodConvenience'] {
  const p = profile === 'urban' ? { d: 0.6, t: 0.7, c: 1.7 } : profile === 'suburban' ? { d: 1, t: 1, c: 1 } : { d: 1.5, t: 1.7, c: 0.55 };
  const dist = (v: number) => Number((v * p.d).toFixed(1));
  const mins = (v: number) => Math.max(2, Math.round(v * p.t));
  const cnt = (v: number) => Math.max(0, Math.round(v * p.c));

  return {
    fast_food: { name: `${city} quick-serve cluster`, distanceMiles: dist(0.8), driveMinutes: mins(4), publicTransitMinutes: profile === 'town' ? null : mins(9), countWithin5: cnt(20), countWithin10: cnt(75), countWithin30: cnt(330), uberAvailable: true, uberEatsAvailable: true },
    grocery_store: { name: `${city} grocery node`, distanceMiles: dist(1.2), driveMinutes: mins(6), publicTransitMinutes: profile === 'town' ? null : mins(12), countWithin5: cnt(10), countWithin10: cnt(34), countWithin30: cnt(140), uberAvailable: true, uberEatsAvailable: true },
    starbucks: { name: `${city} Starbucks`, distanceMiles: dist(0.8), driveMinutes: mins(4), publicTransitMinutes: profile === 'town' ? null : mins(9), countWithin5: cnt(8), countWithin10: cnt(25), countWithin30: cnt(120), uberAvailable: true, uberEatsAvailable: true },
    walmart: { name: `${city} Walmart`, distanceMiles: dist(7.8), driveMinutes: mins(17), publicTransitMinutes: profile === 'town' ? null : mins(36), countWithin10: cnt(1), countWithin30: cnt(8), uberAvailable: true, uberEatsAvailable: true },
    costco: { name: `${city} Costco`, distanceMiles: dist(6.9), driveMinutes: mins(16), publicTransitMinutes: profile === 'town' ? null : mins(34), countWithin10: cnt(1), countWithin30: cnt(7), uberAvailable: true, uberEatsAvailable: false },
    chinese_restaurant: { name: `${city} Chinese dining`, distanceMiles: dist(1.6), driveMinutes: mins(7), publicTransitMinutes: profile === 'town' ? null : mins(14), countWithin5: cnt(12), countWithin10: cnt(45), countWithin30: cnt(210), uberAvailable: true, uberEatsAvailable: true },
    asian_grocery: { name: `${city} Asian grocery`, distanceMiles: dist(4.8), driveMinutes: mins(14), publicTransitMinutes: profile === 'town' ? null : mins(27), countWithin10: cnt(4), countWithin30: cnt(24), uberAvailable: true, uberEatsAvailable: profile !== 'town' },
    dim_sum: { name: `${city} Dim sum`, distanceMiles: dist(5.8), driveMinutes: mins(17), publicTransitMinutes: profile === 'town' ? null : mins(32), countWithin10: cnt(2), countWithin30: cnt(13), uberAvailable: true, uberEatsAvailable: true },
  };
}

function buildLife(profile: Profile, city: string): School['lifeConvenience'] {
  const p = profile === 'urban' ? { d: 0.7, t: 0.8 } : profile === 'suburban' ? { d: 1, t: 1 } : { d: 1.45, t: 1.55 };
  const dist = (v: number) => Number((v * p.d).toFixed(1));
  const mins = (v: number) => Math.max(2, Math.round(v * p.t));

  return {
    dmv: { name: `${city} DMV`, distanceMiles: dist(4.5), driveMinutes: mins(14), publicTransitMinutes: profile === 'town' ? null : mins(30), uberAvailable: true },
    social_security: { name: `${city} Social Security office`, distanceMiles: dist(6.2), driveMinutes: mins(18), publicTransitMinutes: profile === 'town' ? null : mins(35), uberAvailable: true },
    bank_of_america: { name: `${city} Bank of America`, distanceMiles: dist(0.9), driveMinutes: mins(5), publicTransitMinutes: profile === 'town' ? null : mins(10), uberAvailable: true },
    toyota_dealership: { name: `${city} Toyota dealership`, distanceMiles: dist(5.4), driveMinutes: mins(15), publicTransitMinutes: profile === 'town' ? null : mins(31), uberAvailable: true },
    hospital: { name: `${city} hospital`, distanceMiles: dist(1.4), driveMinutes: mins(6), publicTransitMinutes: profile === 'town' ? null : mins(12), uberAvailable: true },
    usps: { name: `${city} USPS`, distanceMiles: dist(1.0), driveMinutes: mins(5), publicTransitMinutes: profile === 'town' ? null : mins(10), uberAvailable: true },
    shopping_destination: { name: `${city} major shopping`, distanceMiles: dist(5.0), driveMinutes: mins(14), publicTransitMinutes: profile === 'town' ? null : mins(29), uberAvailable: true },
    target_anchor: { name: `${city} Target`, distanceMiles: dist(4.1), driveMinutes: mins(12), publicTransitMinutes: profile === 'town' ? null : mins(25), uberAvailable: true },
  };
}

function makeSchool(seed: Seed): School {
  const meta = states[seed.stateCode];
  const baseLat = meta.lat + jitter(seed.slug, 1.8);
  const baseLng = meta.lng + jitter(`${seed.slug}-lng`, 1.8);
  const climate = buildClimate(meta.climateBand);
  const convenience = profileScores(seed.profile, seed.schoolType);

  const climateScore = meta.climateBand === 'Mild' ? 86 : meta.climateBand === 'Warm' ? 72 : meta.climateBand === 'Cold Winter' ? 56 : 68;
  const demographicsScore = seed.profile === 'urban' ? 86 : seed.profile === 'suburban' ? 79 : 71;
  const overall = Math.round((climateScore + demographicsScore + convenience.food + convenience.life + convenience.airport) / 5);

  return {
    id: `school_${seed.slug.replace(/-/g, '_')}`,
    slug: seed.slug,
    name: seed.name,
    city: seed.city,
    state: meta.state,
    stateCode: meta.stateCode,
    schoolType: seed.schoolType,
    sector: seed.sector,
    region: meta.region,
    climateBand: meta.climateBand,
    rankingLabel: seed.rankingLabel,
    rankingBand: seed.rankingBand,
    coordinates: { lat: Number(baseLat.toFixed(4)), lng: Number(baseLng.toFixed(4)) },
    scores: { climate: climateScore, demographics: demographicsScore, food: convenience.food, life: convenience.life, airport: convenience.airport, overall },
    summary: ls(
      `${seed.name} is included in the launch ranking set with practical context metrics for climate, convenience, and airport access.`,
      `${seed.name} 已纳入首发榜单，并提供气候、生活便利度与机场可达性的务实指标。`,
      `${seed.name} はローンチランキング対象として、気候・生活利便性・空港アクセス指標を掲載しています。`,
    ),
    methodologyNote: ls(
      'Values are maintained as transparent seed data and are being continuously refined with verified sources.',
      '当前数据以可审计种子数据方式维护，并持续用可验证来源迭代。',
      '現在の値は監査可能なシードデータとして管理し、検証可能な情報で順次更新しています。',
    ),
    tags: seed.tags,
    climate: {
      monthly: monthly(climate.highs, climate.lows),
      annualPrecipitationIn: climate.precipitation,
      annualSnowfallIn: climate.snowfall,
      humidityBand: climate.humidity,
      summerHeatIntensity: ls('Summer comfort varies by latitude and urban density, with occasional heat spikes.', '夏季体感受纬度与城市密度影响，个别时段会有热浪。', '夏の体感は緯度と都市密度に左右され、短期的な熱波もあります。'),
      winterSeverity: ls('Winter impact depends on region, snowfall, and local wind exposure.', '冬季影响取决于区域、降雪和风暴暴露程度。', '冬の影響は地域・降雪・風の暴露度に依存します。'),
      sunshineSummary: ls('Sunshine/cloudiness patterns are shown to support realistic planning.', '晴天/阴天模式用于支持更现实的生活规划。', '日照・曇天傾向は現実的な生活計画のために表示しています。'),
      severeWeatherNotes: ls('Severe weather notes indicate practical planning risk, not ranking value.', '极端天气说明用于实际风险提示，不作价值判断。', '異常気象メモは実務上のリスク提示であり、価値判断ではありません。'),
      seasonalLifestyleSummary: ls('Seasonal rhythm can materially affect commuting and errands.', '季节节奏会实质影响通勤与日常办事。', '季節リズムは通学と日常用事に実質的な影響を与えます。'),
    },
    demographics: {
      campus: { white: seed.profile === 'urban' ? 32 : 46, black: seed.profile === 'urban' ? 8 : 6, hispanicLatino: seed.profile === 'urban' ? 13 : 9, asian: seed.profile === 'urban' ? 21 : 14, internationalStudents: seed.schoolType === 'National University' ? 12 : 10, populationDensityBand: seed.profile === 'urban' ? 'Urban-accessible' : seed.profile === 'suburban' ? 'Suburban mix' : 'Low density' },
      area30mi: { white: seed.profile === 'urban' ? 48 : seed.profile === 'suburban' ? 58 : 76, black: seed.profile === 'urban' ? 14 : seed.profile === 'suburban' ? 11 : 5, hispanicLatino: seed.profile === 'urban' ? 16 : seed.profile === 'suburban' ? 12 : 7, asian: seed.profile === 'urban' ? 11 : seed.profile === 'suburban' ? 8 : 4, foreignBornShare: seed.profile === 'urban' ? 22 : seed.profile === 'suburban' ? 16 : 9, medianHouseholdIncomeUsd: seed.profile === 'urban' ? 94000 : seed.profile === 'suburban' ? 86000 : 74000, populationDensityBand: seed.profile === 'urban' ? 'Urban-accessible' : seed.profile === 'suburban' ? 'Suburban mix' : 'Low density' },
      note: ls('Campus and surrounding-area context are shown together for practical comparison.', '校内与周边环境数据并列呈现，用于务实比较。', 'キャンパス内と周辺環境データを並列表示し、実務的に比較できるようにしています。'),
    },
    foodConvenience: buildFood(seed.profile, seed.city),
    lifeConvenience: buildLife(seed.profile, seed.city),
    airportAccess: {
      airportName: meta.majorAirport,
      distanceMiles: seed.profile === 'urban' ? 12 : seed.profile === 'suburban' ? 24 : 52,
      driveMinutes: seed.profile === 'urban' ? 28 : seed.profile === 'suburban' ? 37 : 74,
      publicTransitMinutes: seed.profile === 'town' ? null : seed.profile === 'urban' ? 52 : 78,
      connectivitySummary: ls('Connectivity is evaluated around practical routes to major Asia gateways (Tokyo, Seoul, Shanghai, Beijing, Hong Kong, Taipei, Singapore).', '连接度围绕东京、首尔、上海、北京、香港、台北、新加坡等亚洲主要门户的实际可达性评估。', '接続性は東京・ソウル・上海・北京・香港・台北・シンガポール方面の実用性を中心に評価しています。'),
      practicalTravelSummary: ls('Airport-day friction is based on campus-to-airport distance, drive time, and public transit availability.', '机场出行摩擦基于校园到机场的距离、开车时间与公共交通可用性。', '空港移動の負担はキャンパスからの距離・車移動時間・公共交通可用性で評価しています。'),
      accessLevel: seed.profile === 'urban' ? 'easy' : seed.profile === 'suburban' ? 'moderate' : 'inconvenient',
    },
  };
}

// 50 National + 50 Liberal Arts seeds
const topNational50: Seed[] = [
  { slug: 'harvard-university', name: 'Harvard University', city: 'Cambridge', stateCode: 'MA', schoolType: 'National University', sector: 'Private', rankingBand: 'Top 10', rankingLabel: 'Top national university', profile: 'urban', tags: ['major_air_hub', 'research_intensive', 'car_optional'] },
  { slug: 'mit', name: 'Massachusetts Institute of Technology', city: 'Cambridge', stateCode: 'MA', schoolType: 'National University', sector: 'Private', rankingBand: 'Top 10', rankingLabel: 'Top national university', profile: 'urban', tags: ['major_air_hub', 'research_intensive', 'car_optional'] },
  { slug: 'stanford-university', name: 'Stanford University', city: 'Stanford', stateCode: 'CA', schoolType: 'National University', sector: 'Private', rankingBand: 'Top 10', rankingLabel: 'Top national university', profile: 'suburban', tags: ['research_intensive', 'major_air_hub', 'mild_winter'] },
  { slug: 'yale-university', name: 'Yale University', city: 'New Haven', stateCode: 'CT', schoolType: 'National University', sector: 'Private', rankingBand: 'Top 10', rankingLabel: 'Top national university', profile: 'urban', tags: ['research_intensive', 'major_air_hub'] },
  { slug: 'university-of-pennsylvania', name: 'University of Pennsylvania', city: 'Philadelphia', stateCode: 'PA', schoolType: 'National University', sector: 'Private', rankingBand: 'Top 10', rankingLabel: 'Top national university', profile: 'urban', tags: ['research_intensive', 'major_air_hub', 'car_optional'] },
  { slug: 'california-institute-of-technology', name: 'California Institute of Technology', city: 'Pasadena', stateCode: 'CA', schoolType: 'National University', sector: 'Private', rankingBand: 'Top 10', rankingLabel: 'Top national university', profile: 'suburban', tags: ['research_intensive', 'major_air_hub', 'mild_winter'] },
  { slug: 'duke-university', name: 'Duke University', city: 'Durham', stateCode: 'NC', schoolType: 'National University', sector: 'Private', rankingBand: 'Top 20', rankingLabel: 'Top national university', profile: 'suburban', tags: ['research_intensive', 'major_air_hub', 'quiet_residential'] },
  { slug: 'brown-university', name: 'Brown University', city: 'Providence', stateCode: 'RI', schoolType: 'National University', sector: 'Private', rankingBand: 'Top 20', rankingLabel: 'Top national university', profile: 'urban', tags: ['research_intensive', 'major_air_hub'] },
  { slug: 'johns-hopkins-university', name: 'Johns Hopkins University', city: 'Baltimore', stateCode: 'MD', schoolType: 'National University', sector: 'Private', rankingBand: 'Top 20', rankingLabel: 'Top national university', profile: 'urban', tags: ['research_intensive', 'major_air_hub', 'car_optional'] },
  { slug: 'northwestern-university', name: 'Northwestern University', city: 'Evanston', stateCode: 'IL', schoolType: 'National University', sector: 'Private', rankingBand: 'Top 20', rankingLabel: 'Top national university', profile: 'suburban', tags: ['research_intensive', 'major_air_hub'] },
  { slug: 'columbia-university', name: 'Columbia University', city: 'New York', stateCode: 'NY', schoolType: 'National University', sector: 'Private', rankingBand: 'Top 20', rankingLabel: 'Top national university', profile: 'urban', tags: ['major_air_hub', 'research_intensive', 'car_optional'] },
  { slug: 'cornell-university', name: 'Cornell University', city: 'Ithaca', stateCode: 'NY', schoolType: 'National University', sector: 'Private', rankingBand: 'Top 20', rankingLabel: 'Top national university', profile: 'town', tags: ['research_intensive', 'quiet_residential', 'walkable_town'] },
  { slug: 'university-of-chicago', name: 'University of Chicago', city: 'Chicago', stateCode: 'IL', schoolType: 'National University', sector: 'Private', rankingBand: 'Top 20', rankingLabel: 'Top national university', profile: 'urban', tags: ['research_intensive', 'major_air_hub', 'car_optional'] },
  { slug: 'university-of-california-berkeley', name: 'University of California, Berkeley', city: 'Berkeley', stateCode: 'CA', schoolType: 'National University', sector: 'Public', rankingBand: 'Top 20', rankingLabel: 'Top national public university', profile: 'urban', tags: ['research_intensive', 'major_air_hub', 'car_optional'] },
  { slug: 'dartmouth-college', name: 'Dartmouth College', city: 'Hanover', stateCode: 'NH', schoolType: 'National University', sector: 'Private', rankingBand: 'Top 20', rankingLabel: 'Top national university', profile: 'town', tags: ['quiet_residential', 'walkable_town'] },
  { slug: 'vanderbilt-university', name: 'Vanderbilt University', city: 'Nashville', stateCode: 'TN', schoolType: 'National University', sector: 'Private', rankingBand: 'Top 20', rankingLabel: 'Top national university', profile: 'urban', tags: ['research_intensive', 'major_air_hub'] },
  { slug: 'university-of-notre-dame', name: 'University of Notre Dame', city: 'Notre Dame', stateCode: 'IN', schoolType: 'National University', sector: 'Private', rankingBand: 'Top 20', rankingLabel: 'Top national university', profile: 'suburban', tags: ['quiet_residential', 'research_intensive'] },
  { slug: 'georgetown-university', name: 'Georgetown University', city: 'Washington', stateCode: 'DC', schoolType: 'National University', sector: 'Private', rankingBand: 'Top 25', rankingLabel: 'Top national university', profile: 'urban', tags: ['major_air_hub', 'car_optional'] },
  { slug: 'unc-chapel-hill', name: 'University of North Carolina at Chapel Hill', city: 'Chapel Hill', stateCode: 'NC', schoolType: 'National University', sector: 'Public', rankingBand: 'Top 30', rankingLabel: 'Top national public university', profile: 'suburban', tags: ['research_intensive', 'walkable_town', 'major_air_hub'] },
  { slug: 'carnegie-mellon-university', name: 'Carnegie Mellon University', city: 'Pittsburgh', stateCode: 'PA', schoolType: 'National University', sector: 'Private', rankingBand: 'Top 30', rankingLabel: 'Top national university', profile: 'urban', tags: ['research_intensive', 'major_air_hub'] },
  { slug: 'emory-university', name: 'Emory University', city: 'Atlanta', stateCode: 'GA', schoolType: 'National University', sector: 'Private', rankingBand: 'Top 30', rankingLabel: 'Top national university', profile: 'suburban', tags: ['research_intensive', 'major_air_hub', 'asian_grocery_access'] },
  { slug: 'university-of-virginia', name: 'University of Virginia', city: 'Charlottesville', stateCode: 'VA', schoolType: 'National University', sector: 'Public', rankingBand: 'Top 30', rankingLabel: 'Top national public university', profile: 'suburban', tags: ['walkable_town', 'quiet_residential'] },
  { slug: 'washington-university-in-st-louis', name: 'Washington University in St. Louis', city: 'St. Louis', stateCode: 'MO', schoolType: 'National University', sector: 'Private', rankingBand: 'Top 30', rankingLabel: 'Top national university', profile: 'urban', tags: ['research_intensive', 'major_air_hub'] },
  { slug: 'university-of-southern-california', name: 'University of Southern California', city: 'Los Angeles', stateCode: 'CA', schoolType: 'National University', sector: 'Private', rankingBand: 'Top 30', rankingLabel: 'Top national university', profile: 'urban', tags: ['major_air_hub', 'asian_grocery_access', 'car_optional'] },
  { slug: 'new-york-university', name: 'New York University', city: 'New York', stateCode: 'NY', schoolType: 'National University', sector: 'Private', rankingBand: 'Top 35', rankingLabel: 'Top national university', profile: 'urban', tags: ['major_air_hub', 'car_optional', 'dense_asian_corridor'] },
  { slug: 'tufts-university', name: 'Tufts University', city: 'Medford', stateCode: 'MA', schoolType: 'National University', sector: 'Private', rankingBand: 'Top 40', rankingLabel: 'Top national university', profile: 'suburban', tags: ['major_air_hub', 'research_intensive'] },
  { slug: 'boston-university', name: 'Boston University', city: 'Boston', stateCode: 'MA', schoolType: 'National University', sector: 'Private', rankingBand: 'Top 50', rankingLabel: 'Top national university', profile: 'urban', tags: ['major_air_hub', 'car_optional'] },
  { slug: 'university-of-california-san-diego', name: 'University of California, San Diego', city: 'San Diego', stateCode: 'CA', schoolType: 'National University', sector: 'Public', rankingBand: 'Top 40', rankingLabel: 'Top national public university', profile: 'suburban', tags: ['mild_winter', 'major_air_hub', 'research_intensive'] },
  { slug: 'university-of-florida', name: 'University of Florida', city: 'Gainesville', stateCode: 'FL', schoolType: 'National University', sector: 'Public', rankingBand: 'Top 40', rankingLabel: 'Top national public university', profile: 'suburban', tags: ['research_intensive', 'major_air_hub', 'quiet_residential'] },
  { slug: 'university-of-texas-austin', name: 'University of Texas at Austin', city: 'Austin', stateCode: 'TX', schoolType: 'National University', sector: 'Public', rankingBand: 'Top 40', rankingLabel: 'Top national public university', profile: 'urban', tags: ['research_intensive', 'major_air_hub'] },
  { slug: 'georgia-institute-of-technology', name: 'Georgia Institute of Technology', city: 'Atlanta', stateCode: 'GA', schoolType: 'National University', sector: 'Public', rankingBand: 'Top 40', rankingLabel: 'Top national public university', profile: 'urban', tags: ['research_intensive', 'major_air_hub'] },
  { slug: 'university-of-california-davis', name: 'University of California, Davis', city: 'Davis', stateCode: 'CA', schoolType: 'National University', sector: 'Public', rankingBand: 'Top 40', rankingLabel: 'Top national public university', profile: 'suburban', tags: ['mild_winter', 'research_intensive', 'quiet_residential'] },
  { slug: 'university-of-california-irvine', name: 'University of California, Irvine', city: 'Irvine', stateCode: 'CA', schoolType: 'National University', sector: 'Public', rankingBand: 'Top 40', rankingLabel: 'Top national public university', profile: 'suburban', tags: ['mild_winter', 'asian_grocery_access', 'major_air_hub'] },
  { slug: 'university-of-illinois-urbana-champaign', name: 'University of Illinois Urbana-Champaign', city: 'Champaign', stateCode: 'IL', schoolType: 'National University', sector: 'Public', rankingBand: 'Top 50', rankingLabel: 'Top national public university', profile: 'town', tags: ['research_intensive', 'walkable_town'] },
  { slug: 'university-of-wisconsin-madison', name: 'University of Wisconsin-Madison', city: 'Madison', stateCode: 'WI', schoolType: 'National University', sector: 'Public', rankingBand: 'Top 50', rankingLabel: 'Top national public university', profile: 'urban', tags: ['research_intensive', 'walkable_town'] },
  { slug: 'ohio-state-university', name: 'The Ohio State University', city: 'Columbus', stateCode: 'OH', schoolType: 'National University', sector: 'Public', rankingBand: 'Top 50', rankingLabel: 'Top national public university', profile: 'urban', tags: ['research_intensive', 'major_air_hub'] },
  { slug: 'rutgers-university', name: 'Rutgers University-New Brunswick', city: 'New Brunswick', stateCode: 'NJ', schoolType: 'National University', sector: 'Public', rankingBand: 'Top 50', rankingLabel: 'Top national public university', profile: 'urban', tags: ['major_air_hub', 'car_optional'] },
  { slug: 'university-of-maryland-college-park', name: 'University of Maryland, College Park', city: 'College Park', stateCode: 'MD', schoolType: 'National University', sector: 'Public', rankingBand: 'Top 50', rankingLabel: 'Top national public university', profile: 'suburban', tags: ['major_air_hub', 'research_intensive'] },
  { slug: 'purdue-university', name: 'Purdue University', city: 'West Lafayette', stateCode: 'IN', schoolType: 'National University', sector: 'Public', rankingBand: 'Top 50', rankingLabel: 'Top national public university', profile: 'town', tags: ['research_intensive', 'walkable_town'] },
  { slug: 'wake-forest-university', name: 'Wake Forest University', city: 'Winston-Salem', stateCode: 'NC', schoolType: 'National University', sector: 'Private', rankingBand: 'Top 50', rankingLabel: 'Top national university', profile: 'suburban', tags: ['quiet_residential', 'major_air_hub'] },
  { slug: 'case-western-reserve-university', name: 'Case Western Reserve University', city: 'Cleveland', stateCode: 'OH', schoolType: 'National University', sector: 'Private', rankingBand: 'Top 50', rankingLabel: 'Top national university', profile: 'urban', tags: ['research_intensive', 'major_air_hub'] },
  { slug: 'lehigh-university', name: 'Lehigh University', city: 'Bethlehem', stateCode: 'PA', schoolType: 'National University', sector: 'Private', rankingBand: 'Top 50', rankingLabel: 'Top national university', profile: 'suburban', tags: ['quiet_residential', 'major_air_hub'] },
  { slug: 'william-and-mary', name: 'William & Mary', city: 'Williamsburg', stateCode: 'VA', schoolType: 'National University', sector: 'Public', rankingBand: 'Top 50', rankingLabel: 'Top national public university', profile: 'town', tags: ['walkable_town', 'quiet_residential'] },
  { slug: 'villanova-university', name: 'Villanova University', city: 'Villanova', stateCode: 'PA', schoolType: 'National University', sector: 'Private', rankingBand: 'Top 50', rankingLabel: 'Top national university', profile: 'suburban', tags: ['major_air_hub', 'quiet_residential'] },
  { slug: 'university-of-minnesota-twin-cities', name: 'University of Minnesota Twin Cities', city: 'Minneapolis', stateCode: 'MN', schoolType: 'National University', sector: 'Public', rankingBand: 'Top 50', rankingLabel: 'Top national public university', profile: 'urban', tags: ['research_intensive', 'major_air_hub'] },
  { slug: 'university-of-rochester', name: 'University of Rochester', city: 'Rochester', stateCode: 'NY', schoolType: 'National University', sector: 'Private', rankingBand: 'Top 50', rankingLabel: 'Top national university', profile: 'urban', tags: ['research_intensive', 'major_air_hub'] },
  { slug: 'brandeis-university', name: 'Brandeis University', city: 'Waltham', stateCode: 'MA', schoolType: 'National University', sector: 'Private', rankingBand: 'Top 50', rankingLabel: 'Top national university', profile: 'suburban', tags: ['major_air_hub', 'quiet_residential'] },
  { slug: 'uc-santa-barbara', name: 'University of California, Santa Barbara', city: 'Santa Barbara', stateCode: 'CA', schoolType: 'National University', sector: 'Public', rankingBand: 'Top 50', rankingLabel: 'Top national public university', profile: 'suburban', tags: ['mild_winter', 'major_air_hub'] },
  { slug: 'uc-santa-cruz', name: 'University of California, Santa Cruz', city: 'Santa Cruz', stateCode: 'CA', schoolType: 'National University', sector: 'Public', rankingBand: 'Top 50', rankingLabel: 'Top national public university', profile: 'suburban', tags: ['mild_winter', 'quiet_residential'] },
  { slug: 'pepperdine-university', name: 'Pepperdine University', city: 'Malibu', stateCode: 'CA', schoolType: 'National University', sector: 'Private', rankingBand: 'Top 50', rankingLabel: 'Top national university', profile: 'suburban', tags: ['mild_winter', 'major_air_hub'] },
];

const topLac50: Seed[] = [
  { slug: 'williams-college', name: 'Williams College', city: 'Williamstown', stateCode: 'MA', schoolType: 'Liberal Arts College', sector: 'Private', rankingBand: 'Top 10', rankingLabel: 'Top liberal arts college', profile: 'town', tags: ['quiet_residential', 'walkable_town'] },
  { slug: 'swarthmore-college', name: 'Swarthmore College', city: 'Swarthmore', stateCode: 'PA', schoolType: 'Liberal Arts College', sector: 'Private', rankingBand: 'Top 10', rankingLabel: 'Top liberal arts college', profile: 'suburban', tags: ['major_air_hub', 'quiet_residential'] },
  { slug: 'wellesley-college', name: 'Wellesley College', city: 'Wellesley', stateCode: 'MA', schoolType: 'Liberal Arts College', sector: 'Private', rankingBand: 'Top 10', rankingLabel: 'Top liberal arts college', profile: 'suburban', tags: ['major_air_hub', 'quiet_residential'] },
  { slug: 'bowdoin-college', name: 'Bowdoin College', city: 'Brunswick', stateCode: 'ME', schoolType: 'Liberal Arts College', sector: 'Private', rankingBand: 'Top 10', rankingLabel: 'Top liberal arts college', profile: 'town', tags: ['quiet_residential', 'walkable_town'] },
  { slug: 'carleton-college', name: 'Carleton College', city: 'Northfield', stateCode: 'MN', schoolType: 'Liberal Arts College', sector: 'Private', rankingBand: 'Top 10', rankingLabel: 'Top liberal arts college', profile: 'town', tags: ['quiet_residential', 'walkable_town'] },
  { slug: 'claremont-mckenna-college', name: 'Claremont McKenna College', city: 'Claremont', stateCode: 'CA', schoolType: 'Liberal Arts College', sector: 'Private', rankingBand: 'Top 10', rankingLabel: 'Top liberal arts college', profile: 'suburban', tags: ['mild_winter', 'major_air_hub'] },
  { slug: 'davidson-college', name: 'Davidson College', city: 'Davidson', stateCode: 'NC', schoolType: 'Liberal Arts College', sector: 'Private', rankingBand: 'Top 20', rankingLabel: 'Top liberal arts college', profile: 'town', tags: ['quiet_residential', 'walkable_town'] },
  { slug: 'haverford-college', name: 'Haverford College', city: 'Haverford', stateCode: 'PA', schoolType: 'Liberal Arts College', sector: 'Private', rankingBand: 'Top 20', rankingLabel: 'Top liberal arts college', profile: 'suburban', tags: ['major_air_hub', 'quiet_residential'] },
  { slug: 'vassar-college', name: 'Vassar College', city: 'Poughkeepsie', stateCode: 'NY', schoolType: 'Liberal Arts College', sector: 'Private', rankingBand: 'Top 20', rankingLabel: 'Top liberal arts college', profile: 'suburban', tags: ['major_air_hub', 'walkable_town'] },
  { slug: 'washington-and-lee-university', name: 'Washington and Lee University', city: 'Lexington', stateCode: 'VA', schoolType: 'Liberal Arts College', sector: 'Private', rankingBand: 'Top 20', rankingLabel: 'Top liberal arts college', profile: 'town', tags: ['quiet_residential', 'walkable_town'] },
  { slug: 'hamilton-college', name: 'Hamilton College', city: 'Clinton', stateCode: 'NY', schoolType: 'Liberal Arts College', sector: 'Private', rankingBand: 'Top 20', rankingLabel: 'Top liberal arts college', profile: 'town', tags: ['quiet_residential', 'walkable_town'] },
  { slug: 'colby-college', name: 'Colby College', city: 'Waterville', stateCode: 'ME', schoolType: 'Liberal Arts College', sector: 'Private', rankingBand: 'Top 20', rankingLabel: 'Top liberal arts college', profile: 'town', tags: ['quiet_residential', 'walkable_town'] },
  { slug: 'middlebury-college', name: 'Middlebury College', city: 'Middlebury', stateCode: 'VT', schoolType: 'Liberal Arts College', sector: 'Private', rankingBand: 'Top 20', rankingLabel: 'Top liberal arts college', profile: 'town', tags: ['quiet_residential', 'walkable_town'] },
  { slug: 'grinnell-college', name: 'Grinnell College', city: 'Grinnell', stateCode: 'IA', schoolType: 'Liberal Arts College', sector: 'Private', rankingBand: 'Top 20', rankingLabel: 'Top liberal arts college', profile: 'town', tags: ['quiet_residential', 'walkable_town'] },
  { slug: 'colgate-university', name: 'Colgate University', city: 'Hamilton', stateCode: 'NY', schoolType: 'Liberal Arts College', sector: 'Private', rankingBand: 'Top 20', rankingLabel: 'Top liberal arts college', profile: 'town', tags: ['quiet_residential', 'walkable_town'] },
  { slug: 'smith-college', name: 'Smith College', city: 'Northampton', stateCode: 'MA', schoolType: 'Liberal Arts College', sector: 'Private', rankingBand: 'Top 20', rankingLabel: 'Top liberal arts college', profile: 'town', tags: ['quiet_residential', 'walkable_town'] },
  { slug: 'harvey-mudd-college', name: 'Harvey Mudd College', city: 'Claremont', stateCode: 'CA', schoolType: 'Liberal Arts College', sector: 'Private', rankingBand: 'Top 20', rankingLabel: 'Top liberal arts college', profile: 'suburban', tags: ['mild_winter', 'major_air_hub'] },
  { slug: 'bryn-mawr-college', name: 'Bryn Mawr College', city: 'Bryn Mawr', stateCode: 'PA', schoolType: 'Liberal Arts College', sector: 'Private', rankingBand: 'Top 30', rankingLabel: 'Top liberal arts college', profile: 'suburban', tags: ['major_air_hub', 'quiet_residential'] },
  { slug: 'wesleyan-university', name: 'Wesleyan University', city: 'Middletown', stateCode: 'CT', schoolType: 'Liberal Arts College', sector: 'Private', rankingBand: 'Top 30', rankingLabel: 'Top liberal arts college', profile: 'suburban', tags: ['walkable_town', 'quiet_residential'] },
  { slug: 'barnard-college', name: 'Barnard College', city: 'New York', stateCode: 'NY', schoolType: 'Liberal Arts College', sector: 'Private', rankingBand: 'Top 30', rankingLabel: 'Top liberal arts college', profile: 'urban', tags: ['major_air_hub', 'car_optional'] },
  { slug: 'macalester-college', name: 'Macalester College', city: 'Saint Paul', stateCode: 'MN', schoolType: 'Liberal Arts College', sector: 'Private', rankingBand: 'Top 30', rankingLabel: 'Top liberal arts college', profile: 'urban', tags: ['major_air_hub', 'walkable_town'] },
  { slug: 'bates-college', name: 'Bates College', city: 'Lewiston', stateCode: 'ME', schoolType: 'Liberal Arts College', sector: 'Private', rankingBand: 'Top 30', rankingLabel: 'Top liberal arts college', profile: 'town', tags: ['quiet_residential', 'walkable_town'] },
  { slug: 'colorado-college', name: 'Colorado College', city: 'Colorado Springs', stateCode: 'CO', schoolType: 'Liberal Arts College', sector: 'Private', rankingBand: 'Top 30', rankingLabel: 'Top liberal arts college', profile: 'urban', tags: ['major_air_hub', 'walkable_town'] },
  { slug: 'oberlin-college', name: 'Oberlin College', city: 'Oberlin', stateCode: 'OH', schoolType: 'Liberal Arts College', sector: 'Private', rankingBand: 'Top 30', rankingLabel: 'Top liberal arts college', profile: 'town', tags: ['quiet_residential', 'walkable_town'] },
  { slug: 'scripps-college', name: 'Scripps College', city: 'Claremont', stateCode: 'CA', schoolType: 'Liberal Arts College', sector: 'Private', rankingBand: 'Top 30', rankingLabel: 'Top liberal arts college', profile: 'suburban', tags: ['mild_winter', 'major_air_hub'] },
  { slug: 'franklin-and-marshall-college', name: 'Franklin & Marshall College', city: 'Lancaster', stateCode: 'PA', schoolType: 'Liberal Arts College', sector: 'Private', rankingBand: 'Top 40', rankingLabel: 'Top liberal arts college', profile: 'urban', tags: ['major_air_hub', 'quiet_residential'] },
  { slug: 'college-of-the-holy-cross', name: 'College of the Holy Cross', city: 'Worcester', stateCode: 'MA', schoolType: 'Liberal Arts College', sector: 'Private', rankingBand: 'Top 40', rankingLabel: 'Top liberal arts college', profile: 'urban', tags: ['major_air_hub', 'quiet_residential'] },
  { slug: 'kenyon-college', name: 'Kenyon College', city: 'Gambier', stateCode: 'OH', schoolType: 'Liberal Arts College', sector: 'Private', rankingBand: 'Top 40', rankingLabel: 'Top liberal arts college', profile: 'town', tags: ['quiet_residential', 'walkable_town'] },
  { slug: 'whitman-college', name: 'Whitman College', city: 'Walla Walla', stateCode: 'WA', schoolType: 'Liberal Arts College', sector: 'Private', rankingBand: 'Top 40', rankingLabel: 'Top liberal arts college', profile: 'town', tags: ['quiet_residential', 'walkable_town'] },
  { slug: 'mount-holyoke-college', name: 'Mount Holyoke College', city: 'South Hadley', stateCode: 'MA', schoolType: 'Liberal Arts College', sector: 'Private', rankingBand: 'Top 40', rankingLabel: 'Top liberal arts college', profile: 'town', tags: ['quiet_residential', 'walkable_town'] },
  { slug: 'skidmore-college', name: 'Skidmore College', city: 'Saratoga Springs', stateCode: 'NY', schoolType: 'Liberal Arts College', sector: 'Private', rankingBand: 'Top 40', rankingLabel: 'Top liberal arts college', profile: 'town', tags: ['quiet_residential', 'walkable_town'] },
  { slug: 'pitzer-college', name: 'Pitzer College', city: 'Claremont', stateCode: 'CA', schoolType: 'Liberal Arts College', sector: 'Private', rankingBand: 'Top 40', rankingLabel: 'Top liberal arts college', profile: 'suburban', tags: ['mild_winter', 'major_air_hub'] },
  { slug: 'trinity-college-ct', name: 'Trinity College', city: 'Hartford', stateCode: 'CT', schoolType: 'Liberal Arts College', sector: 'Private', rankingBand: 'Top 40', rankingLabel: 'Top liberal arts college', profile: 'urban', tags: ['major_air_hub', 'quiet_residential'] },
  { slug: 'lafayette-college', name: 'Lafayette College', city: 'Easton', stateCode: 'PA', schoolType: 'Liberal Arts College', sector: 'Private', rankingBand: 'Top 40', rankingLabel: 'Top liberal arts college', profile: 'town', tags: ['quiet_residential', 'walkable_town'] },
  { slug: 'bucknell-university', name: 'Bucknell University', city: 'Lewisburg', stateCode: 'PA', schoolType: 'Liberal Arts College', sector: 'Private', rankingBand: 'Top 40', rankingLabel: 'Top liberal arts college', profile: 'town', tags: ['quiet_residential', 'walkable_town'] },
  { slug: 'denison-university', name: 'Denison University', city: 'Granville', stateCode: 'OH', schoolType: 'Liberal Arts College', sector: 'Private', rankingBand: 'Top 50', rankingLabel: 'Top liberal arts college', profile: 'town', tags: ['quiet_residential', 'walkable_town'] },
  { slug: 'sewanee-university-of-the-south', name: 'Sewanee: The University of the South', city: 'Sewanee', stateCode: 'TN', schoolType: 'Liberal Arts College', sector: 'Private', rankingBand: 'Top 50', rankingLabel: 'Top liberal arts college', profile: 'town', tags: ['quiet_residential', 'walkable_town'] },
  { slug: 'union-college', name: 'Union College', city: 'Schenectady', stateCode: 'NY', schoolType: 'Liberal Arts College', sector: 'Private', rankingBand: 'Top 50', rankingLabel: 'Top liberal arts college', profile: 'suburban', tags: ['quiet_residential', 'major_air_hub'] },
  { slug: 'connecticut-college', name: 'Connecticut College', city: 'New London', stateCode: 'CT', schoolType: 'Liberal Arts College', sector: 'Private', rankingBand: 'Top 50', rankingLabel: 'Top liberal arts college', profile: 'suburban', tags: ['quiet_residential', 'major_air_hub'] },
  { slug: 'rhodes-college', name: 'Rhodes College', city: 'Memphis', stateCode: 'TN', schoolType: 'Liberal Arts College', sector: 'Private', rankingBand: 'Top 50', rankingLabel: 'Top liberal arts college', profile: 'urban', tags: ['major_air_hub', 'quiet_residential'] },
  { slug: 'st-olaf-college', name: 'St. Olaf College', city: 'Northfield', stateCode: 'MN', schoolType: 'Liberal Arts College', sector: 'Private', rankingBand: 'Top 50', rankingLabel: 'Top liberal arts college', profile: 'town', tags: ['quiet_residential', 'walkable_town'] },
  { slug: 'reed-college', name: 'Reed College', city: 'Portland', stateCode: 'OR', schoolType: 'Liberal Arts College', sector: 'Private', rankingBand: 'Top 50', rankingLabel: 'Top liberal arts college', profile: 'urban', tags: ['major_air_hub', 'walkable_town'] },
  { slug: 'gettysburg-college', name: 'Gettysburg College', city: 'Gettysburg', stateCode: 'PA', schoolType: 'Liberal Arts College', sector: 'Private', rankingBand: 'Top 50', rankingLabel: 'Top liberal arts college', profile: 'town', tags: ['quiet_residential', 'walkable_town'] },
  { slug: 'dickinson-college', name: 'Dickinson College', city: 'Carlisle', stateCode: 'PA', schoolType: 'Liberal Arts College', sector: 'Private', rankingBand: 'Top 50', rankingLabel: 'Top liberal arts college', profile: 'town', tags: ['quiet_residential', 'walkable_town'] },
  { slug: 'furman-university', name: 'Furman University', city: 'Greenville', stateCode: 'SC', schoolType: 'Liberal Arts College', sector: 'Private', rankingBand: 'Top 50', rankingLabel: 'Top liberal arts college', profile: 'suburban', tags: ['quiet_residential', 'major_air_hub'] },
  { slug: 'sarah-lawrence-college', name: 'Sarah Lawrence College', city: 'Bronxville', stateCode: 'NY', schoolType: 'Liberal Arts College', sector: 'Private', rankingBand: 'Top 50', rankingLabel: 'Top liberal arts college', profile: 'suburban', tags: ['major_air_hub', 'quiet_residential'] },
  { slug: 'depauw-university', name: 'DePauw University', city: 'Greencastle', stateCode: 'IN', schoolType: 'Liberal Arts College', sector: 'Private', rankingBand: 'Top 50', rankingLabel: 'Top liberal arts college', profile: 'town', tags: ['quiet_residential', 'walkable_town'] },
  { slug: 'centre-college', name: 'Centre College', city: 'Danville', stateCode: 'KY', schoolType: 'Liberal Arts College', sector: 'Private', rankingBand: 'Top 50', rankingLabel: 'Top liberal arts college', profile: 'town', tags: ['quiet_residential', 'walkable_town'] },
  { slug: 'occidental-college', name: 'Occidental College', city: 'Los Angeles', stateCode: 'CA', schoolType: 'Liberal Arts College', sector: 'Private', rankingBand: 'Top 50', rankingLabel: 'Top liberal arts college', profile: 'urban', tags: ['mild_winter', 'major_air_hub'] },
  { slug: 'st-johns-college', name: 'St. John\'s College', city: 'Annapolis', stateCode: 'MD', schoolType: 'Liberal Arts College', sector: 'Private', rankingBand: 'Top 50', rankingLabel: 'Top liberal arts college', profile: 'town', tags: ['walkable_town', 'major_air_hub'] },
  { slug: 'agnes-scott-college', name: 'Agnes Scott College', city: 'Decatur', stateCode: 'GA', schoolType: 'Liberal Arts College', sector: 'Private', rankingBand: 'Top 50', rankingLabel: 'Top liberal arts college', profile: 'urban', tags: ['major_air_hub', 'quiet_residential'] },
  { slug: 'trinity-university', name: 'Trinity University', city: 'San Antonio', stateCode: 'TX', schoolType: 'Liberal Arts College', sector: 'Private', rankingBand: 'Top 50', rankingLabel: 'Top liberal arts college', profile: 'urban', tags: ['major_air_hub', 'quiet_residential'] },
  { slug: 'wooster-college', name: 'College of Wooster', city: 'Wooster', stateCode: 'OH', schoolType: 'Liberal Arts College', sector: 'Private', rankingBand: 'Top 50', rankingLabel: 'Top liberal arts college', profile: 'town', tags: ['quiet_residential', 'walkable_town'] },
  { slug: 'goucher-college', name: 'Goucher College', city: 'Towson', stateCode: 'MD', schoolType: 'Liberal Arts College', sector: 'Private', rankingBand: 'Top 50', rankingLabel: 'Top liberal arts college', profile: 'suburban', tags: ['major_air_hub', 'quiet_residential'] },
];

export const extraSchools: School[] = [...topNational50, ...topLac50].map(makeSchool);

const colgate = extraSchools.find((school) => school.slug === 'colgate-university');
if (colgate) {
  colgate.scores = { climate: 52, demographics: 69, food: 45, life: 47, airport: 57, overall: 54 };
  colgate.foodConvenience.starbucks = { name: 'Starbucks New Hartford', distanceMiles: 17.2, driveMinutes: 28, publicTransitMinutes: null, countWithin5: 0, countWithin10: 0, countWithin30: 4, uberAvailable: true, uberEatsAvailable: false };
  colgate.lifeConvenience.dmv = { name: 'Norwich NYS DMV', distanceMiles: 18.6, driveMinutes: 31, publicTransitMinutes: null, uberAvailable: true };
}
