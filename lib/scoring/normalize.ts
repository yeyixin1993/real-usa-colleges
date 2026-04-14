function clamp(value: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value));
}

/**
 * Maps a distance metric to a 0-100 score.
 * Smaller distance is better by default.
 */
export function normalizeDistance(
  value: number,
  options: {
    best?: number;
    worst?: number;
    invert?: boolean;
  } = {},
) {
  const best = options.best ?? 0;
  const worst = options.worst ?? 40;
  const invert = options.invert ?? false;

  if (worst <= best) {
    return 0;
  }

  const normalized = ((value - best) / (worst - best)) * 100;
  const scored = invert ? normalized : 100 - normalized;
  return clamp(scored);
}

/**
 * Maps a time metric to a 0-100 score.
 * Smaller travel time is better by default.
 */
export function normalizeTime(
  value: number,
  options: {
    best?: number;
    worst?: number;
    invert?: boolean;
  } = {},
) {
  const best = options.best ?? 0;
  const worst = options.worst ?? 120;
  const invert = options.invert ?? false;

  if (worst <= best) {
    return 0;
  }

  const normalized = ((value - best) / (worst - best)) * 100;
  const scored = invert ? normalized : 100 - normalized;
  return clamp(scored);
}

/**
 * Small helper for normalizing count-like "more is better" values.
 */
export function normalizeCount(value: number, maxExpected: number) {
  if (maxExpected <= 0) return 0;
  return clamp((value / maxExpected) * 100);
}

export function weightedAverage(parts: Array<{ value: number; weight: number }>) {
  const totalWeight = parts.reduce((sum, part) => sum + part.weight, 0);
  if (totalWeight <= 0) return 0;
  const total = parts.reduce((sum, part) => sum + part.value * part.weight, 0);
  return Number((total / totalWeight).toFixed(1));
}
