import { Link } from 'react-router-dom';
import { Route } from 'lucide-react';
import Page, { Section } from '@/components/ui/Page';
import SearchBar from '@/components/search/SearchBar';
import SubjectCard from '@/components/discover/SubjectCard';
import CreatorCard from '@/components/discover/CreatorCard';
import TrendingCarousel from '@/components/discover/TrendingCarousel';
import ErrorState from '@/components/ui/ErrorState';
import { Skeleton, CardGridSkeleton } from '@/components/ui/Skeleton';
import { useTrending, useCreators } from '@/hooks/useVideos';
import { SUBJECTS } from '@/lib/subjects';
import { FEATURED_PATH_ID } from '@/lib/config';

export default function Discover() {
  const trending = useTrending();
  const creators = useCreators();
  return (
    <Page title="Discover something worth learning." wide>
      <SearchBar className="mb-8 max-w-2xl" />
      <Section title="Subjects">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">{SUBJECTS.map((s) => <SubjectCard key={s.slug} subject={s} />)}</div>
      </Section>

      <Section title="Trending Lessons">
        {trending.isPending && <div className="flex gap-4 overflow-hidden">{[0, 1, 2, 3].map((i) => <div key={i} className="w-72 shrink-0"><Skeleton className="aspect-video rounded-lg" /><Skeleton className="mt-2 h-4 w-3/4" /></div>)}</div>}
        {trending.isError && <ErrorState onRetry={() => trending.refetch()} />}
        {trending.data && <TrendingCarousel videos={trending.data.items} />}
      </Section>

      <Section title="Learning Paths">
        <Link to={`/paths/${FEATURED_PATH_ID}`} className="flex items-center gap-4 rounded-xl border border-line bg-surface p-4 transition hover:bg-surface-2">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/15 text-accent"><Route size={24} /></span>
          <span><span className="block font-display font-semibold">Python Fundamentals</span><span className="text-sm text-muted">A guided path from your first line of code to real programs.</span></span>
        </Link>
      </Section>

      <Section title="Popular Creators">
        {creators.isPending && <CardGridSkeleton count={5} className="h-40" />}
        {creators.isError && <ErrorState onRetry={() => creators.refetch()} />}
        {creators.data && <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-2 md:-mx-6 md:px-6">{creators.data.items.map((c) => <CreatorCard key={c.id} creator={c} />)}</div>}
      </Section>
    </Page>
  );
}
