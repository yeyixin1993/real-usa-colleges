import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import ts from 'typescript';

const projectRoot = process.cwd();
const require = createRequire(import.meta.url);
const inputPath = process.argv[2];

if (!inputPath) {
  throw new Error('Usage: node scripts/import-college-scorecard.mjs /path/to/Most-Recent-Cohorts-Institution.csv');
}

const source = {
  label: 'U.S. Department of Education College Scorecard',
  release: 'Most Recent Cohorts Institution-Level Data, May 19, 2025',
  url: 'https://catalog.data.gov/dataset/college-scorecard',
  downloadUrl:
    'https://ed-public-download.scorecard.network/downloads/Most-Recent-Cohorts-Institution_05192025.zip',
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
  let value = '';
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    if (character === '"') {
      if (quoted && line[index + 1] === '"') {
        value += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (character === ',' && !quoted) {
      values.push(value);
      value = '';
    } else {
      value += character;
    }
  }
  values.push(value);
  return values;
}

function normalize(value) {
  return value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/\bthe\b/g, '')
    .replace(/\buniversity\b/g, 'univ')
    .replace(/\bcollege\b/g, 'coll')
    .replace(/\bof\b/g, '')
    .replace(/[^a-z0-9]/g, '');
}

function numberOrNull(value) {
  if (!value || value === 'NULL' || value === 'PrivacySuppressed') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function percentOrNull(value) {
  const parsed = numberOrNull(value);
  return parsed === null ? null : Number((parsed * 100).toFixed(1));
}

const headerAndRows = fs.readFileSync(inputPath, 'utf8').split(/\r?\n/).filter(Boolean);
const headers = parseCsvLine(headerAndRows[0]).map((header) => header.replace(/^\uFEFF/, ''));
const wantedColumns = [
  'UNITID',
  'INSTNM',
  'CITY',
  'STABBR',
  'INSTURL',
  'CONTROL',
  'LATITUDE',
  'LONGITUDE',
  'UGDS',
  'UGDS_WHITE',
  'UGDS_BLACK',
  'UGDS_HISP',
  'UGDS_ASIAN',
  'UGDS_NRA',
  'UGDS_MEN',
  'UGDS_WOMEN',
  'UG25ABV',
  'LOCALE',
];
const columnIndexes = Object.fromEntries(wantedColumns.map((column) => [column, headers.indexOf(column)]));

for (const [column, index] of Object.entries(columnIndexes)) {
  if (index === -1) throw new Error(`Missing required College Scorecard column: ${column}`);
}

const scorecardRows = headerAndRows.slice(1).map((line) => {
  const values = parseCsvLine(line);
  return Object.fromEntries(
    Object.entries(columnIndexes).map(([column, index]) => [column, values[index]]),
  );
});

const catalog = [
  ...loadSchoolModule('data/schools.ts'),
  ...loadSchoolModule('data/schools-top100.ts'),
];

const manualUnitIds = {
  'columbia-university': '190150',
  'georgia-institute-of-technology': '139755',
  mit: '166683',
  'ohio-state-university': '204796',
  'purdue-university': '243780',
  ucla: '110662',
  'rutgers-university': '186380',
  'st-johns-college': '163976',
  'unc-chapel-hill': '199120',
  'university-of-illinois-urbana-champaign': '145637',
  'university-of-michigan': '170976',
  'university-of-minnesota-twin-cities': '174066',
  'university-of-southern-california': '123961',
  'university-of-texas-austin': '228778',
  'university-of-virginia': '234076',
  'university-of-washington': '236948',
  'sewanee-university-of-the-south': '221519',
  'william-and-mary': '231624',
  'wooster-college': '206589',
};

const records = {};
const unmatched = [];
const ambiguous = [];

for (const school of catalog) {
  const manualUnitId = manualUnitIds[school.slug];
  const sameState = scorecardRows.filter((row) => row.STABBR === school.stateCode);
  const exactName = sameState.filter((row) => normalize(row.INSTNM) === normalize(school.name));
  const exactCity = exactName.filter((row) => normalize(row.CITY) === normalize(school.city));
  const candidates = manualUnitId
    ? scorecardRows.filter((row) => row.UNITID === manualUnitId)
    : exactCity.length === 1
      ? exactCity
      : exactName;

  if (candidates.length === 0) {
    unmatched.push({ slug: school.slug, name: school.name, city: school.city, state: school.stateCode });
    continue;
  }
  if (candidates.length !== 1) {
    ambiguous.push({
      slug: school.slug,
      expected: `${school.name} (${school.city}, ${school.stateCode})`,
      candidates: candidates.map((row) => `${row.UNITID}: ${row.INSTNM} (${row.CITY}, ${row.STABBR})`),
    });
    continue;
  }

  const row = candidates[0];
  const latitude = numberOrNull(row.LATITUDE);
  const longitude = numberOrNull(row.LONGITUDE);
  if (latitude === null || longitude === null) {
    unmatched.push({ slug: school.slug, reason: 'Official record has no coordinates', unitId: row.UNITID });
    continue;
  }

  records[school.slug] = {
    unitId: row.UNITID,
    name: row.INSTNM,
    city: row.CITY,
    stateCode: row.STABBR,
    website: row.INSTURL ? `https://${row.INSTURL.replace(/^https?:\/\//, '').replace(/\/$/, '')}` : null,
    sector: row.CONTROL === '1' ? 'Public' : row.CONTROL === '2' ? 'Private' : null,
    coordinates: { lat: latitude, lng: longitude },
    undergraduateEnrollment: numberOrNull(row.UGDS),
    campusDemographics: {
      white: percentOrNull(row.UGDS_WHITE),
      black: percentOrNull(row.UGDS_BLACK),
      hispanicLatino: percentOrNull(row.UGDS_HISP),
      asian: percentOrNull(row.UGDS_ASIAN),
      nonresident: percentOrNull(row.UGDS_NRA),
      men: percentOrNull(row.UGDS_MEN),
      women: percentOrNull(row.UGDS_WOMEN),
      age25OrOlder: percentOrNull(row.UG25ABV),
    },
    localeCode: numberOrNull(row.LOCALE),
  };
}

if (unmatched.length || ambiguous.length) {
  console.error(JSON.stringify({ unmatched, ambiguous }, null, 2));
  process.exitCode = 1;
} else {
  const output = {
    source,
    generatedAt: new Date().toISOString(),
    recordCount: Object.keys(records).length,
    records,
  };
  fs.writeFileSync(
    path.join(projectRoot, 'data/verified-colleges.json'),
    `${JSON.stringify(output, null, 2)}\n`,
  );
  console.log(`Wrote ${output.recordCount} verified records to data/verified-colleges.json`);
}
