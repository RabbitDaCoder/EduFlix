import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Check, Play, Circle, Route } from 'lucide-react';
import Page from '@/components/ui/Page';
import VideoPlayer from '@/components/video/VideoPlayer';
import ErrorState from '@/components/ui/ErrorState';
import EmptyState from '@/components/ui/EmptyState';
import Button from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { usePath } from '@/hooks/useVideos';
import { usePathProgress } from '@/hooks/useLibrary';
import { useWatchTracker } from '@/hooks/useWatchTracker';
import { formatDuration, cn } from '@/lib/utils';

function LessonPlayer({ lesson, onEnded }) {
  const tracker = useWatchTracker(lesson);
  return (
    <VideoPlayer
      key={lesson.id}
      video={lesson}
      active
      autoPlay={false}
      onProgress={tracker.onProgress}
      onEnded={(d) => { tracker.onEnded(d); onEnded(); }}
    />
  );
}

function PathBody({ path }) {
  const { done, toggle } = usePathProgress(path.id);
  const firstOpen = path.lessons.findIndex((_, i) => !done.includes(i));
  const [selected, setSelected] = useState(firstOpen === -1 ? 0 : firstOpen);
  const lesson = path.lessons[selected];
  const total = path.lessons.length;
  const pct = Math.round((done.length / total) * 100);

  const finish = () => {
    toggle(selected, true);
    if (selected + 1 < total) setSelected(selected + 1);
  };

  return (
    <Page wide>
      <p className="flex items-center gap-2 text-sm font-medium text-accent"><Route size={16} /> Learning path</p>
      <h1 className="mt-1 font-display text-2xl font-bold md:text-3xl">{path.title}</h1>
      <p className="mt-1 text-muted">{path.description}</p>
      <div className="mt-4 max-w-md">
        <div className="mb-1.5 flex justify-between text-sm"><span className="font-medium">{done.length} of {total} lessons completed</span><span className="text-muted">{pct}%</span></div>
        <div className="h-2 overflow-hidden rounded-full bg-line" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}><div className="h-full rounded-full bg-accent transition-all" style={{ width: pct + '%' }} /></div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div>
          <LessonPlayer key={lesson.id} lesson={lesson} onEnded={finish} />
          <h2 className="mt-4 font-display text-xl font-semibold">{lesson.title}</h2>
          <p className="mt-1 text-sm text-muted">From: {lesson.sourceTitle || lesson.title} · {lesson.creator.name}</p>
          <Button className="mt-4" variant={done.includes(selected) ? 'secondary' : 'primary'} onClick={() => toggle(selected)}>
            <Check size={16} /> {done.includes(selected) ? 'Completed' : 'Mark as complete'}
          </Button>
        </div>
        <ol className="space-y-1" aria-label="Lessons">
          {path.lessons.map((l, i) => {
            const isDone = done.includes(i);
            const isCurrent = i === selected;
            return (
              <li key={l.id}>
                <button
                  type="button" onClick={() => setSelected(i)} aria-current={isCurrent ? 'step' : undefined}
                  className={cn('flex w-full cursor-pointer items-center gap-3 rounded-lg border px-3 py-3 text-left transition', isCurrent ? 'border-accent/50 bg-surface-2' : 'border-transparent hover:bg-surface')}
                >
                  <span className={cn('flex h-7 w-7 shrink-0 items-center justify-center rounded-full', isDone ? 'bg-good/20 text-good' : isCurrent ? 'bg-accent text-accent-fg' : 'text-muted')}>
                    {isDone ? <Check size={16} /> : isCurrent ? <Play size={14} fill="currentColor" /> : <Circle size={14} />}
                  </span>
                  <span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium">{l.title}</span><span className="text-xs text-muted">{formatDuration(l.duration)}</span></span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </Page>
  );
}

export default function Playlist() {
  const { id } = useParams();
  const path = usePath(id);
  if (path.isPending) return <Page wide><Skeleton className="h-8 w-64" /><Skeleton className="mt-6 aspect-video max-w-3xl rounded-xl" /></Page>;
  if (path.error?.status === 404) return <EmptyState icon={Route} title="Learning path not found" action={<Button as={Link} to="/discover" variant="primary">Back to Discover</Button>} />;
  if (path.isError) return <ErrorState title="Could not load path" onRetry={() => path.refetch()} />;
  return <PathBody key={path.data.id} path={path.data} />;
}
