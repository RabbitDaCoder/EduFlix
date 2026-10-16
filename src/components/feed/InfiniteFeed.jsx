import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import VideoCard from '../video/VideoCard';
import FeedLoader from './FeedLoader';
import { useToast } from '../ui/Toast';
import { useStore } from '@/lib/store';

const WINDOW = 1; // render full cards for active +/- WINDOW, lightweight placeholders elsewhere
const PREFETCH_AHEAD = 3; // fetch next page when the viewer is within N items of the end

/**
 * Vertical snap feed. IntersectionObserver decides the active video; only that one gets a live player.
 * A second observer on a sentinel + an "items remaining" check triggers fetchNextPage().
 */
export default function InfiniteFeed({ items, hasNextPage, isFetchingNextPage, fetchNextPage, header, nextPageError, onRetry }) {
  const toast = useToast();
  const scroller = useRef(null);
  const sentinel = useRef(null);
  const ratios = useRef(new Map());
  const [active, setActive] = useState(0);
  const [bad, setBad] = useStore('unavailable', {});

  const visible = useMemo(() => items.filter((v) => !bad[v.youtubeId]), [items, bad]);

  // Active-slot detection
  useEffect(() => {
    const root = scroller.current;
    if (!root) return undefined;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => ratios.current.set(Number(e.target.dataset.index), e.intersectionRatio));
      let best = -1;
      let bestRatio = 0.5;
      ratios.current.forEach((r, i) => { if (r >= bestRatio) { best = i; bestRatio = r; } });
      if (best >= 0) setActive(best);
    }, { root, threshold: [0, 0.25, 0.5, 0.6, 0.75, 1] });
    root.querySelectorAll('[data-index]').forEach((el) => io.observe(el));
    return () => { io.disconnect(); ratios.current.clear(); };
  }, [visible.length]);

  // Load more when sentinel approaches, or when near the end of the list
  useEffect(() => {
    const root = scroller.current;
    const el = sentinel.current;
    if (!root || !el || !hasNextPage || nextPageError) return undefined;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !isFetchingNextPage) fetchNextPage();
    }, { root, rootMargin: '0px 0px 100% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, visible.length]);

  useEffect(() => {
    if (hasNextPage && !nextPageError && !isFetchingNextPage && visible.length > 0 && active >= visible.length - PREFETCH_AHEAD) fetchNextPage();
  }, [active, visible.length, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const goTo = useCallback((i) => {
    const el = scroller.current?.querySelector(`[data-index="${i}"]`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  // Keyboard navigation (j/k and arrows)
  useEffect(() => {
    const onKey = (e) => {
      if (/input|textarea|select/i.test(e.target.tagName) || e.metaKey || e.ctrlKey) return;
      if (e.key === 'ArrowDown' || e.key === 'j') { e.preventDefault(); goTo(Math.min(active + 1, visible.length - 1)); }
      if (e.key === 'ArrowUp' || e.key === 'k') { e.preventDefault(); goTo(Math.max(active - 1, 0)); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, visible.length, goTo]);

  const onUnavailable = (v) => {
    setBad((m) => ({ ...m, [v.youtubeId]: true }));
    toast('Skipped a lesson that is no longer available');
  };

  return (
    <div ref={scroller} className="h-full snap-y snap-mandatory overflow-y-auto overscroll-contain scroll-smooth" tabIndex={-1}>
      {header}
      {visible.map((video, i) => (
        <section
          key={video.id}
          data-index={i}
          className="flex h-[calc(100dvh-var(--header-h)-var(--bottom-h))] snap-start snap-always items-center py-2"
          aria-label={`Lesson ${i + 1}`}
        >
          {Math.abs(i - active) <= WINDOW ? (
            <VideoCard
              video={video}
              active={i === active}
              onRequestPlay={() => goTo(i)}
              onEnded={() => i + 1 < visible.length && goTo(i + 1)}
              onUnavailable={onUnavailable}
            />
          ) : null}
        </section>
      ))}
      <div ref={sentinel} />
      <FeedLoader loading={isFetchingNextPage} hasMore={hasNextPage} error={nextPageError} onRetry={onRetry} onTop={() => goTo(0)} />
    </div>
  );
}
