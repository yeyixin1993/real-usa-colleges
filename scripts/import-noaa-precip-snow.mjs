import fs from 'node:fs';
import path from 'node:path';

const projectRoot = process.cwd();
const inventoryPath = process.argv[2];

if (!inventoryPath) {
  throw new Error('Usage: node scripts/import-noaa-precip-snow.mjs /path/to/inventory_30yr.txt');
}

const apiUrl = 'https://www.ncei.noaa.gov/access/services/data/v1';
const datasetUrl = 'https://www.ncei.noaa.gov/products/land-based-station/us-climate-normals';
const colleges = JSON.parse(fs.readFileSync(path.join(projectRoot, 'data/verified-colleges.json'), 'utf8')).records;

const stations = fs.readFileSync(inventoryPath, 'utf8').trim().split(/\r?\n/).map((line) => {
  const match = line.match(/^(\S+)\s+(-?\d+\.\d+)\s+(-?\d+\.\d+)\s+(-?\d+\.\d+)\s+(\S+)\s+(.*)$/);
  if (!match) return null;
  return {
    id: match[1],
    lat: Number(match[2]),
    lng: Number(match[3]),
    elevationMeters: Number(match[4]),
    stateCode: match[5],
    name: match[6].replace(/\s+(?:(?:HCN|GSN)(?:\s+\d{5})?|\d{5})\s*$/, '').trim(),
  };
}).filter((station) => station && /^US[CW]/.test(station.id));

function distanceMiles(a, b) {
  const radians = (degrees) => degrees * Math.PI / 180;
  const dLat = radians(b.lat - a.lat);
  const dLng = radians(b.lng - a.lng);
  const value = Math.sin(dLat / 2) ** 2
    + Math.cos(radians(a.lat)) * Math.cos(radians(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 3958.8 * 2 * Math.asin(Math.sqrt(value));
}

const candidatesBySlug = {};
for (const [slug, college] of Object.entries(colleges)) {
  candidatesBySlug[slug] = stations
    .map((station) => ({ station, distance: distanceMiles(college.coordinates, station) }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 20);
}

const candidateIds = [...new Set(Object.values(candidatesBySlug).flatMap((items) => items.map(({ station }) => station.id)))];

async function fetchBatch(stationIds, attempt = 1) {
  const url = new URL(apiUrl);
  url.searchParams.set('dataset', 'normals-monthly-1991-2020');
  url.searchParams.set('dataTypes', 'MLY-PRCP-NORMAL,MLY-SNOW-NORMAL');
  url.searchParams.set('format', 'json');
  url.searchParams.set('units', 'metric');
  url.searchParams.set('stations', stationIds.join(','));
  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'real-usa-colleges-data-import/1.0' },
      signal: AbortSignal.timeout(180_000),
    });
    if (!response.ok) throw new Error(`NOAA returned ${response.status}`);
    return await response.json();
  } catch (error) {
    if (attempt >= 4) throw error;
    await new Promise((resolve) => setTimeout(resolve, attempt * 2_000));
    return fetchBatch(stationIds, attempt + 1);
  }
}

const batches = [];
for (let index = 0; index < candidateIds.length; index += 35) batches.push(candidateIds.slice(index, index + 35));
const batchResults = new Array(batches.length);
let nextBatch = 0;
async function worker() {
  while (nextBatch < batches.length) {
    const index = nextBatch++;
    batchResults[index] = await fetchBatch(batches[index]);
    process.stdout.write(`NOAA monthly normals ${index + 1}/${batches.length}\n`);
  }
}
await Promise.all(Array.from({ length: 5 }, () => worker()));

const rowsByStation = new Map();
for (const row of batchResults.flat()) {
  if (!rowsByStation.has(row.STATION)) rowsByStation.set(row.STATION, []);
  rowsByStation.get(row.STATION).push(row);
}

function completeSeries(stationId, field) {
  const values = (rowsByStation.get(stationId) ?? []).map((row) => ({
    month: Number(row.DATE),
    value: Number(row[field]),
  })).filter(({ month, value }) => month >= 1 && month <= 12 && Number.isFinite(value) && value >= 0)
    .sort((a, b) => a.month - b.month);
  return values.length === 12 && new Set(values.map(({ month }) => month)).size === 12 ? values : null;
}

function selectMetric(candidates, field) {
  for (const candidate of candidates) {
    const monthly = completeSeries(candidate.station.id, field);
    if (monthly) return { ...candidate, monthly };
  }
  return null;
}

function serialize(match) {
  if (!match) return null;
  return {
    annualMm: Number(match.monthly.reduce((sum, item) => sum + item.value, 0).toFixed(1)),
    monthlyMm: match.monthly.map(({ month, value }) => ({ month, valueMm: value })),
    station: {
      id: match.station.id,
      name: match.station.name,
      stateCode: match.station.stateCode,
      coordinates: { lat: match.station.lat, lng: match.station.lng },
      elevationMeters: match.station.elevationMeters,
      distanceMiles: Number(match.distance.toFixed(1)),
    },
  };
}

const records = {};
for (const [slug, candidates] of Object.entries(candidatesBySlug)) {
  records[slug] = {
    precipitation: serialize(selectMetric(candidates, 'MLY-PRCP-NORMAL')),
    snowfall: serialize(selectMetric(candidates, 'MLY-SNOW-NORMAL')),
  };
}

const precipitationCoverage = Object.values(records).filter(({ precipitation }) => precipitation).length;
const snowfallCoverage = Object.values(records).filter(({ snowfall }) => snowfall).length;
const generatedAt = new Date().toISOString();
fs.writeFileSync(path.join(projectRoot, 'data/verified-climate-details.json'), `${JSON.stringify({
  generatedAt,
  source: {
    label: 'NOAA U.S. Monthly Climate Normals',
    release: '1991–2020, version 1.0.1',
    normalPeriod: '1991–2020',
    url: datasetUrl,
    apiUrl,
    units: 'metric',
    checkedAt: generatedAt.slice(0, 10),
  },
  methodology: {
    en: 'Annual precipitation and snowfall are sums of the 12 published NOAA monthly normals from the nearest station with a complete series for that metric. Values are stored and displayed in millimeters.',
    zh: '年降水量和年降雪量分别汇总最近且该指标 12 个月数据完整的 NOAA 气象站月常值；数值以毫米保存和显示。',
  },
  recordCount: Object.keys(records).length,
  precipitationCoverage,
  snowfallCoverage,
  records,
}, null, 2)}\n`);

console.log(JSON.stringify({ schools: Object.keys(records).length, precipitationCoverage, snowfallCoverage, candidateStations: candidateIds.length }, null, 2));
