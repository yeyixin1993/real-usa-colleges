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

function buildFood(profile: Profile, label: string): School['foodConvenience'] {
  const m = profile === 'urban' ? 0.65 : profile === 'suburban' ? 0.95 : 1.35;
  const t = profile === 'urban' ? 0.75 : profile === 'suburban' ? 1 : 1.6;
  const dense = profile === 'urban' ? 1.8 : profile === 'suburban' ? 1.1 : 0.6;

  const dist = (v: number) => Number((v * m).toFixed(1));
  const drive = (v: number) => Math.max(2, Math.round(v * (profile === 'urban' ? 0.85 : profile === 'suburban' ? 1 : 1.2)));
  const transit = (v: number) => (profile === 'town' ? Math.round(v * t) : Math.round(v * t));
  const count = (v: number) => Math.max(0, Math.round(v * dense));

  return {
    fast_food: { name: `${label} quick-serve cluster`, distanceMiles: dist(0.8), driveMinutes: drive(4), publicTransitMinutes: transit(8), countWithin5: count(24), countWithin10: count(88), countWithin30: count(420), uberAvailable: true, uberEatsAvailable: true },
    grocery_store: { name: `${label} grocery node`, distanceMiles: dist(1.2), driveMinutes: drive(6), publicTransitMinutes: transit(12), countWithin5: count(11), countWithin10: count(40), countWithin30: count(180), uberAvailable: true, uberEatsAvailable: true },
    starbucks: { name: `${label} Starbucks`, distanceMiles: dist(0.7), driveMinutes: drive(4), publicTransitMinutes: transit(9), countWithin5: count(7), countWithin10: count(28), countWithin30: count(130), uberAvailable: true, uberEatsAvailable: true },
    walmart: { name: `${label} Walmart`, distanceMiles: dist(8.5), driveMinutes: drive(18), publicTransitMinutes: profile === 'town' ? null : transit(34), countWithin10: count(1), countWithin30: count(8), uberAvailable: true, uberEatsAvailable: true },
    costco: { name: `${label} Costco`, distanceMiles: dist(7.2), driveMinutes: drive(17), publicTransitMinutes: profile === 'town' ? null : transit(33), countWithin10: count(1), countWithin30: count(7), uberAvailable: true, uberEatsAvailable: false },
    chinese_restaurant: { name: `${label} Chinese dining cluster`, distanceMiles: dist(1.4), driveMinutes: drive(7), publicTransitMinutes: transit(12), countWithin5: count(15), countWithin10: count(54), countWithin30: count(240), uberAvailable: true, uberEatsAvailable: true },
    asian_grocery: { name: `${label} Asian grocery`, distanceMiles: dist(4.6), driveMinutes: drive(14), publicTransitMinutes: profile === 'town' ? null : transit(25), countWithin10: count(4), countWithin30: count(24), uberAvailable: true, uberEatsAvailable: profile !== 'town' },
    dim_sum: { name: `${label} Dim sum spot`, distanceMiles: dist(5.4), driveMinutes: drive(16), publicTransitMinutes: profile === 'town' ? null : transit(30), countWithin10: count(2), countWithin30: count(14), uberAvailable: true, uberEatsAvailable: true },
  };
}

function buildLife(profile: Profile, label: string): School['lifeConvenience'] {
  const m = profile === 'urban' ? 0.7 : profile === 'suburban' ? 1 : 1.45;
  const t = profile === 'urban' ? 0.8 : profile === 'suburban' ? 1 : 1.55;
  const dist = (v: number) => Number((v * m).toFixed(1));
  const drive = (v: number) => Math.max(2, Math.round(v * (profile === 'urban' ? 0.9 : profile === 'suburban' ? 1 : 1.2)));
  const transit = (v: number) => (profile === 'town' ? Math.round(v * t) : Math.round(v * t));

  return {
    dmv: { name: `${label} DMV`, distanceMiles: dist(4.4), driveMinutes: drive(14), publicTransitMinutes: profile === 'town' ? null : transit(30), uberAvailable: true },
    social_security: { name: `${label} SSA office`, distanceMiles: dist(6.1), driveMinutes: drive(17), publicTransitMinutes: profile === 'town' ? null : transit(34), uberAvailable: true },
    bank_of_america: { name: `${label} Bank of America`, distanceMiles: dist(0.8), driveMinutes: drive(4), publicTransitMinutes: transit(9), uberAvailable: true },
    toyota_dealership: { name: `${label} Toyota dealership`, distanceMiles: dist(5.3), driveMinutes: drive(15), publicTransitMinutes: profile === 'town' ? null : transit(31), uberAvailable: true },
    hospital: { name: `${label} hospital`, distanceMiles: dist(1.3), driveMinutes: drive(6), publicTransitMinutes: transit(12), uberAvailable: true },
    usps: { name: `${label} USPS`, distanceMiles: dist(0.9), driveMinutes: drive(5), publicTransitMinutes: transit(10), uberAvailable: true },
    shopping_destination: { name: `${label} shopping district`, distanceMiles: dist(5.0), driveMinutes: drive(14), publicTransitMinutes: profile === 'town' ? null : transit(29), uberAvailable: true },
    target_anchor: { name: `${label} Target anchor`, distanceMiles: dist(4.2), driveMinutes: drive(12), publicTransitMinutes: profile === 'town' ? null : transit(25), uberAvailable: true },
  };
}

function makeSchool(input: {
  id: string;
  slug: string;
  name: string;
  city: string;
  state: string;
  stateCode: string;
  schoolType: School['schoolType'];
  sector: School['sector'];
  region: School['region'];
  climateBand: School['climateBand'];
  rankingBand: string;
  rankingLabel: string;
  coordinates: { lat: number; lng: number };
  scores: School['scores'];
  summary: { en: string; zh: string; ja: string };
  tags: School['tags'];
  profile: Profile;
  climate: { highs: number[]; lows: number[]; precipitation: number; snowfall: number; humidity: School['climate']['humidityBand']; };
  airport: { name: string; distanceMiles: number; driveMinutes: number; transitMinutes: number | null; accessLevel: School['airportAccess']['accessLevel']; };
  demographics: { campus: School['demographics']['campus']; area30mi: School['demographics']['area30mi'] };
}): School {
  return {
    id: input.id,
    slug: input.slug,
    name: input.name,
    city: input.city,
    state: input.state,
    stateCode: input.stateCode,
    schoolType: input.schoolType,
    sector: input.sector,
    region: input.region,
    climateBand: input.climateBand,
    rankingLabel: input.rankingLabel,
    rankingBand: input.rankingBand,
    coordinates: input.coordinates,
    scores: input.scores,
    summary: ls(input.summary.en, input.summary.zh, input.summary.ja),
    methodologyNote: ls('Score inputs are mock and designed for transparent section-by-section comparisons.', '评分输入为模拟数据，重点用于透明地做分项比较。', 'スコア入力はモックで、項目別比較の透明性を重視しています。'),
    tags: input.tags,
    climate: {
      monthly: monthly(input.climate.highs, input.climate.lows),
      annualPrecipitationIn: input.climate.precipitation,
      annualSnowfallIn: input.climate.snowfall,
      humidityBand: input.climate.humidity,
      summerHeatIntensity: ls('Summer conditions are practical for campus life with occasional hotter weeks.', '夏季整体可接受，但会有短期较热时段。', '夏は概ね対応しやすいですが、短期的に暑さが強まる週があります。'),
      winterSeverity: ls('Winter affects daily routines to varying degrees depending on campus latitude and exposure.', '冬季对日常节奏有不同程度影响，取决于纬度和风雪暴露。', '冬の影響は緯度と風雪条件により異なります。'),
      sunshineSummary: ls('Sunshine and cloudiness patterns are kept visible to support realistic planning.', '晴天与阴天模式会明确展示，便于实际规划。', '日照と曇天傾向を可視化し、現実的な計画に役立てます。'),
      severeWeatherNotes: ls('Severe weather risk is included as a practical planning note.', '极端天气风险作为务实规划提示展示。', '異常気象リスクは実務的な注意点として記載しています。'),
      seasonalLifestyleSummary: ls('Seasonal rhythm can materially influence commuting, errands, and weekend routines.', '季节节奏会实质影响通勤、办事和周末活动。', '季節リズムは通学・用事・週末行動に実質的な影響を与えます。'),
    },
    demographics: {
      campus: input.demographics.campus,
      area30mi: input.demographics.area30mi,
      note: ls('Campus and surrounding-area data are shown side by side for context, not judgment.', '校内与周边数据并排呈现，仅用于语境理解，不作价值判断。', 'キャンパス内と周辺データは、価値判断ではなく文脈理解のために併記しています。'),
    },
    foodConvenience: buildFood(input.profile, input.city),
    lifeConvenience: buildLife(input.profile, input.city),
    airportAccess: {
      airportName: input.airport.name,
      distanceMiles: input.airport.distanceMiles,
      driveMinutes: input.airport.driveMinutes,
      publicTransitMinutes: input.airport.transitMinutes,
      connectivitySummary: ls('Airport connectivity focuses on practical access to Tokyo, Seoul, Shanghai, Beijing, Hong Kong, Taipei, and Singapore corridors.', '机场连接度侧重东京、首尔、上海、北京、香港、台北与新加坡等常见亚洲通道。', '空港接続は東京、ソウル、上海、北京、香港、台北、シンガポール方面の実用性を重視しています。'),
      practicalTravelSummary: ls('This section estimates real student travel friction on departure and return days.', '本节估算学生在出发和返程当天的真实出行摩擦。', 'このセクションは出発日・帰着日の実際の移動負担を想定しています。'),
      accessLevel: input.airport.accessLevel,
    },
  };
}

export const extraSchools: School[] = [
  makeSchool({
    id: 'school_williams',
    slug: 'williams-college',
    name: 'Williams College',
    city: 'Williamstown',
    state: 'Massachusetts',
    stateCode: 'MA',
    schoolType: 'Liberal Arts College',
    sector: 'Private',
    region: 'Northeast',
    climateBand: 'Cold Winter',
    rankingBand: 'Top 10',
    rankingLabel: 'Top liberal arts college',
    coordinates: { lat: 42.712, lng: -73.203 },
    scores: { climate: 56, demographics: 72, food: 53, life: 55, airport: 58, overall: 59 },
    summary: {
      en: 'A top liberal arts college in the Berkshires with beautiful seasons, low-density surroundings, and higher transport planning needs.',
      zh: '位于伯克希尔山区的顶尖文理学院，景色优美，但低密度环境下交通规划成本更高。',
      ja: 'バークシャー地域のトップLACで景観は魅力的ですが、低密度環境ゆえ移動計画の負担は高めです。',
    },
    tags: ['quiet_residential', 'walkable_town'],
    profile: 'town',
    climate: { highs: [30, 33, 42, 56, 67, 75, 80, 78, 70, 58, 46, 35], lows: [14, 16, 24, 34, 44, 53, 58, 56, 48, 37, 29, 20], precipitation: 47, snowfall: 61, humidity: 'Balanced' },
    airport: { name: 'Albany International Airport', distanceMiles: 43, driveMinutes: 62, transitMinutes: null, accessLevel: 'inconvenient' },
    demographics: {
      campus: { white: 37, black: 9, hispanicLatino: 13, asian: 15, internationalStudents: 10, populationDensityBand: 'Low density' },
      area30mi: { white: 83, black: 3, hispanicLatino: 6, asian: 3, foreignBornShare: 7, medianHouseholdIncomeUsd: 74000, populationDensityBand: 'Low density' },
    },
  }),
  makeSchool({
    id: 'school_colgate',
    slug: 'colgate-university',
    name: 'Colgate University',
    city: 'Hamilton',
    state: 'New York',
    stateCode: 'NY',
    schoolType: 'Liberal Arts College',
    sector: 'Private',
    region: 'Northeast',
    climateBand: 'Cold Winter',
    rankingBand: 'Top 30',
    rankingLabel: 'Top liberal arts-focused university',
    coordinates: { lat: 42.8184, lng: -75.5419 },
    scores: { climate: 52, demographics: 69, food: 50, life: 53, airport: 57, overall: 56 },
    summary: {
      en: 'A residential campus in upstate New York with strong academics and a classic small-town daily rhythm.',
      zh: '位于纽约州北部的居住型校园，学术氛围强，小镇生活节奏明显。',
      ja: 'ニューヨーク州北部の居住型キャンパスで、学術環境は強く小規模町の生活リズムです。',
    },
    tags: ['quiet_residential', 'walkable_town'],
    profile: 'town',
    climate: { highs: [28, 31, 41, 55, 67, 75, 80, 78, 70, 57, 45, 33], lows: [13, 15, 24, 34, 45, 54, 59, 57, 49, 39, 31, 20], precipitation: 45, snowfall: 89, humidity: 'Balanced' },
    airport: { name: 'Syracuse Hancock International Airport', distanceMiles: 41, driveMinutes: 53, transitMinutes: null, accessLevel: 'inconvenient' },
    demographics: {
      campus: { white: 51, black: 6, hispanicLatino: 8, asian: 7, internationalStudents: 11, populationDensityBand: 'Low density' },
      area30mi: { white: 89, black: 2, hispanicLatino: 4, asian: 2, foreignBornShare: 4, medianHouseholdIncomeUsd: 69000, populationDensityBand: 'Low density' },
    },
  }),
  makeSchool({
    id: 'school_harvard',
    slug: 'harvard-university',
    name: 'Harvard University',
    city: 'Cambridge',
    state: 'Massachusetts',
    stateCode: 'MA',
    schoolType: 'National University',
    sector: 'Private',
    region: 'Northeast',
    climateBand: 'Four Seasons',
    rankingBand: 'Top 10',
    rankingLabel: 'Top national university',
    coordinates: { lat: 42.377, lng: -71.1167 },
    scores: { climate: 67, demographics: 90, food: 91, life: 90, airport: 90, overall: 86 },
    summary: {
      en: 'A central Cambridge location with dense transit, broad services, and very practical airport routing for Asia travel.',
      zh: '位于剑桥核心区，公共交通密集、生活服务完善，前往亚洲的航线条件也很实用。',
      ja: 'ケンブリッジ中心部に位置し、交通・生活インフラが厚く、アジア渡航の実用性も高い立地です。',
    },
    tags: ['major_air_hub', 'car_optional', 'dense_asian_corridor', 'research_intensive'],
    profile: 'urban',
    climate: { highs: [36, 39, 45, 56, 67, 76, 82, 80, 73, 62, 52, 41], lows: [21, 24, 31, 40, 50, 59, 65, 63, 56, 46, 37, 29], precipitation: 43, snowfall: 51, humidity: 'Balanced' },
    airport: { name: 'Boston Logan International Airport', distanceMiles: 6.5, driveMinutes: 21, transitMinutes: 36, accessLevel: 'easy' },
    demographics: {
      campus: { white: 34, black: 7, hispanicLatino: 11, asian: 27, internationalStudents: 14, populationDensityBand: 'Urban-accessible' },
      area30mi: { white: 55, black: 8, hispanicLatino: 12, asian: 11, foreignBornShare: 22, medianHouseholdIncomeUsd: 108000, populationDensityBand: 'Urban-accessible' },
    },
  }),
  makeSchool({
    id: 'school_hamilton',
    slug: 'hamilton-college',
    name: 'Hamilton College',
    city: 'Clinton',
    state: 'New York',
    stateCode: 'NY',
    schoolType: 'Liberal Arts College',
    sector: 'Private',
    region: 'Northeast',
    climateBand: 'Cold Winter',
    rankingBand: 'Top 20',
    rankingLabel: 'Top liberal arts college',
    coordinates: { lat: 43.0501, lng: -75.4086 },
    scores: { climate: 51, demographics: 70, food: 51, life: 54, airport: 58, overall: 57 },
    summary: {
      en: 'A hilltop liberal arts campus in central New York with strong residential focus and limited car-free regional reach.',
      zh: '位于纽约州中部山地的文理学院，住宿型体验突出，但无车跨区域可达性有限。',
      ja: 'ニューヨーク州中部の高台にあるLACで、居住型体験は強い一方、車なしの広域移動は限定的です。',
    },
    tags: ['quiet_residential', 'walkable_town'],
    profile: 'town',
    climate: { highs: [30, 33, 42, 56, 68, 76, 81, 79, 71, 58, 46, 35], lows: [14, 16, 25, 35, 46, 55, 60, 58, 50, 39, 31, 22], precipitation: 44, snowfall: 83, humidity: 'Balanced' },
    airport: { name: 'Syracuse Hancock International Airport', distanceMiles: 35, driveMinutes: 46, transitMinutes: null, accessLevel: 'inconvenient' },
    demographics: {
      campus: { white: 54, black: 7, hispanicLatino: 9, asian: 8, internationalStudents: 12, populationDensityBand: 'Low density' },
      area30mi: { white: 87, black: 3, hispanicLatino: 4, asian: 2, foreignBornShare: 5, medianHouseholdIncomeUsd: 71000, populationDensityBand: 'Low density' },
    },
  }),
  makeSchool({
    id: 'school_vassar',
    slug: 'vassar-college',
    name: 'Vassar College',
    city: 'Poughkeepsie',
    state: 'New York',
    stateCode: 'NY',
    schoolType: 'Liberal Arts College',
    sector: 'Private',
    region: 'Northeast',
    climateBand: 'Four Seasons',
    rankingBand: 'Top 20',
    rankingLabel: 'Top liberal arts college',
    coordinates: { lat: 41.6862, lng: -73.8968 },
    scores: { climate: 63, demographics: 77, food: 66, life: 68, airport: 72, overall: 69 },
    summary: {
      en: 'A suburban Hudson Valley liberal arts campus with stronger Northeast corridor access than many small-town peers.',
      zh: '位于哈德逊河谷的郊区文理学院，相比多数小镇院校，东北走廊可达性更好。',
      ja: 'ハドソンバレーの郊外LACで、多くの小規模校より北東回廊へのアクセスが良好です。',
    },
    tags: ['walkable_town', 'major_air_hub', 'quiet_residential'],
    profile: 'suburban',
    climate: { highs: [37, 40, 50, 62, 72, 80, 85, 83, 76, 64, 53, 42], lows: [22, 24, 32, 42, 52, 61, 66, 64, 57, 46, 36, 28], precipitation: 47, snowfall: 33, humidity: 'Balanced' },
    airport: { name: 'Newark Liberty International Airport', distanceMiles: 77, driveMinutes: 92, transitMinutes: 125, accessLevel: 'moderate' },
    demographics: {
      campus: { white: 42, black: 7, hispanicLatino: 13, asian: 10, internationalStudents: 10, populationDensityBand: 'Suburban mix' },
      area30mi: { white: 67, black: 10, hispanicLatino: 14, asian: 4, foreignBornShare: 13, medianHouseholdIncomeUsd: 86000, populationDensityBand: 'Suburban mix' },
    },
  }),
  makeSchool({
    id: 'school_mit',
    slug: 'mit',
    name: 'Massachusetts Institute of Technology',
    city: 'Cambridge',
    state: 'Massachusetts',
    stateCode: 'MA',
    schoolType: 'National University',
    sector: 'Private',
    region: 'Northeast',
    climateBand: 'Four Seasons',
    rankingBand: 'Top 10',
    rankingLabel: 'Top national university',
    coordinates: { lat: 42.3601, lng: -71.0942 },
    scores: { climate: 67, demographics: 91, food: 92, life: 91, airport: 90, overall: 87 },
    summary: {
      en: 'A transit-rich Cambridge location with dense food and service access, and highly practical airport connectivity.',
      zh: '位于剑桥交通核心区，餐饮与服务资源密集，机场可达性也非常实用。',
      ja: 'ケンブリッジの交通中核にあり、食・サービス資源が厚く空港アクセスも実用的です。',
    },
    tags: ['major_air_hub', 'car_optional', 'dense_asian_corridor', 'research_intensive'],
    profile: 'urban',
    climate: { highs: [36, 39, 45, 56, 67, 76, 82, 80, 73, 62, 52, 41], lows: [21, 24, 31, 40, 50, 59, 65, 63, 56, 46, 37, 29], precipitation: 43, snowfall: 51, humidity: 'Balanced' },
    airport: { name: 'Boston Logan International Airport', distanceMiles: 5.9, driveMinutes: 19, transitMinutes: 31, accessLevel: 'easy' },
    demographics: {
      campus: { white: 29, black: 5, hispanicLatino: 11, asian: 33, internationalStudents: 19, populationDensityBand: 'Urban-accessible' },
      area30mi: { white: 55, black: 8, hispanicLatino: 12, asian: 11, foreignBornShare: 22, medianHouseholdIncomeUsd: 108000, populationDensityBand: 'Urban-accessible' },
    },
  }),
  makeSchool({
    id: 'school_emory',
    slug: 'emory-university',
    name: 'Emory University',
    city: 'Atlanta',
    state: 'Georgia',
    stateCode: 'GA',
    schoolType: 'National University',
    sector: 'Private',
    region: 'South',
    climateBand: 'Warm',
    rankingBand: 'Top 30',
    rankingLabel: 'Top national university',
    coordinates: { lat: 33.7925, lng: -84.324 },
    scores: { climate: 71, demographics: 84, food: 82, life: 80, airport: 87, overall: 81 },
    summary: {
      en: 'A major private university in metro Atlanta with strong airport connectivity and broad day-to-day service coverage.',
      zh: '位于亚特兰大都市区的私立名校，机场连接能力强，日常生活服务覆盖较广。',
      ja: 'アトランタ都市圏の主要私立大学で、空港接続が強く生活サービスも広範です。',
    },
    tags: ['major_air_hub', 'asian_grocery_access', 'research_intensive'],
    profile: 'suburban',
    climate: { highs: [52, 58, 66, 74, 81, 88, 90, 89, 84, 75, 65, 56], lows: [34, 38, 45, 52, 61, 68, 71, 70, 64, 53, 44, 37], precipitation: 50, snowfall: 2, humidity: 'Humid' },
    airport: { name: 'Hartsfield-Jackson Atlanta International Airport', distanceMiles: 20, driveMinutes: 34, transitMinutes: 67, accessLevel: 'easy' },
    demographics: {
      campus: { white: 31, black: 11, hispanicLatino: 12, asian: 22, internationalStudents: 14, populationDensityBand: 'Suburban mix' },
      area30mi: { white: 43, black: 36, hispanicLatino: 11, asian: 8, foreignBornShare: 17, medianHouseholdIncomeUsd: 83000, populationDensityBand: 'Urban-accessible' },
    },
  }),
  makeSchool({
    id: 'school_duke',
    slug: 'duke-university',
    name: 'Duke University',
    city: 'Durham',
    state: 'North Carolina',
    stateCode: 'NC',
    schoolType: 'National University',
    sector: 'Private',
    region: 'South',
    climateBand: 'Warm',
    rankingBand: 'Top 20',
    rankingLabel: 'Top national university',
    coordinates: { lat: 36.0014, lng: -78.9382 },
    scores: { climate: 74, demographics: 82, food: 75, life: 77, airport: 81, overall: 78 },
    summary: {
      en: 'A high-profile private university in the Research Triangle with balanced climate and practical regional infrastructure.',
      zh: '位于北卡三角区的高知名度私立大学，气候较均衡，区域基础设施较实用。',
      ja: 'リサーチトライアングルにある著名私立大学で、気候と地域インフラのバランスが良好です。',
    },
    tags: ['research_intensive', 'quiet_residential', 'major_air_hub'],
    profile: 'suburban',
    climate: { highs: [50, 55, 63, 72, 79, 86, 89, 87, 81, 72, 62, 54], lows: [31, 34, 41, 49, 58, 66, 70, 68, 62, 50, 40, 34], precipitation: 46, snowfall: 5, humidity: 'Balanced' },
    airport: { name: 'Raleigh-Durham International Airport', distanceMiles: 16, driveMinutes: 24, transitMinutes: 58, accessLevel: 'moderate' },
    demographics: {
      campus: { white: 40, black: 8, hispanicLatino: 11, asian: 24, internationalStudents: 12, populationDensityBand: 'Suburban mix' },
      area30mi: { white: 49, black: 25, hispanicLatino: 12, asian: 7, foreignBornShare: 13, medianHouseholdIncomeUsd: 79000, populationDensityBand: 'Suburban mix' },
    },
  }),
  makeSchool({
    id: 'school_unc',
    slug: 'unc-chapel-hill',
    name: 'University of North Carolina at Chapel Hill',
    city: 'Chapel Hill',
    state: 'North Carolina',
    stateCode: 'NC',
    schoolType: 'National University',
    sector: 'Public',
    region: 'South',
    climateBand: 'Warm',
    rankingBand: 'Top 30',
    rankingLabel: 'Top national public university',
    coordinates: { lat: 35.9049, lng: -79.0469 },
    scores: { climate: 75, demographics: 80, food: 74, life: 76, airport: 80, overall: 77 },
    summary: {
      en: 'A flagship public university with strong college-town identity and practical access to Research Triangle infrastructure.',
      zh: '旗舰公立大学，大学城氛围强，且可共享北卡三角区基础设施。',
      ja: '旗艦公立大学として大学町の色が強く、リサーチトライアングルのインフラも利用しやすいです。',
    },
    tags: ['research_intensive', 'walkable_town', 'major_air_hub'],
    profile: 'suburban',
    climate: { highs: [50, 55, 63, 72, 79, 86, 89, 87, 81, 72, 62, 54], lows: [30, 33, 40, 48, 57, 65, 69, 68, 61, 49, 39, 33], precipitation: 47, snowfall: 4, humidity: 'Balanced' },
    airport: { name: 'Raleigh-Durham International Airport', distanceMiles: 18, driveMinutes: 28, transitMinutes: 62, accessLevel: 'moderate' },
    demographics: {
      campus: { white: 51, black: 9, hispanicLatino: 11, asian: 14, internationalStudents: 8, populationDensityBand: 'Suburban mix' },
      area30mi: { white: 54, black: 20, hispanicLatino: 12, asian: 6, foreignBornShare: 11, medianHouseholdIncomeUsd: 76000, populationDensityBand: 'Suburban mix' },
    },
  }),
];

const colgate = extraSchools.find((school) => school.slug === 'colgate-university');

if (colgate) {
  // Manual correction pass for Colgate with more realistic nearby anchors.
  colgate.scores = { climate: 52, demographics: 69, food: 45, life: 47, airport: 57, overall: 54 };

  colgate.foodConvenience.starbucks = {
    name: 'Starbucks New Hartford',
    distanceMiles: 17.2,
    driveMinutes: 28,
    publicTransitMinutes: null,
    countWithin5: 0,
    countWithin10: 0,
    countWithin30: 4,
    uberAvailable: true,
    uberEatsAvailable: false,
  };

  colgate.foodConvenience.grocery_store = {
    name: 'Price Chopper Hamilton',
    distanceMiles: 2.6,
    driveMinutes: 7,
    publicTransitMinutes: null,
    countWithin5: 1,
    countWithin10: 2,
    countWithin30: 10,
    uberAvailable: true,
    uberEatsAvailable: true,
  };

  colgate.foodConvenience.asian_grocery = {
    name: 'Sangertown-area Asian grocery (New Hartford)',
    distanceMiles: 17.8,
    driveMinutes: 29,
    publicTransitMinutes: null,
    countWithin5: 0,
    countWithin10: 0,
    countWithin30: 2,
    uberAvailable: true,
    uberEatsAvailable: false,
  };

  colgate.foodConvenience.dim_sum = {
    name: 'Utica dim sum options',
    distanceMiles: 23.5,
    driveMinutes: 36,
    publicTransitMinutes: null,
    countWithin5: 0,
    countWithin10: 0,
    countWithin30: 1,
    uberAvailable: true,
    uberEatsAvailable: false,
  };

  colgate.lifeConvenience.dmv = {
    name: 'Norwich NYS DMV',
    distanceMiles: 18.6,
    driveMinutes: 31,
    publicTransitMinutes: null,
    uberAvailable: true,
  };

  colgate.lifeConvenience.social_security = {
    name: 'Social Security Office Utica',
    distanceMiles: 23.8,
    driveMinutes: 37,
    publicTransitMinutes: null,
    uberAvailable: true,
  };

  colgate.lifeConvenience.shopping_destination = {
    name: 'Sangertown Square, New Hartford',
    distanceMiles: 17.1,
    driveMinutes: 28,
    publicTransitMinutes: null,
    uberAvailable: true,
  };

  colgate.lifeConvenience.target_anchor = {
    name: 'Target New Hartford',
    distanceMiles: 16.8,
    driveMinutes: 27,
    publicTransitMinutes: null,
    uberAvailable: true,
  };
}
