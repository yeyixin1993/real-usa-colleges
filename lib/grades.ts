import type { Grade } from '@/types/school';

export function getGrade(score: number): Grade {
  if (score >= 85) return 'A';
  if (score >= 70) return 'B';
  if (score >= 55) return 'C';
  if (score >= 40) return 'D';
  return 'F';
}

export function getScoreTone(score: number) {
  if (score >= 85) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
  if (score >= 70) return 'text-sky-700 bg-sky-50 border-sky-200';
  if (score >= 55) return 'text-amber-700 bg-amber-50 border-amber-200';
  if (score >= 40) return 'text-orange-700 bg-orange-50 border-orange-200';
  return 'text-rose-700 bg-rose-50 border-rose-200';
}
