import { getGrade, getScoreTone } from '@/lib/grades';
import { cn } from '@/lib/utils';
import type { Grade } from '@/types/school';

export function ScoreBadge({ score, label, compact = false, grade }: { score: number; label?: string; compact?: boolean; grade?: Grade }) {
  const finalGrade = grade ?? getGrade(score);

  return (
    <div
      className={cn(
        'inline-flex items-center gap-3 rounded-full border px-3 py-2',
        compact ? 'text-xs' : 'text-sm',
        getScoreTone(score),
      )}
    >
      {label ? <span className="text-slate-500">{label}</span> : null}
      <span className="font-semibold text-slate-900">{score}</span>
      <span className="rounded-full bg-white/80 px-2 py-0.5 font-semibold">{finalGrade}</span>
    </div>
  );
}
