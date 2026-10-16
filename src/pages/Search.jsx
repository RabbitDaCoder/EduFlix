import { useSearchParams } from 'react-router-dom';
import { SearchX, Search as SearchIcon } from 'lucide-react';
import Page from '@/components/ui/Page';
import SearchBar from '@/components/search/SearchBar';
import SearchFilters from '@/components/search/SearchFilters';
import SearchResultCard from '@/components/search/SearchResultCard';
import CreatorCard from '@/components/discover/CreatorCard';
import LoadMore from '@/components/feed/LoadMore';
import EmptyState from '@/components/ui/EmptyState';
import ErrorState from '@/components/ui/ErrorState';
import { ResultSkeleton } from '@/components/ui/Skeleton';
import { useSearch } from '@/hooks/useSearch';

export default function Search() {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') || '';
  const type = params.get('type') || undefined;
  const level = params.get('level') || undefined;
  const length = params.get('length') || undefined;
  const search = useSearch({ q, type, level, length });

  const onChange = (patch) => {
    const next = new URLSearchParams(params);
    Object.entries(patch).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)));
    setParams(next, { replace: true });
  };

  return (
    <Page title={q ? 'Results for "' + q + '"' : 'Search lessons, topics, creators...'}>
      <SearchBar className="mb-5 md:hidden" autoFocus={!q} />
      {!q ? (
        <EmptyState icon={SearchIcon} title="What do you want to learn?" description="Try python, calculus, or neural networks." />
      ) : (
        <>
          <SearchFilters type={type} level={level} length={length} onChange={onChange} />
          <div className="mt-6">
            {search.isPending && <ResultSkeleton />}
            {search.isError && <ErrorState title="Search failed" description="Something went wrong while searching." onRetry={() => search.refetch()} />}
            {search.isSuccess && search.items.length === 0 && search.creators.length === 0 && (
              <EmptyState icon={SearchX} title="No lessons found" description="Try searching for another topic." />
            )}
            {search.isSuccess && search.creators.length > 0 && (
              <div className="no-scrollbar mb-8 flex gap-3 overflow-x-auto pb-2">{search.creators.map((c) => <CreatorCard key={c.id} creator={c} />)}</div>
            )}
            {search.items.length > 0 && (
              <div className="space-y-5">{search.items.map((v) => <SearchResultCard key={v.id} video={v} />)}</div>
            )}
            {search.isSuccess && search.items.length > 0 && (
              <LoadMore hasNextPage={search.hasNextPage} isFetchingNextPage={search.isFetchingNextPage} isError={search.isFetchNextPageError} fetchNextPage={search.fetchNextPage} />
            )}
          </div>
        </>
      )}
    </Page>
  );
}
