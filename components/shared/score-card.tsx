import { Card, CardContent } from '@/components/ui/card';
import { ScoreBadge } from '@/components/shared/score-badge';

export function ScoreCard({ title, description, score }: { title: string; description: string; score: number }) {
  return (
    <Card className="h-full">
      <CardContent className="space-y-4 p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>
          </div>
          <ScoreBadge score={score} compact />
        </div>
      </CardContent>
    </Card>
  );
}
