import { getGrade, getScoreTone } from '@/lib/grades';
import { cn } from '@/lib/utils';

export function ScoreBadge({ score, label, compact = false }: { score: number; label?: string; compact?: boolean }) {
  const grade = getGrade(score);

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
      <span className="rounded-full bg-white/80 px-2 py-0.5 font-semibold">{grade}</span>
    </div>
  );
}
