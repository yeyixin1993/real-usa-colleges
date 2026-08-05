import fs from 'node:fs';
import path from 'node:path';

const projectRoot = process.cwd();
const dataPath = path.join(projectRoot, 'data/verified-colleges.json');
const apiKey = process.env.COLLEGE_SCORECARD_API_KEY || 'DEMO_KEY';

const payload = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const records = payload.records ?? {};

const unitIds = [...new Set(Object.values(records)
  .map((record) => record.unitId)
  .filter((value) => typeof value === 'string' && value.trim()))];

if (unitIds.length === 0) {
  throw new Error('No UNITID values found in data/verified-colleges.json');
}

const chunks = [];
for (let index = 0; index < unitIds.length; index += 40) {
  chunks.push(unitIds.slice(index, index + 40));
}

const fields = [
  'id',
  'latest.cost.tuition.in_state',
  'latest.cost.tuition.out_of_state',
  'latest.cost.attendance.academic_year',
].join(',');

const byUnitId = new Map();

for (const chunk of chunks) {
  const url = new URL('https://api.data.gov/ed/collegescorecard/v1/schools.json');
  url.searchParams.set('id', chunk.join(','));
  url.searchParams.set('fields', fields);
  url.searchParams.set('per_page', String(chunk.length));
  url.searchParams.set('api_key', apiKey);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Scorecard API request failed (${response.status}): ${url}`);
  }

  const body = await response.json();
  for (const row of body.results ?? []) {
    byUnitId.set(String(row.id), {
      tuitionInState: Number.isFinite(row['latest.cost.tuition.in_state']) ? row['latest.cost.tuition.in_state'] : null,
      tuitionOutOfState: Number.isFinite(row['latest.cost.tuition.out_of_state']) ? row['latest.cost.tuition.out_of_state'] : null,
      totalCost: Number.isFinite(row['latest.cost.attendance.academic_year']) ? row['latest.cost.attendance.academic_year'] : null,
    });
  }
}

let matched = 0;
for (const record of Object.values(records)) {
  const cost = byUnitId.get(String(record.unitId));
  if (!cost) {
    record.undergraduateTuitionUsd = null;
    record.totalCostUsd = null;
    continue;
  }

  record.undergraduateTuitionUsd = cost.tuitionOutOfState ?? cost.tuitionInState;
  record.totalCostUsd = cost.totalCost;
  matched += 1;
}

payload.generatedAt = new Date().toISOString();
fs.writeFileSync(dataPath, `${JSON.stringify(payload, null, 2)}\n`);

console.log(`Updated tuition/total cost for ${matched}/${Object.keys(records).length} schools.`);
