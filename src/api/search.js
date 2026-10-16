import { request } from './client';
import { USE_MOCK_API, PAGE_SIZE } from '@/lib/config';
import { mockApi } from './mock/handlers';

// Resolves to { items, nextCursor, creators }
export const searchLessons = ({ q, type, level, length, cursor, limit = PAGE_SIZE }, opts) =>
  USE_MOCK_API
    ? mockApi.search({ q, type, level, length, cursor, limit })
    : request('/api/search', { q, type, level, length, cursor, limit }, opts);
