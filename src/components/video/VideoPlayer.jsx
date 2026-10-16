import { useEffect, useRef, useState } from 'react';
import { Play, ExternalLink } from 'lucide-react';
import { thumbFor, cn } from '@/lib/utils';

// ---- YouTube IFrame API loader (singleton) ----
let apiPromise = null;
function loadYouTubeApi() {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (!apiPromise) {
    apiPromise = new Promise((resolve) => {
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => { prev?.(); resolve(window.YT); };
      const s = document.createElement('script');
      s.src = 'https://www.youtube.com/iframe_api';
      s.onerror = () => { apiPromise = null; resolve(null); };
      document.head.appendChild(s);
    });
  }
  return apiPromise;
}

// Remember whether the viewer turned sound on, so the next player follows suit.
let wantSound = false;
const UNAVAILABLE = new Set([5, 100, 101, 150]);

/**
 * Only mounts a real YouTube player while `active`. Otherwise shows a lightweight poster,
 * so dozens of iframes are never alive at once. Leaving `active` destroys the player (= pause).
 */
export default function VideoPlayer({ video, active, autoPlay = true, onProgress, onEnded, onUnavailable, onRequestPlay, className }) {
  const hostRef = useRef(null);
  const cb = useRef({});
  cb.current = { onProgress, onEnded, onUnavailable };
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!active) return undefined;
    let player;
    let timer;
    let cancelled = false;
    setError(null);

    const report = (force) => {
      try {
        const t = player?.getCurrentTime?.();
        const d = player?.getDuration?.();
        if (typeof t === 'number' && t > 0) cb.current.onProgress?.(t, d, force);
      } catch { /* player already gone */ }
    };

    loadYouTubeApi().then((YT) => {
      if (cancelled || !hostRef.current) return;
      if (!YT) { setError('network'); return; }
      const el = document.createElement('div');
      hostRef.current.replaceChildren(el);
      player = new YT.Player(el, {
        videoId: video.youtubeId,
        playerVars: { autoplay: autoPlay ? 1 : 0, mute: wantSound ? 0 : 1, rel: 0, modestbranding: 1, playsinline: 1, origin: window.location.origin },
        events: {
          onStateChange: (e) => {
            try { wantSound = !player.isMuted(); } catch { /* ignore */ }
            clearInterval(timer);
            if (e.data === YT.PlayerState.PLAYING) timer = setInterval(() => report(false), 1000);
            if (e.data === YT.PlayerState.PAUSED) report(true);
            if (e.data === YT.PlayerState.ENDED) cb.current.onEnded?.(player.getDuration?.());
          },
          onError: (e) => {
            setError(e.data);
            if (UNAVAILABLE.has(e.data)) cb.current.onUnavailable?.(video, e.data);
          },
        },
      });
    });

    return () => {
      cancelled = true;
      clearInterval(timer);
      report(true);
      try { player?.destroy?.(); } catch { /* ignore */ }
    };
  }, [active, video.youtubeId, autoPlay]); // eslint-disable-line react-hooks/exhaustive-deps

  const showPlayer = active && !error;

  return (
    <div className={cn('relative aspect-video w-full overflow-hidden rounded-xl bg-black', className)}>
      {showPlayer && <div ref={hostRef} className="yt-host absolute inset-0" />}
      {!showPlayer && (
        <div className="absolute inset-0">
          <img src={video.thumbnail || thumbFor(video.youtubeId)} alt="" loading="lazy" className="h-full w-full object-cover" />
          {error ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/75 p-4 text-center">
              <p className="text-sm text-fg">This lesson cannot be played here right now.</p>
              <a href={`https://www.youtube.com/watch?v=${video.youtubeId}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-4 py-2 text-sm font-medium hover:bg-line">
                Watch on YouTube <ExternalLink size={14} />
              </a>
            </div>
          ) : (
            <button type="button" onClick={onRequestPlay} aria-label={`Play ${video.title}`} className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/30 transition hover:bg-black/20">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-accent-fg shadow-xl"><Play size={28} fill="currentColor" /></span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
