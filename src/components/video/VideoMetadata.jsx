import { Link } from 'react-router-dom';
import { BadgeCheck, Clock } from 'lucide-react';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';
import { formatDuration, formatCount, cn } from '@/lib/utils';
import { SUBJECTS } from '@/lib/subjects';

export default function VideoMetadata({ video, clampDescription = true, showDescription = true, titleAs: Title = 'h2', className }) {
  const subject = SUBJECTS.find((s) => s.name === video.subject);
  return (
    <div className={cn('min-w-0', className)}>
      <Title className="font-display text-lg font-semibold leading-snug sm:text-xl">{video.title}</Title>
      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2">
        <Link to={`/creators/${video.creator.id}`} className="flex min-w-0 items-center gap-2 hover:text-accent">
          <Avatar name={video.creator.name} hue={video.creator.hue} size="sm" />
          <span className="truncate text-sm font-medium">{video.creator.name}</span>
          {video.creator.verified && <BadgeCheck size={14} className="shrink-0 text-muted" aria-label="Verified creator" />}
        </Link>
        <span className="flex items-center gap-1 text-sm text-muted"><Clock size={14} />{formatDuration(video.duration)}</span>
        {video.views != null && <span className="text-sm text-muted">{formatCount(video.views)} views</span>}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
        {subject ? (
          <Link to={`/subjects/${subject.slug}`} className="font-medium text-fg hover:text-accent">{video.subject}</Link>
        ) : <span className="font-medium">{video.subject}</span>}
        {video.topic && <><span className="text-muted">·</span><span className="text-muted">{video.topic}</span></>}
        {video.level && <Badge>{video.level}</Badge>}
        <Badge tone="accent">Recommended lesson</Badge>
      </div>
      {showDescription && video.description && (
        <p className={cn('mt-3 text-sm leading-relaxed text-muted', clampDescription && 'line-clamp-2')}>{video.description}</p>
      )}
    </div>
  );
}
