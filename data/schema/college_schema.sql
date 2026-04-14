-- PostgreSQL / PostGIS-ready schema (draft)
-- Notes:
-- 1) geography(Point, 4326) supports distance/radius queries with ST_DWithin.
-- 2) All score fields remain persisted for explainability, while raw metrics are retained.

create extension if not exists postgis;

create table if not exists schools (
  id text primary key,
  slug text not null unique,
  name_zh text not null,
  name_en text not null,
  name_ja text not null,
  city text not null,
  state text not null,
  latitude numeric(9,6) not null,
  longitude numeric(9,6) not null,
  geo geography(Point, 4326) generated always as (ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography) stored,
  school_type text not null check (school_type in ('national_university', 'liberal_arts_college')),
  control text not null check (control in ('public', 'private')),
  ranking_source text not null,
  ranking_year int not null,
  ranking_value int not null,
  undergraduate_enrollment int not null,
  setting text not null check (setting in ('urban', 'suburban', 'town', 'rural')),
  short_summary_zh text not null,
  short_summary_en text not null,
  short_summary_ja text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_schools_geo on schools using gist (geo);
create index if not exists idx_schools_type on schools (school_type, control);

create table if not exists climate (
  school_id text primary key references schools(id) on delete cascade,
  average_monthly_highs numeric[] not null check (array_length(average_monthly_highs, 1) = 12),
  average_monthly_lows numeric[] not null check (array_length(average_monthly_lows, 1) = 12),
  annual_precipitation_in numeric not null,
  annual_snowfall_in numeric not null,
  humidity_band text not null,
  summer_heat_intensity text not null,
  winter_severity text not null,
  sunshine_cloudiness_band text not null,
  severe_weather_note_zh text not null,
  severe_weather_note_en text not null,
  severe_weather_note_ja text not null,
  seasonal_summary_zh text not null,
  seasonal_summary_en text not null,
  seasonal_summary_ja text not null,
  climate_score numeric not null,
  climate_grade text not null
);

create table if not exists campus_demographics (
  school_id text primary key references schools(id) on delete cascade,
  pct_white numeric not null,
  pct_black numeric not null,
  pct_hispanic numeric not null,
  pct_asian numeric not null,
  pct_international numeric not null,
  note_zh text not null,
  note_en text not null,
  note_ja text not null
);

create table if not exists local_demographics_30mi (
  school_id text primary key references schools(id) on delete cascade,
  pct_white numeric not null,
  pct_black numeric not null,
  pct_hispanic numeric not null,
  pct_asian numeric not null,
  foreign_born_pct numeric not null,
  median_household_income numeric not null,
  population_density_band text not null,
  note_zh text not null,
  note_en text not null,
  note_ja text not null,
  demographics_score numeric not null,
  demographics_grade text not null
);

create table if not exists food_convenience (
  school_id text not null references schools(id) on delete cascade,
  category text not null,
  nearest_place_name text not null,
  distance_miles numeric not null,
  drive_minutes int not null,
  transit_minutes int,
  count_within_5_miles int not null,
  count_within_10_miles int not null,
  count_within_30_miles int not null,
  uber_available boolean not null,
  uber_eats_available boolean not null,
  primary key (school_id, category)
);

create table if not exists life_convenience (
  school_id text not null references schools(id) on delete cascade,
  category text not null,
  nearest_place_name text not null,
  distance_miles numeric not null,
  drive_minutes int not null,
  transit_minutes int,
  primary key (school_id, category)
);

create table if not exists airport_access_asia (
  school_id text primary key references schools(id) on delete cascade,
  airport_name text not null,
  distance_miles numeric not null,
  drive_minutes int not null,
  transit_minutes int,
  connectivity_level text not null,
  travel_summary_zh text not null,
  travel_summary_en text not null,
  travel_summary_ja text not null,
  airport_score numeric not null,
  airport_grade text not null
);

create table if not exists derived_school_scores (
  school_id text primary key references schools(id) on delete cascade,
  climate_score numeric not null,
  demographics_score numeric not null,
  food_score numeric not null,
  life_score numeric not null,
  airport_score numeric not null,
  overall_score numeric not null,
  climate_grade text not null,
  demographics_grade text not null,
  food_grade text not null,
  life_grade text not null,
  airport_grade text not null,
  overall_grade text not null,
  calculated_at timestamptz not null default now()
);
