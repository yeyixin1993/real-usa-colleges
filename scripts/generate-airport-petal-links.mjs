import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import ts from 'typescript';

const projectRoot = process.cwd();
const require = createRequire(import.meta.url);
const faaCsvPath = path.resolve(process.argv[2] ?? '');

if (!faaCsvPath || !fs.existsSync(faaCsvPath)) {
  console.error('Usage: node scripts/generate-airport-petal-links.mjs /path/to/APT_BASE.csv');
  process.exit(1);
}

const faaCycle = '2026-05-14';
const faaSourceUrl = 'https://www.faa.gov/air_traffic/flight_info/aeronav/aero_data/NASR_Subscription/2026-05-14/';
const petalProductUrl = 'https://consumer.huawei.com/en/mobileservices/petalmaps/';
const petalWebUrl = 'https://www.petalmaps.com/';
const googleMapsWebUrl = 'https://www.google.com/maps/';
const googleMapsUrlDocs = 'https://developers.google.com/maps/documentation/urls/get-started';
const checkedAt = new Date().toISOString();
const campusRecords = JSON.parse(fs.readFileSync(path.join(projectRoot, 'data/verified-colleges.json'), 'utf8')).records;

const airportIds = {
  'Baltimore/Washington International Airport': 'BWI',
  'Boston Logan International Airport': 'BOS',
  'Bradley International Airport': 'BDL',
  'Burlington International Airport': 'BTV',
  'Charlotte Douglas International Airport': 'CLT',
  "Chicago O'Hare International Airport": 'ORD',
  'Cincinnati/Northern Kentucky International Airport': 'CVG',
  'Dallas/Fort Worth International Airport': 'DFW',
  'Denver International Airport': 'DEN',
  'Des Moines International Airport': 'DSM',
  'Detroit Metropolitan Wayne County Airport': 'DTW',
  'George Bush Intercontinental Airport': 'IAH',
  'Hartsfield-Jackson Atlanta International Airport': 'ATL',
  'Indianapolis International Airport': 'IND',
  'John F. Kennedy International Airport': 'JFK',
  'John Glenn Columbus International Airport': 'CMH',
  'Los Angeles International Airport': 'LAX',
  'Manchester-Boston Regional Airport': 'MHT',
  'Milwaukee Mitchell International Airport': 'MKE',
  'Minneapolis-Saint Paul International Airport': 'MSP',
  'Nashville International Airport': 'BNA',
  'Newark Liberty International Airport': 'EWR',
  'Ontario International Airport': 'ONT',
  'Orlando International Airport': 'MCO',
  'Philadelphia International Airport': 'PHL',
  'Portland International Airport': 'PDX',
  'Portland International Jetport': 'PWM',
  'Raleigh-Durham International Airport': 'RDU',
  'Seattle-Tacoma International Airport': 'SEA',
  'St. Louis Lambert International Airport': 'STL',
  'T.F. Green International Airport': 'PVD',
  'Washington Dulles International Airport': 'IAD',
};

function loadSchoolModule(relativePath) {
  const filePath = path.join(projectRoot, relativePath);
  const javascript = ts.transpileModule(fs.readFileSync(filePath, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const module = { exports: {} };
  new Function('exports', 'module', 'require', javascript)(module.exports, module, require);
  return Object.values(module.exports)[0];
}

function parseCsvLine(line) {
  const values = [];
  let current = '';
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    if (character === '"') {
      if (quoted && line[index + 1] === '"') {
        current += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (character === ',' && !quoted) {
      values.push(current);
      current = '';
    } else {
      current += character;
    }
  }
  values.push(current);
  return values;
}

const csvLines = fs.readFileSync(faaCsvPath, 'utf8').split(/\r?\n/).filter(Boolean);
const headers = parseCsvLine(csvLines[0]);
const wantedIds = new Set(Object.values(airportIds));
const faaAirports = new Map();

for (const line of csvLines.slice(1)) {
  const values = parseCsvLine(line);
  const row = Object.fromEntries(headers.map((header, index) => [header, values[index]]));
  if (!wantedIds.has(row.ARPT_ID)) continue;
  const lat = Number(row.LAT_DECIMAL);
  const lng = Number(row.LONG_DECIMAL);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue;
  faaAirports.set(row.ARPT_ID, {
    faaId: row.ARPT_ID,
    icaoId: row.ICAO_ID || null,
    faaName: row.ARPT_NAME,
    coordinates: { lat, lng },
  });
}

const missingAirportIds = [...wantedIds].filter((id) => !faaAirports.has(id));
if (missingAirportIds.length) {
  throw new Error(`FAA CSV is missing airport IDs: ${missingAirportIds.join(', ')}`);
}

const schools = [
  ...loadSchoolModule('data/schools.ts'),
  ...loadSchoolModule('data/schools-top100.ts'),
];

function petalDriveLink(origin, destination) {
  const url = new URL('/routes/', petalWebUrl);
  url.searchParams.set('saddr', `${origin.lat},${origin.lng}`);
  url.searchParams.set('daddr', `${destination.lat},${destination.lng}`);
  url.searchParams.set('type', 'drive');
  return url.toString();
}

function googleDriveLink(origin, destination) {
  const url = new URL('/maps/dir/', googleMapsWebUrl);
  url.searchParams.set('api', '1');
  url.searchParams.set('origin', `${origin.lat},${origin.lng}`);
  url.searchParams.set('destination', `${destination.lat},${destination.lng}`);
  url.searchParams.set('travelmode', 'driving');
  return url.toString();
}

const records = {};
for (const school of schools) {
  const campus = campusRecords[school.slug]?.coordinates;
  const airportName = school.airportAccess.airportName;
  const faaId = airportIds[airportName];
  const airport = faaAirports.get(faaId);
  if (!campus || !airport) throw new Error(`Missing verified coordinates for ${school.slug}`);

  records[school.slug] = {
    airportName,
    airport,
    campus,
    googleMaps: {
      airportToCampusUrl: googleDriveLink(airport.coordinates, campus),
      campusToAirportUrl: googleDriveLink(campus, airport.coordinates),
      transportMode: 'driving',
    },
    petalMaps: {
      airportToCampusUrl: petalDriveLink(airport.coordinates, campus),
      campusToAirportUrl: petalDriveLink(campus, airport.coordinates),
      webFallbackUrl: petalWebUrl,
      transportMode: 'drive',
      officialUsCoverageDeclared: false,
    },
  };
}

const output = {
  generatedAt: checkedAt,
  recordCount: Object.keys(records).length,
  sources: {
    airportCoordinates: {
      label: `FAA 28-Day NASR Airport CSV — ${faaCycle}`,
      url: faaSourceUrl,
      checkedAt: checkedAt.slice(0, 10),
    },
    petalMaps: {
      label: 'HUAWEI Petal Maps',
      url: petalProductUrl,
      webUrl: petalWebUrl,
      checkedAt: checkedAt.slice(0, 10),
      notes: "Links open Petal Maps' HTTPS route-planning page with the stored origin and destination coordinates. This website does not call a paid routing API. The site operator has tested that Petal can display U.S. maps and plan some U.S. driving routes. Actual availability still depends on the user's device and region. The shortcut is not evidence that any displayed travel time is verified.",
    },
    googleMaps: {
      label: 'Google Maps URLs — Directions',
      url: googleMapsUrlDocs,
      webUrl: googleMapsWebUrl,
      checkedAt: checkedAt.slice(0, 10),
      notes: 'Google Maps Directions URLs open a route preview with stored origin and destination coordinates. They require no API key and do not call a paid routing API from this website. Google Maps accessibility from mainland China is not guaranteed.',
    },
  },
  methodology: {
    en: "Airport and campus coordinates are stored once. Google Maps is the primary route-preview link, with Petal Maps retained as a fallback. Neither link calls a routing API from this website. Public-transit links are intentionally not generated because provider coverage varies by region.",
    zh: '机场与校园坐标只保存一次。Google Maps 作为主要路线预览入口，Petal Maps 作为备用；两者都不会由本网站调用路线 API。由于服务覆盖因地区而异，系统暂不自动生成公交预链接。',
  },
  records,
};

fs.writeFileSync(path.join(projectRoot, 'data/airport-petal-links.json'), `${JSON.stringify(output, null, 2)}\n`);
console.log(`Wrote ${output.recordCount} Google Maps and Petal Maps airport shortcuts using ${faaAirports.size} FAA airports.`);
