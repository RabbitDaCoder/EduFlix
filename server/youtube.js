// Server-side YouTube Data API v3 client. The key never leaves this process.
const BASE = 'https://www.googleapis.com/youtube/v3';

export class YouTubeError extends Error {
  constructor(message, status, reason) {
    super(message);
    this.status = status;
    this.reason = reason;
  }
}

export const hasKey = () => !!process.env.YOUTUBE_API_KEY;

// Quota units used this process (search = 100, list calls = 1)
export const quota = { used: 0 };

async function call(path, params, cost) {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) throw new YouTubeError('YOUTUBE_API_KEY is not set', 500, 'noKey');
  const url = new URL(BASE + path);
  Object.entries(params).forEach(([k, v]) => v !== undefined && url.searchParams.set(k, String(v)));
  url.searchParams.set('key', key);
  const res = await fetch(url);
  quota.used += cost;
  if (!res.ok) {
    let reason = 'unknown';
    let message = 'YouTube API error ' + res.status;
    try {
      const body = await res.json();
      reason = body.error?.errors?.[0]?.reason || reason;
      message = body.error?.message || message;
    } catch { /* non-JSON error */ }
    throw new YouTubeError(message, res.status, reason);
  }
  return res.json();
}

export const search = (q, { pageToken, maxResults = 25 } = {}) =>
  call('/search', { part: 'snippet', type: 'video', q, maxResults, videoEmbeddable: 'true', safeSearch: 'strict', relevanceLanguage: 'en', pageToken }, 100);

export const videos = (ids) =>
  call('/videos', { part: 'snippet,contentDetails,status,statistics', id: ids.join(','), maxResults: 50 }, 1);

export const channels = (ids) =>
  call('/channels', { part: 'snippet,statistics', id: ids.join(','), maxResults: 50 }, 1);

// ISO 8601 duration (PT1H2M3S) -> seconds
export function parseDuration(iso = '') {
  const m = /^P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/.exec(iso);
  if (!m) return 0;
  return (+m[1] || 0) * 86400 + (+m[2] || 0) * 3600 + (+m[3] || 0) * 60 + (+m[4] || 0);
}

export const chunk = (arr, n) => Array.from({ length: Math.ceil(arr.length / n) }, (_, i) => arr.slice(i * n, i * n + n));
