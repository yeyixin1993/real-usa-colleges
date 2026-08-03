import fs from 'node:fs';
import path from 'node:path';

const projectRoot = process.cwd();
const inventoryPath = process.argv[2];

if (!inventoryPath) {
  throw new Error('Usage: node scripts/import-noaa-temperature.mjs /path/to/inventory_30yr.txt');
}

const dataset = {
  label: 'NOAA National Centers for Environmental Information',
  release: 'U.S. Monthly Climate Normals, 1991–2020, version 1.0.1',
  normalPeriod: '1991–2020',
  url: 'https://www.ncei.noaa.gov/products/land-based-station/us-climate-normals',
  datasetUrl: 'https://www.ncei.noaa.gov/data/normals-monthly/1991-2020/',
  inventoryUrl:
    'https://www.ncei.noaa.gov/data/normals-monthly/1991-2020/doc/inventory_30yr.txt',
  apiUrl: 'https://www.ncei.noaa.gov/access/services/data/v1',
};

const colleges = JSON.parse(
  fs.readFileSync(path.join(projectRoot, 'data/verified-colleges.json'), 'utf8'),
).records;

const stations = fs
  .readFileSync(inventoryPath, 'utf8')
  .trim()
  .split(/\r?\n/)
  .map((line) => {
    const match = line.match(/^(\S+)\s+(-?\d+\.\d+)\s+(-?\d+\.\d+)\s+(-?\d+\.\d+)\s+(\S+)\s+(.*)$/);
    if (!match) return null;
    return {
      id: match[1],
      lat: Number(match[2]),
      lng: Number(match[3]),
      elevationMeters: Number(match[4]),
      stateCode: match[5],
      name: match[6]
        .replace(/\s+(?:(?:HCN|GSN)(?:\s+\d{5})?|\d{5})\s*$/, '')
        .trim(),
    };
  })
  // Conventional and airport stations measure temperature. CoCoRaHS stations
  // (US1...) are precipitation-focused and are intentionally excluded.
  .filter((station) => station && /^US[CW]/.test(station.id));

function distanceMiles(a, b) {
  const radians = (degrees) => (degrees * Math.PI) / 180;
  const earthRadiusMiles = 3958.8;
  const latitudeDelta = radians(b.lat - a.lat);
  const longitudeDelta = radians(b.lng - a.lng);
  const value =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(radians(a.lat)) *
      Math.cos(radians(b.lat)) *
      Math.sin(longitudeDelta / 2) ** 2;
  return 2 * earthRadiusMiles * Math.asin(Math.sqrt(value));
}

const candidatesBySlug = {};
for (const [slug, college] of Object.entries(colleges)) {
  candidatesBySlug[slug] = stations
    .map((station) => ({ station, distance: distanceMiles(college.coordinates, station) }))
    .sort((left, right) => left.distance - right.distance)
    .slice(0, 8);
}

const candidateIds = [
  ...new Set(Object.values(candidatesBySlug).flatMap((candidates) => candidates.map(({ station }) => station.id))),
];

async function fetchBatch(stationIds, attempt = 1) {
  const url = new URL(dataset.apiUrl);
  url.searchParams.set('dataset', 'normals-monthly-1991-2020');
  url.searchParams.set('dataTypes', 'MLY-TMAX-NORMAL,MLY-TMIN-NORMAL');
  url.searchParams.set('format', 'json');
  url.searchParams.set('stations', stationIds.join(','));

  try {
    const response = await fetch(url, { headers: { 'User-Agent': 'real-usa-colleges-data-import/1.0' } });
    if (!response.ok) throw new Error(`NOAA returned ${response.status}`);
    return await response.json();
  } catch (error) {
    if (attempt >= 3) throw error;
    await new Promise((resolve) => setTimeout(resolve, attempt * 1500));
    return fetchBatch(stationIds, attempt + 1);
  }
}

const batchSize = 45;
const batches = [];
for (let index = 0; index < candidateIds.length; index += batchSize) {
  batches.push(candidateIds.slice(index, index + batchSize));
}

const rows = (await Promise.all(batches.map((batch) => fetchBatch(batch)))).flat();
const rowsByStation = new Map();
for (const row of rows) {
  if (!rowsByStation.has(row.STATION)) rowsByStation.set(row.STATION, []);
  rowsByStation.get(row.STATION).push(row);
}

function completeMonthlySeries(stationId) {
  const stationRows = (rowsByStation.get(stationId) ?? [])
    .map((row) => ({
      month: Number(row.DATE),
      highF: Number(row['MLY-TMAX-NORMAL']),
      lowF: Number(row['MLY-TMIN-NORMAL']),
    }))
    .filter(
      (row) =>
        Number.isInteger(row.month) &&
        row.month >= 1 &&
        row.month <= 12 &&
        Number.isFinite(row.highF) &&
        Number.isFinite(row.lowF),
    )
    .sort((left, right) => left.month - right.month);

  return stationRows.length === 12 && new Set(stationRows.map((row) => row.month)).size === 12
    ? stationRows
    : null;
}

const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const records = {};
const unmatched = [];

for (const [slug, candidates] of Object.entries(candidatesBySlug)) {
  const match = candidates
    .map(({ station, distance }) => ({ station, distance, monthly: completeMonthlySeries(station.id) }))
    .find(({ monthly }) => monthly !== null);

  if (!match) {
    unmatched.push(slug);
    continue;
  }

  records[slug] = {
    station: {
      id: match.station.id,
      name: match.station.name,
      stateCode: match.station.stateCode,
      coordinates: { lat: match.station.lat, lng: match.station.lng },
      elevationMeters: match.station.elevationMeters,
      distanceMiles: Number(match.distance.toFixed(1)),
    },
    monthly: match.monthly.map((row) => ({
      month: monthLabels[row.month - 1],
      highF: row.highF,
      lowF: row.lowF,
    })),
  };
}

if (unmatched.length) {
  throw new Error(`No complete nearby NOAA temperature series for: ${unmatched.join(', ')}`);
}

const output = {
  source: dataset,
  generatedAt: new Date().toISOString(),
  recordCount: Object.keys(records).length,
  candidateStationCount: candidateIds.length,
  records,
};

fs.writeFileSync(
  path.join(projectRoot, 'data/verified-climate.json'),
  `${JSON.stringify(output, null, 2)}\n`,
);

const distances = Object.values(records).map((record) => record.station.distanceMiles);
console.log(
  JSON.stringify(
    {
      records: output.recordCount,
      candidateStations: output.candidateStationCount,
      maximumStationDistanceMiles: Math.max(...distances),
      averageStationDistanceMiles: Number(
        (distances.reduce((sum, distance) => sum + distance, 0) / distances.length).toFixed(1),
      ),
    },
    null,
    2,
  ),
);
