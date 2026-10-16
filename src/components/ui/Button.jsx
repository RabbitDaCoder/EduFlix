import { cn } from '@/lib/utils';

const variants = {
  primary: 'bg-accent text-accent-fg hover:brightness-110',
  secondary: 'bg-surface-2 text-fg hover:bg-line border border-line',
  ghost: 'text-muted hover:text-fg hover:bg-surface-2',
  outline: 'border border-line text-fg hover:bg-surface-2',
};
const sizes = {
  sm: 'h-8 px-3 text-sm gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  icon: 'h-10 w-10',
};

export default function Button({ variant = 'secondary', size = 'md', className, as: Tag = 'button', ...props }) {
  return (
    <Tag
      className={cn(
        'inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full font-medium transition active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50',
        variants[variant], sizes[size], className,
      )}
      {...(Tag === 'button' ? { type: 'button' } : {})}
      {...props}
    />
  );
}
