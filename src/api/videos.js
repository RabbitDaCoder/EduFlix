import { request } from './client';
import { USE_MOCK_API, PAGE_SIZE } from '@/lib/config';
import { mockApi } from './mock/handlers';

// The EduFlix API returns educational videos only; the frontend never filters or searches YouTube.
const enc = encodeURIComponent;

export const fetchVideos = ({ subject, level, topic, sort, cursor, limit = PAGE_SIZE } = {}, opts) =>
  USE_MOCK_API
    ? mockApi.getVideos({ subject, level, topic, sort, cursor, limit })
    : request('/api/videos', { subject, level, topic, sort, cursor, limit }, opts);

export const fetchTrending = (opts) =>
  USE_MOCK_API ? mockApi.getTrending() : request('/api/videos/trending', {}, opts);

export const fetchVideo = (id, opts) =>
  USE_MOCK_API ? mockApi.getVideo(id) : request(`/api/videos/${enc(id)}`, {}, opts);

export const fetchRelated = (id, opts) =>
  USE_MOCK_API ? mockApi.getRelated(id) : request(`/api/videos/${enc(id)}/related`, {}, opts);

export const fetchCreators = (opts) =>
  USE_MOCK_API ? mockApi.getCreators() : request('/api/creators', {}, opts);

export const fetchCreator = (id, opts) =>
  USE_MOCK_API ? mockApi.getCreator(id) : request(`/api/creators/${enc(id)}`, {}, opts);

export const fetchCreatorVideos = (id, { sort, cursor, limit = PAGE_SIZE } = {}, opts) =>
  USE_MOCK_API
    ? mockApi.getCreatorVideos(id, { sort, cursor, limit })
    : request(`/api/creators/${enc(id)}/videos`, { sort, cursor, limit }, opts);

export const fetchPath = (id, opts) =>
  USE_MOCK_API ? mockApi.getPath(id) : request(`/api/paths/${enc(id)}`, {}, opts);
