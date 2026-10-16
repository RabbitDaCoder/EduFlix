import { Link } from 'react-router-dom';
import { BadgeCheck } from 'lucide-react';
import { formatDuration, thumbFor, cn } from '@/lib/utils';
import Badge from '../ui/Badge';

export function Thumbnail({ video, progress = 0, className }) {
  return (
    <div className={cn('relative aspect-video overflow-hidden rounded-lg bg-surface-2', className)}>
      <img src={video.thumbnail || thumbFor(video.youtubeId)} alt="" loading="lazy" className="h-full w-full object-cover transition group-hover:scale-105" />
      <span className="absolute bottom-1.5 right-1.5 rounded bg-black/80 px-1.5 py-0.5 text-xs font-medium">{formatDuration(video.duration)}</span>
      {progress > 0 && (
        <div className="absolute inset-x-0 bottom-0 h-1 bg-black/60"><div className="h-full bg-accent" style={{ width: `${Math.round(progress * 100)}%` }} /></div>
      )}
    </div>
  );
}

// Horizontal card used by search, saved, history, related, up next.
export default function SearchResultCard({ video, progress = 0, to, meta, actions, compact = false }) {
  return (
    <div className="group relative flex gap-3 sm:gap-4">
      <Link to={to || `/watch/${video.id}`} className={cn('shrink-0', compact ? 'w-36 sm:w-40' : 'w-40 sm:w-64')} aria-label={`Watch ${video.title}`}>
        <Thumbnail video={video} progress={progress} />
      </Link>
      <div className="min-w-0 flex-1 py-0.5">
        <Link to={to || `/watch/${video.id}`} className="line-clamp-2 font-display text-sm font-semibold leading-snug hover:text-accent sm:text-base">{video.title}</Link>
        <Link to={`/creators/${video.creator.id}`} className="mt-1 flex items-center gap-1 text-xs text-muted hover:text-fg sm:text-sm">
          {video.creator.name}{video.creator.verified && <BadgeCheck size={13} />}
        </Link>
        <p className="mt-1 text-xs text-muted sm:text-sm">{[video.subject, video.topic].filter(Boolean).join(' · ')}</p>
        {meta}
        {!compact && video.description && <p className="mt-2 hidden line-clamp-2 text-sm text-muted md:block">{video.description}</p>}
        {video.level && !compact && <Badge className="mt-2">{video.level}</Badge>}
      </div>
      {actions && <div className="shrink-0 self-start">{actions}</div>}
    </div>
  );
}
