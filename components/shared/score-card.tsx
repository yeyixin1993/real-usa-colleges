import { Card, CardContent } from '@/components/ui/card';
import { ScoreBadge } from '@/components/shared/score-badge';
import type { Grade } from '@/types/school';

export function ScoreCard({ title, description, score, grade }: { title: string; description: string; score: number; grade?: Grade }) {
  return (
    <Card className="h-full">
      <CardContent className="space-y-4 p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>
          </div>
          <ScoreBadge score={score} compact grade={grade} />
        </div>
      </CardContent>
    </Card>
  );
}
