import { cn } from '@/lib/utils';

export default function Badge({ className, tone = 'default', ...props }) {
  const tones = {
    default: 'bg-surface-2 text-muted border-line',
    accent: 'bg-accent/15 text-accent border-accent/30',
    good: 'bg-good/10 text-good border-good/30',
  };
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium', tones[tone], className)} {...props} />
  );
}
