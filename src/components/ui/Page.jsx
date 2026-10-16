import { cn } from '@/lib/utils';

export default function Page({ title, subtitle, actions, children, className, wide = false }) {
  return (
    <div className={cn('mx-auto w-full px-4 py-6 md:px-6 md:py-8', wide ? 'max-w-7xl' : 'max-w-5xl', className)}>
      {(title || actions) && (
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">{title}</h1>
            {subtitle && <p className="mt-1 text-muted">{subtitle}</p>}
          </div>
          {actions}
        </div>
      )}
      {children}
    </div>
  );
}

export function Section({ title, action, children, className }) {
  return (
    <section className={cn('mt-10 first:mt-0', className)}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold md:text-xl">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}
