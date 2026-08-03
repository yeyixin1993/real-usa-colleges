import fs from 'node:fs';
import path from 'node:path';

const projectRoot = process.cwd();
const apiUrl = 'https://power.larc.nasa.gov/api/temporal/climatology/point';
const documentationUrl = 'https://power.larc.nasa.gov/docs/services/api/temporal/climatology/';
const cacheDirectory = '/private/tmp/real-usa-colleges-nasa-humidity';
const colleges = JSON.parse(fs.readFileSync(path.join(projectRoot, 'data/verified-colleges.json'), 'utf8')).records;
fs.mkdirSync(cacheDirectory, { recursive: true });

function band(value) {
  if (value < 50) return 'Dry';
  if (value <= 65) return 'Balanced';
  return 'Humid';
}

async function fetchHumidity(slug, coordinates, attempt = 1) {
  const cachePath = path.join(cacheDirectory, `${slug}.json`);
  if (fs.existsSync(cachePath)) return JSON.parse(fs.readFileSync(cachePath, 'utf8'));
  const url = new URL(apiUrl);
  url.searchParams.set('parameters', 'RH2M');
  url.searchParams.set('community', 'SB');
  url.searchParams.set('longitude', String(coordinates.lng));
  url.searchParams.set('latitude', String(coordinates.lat));
  url.searchParams.set('format', 'JSON');
  url.searchParams.set('start', '1991');
  url.searchParams.set('end', '2020');
  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'real-usa-colleges-data-import/1.0' },
      signal: AbortSignal.timeout(120_000),
    });
    if (!response.ok) throw new Error(`NASA POWER returned ${response.status}`);
    const json = await response.json();
    fs.writeFileSync(cachePath, `${JSON.stringify(json)}\n`);
    return json;
  } catch (error) {
    if (attempt >= 4) throw error;
    await new Promise((resolve) => setTimeout(resolve, attempt * 2_000));
    return fetchHumidity(slug, coordinates, attempt + 1);
  }
}

const entries = Object.entries(colleges);
const records = {};
let nextIndex = 0;
async function worker() {
  while (nextIndex < entries.length) {
    const [slug, college] = entries[nextIndex++];
    const json = await fetchHumidity(slug, college.coordinates);
    const value = Number(json?.properties?.parameter?.RH2M?.ANN);
    if (!Number.isFinite(value) || value < 0 || value > 100) throw new Error(`Invalid NASA RH2M for ${slug}`);
    records[slug] = {
      annualMeanRelativeHumidityPercent: value,
      humidityBand: band(value),
      coordinates: college.coordinates,
      gridElevationMeters: Number.isFinite(Number(json?.geometry?.coordinates?.[2])) ? Number(json.geometry.coordinates[2]) : null,
    };
    process.stdout.write(`NASA humidity ${Object.keys(records).length}/${entries.length}\n`);
  }
}
await Promise.all(Array.from({ length: 5 }, () => worker()));

const generatedAt = new Date().toISOString();
fs.writeFileSync(path.join(projectRoot, 'data/verified-humidity.json'), `${JSON.stringify({
  generatedAt,
  source: {
    label: 'NASA POWER — MERRA-2 Relative Humidity at 2 Meters',
    release: 'Custom 1991–2020 climatology',
    normalPeriod: '1991–2020',
    url: documentationUrl,
    apiUrl,
    parameter: 'RH2M',
    units: '%',
    checkedAt: generatedAt.slice(0, 10),
  },
  methodology: {
    en: 'Annual mean relative humidity is NASA POWER RH2M for the verified campus coordinate and 1991–2020 custom climatology. POWER meteorology is derived from NASA MERRA-2; it is gridded model/assimilation data, not an on-campus sensor. Site bands: Dry <50%, Balanced 50–65%, Humid >65%.',
    zh: '年平均相对湿度采用已核实校园坐标处的 NASA POWER RH2M 1991–2020 自定义气候常值。POWER 气象数据来自 NASA MERRA-2，是网格化模型/同化数据，并非校园内传感器。本站分档：低于 50% 为 Dry，50–65% 为 Balanced，高于 65% 为 Humid。',
  },
  recordCount: Object.keys(records).length,
  records,
}, null, 2)}\n`);

console.log(JSON.stringify({ schools: Object.keys(records).length }, null, 2));
