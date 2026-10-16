import { Loader2 } from 'lucide-react';
import Button from '../ui/Button';

export default function FeedLoader({ loading, hasMore, error, onRetry, onTop }) {
  if (error) {
    return (
      <div role="alert" className="flex flex-col items-center gap-3 py-10 text-center">
        <p className="text-sm text-muted">Could not load more lessons.</p>
        <Button variant="primary" onClick={onRetry}>Try again</Button>
      </div>
    );
  }
  if (loading) {
    return (
      <div role="status" className="flex items-center justify-center gap-2 py-10 text-sm text-muted">
        <Loader2 size={18} className="animate-spin" /> Loading more lessons...
      </div>
    );
  }
  if (!hasMore) {
    return (
      <div className="flex flex-col items-center gap-3 py-12 text-center">
        <p className="text-sm text-muted">You are all caught up. New lessons arrive regularly.</p>
        {onTop && <Button onClick={onTop}>Back to top</Button>}
      </div>
    );
  }
  return <div className="h-10" />;
}
