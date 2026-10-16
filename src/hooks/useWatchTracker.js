import { useCallback, useRef } from 'react';
import { useHistory } from './useLibrary';

// Turns raw player progress into throttled localStorage history writes.
export function useWatchTracker(video) {
  const { record } = useHistory();
  const last = useRef(0);
  const onProgress = useCallback((seconds, duration, force = false) => {
    if (seconds < 2) return;
    const now = Date.now();
    if (!force && now - last.current < 5000) return;
    last.current = now;
    record(video, seconds, duration);
  }, [record, video]);
  const onEnded = useCallback((duration) => {
    record(video, duration || video.duration || 0, duration, true);
  }, [record, video]);
  return { onProgress, onEnded };
}
