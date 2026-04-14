import { cn } from '@/lib/utils';

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div className={cn('max-w-3xl space-y-3', className)}>
      {eyebrow ? <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-500">{eyebrow}</p> : null}
      <h2 className="text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">{title}</h2>
      {description ? <p className="text-base leading-7 text-slate-600 md:text-lg">{description}</p> : null}
    </div>
  );
}
