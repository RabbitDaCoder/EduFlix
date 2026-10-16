import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import {
  fetchVideos, fetchTrending, fetchVideo, fetchRelated,
  fetchCreators, fetchCreator, fetchCreatorVideos, fetchPath,
} from '@/api/videos';

const nextCursor = (last) => last.nextCursor ?? undefined;
const flatten = (data) => {
  const seen = new Set();
  const items = [];
  (data?.pages || []).forEach((p) => p.items.forEach((v) => {
    if (!seen.has(v.id)) { seen.add(v.id); items.push(v); }
  }));
  return items;
};

// Main infinite feed. Key: ['videos', subject, filters]
export function useVideoFeed({ subject, level, topic, sort } = {}) {
  const query = useInfiniteQuery({
    queryKey: ['videos', subject || 'all', { level, topic, sort }],
    queryFn: ({ pageParam, signal }) => fetchVideos({ subject, level, topic, sort, cursor: pageParam }, { signal }),
    initialPageParam: undefined,
    getNextPageParam: nextCursor,
  });
  return { ...query, items: flatten(query.data) };
}

export const useTrending = () =>
  useQuery({ queryKey: ['videos', 'trending'], queryFn: ({ signal }) => fetchTrending({ signal }), staleTime: 5 * 60_000 });

export const useVideo = (id) =>
  useQuery({ queryKey: ['video', id], queryFn: ({ signal }) => fetchVideo(id, { signal }), enabled: !!id, retry: (n, e) => e?.status !== 404 && n < 2 });

export const useRelated = (id) =>
  useQuery({ queryKey: ['video', id, 'related'], queryFn: ({ signal }) => fetchRelated(id, { signal }), enabled: !!id });

export const useCreators = () =>
  useQuery({ queryKey: ['creators'], queryFn: ({ signal }) => fetchCreators({ signal }), staleTime: 5 * 60_000 });

export const useCreator = (id) =>
  useQuery({ queryKey: ['creator', id], queryFn: ({ signal }) => fetchCreator(id, { signal }), enabled: !!id, retry: (n, e) => e?.status !== 404 && n < 2 });

export function useCreatorVideos(id, sort) {
  const query = useInfiniteQuery({
    queryKey: ['creator', id, 'videos', sort],
    queryFn: ({ pageParam, signal }) => fetchCreatorVideos(id, { sort, cursor: pageParam }, { signal }),
    initialPageParam: undefined,
    getNextPageParam: nextCursor,
    enabled: !!id,
  });
  return { ...query, items: flatten(query.data) };
}

export const usePath = (id) =>
  useQuery({ queryKey: ['path', id], queryFn: ({ signal }) => fetchPath(id, { signal }), enabled: !!id, retry: (n, e) => e?.status !== 404 && n < 2 });
