import { TriangleAlert } from 'lucide-react';
import Button from './Button';

export default function ErrorState({ title = "Couldn't load lessons", description = 'Something went wrong while loading the feed.', onRetry }) {
  return (
    <div role="alert" className="mx-auto flex max-w-sm flex-col items-center px-6 py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-line bg-surface text-accent"><TriangleAlert size={26} /></div>
      <h2 className="font-display text-xl font-semibold">{title}</h2>
      <p className="mt-2 text-sm text-muted">{description}</p>
      {onRetry && <Button variant="primary" className="mt-5" onClick={onRetry}>Try again</Button>}
    </div>
  );
}
