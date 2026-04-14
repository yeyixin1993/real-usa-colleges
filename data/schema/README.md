# College Data Model (Mock -> PostgreSQL/PostGIS)

This folder defines a normalized data layout that mirrors production table boundaries.

## Entity groups

- `schools`
- `climate`
- `campus_demographics`
- `local_demographics_30mi`
- `food_convenience`
- `life_convenience`
- `airport_access_asia`
- `derived_school_scores`

## Current mock source

- Runtime seed bundle: `data/mock/college-data.ts`
- Type definitions: `types/data-model/college.ts`
- Scoring logic: `lib/scoring/*`

## Postgres migration notes

1. Keep raw metrics in source tables; do not collapse into scores only.
2. Recompute `derived_school_scores` through batch jobs or materialized views.
3. Use PostGIS `schools.geo` for 5/10/30 mile radius metrics and nearest-place updates.
4. Store multilingual fields directly (`*_zh`, `*_en`, `*_ja`) to avoid join-heavy reads on profile pages.
