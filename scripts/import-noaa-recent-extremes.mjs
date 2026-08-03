import fs from 'node:fs';
import path from 'node:path';

const projectRoot = process.cwd();
const startDate = '2021-01-01';
const endDate = '2025-12-31';
const minimumMonthlyCoverage = 0.9;
const cacheDirectory = '/private/tmp/real-usa-colleges-noaa-recent';
const apiUrl = 'https://www.ncei.noaa.gov/access/services/data/v1';

const climate = JSON.parse(
  fs.readFileSync(path.join(projectRoot, 'data/verified-climate.json'), 'utf8'),
);

fs.mkdirSync(cacheDirectory, { recursive: true });

const stationsById = new Map();
for (const record of Object.values(climate.records)) {
  stationsById.set(record.station.id, record.station);
}
const stationIds = [...stationsById.keys()];

function qualityFlag(attributes) {
  return typeof attributes === 'string' ? (attributes.split(',')[1] ?? '') : '';
}

async function fetchStation(stationId, attempt = 1) {
  const cachePath = path.join(cacheDirectory, `${stationId}.json`);
  if (fs.existsSync(cachePath)) {
    try {
      const cached = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
      if (Array.isArray(cached)) return cached;
    } catch {
      // Ignore an incomplete cache file and download it again.
    }
  }

  const url = new URL(apiUrl);
  url.searchParams.set('dataset', 'daily-summaries');
  url.searchParams.set('dataTypes', 'TMAX,TMIN');
  url.searchParams.set('stations', stationId);
  url.searchParams.set('startDate', startDate);
  url.searchParams.set('endDate', endDate);
  url.searchParams.set('format', 'json');
  url.searchParams.set('units', 'metric');
  url.searchParams.set('includeAttributes', 'true');

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 180_000);

  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'real-usa-colleges-data-import/1.0' },
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`NOAA returned ${response.status}`);
    const text = await response.text();
    const rows = JSON.parse(text);
    if (!Array.isArray(rows)) throw new Error('NOAA response was not an array');
    fs.writeFileSync(cachePath, `${JSON.stringify(rows)}\n`);
    return rows;
  } catch (error) {
    if (attempt >= 3) throw error;
    await new Promise((resolve) => setTimeout(resolve, attempt * 2_000));
    return fetchStation(stationId, attempt + 1);
  } finally {
    clearTimeout(timeout);
  }
}

const rowsByStation = new Map();
let nextStationIndex = 0;
let completedStations = 0;
const failures = [];

async function worker() {
  while (nextStationIndex < stationIds.length) {
    const index = nextStationIndex;
    nextStationIndex += 1;
    const stationId = stationIds[index];

    try {
      rowsByStation.set(stationId, await fetchStation(stationId));
    } catch (error) {
      failures.push({ stationId, error: error instanceof Error ? error.message : String(error) });
      rowsByStation.set(stationId, []);
    }

    completedStations += 1;
    if (completedStations % 5 === 0 || completedStations === stationIds.length) {
      console.log(`Downloaded ${completedStations}/${stationIds.length} stations`);
    }
  }
}

await Promise.all(Array.from({ length: 6 }, () => worker()));

function expectedDaysForMonth(monthIndex) {
  let count = 0;
  for (let year = 2021; year <= 2025; year += 1) {
    count += new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
  }
  return count;
}

const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function monthlyExtremes(rows) {
  return monthLabels.map((month, monthIndex) => {
    const expectedDays = expectedDaysForMonth(monthIndex);
    const monthRows = rows.filter((row) => Number(row.DATE?.slice(5, 7)) === monthIndex + 1);
    const maximumObservations = monthRows
      .filter((row) => Number.isFinite(Number(row.TMAX)) && !qualityFlag(row.TMAX_ATTRIBUTES))
      .map((row) => ({ value: Number(row.TMAX), date: row.DATE }));
    const minimumObservations = monthRows
      .filter((row) => Number.isFinite(Number(row.TMIN)) && !qualityFlag(row.TMIN_ATTRIBUTES))
      .map((row) => ({ value: Number(row.TMIN), date: row.DATE }));
    const maximumCoverage = maximumObservations.length / expectedDays;
    const minimumCoverage = minimumObservations.length / expectedDays;
    const maximum = maximumCoverage >= minimumMonthlyCoverage
      ? maximumObservations.reduce((best, current) => current.value > best.value ? current : best)
      : null;
    const minimum = minimumCoverage >= minimumMonthlyCoverage
      ? minimumObservations.reduce((best, current) => current.value < best.value ? current : best)
      : null;

    return {
      month,
      actualMaxC: maximum?.value ?? null,
      actualMaxDate: maximum?.date ?? null,
      actualMinC: minimum?.value ?? null,
      actualMinDate: minimum?.date ?? null,
      maximumObservationCount: maximumObservations.length,
      minimumObservationCount: minimumObservations.length,
      expectedDays,
    };
  });
}

const records = {};
for (const [slug, climateRecord] of Object.entries(climate.records)) {
  const rows = rowsByStation.get(climateRecord.station.id) ?? [];
  const monthly = monthlyExtremes(rows);
  records[slug] = {
    station: climateRecord.station,
    observationPeriod: { startDate, endDate },
    minimumMonthlyCoverage,
    monthly,
  };
}

const fullyCoveredSchools = Object.values(records).filter((record) =>
  record.monthly.every((month) => month.actualMaxC !== null && month.actualMinC !== null),
).length;

const output = {
  source: {
    label: 'NOAA Global Historical Climatology Network Daily',
    release: 'GHCN-Daily, Version 3',
    url: 'https://www.ncei.noaa.gov/products/land-based-station/global-historical-climatology-network-daily',
    apiDocumentationUrl: 'https://www.ncei.noaa.gov/support/access-data-service-api-user-documentation',
    apiUrl,
    observationPeriod: `${startDate}–${endDate}`,
    units: 'metric',
    method: 'Monthly highest observed daily TMAX and lowest observed daily TMIN; quality-flagged observations excluded; 90% monthly coverage required.',
  },
  generatedAt: new Date().toISOString(),
  recordCount: Object.keys(records).length,
  uniqueStationCount: stationIds.length,
  fullyCoveredSchools,
  failures,
  records,
};

fs.writeFileSync(
  path.join(projectRoot, 'data/verified-recent-climate.json'),
  `${JSON.stringify(output, null, 2)}\n`,
);

console.log(JSON.stringify({
  schools: output.recordCount,
  stations: output.uniqueStationCount,
  fullyCoveredSchools,
  failedStations: failures.length,
}, null, 2));
