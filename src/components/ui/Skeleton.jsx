import { cn } from '@/lib/utils';

export const Skeleton = ({ className }) => <div className={cn('skeleton rounded-md', className)} />;

export function FeedItemSkeleton() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-4" aria-hidden="true">
      <Skeleton className="aspect-video w-full rounded-xl" />
      <Skeleton className="mt-4 h-6 w-3/4" />
      <div className="mt-3 flex items-center gap-3"><Skeleton className="h-9 w-9 rounded-full" /><Skeleton className="h-4 w-40" /></div>
      <Skeleton className="mt-4 h-4 w-full" />
      <Skeleton className="mt-2 h-4 w-2/3" />
    </div>
  );
}

export function ResultSkeleton({ count = 4 }) {
  return (
    <div className="space-y-4" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <Skeleton className="aspect-video w-40 shrink-0 rounded-lg sm:w-64" />
          <div className="flex-1 space-y-2 py-1"><Skeleton className="h-5 w-4/5" /><Skeleton className="h-4 w-1/3" /><Skeleton className="hidden h-4 w-full sm:block" /></div>
        </div>
      ))}
    </div>
  );
}

export function CardGridSkeleton({ count = 6, className = 'h-28' }) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => <Skeleton key={i} className={cn('rounded-xl', className)} />)}
    </div>
  );
}

export function CreatorSkeleton() {
  return (
    <div className="flex items-center gap-5" aria-hidden="true">
      <Skeleton className="h-24 w-24 rounded-full" />
      <div className="space-y-3"><Skeleton className="h-7 w-56" /><Skeleton className="h-4 w-72" /><Skeleton className="h-9 w-28 rounded-full" /></div>
    </div>
  );
}
