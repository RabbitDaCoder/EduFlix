import { useEffect, useRef } from 'react';
import FeedLoader from './FeedLoader';

// Sentinel-driven pagination for ordinary (non-snap) lists such as search results.
export default function LoadMore({ hasNextPage, isFetchingNextPage, isError, fetchNextPage }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !hasNextPage || isError) return undefined;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting && !isFetchingNextPage) fetchNextPage(); }, { rootMargin: '400px' });
    io.observe(el);
    return () => io.disconnect();
  }, [hasNextPage, isFetchingNextPage, isError, fetchNextPage]);
  return (
    <>
      <div ref={ref} />
      <FeedLoader loading={isFetchingNextPage} hasMore={hasNextPage} error={isError} onRetry={fetchNextPage} />
    </>
  );
}
