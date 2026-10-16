import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { BadgeCheck, UserX, Route } from 'lucide-react';
import Page, { Section } from '@/components/ui/Page';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import ErrorState from '@/components/ui/ErrorState';
import EmptyState from '@/components/ui/EmptyState';
import { CreatorSkeleton, ResultSkeleton } from '@/components/ui/Skeleton';
import SearchResultCard from '@/components/search/SearchResultCard';
import { Chip } from '@/components/search/SearchFilters';
import LoadMore from '@/components/feed/LoadMore';
import { useCreator, useCreatorVideos } from '@/hooks/useVideos';
import { useFollows } from '@/hooks/useLibrary';
import { formatCount } from '@/lib/utils';
import { FEATURED_PATH_ID } from '@/lib/config';

export default function Creator() {
  const { id } = useParams();
  const [sort, setSort] = useState('latest');
  const creator = useCreator(id);
  const videos = useCreatorVideos(id, sort);
  const { isFollowing, toggle } = useFollows();

  if (creator.isPending) return <Page><CreatorSkeleton /></Page>;
  if (creator.error?.status === 404) return <EmptyState icon={UserX} title="Creator not found" description="This creator may have been removed." action={<Button as={Link} to="/discover" variant="primary">Back to Discover</Button>} />;
  if (creator.isError) return <ErrorState title="Could not load creator" description="Something went wrong while loading this page." onRetry={() => creator.refetch()} />;

  const c = creator.data;
  const following = isFollowing(c.id);
  const followers = c.followers + (following ? 1 : 0);
  const hasPath = c.subjects?.includes('Programming');

  return (
    <Page>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <Avatar name={c.name} hue={c.hue} size="xl" />
        <div className="min-w-0 flex-1">
          <h1 className="flex items-center gap-2 font-display text-2xl font-bold md:text-3xl">{c.name}{c.verified && <BadgeCheck size={22} className="text-accent" aria-label="Verified" />}</h1>
          <p className="mt-0.5 text-sm text-muted">{c.verified ? 'Verified educational creator' : 'Creator'} · {formatCount(followers)} followers</p>
          <p className="mt-3 max-w-xl text-sm">{c.bio}</p>
          <div className="mt-3 flex flex-wrap gap-2">{c.subjects?.map((s) => <Badge key={s}>{s}</Badge>)}</div>
        </div>
        <Button variant={following ? 'secondary' : 'primary'} onClick={() => toggle(c.id)} aria-pressed={following}>{following ? 'Following' : 'Follow'}</Button>
      </div>

      {hasPath && (
        <Section title="Playlists" className="mt-10">
          <Link to={'/paths/' + FEATURED_PATH_ID} className="flex items-center gap-4 rounded-xl border border-line bg-surface p-4 hover:bg-surface-2">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/15 text-accent"><Route size={24} /></span>
            <span><span className="block font-display font-semibold">Python Fundamentals</span><span className="text-sm text-muted">5 lessons · Beginner learning path</span></span>
          </Link>
        </Section>
      )}

      <Section title={sort === 'latest' ? 'Latest Lessons' : 'Popular Lessons'} className="mt-10" action={
        <div className="flex gap-2"><Chip active={sort === 'latest'} onClick={() => setSort('latest')}>Latest</Chip><Chip active={sort === 'popular'} onClick={() => setSort('popular')}>Popular</Chip></div>
      }>
        {videos.isPending && <ResultSkeleton />}
        {videos.isError && <ErrorState onRetry={() => videos.refetch()} />}
        {videos.isSuccess && videos.items.length === 0 && <EmptyState title="No lessons yet" description="This creator has not published any lessons here." />}
        <div className="space-y-5">{videos.items.map((v) => <SearchResultCard key={v.id} video={v} />)}</div>
        {videos.isSuccess && videos.items.length > 0 && (
          <LoadMore hasNextPage={videos.hasNextPage} isFetchingNextPage={videos.isFetchingNextPage} isError={videos.isFetchNextPageError} fetchNextPage={videos.fetchNextPage} />
        )}
      </Section>
    </Page>
  );
}
