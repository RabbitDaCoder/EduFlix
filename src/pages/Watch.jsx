import { Link, useParams } from 'react-router-dom';
import { VideoOff } from 'lucide-react';
import Page, { Section } from '@/components/ui/Page';
import VideoPlayer from '@/components/video/VideoPlayer';
import VideoMetadata from '@/components/video/VideoMetadata';
import VideoActions from '@/components/video/VideoActions';
import SearchResultCard, { Thumbnail } from '@/components/search/SearchResultCard';
import ErrorState from '@/components/ui/ErrorState';
import EmptyState from '@/components/ui/EmptyState';
import Button from '@/components/ui/Button';
import { Skeleton, ResultSkeleton } from '@/components/ui/Skeleton';
import { useVideo, useRelated } from '@/hooks/useVideos';
import { useWatchTracker } from '@/hooks/useWatchTracker';
import { useHistory } from '@/hooks/useLibrary';

function WatchBody({ video }) {
  const related = useRelated(video.id);
  const tracker = useWatchTracker(video);
  const { progressOf } = useHistory();
  const items = related.data?.items || [];

  return (
    <Page wide>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div>
          <VideoPlayer key={video.id} video={video} active onProgress={tracker.onProgress} onEnded={tracker.onEnded} />
          <div className="mt-4 flex flex-col gap-4">
            <VideoMetadata video={video} titleAs="h1" clampDescription={false} />
            <VideoActions video={video} />
          </div>
        </div>
        <aside aria-label="Up next">
          <h2 className="mb-4 font-display text-lg font-semibold">Up Next</h2>
          {related.isPending && <ResultSkeleton count={4} />}
          {related.isError && <ErrorState title="Could not load suggestions" description="Something went wrong." onRetry={() => related.refetch()} />}
          <div className="space-y-4">{items.slice(0, 5).map((v) => <SearchResultCard key={v.id} video={v} compact progress={progressOf(v)} />)}</div>
        </aside>
      </div>
      {items.length > 5 && (
        <Section title="Related Lessons" className="mt-12">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {items.slice(5).map((v) => (
              <Link key={v.id} to={'/watch/' + v.id} className="group block">
                <Thumbnail video={v} progress={progressOf(v)} />
                <h3 className="mt-2 line-clamp-2 text-sm font-semibold group-hover:text-accent">{v.title}</h3>
                <p className="text-xs text-muted">{v.creator.name}</p>
              </Link>
            ))}
          </div>
        </Section>
      )}
    </Page>
  );
}

export default function Watch() {
  const { id } = useParams();
  const video = useVideo(id);
  if (video.isPending) return <Page wide><Skeleton className="aspect-video w-full max-w-4xl rounded-xl" /><Skeleton className="mt-4 h-7 w-2/3" /></Page>;
  if (video.error?.status === 404) return <EmptyState icon={VideoOff} title="Lesson not found" description="This lesson may have been removed." action={<Button as={Link} to="/" variant="primary">Back to feed</Button>} />;
  if (video.isError) return <ErrorState onRetry={() => video.refetch()} />;
  return <WatchBody key={video.data.id} video={video.data} />;
}
