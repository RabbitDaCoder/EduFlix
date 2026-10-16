import { API_URL } from '@/lib/config';

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

// The only place that talks HTTP. Drops empty params so URLs stay clean.
export async function request(path, params = {}, { signal } = {}) {
  const url = new URL(`${API_URL}${path}`, window.location.origin);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '' && v !== 'all') url.searchParams.set(k, v);
  });
  const res = await fetch(url, { signal, headers: { Accept: 'application/json' } });
  if (!res.ok) throw new ApiError(`Request failed (${res.status})`, res.status);
  return res.json();
}
