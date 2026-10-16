import { SearchX } from 'lucide-react';
import InfiniteFeed from './InfiniteFeed';
import ErrorState from '../ui/ErrorState';
import EmptyState from '../ui/EmptyState';
import { FeedItemSkeleton } from '../ui/Skeleton';
import { useVideoFeed } from '@/hooks/useVideos';

// Data-connected feed: handles loading, error, empty and the happy path.
export default function VideoFeed({ subject, level, topic, sort, header }) {
  const feed = useVideoFeed({ subject, level, topic, sort });

  if (feed.isPending) {
    return <div className="h-full overflow-y-auto">{header}<div className="pt-2"><FeedItemSkeleton /></div></div>;
  }
  if (feed.isError) {
    return <div className="h-full overflow-y-auto">{header}<ErrorState onRetry={() => feed.refetch()} /></div>;
  }
  if (feed.items.length === 0) {
    return (
      <div className="h-full overflow-y-auto">
        {header}
        <EmptyState icon={SearchX} title="No lessons here yet" description="Try another subject or level. New lessons are added regularly." />
      </div>
    );
  }
  return (
    <InfiniteFeed
      items={feed.items}
      hasNextPage={feed.hasNextPage}
      isFetchingNextPage={feed.isFetchingNextPage}
      fetchNextPage={feed.fetchNextPage}
      nextPageError={feed.isFetchNextPageError}
      onRetry={() => feed.fetchNextPage()}
      header={header}
    />
  );
}
