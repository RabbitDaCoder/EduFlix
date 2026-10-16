import { useState } from 'react';
import VideoPlayer from './VideoPlayer';
import VideoMetadata from './VideoMetadata';
import VideoActions from './VideoActions';
import { useHistory } from '@/hooks/useLibrary';
import { useWatchTracker } from '@/hooks/useWatchTracker';

// One feed entry: player (video dominant) + progress + metadata + actions.
export default function VideoCard({ video, active, onRequestPlay, onEnded, onUnavailable }) {
  const tracker = useWatchTracker(video);
  const { progressOf } = useHistory();
  const [live, setLive] = useState(null);
  const pct = Math.round((live ?? progressOf(video)) * 100);

  return (
    <article
      className="mx-auto flex w-full max-w-[min(100%,calc((100dvh-var(--header-h)-var(--bottom-h)-15rem)*16/9))] min-w-[min(100%,20rem)] flex-col px-3 sm:px-4"
      aria-label={video.title}
    >
      <VideoPlayer
        video={video}
        active={active}
        onRequestPlay={onRequestPlay}
        onUnavailable={onUnavailable}
        onProgress={(t, d, force) => {
          if (d) setLive(Math.min(1, t / d));
          tracker.onProgress(t, d, force);
        }}
        onEnded={(d) => { setLive(1); tracker.onEnded(d); onEnded?.(); }}
      />
      <div
        className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-line"
        role="progressbar" aria-label="Lesson progress" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}
      >
        <div className="h-full rounded-full bg-accent transition-[width] duration-700" style={{ width: `${pct}%` }} />
      </div>
      <div className="mt-3 flex flex-col gap-3">
        <VideoMetadata video={video} />
        <VideoActions video={video} />
      </div>
    </article>
  );
}
