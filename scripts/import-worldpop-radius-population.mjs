import fs from 'node:fs/promises';
import path from 'node:path';

const radiusKm = 30;
const apiUrl = 'https://worldpop.arcgis.com/arcgis/rest/services/WorldPop_Total_Population_1km/ImageServer/computeStatisticsHistograms';
const inputPath = path.resolve(process.argv[2] ?? 'data/verified-colleges.json');
const outputPath = path.resolve(process.argv[3] ?? 'data/verified-area-population.json');

function circleRing(center, radius, vertices = 72) {
  const earthRadiusKm = 6371.0088;
  const angularDistance = radius / earthRadiusKm;
  const lat1 = center.lat * Math.PI / 180;
  const lng1 = center.lng * Math.PI / 180;
  const points = [];
  for (let index = 0; index <= vertices; index += 1) {
    const bearing = index / vertices * Math.PI * 2;
    const lat2 = Math.asin(
      Math.sin(lat1) * Math.cos(angularDistance)
      + Math.cos(lat1) * Math.sin(angularDistance) * Math.cos(bearing),
    );
    const lng2 = lng1 + Math.atan2(
      Math.sin(bearing) * Math.sin(angularDistance) * Math.cos(lat1),
      Math.cos(angularDistance) - Math.sin(lat1) * Math.sin(lat2),
    );
    points.push([lng2 * 180 / Math.PI, lat2 * 180 / Math.PI]);
  }
  return points;
}

async function fetchPopulation(slug, coordinates, attempt = 1) {
  const url = new URL(apiUrl);
  url.searchParams.set('geometryType', 'esriGeometryPolygon');
  url.searchParams.set('geometry', JSON.stringify({
    rings: [circleRing(coordinates, radiusKm)],
    spatialReference: { wkid: 4326 },
  }));
  url.searchParams.set('time', '1577836800000');
  url.searchParams.set('pixelSize', '0.0083333333');
  url.searchParams.set('processAsMultidimensional', 'false');
  url.searchParams.set('f', 'json');
  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'real-usa-colleges-data-import/1.0' },
      signal: AbortSignal.timeout(120_000),
    });
    if (!response.ok) throw new Error(`WorldPop returned ${response.status}`);
    const json = await response.json();
    const statistics = json.statistics?.[0];
    if (!statistics || !Number.isFinite(Number(statistics.sum))) {
      throw new Error(`WorldPop returned no population sum for ${slug}: ${JSON.stringify(json)}`);
    }
    return {
      population: Math.round(Number(statistics.sum)),
      radiusKm,
      includedCellCount: Number(statistics.count),
    };
  } catch (error) {
    if (attempt >= 4) throw error;
    await new Promise((resolve) => setTimeout(resolve, attempt * 2_000));
    return fetchPopulation(slug, coordinates, attempt + 1);
  }
}

const collegeData = JSON.parse(await fs.readFile(inputPath, 'utf8'));
const entries = Object.entries(collegeData.records);
const records = {};
let nextIndex = 0;
async function worker() {
  while (nextIndex < entries.length) {
    const [slug, school] = entries[nextIndex++];
    records[slug] = await fetchPopulation(slug, school.coordinates);
    process.stdout.write(`${slug}: ${records[slug].population.toLocaleString('en-US')} (${Object.keys(records).length}/${entries.length})\n`);
  }
}
await Promise.all(Array.from({ length: 6 }, () => worker()));

const checkedAt = new Date().toISOString();
await fs.writeFile(outputPath, `${JSON.stringify({
  generatedAt: checkedAt,
  source: {
    label: 'WorldPop — Global High Resolution Population Denominators',
    url: 'https://worldpop.arcgis.com/arcgis/rest/services/WorldPop_Total_Population_1km/ImageServer',
    doi: '10.5258/SOTON/WP00647',
    vintage: '2020 population counts, approximately 1 km grid',
    checkedAt: checkedAt.slice(0, 10),
  },
  methodology: {
    en: 'WorldPop ArcGIS computes the sum of its 2020 population-count grid inside a 72-vertex geodesic polygon approximating a 30.0 km circle around the verified campus coordinate. This is a reproducible gridded estimate, not a Census enumeration or an exact building-level count.',
    zh: '以已核实校园坐标为圆心，用 72 个顶点构造 30.0 km 测地圆，并由 WorldPop ArcGIS 汇总圆内 2020 人口计数栅格。该值是可复算的约 1 km 栅格估计，并非人口普查逐户计数或建筑级精确人数。',
  },
  recordCount: Object.keys(records).length,
  records,
}, null, 2)}\n`, 'utf8');

process.stdout.write(`Wrote ${Object.keys(records).length} records to ${outputPath}\n`);
