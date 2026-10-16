import { useInfiniteQuery } from '@tanstack/react-query';
import { searchLessons } from '@/api/search';

export function useSearch({ q, type, level, length }) {
  const query = useInfiniteQuery({
    queryKey: ['search', q, { type, level, length }],
    queryFn: ({ pageParam, signal }) => searchLessons({ q, type, level, length, cursor: pageParam }, { signal }),
    initialPageParam: undefined,
    getNextPageParam: (last) => last.nextCursor ?? undefined,
    enabled: !!q?.trim(),
  });
  const pages = query.data?.pages || [];
  return {
    ...query,
    items: pages.flatMap((p) => p.items),
    creators: pages[0]?.creators || [],
  };
}
