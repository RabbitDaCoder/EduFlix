import { cn } from '@/lib/utils';

export default function Avatar({ name = '?', hue = 215, size = 'md', className }) {
  const initials = name.replace(/[^\p{L}\p{N} ]/gu, '').split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
  const sizes = { sm: 'h-7 w-7 text-[11px]', md: 'h-9 w-9 text-xs', lg: 'h-16 w-16 text-lg', xl: 'h-24 w-24 text-2xl' };
  return (
    <span
      aria-hidden="true"
      className={cn('inline-flex shrink-0 select-none items-center justify-center rounded-full font-display font-semibold text-white', sizes[size], className)}
      style={{ background: `hsl(${hue} 55% 38%)` }}
    >
      {initials}
    </span>
  );
}
