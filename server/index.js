import http from 'node:http';
import { existsSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { load, getState } from './store.js';
import { ingest, isRunning } from './ingest.js';
import { hasKey, quota } from './youtube.js';
import { isApprovedChannel } from './classify.js';
import { slugify } from './taxonomy.js';

// .env is shared with Vite, but only VITE_* vars reach the browser bundle. YOUTUBE_API_KEY stays here.
if (existsSync('.env')) process.loadEnvFile('.env');
const PORT = Number(process.env.API_PORT) || 8787;
load();

const hue = (s) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 11) % 360;
const state = () => getState();

function creatorOf(channelId) {
  const ch = state().channels[channelId];
  if (!ch) return null;
  const vids = Object.values(state().videos).filter((v) => v.channelId === channelId);
  const counts = {};
  vids.forEach((v) => { counts[v.subject] = (counts[v.subject] || 0) + 1; });
  return {
    id: ch.id, name: ch.name, handle: '@' + ch.name.replace(/\s+/g, '').toLowerCase(), followers: ch.subscribers,
    verified: isApprovedChannel(ch.name) || ch.subscribers >= 100000, hue: hue(ch.id), bio: ch.bio || '',
    subjects: Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([s]) => s).slice(0, 4),
  };
}

const toApi = (v) => {
  const c = creatorOf(v.channelId) || { id: v.channelId, name: v.channelName, verified: false, hue: hue(v.channelId) };
  return { ...v, creator: { id: c.id, name: c.name, hue: c.hue, verified: c.verified } };
};

const all = () => Object.values(state().videos).filter((v) => v.status === 'approved');
const byRank = (a, b) => b.rank - a.rank;

function page(list, q) {
  const limit = Math.min(Math.max(Number(q.get('limit')) || 8, 1), 24);
  const start = Math.max(Number(q.get('cursor')) || 0, 0);
  const end = start + limit;
  return { items: list.slice(start, end).map(toApi), nextCursor: end < list.length ? String(end) : null };
}

function filterVideos(q) {
  let list = all();
  const subject = q.get('subject');
  if (subject) list = list.filter((v) => slugify(v.subject) === subject);
  if (q.get('topic')) list = list.filter((v) => v.topic.toLowerCase() === q.get('topic').toLowerCase());
  if (q.get('level')) list = list.filter((v) => v.level.toLowerCase() === q.get('level').toLowerCase());
  return q.get('sort') === 'popular' ? list.sort((a, b) => b.views - a.views) : list.sort(byRank);
}

function search(q) {
  const tokens = (q.get('q') || '').toLowerCase().split(/\s+/).filter(Boolean);
  const type = q.get('type');
  const creators = Object.keys(state().channels).map(creatorOf).filter((c) => c && c.subjects.length && tokens.length && tokens.every((t) => c.name.toLowerCase().includes(t)));
  if (type === 'creators') return { items: [], nextCursor: null, creators };
  const hay = (v) => (v.title + ' ' + v.topic + ' ' + v.subject + ' ' + v.channelName + ' ' + v.description.slice(0, 400)).toLowerCase();
  let list = all().filter((v) => tokens.length && tokens.every((t) => hay(v).includes(t)));
  if (q.get('level')) list = list.filter((v) => v.level.toLowerCase() === q.get('level').toLowerCase());
  if (q.get('length') === 'short') list = list.filter((v) => v.duration < 900);
  if (q.get('length') === 'long') list = list.filter((v) => v.duration >= 1800);
  if (type === 'tutorials') list = list.filter((v) => /tutorial|learn|how to|beginners/i.test(v.title));
  if (type === 'courses') list = list.filter((v) => v.duration >= 3600 || /course/i.test(v.title));
  if (type === 'lessons') list = list.filter((v) => v.duration < 3600 && !/course/i.test(v.title));
  // Title matches first, then rank
  const titleHit = (v) => (tokens.every((t) => v.title.toLowerCase().includes(t)) ? 1 : 0);
  list.sort((a, b) => titleHit(b) - titleHit(a) || byRank(a, b));
  const cursor = q.get('cursor');
  return { ...page(list, q), creators: cursor ? [] : creators };
}

const json = (res, code, body) => {
  res.writeHead(code, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(body));
};

const isLocal = (req) => ['127.0.0.1', '::1', '::ffff:127.0.0.1'].includes(req.socket.remoteAddress);

async function route(req, res) {
  const url = new URL(req.url, 'http://x');
  const p = url.pathname;
  const q = url.searchParams;
  const m = (re) => re.exec(p);
  let r;

  if (p === '/api/health') {
    return json(res, 200, { ok: true, youtubeKeyConfigured: hasKey(), videos: all().length, ingesting: isRunning(), lastIngest: state().lastIngest, quotaUsedThisProcess: quota.used });
  }
  if (p === '/api/admin/ingest' && req.method === 'POST') {
    const token = process.env.ADMIN_TOKEN;
    if (!(token ? req.headers['x-admin-token'] === token : isLocal(req))) return json(res, 403, { error: 'Forbidden' });
    return json(res, 200, await ingest({ maxQueries: Number(q.get('maxQueries')) || 6 }));
  }
  if (req.method !== 'GET') return json(res, 405, { error: 'Method not allowed' });

  if (p === '/api/videos') return json(res, 200, page(filterVideos(q), q));
  if (p === '/api/videos/trending') return json(res, 200, { items: all().sort((a, b) => b.views - a.views).slice(0, 10).map(toApi) });
  if ((r = m(/^\/api\/videos\/([\w-]+)\/related$/))) {
    const v = state().videos[r[1]];
    const score = (x) => (v && x.subject === v.subject ? 2 : 0) + (v && x.topic === v.topic ? 2 : 0) + (v && x.channelId === v.channelId ? 1 : 0);
    const items = all().filter((x) => x.id !== r[1]).sort((a, b) => score(b) - score(a) || byRank(a, b)).slice(0, 10).map(toApi);
    return json(res, 200, { items });
  }
  if ((r = m(/^\/api\/videos\/([\w-]+)$/))) {
    const v = state().videos[r[1]];
    return v && v.status === 'approved' ? json(res, 200, toApi(v)) : json(res, 404, { error: 'Video not found' });
  }
  if (p === '/api/search') return json(res, 200, search(q));
  if (p === '/api/creators') {
    const items = Object.keys(state().channels).map(creatorOf).filter((c) => c && c.subjects.length);
    return json(res, 200, { items: items.sort((a, b) => b.followers - a.followers).slice(0, 12) });
  }
  if ((r = m(/^\/api\/creators\/([\w-]+)\/videos$/))) {
    const list = all().filter((v) => v.channelId === r[1]);
    list.sort(q.get('sort') === 'popular' ? (a, b) => b.views - a.views : (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
    return json(res, 200, page(list, q));
  }
  if ((r = m(/^\/api\/creators\/([\w-]+)$/))) {
    const c = creatorOf(r[1]);
    return c ? json(res, 200, c) : json(res, 404, { error: 'Creator not found' });
  }
  return json(res, 404, { error: 'Not found' });
}

// Shared by the local server below and the Vercel function in api/
export function handle(req, res) {
  return route(req, res).catch((e) => { console.error(e); json(res, 500, { error: 'Internal error' }); });
}

// Only listen when run directly (npm run api), not when imported by Vercel
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  http.createServer(handle).listen(PORT, () => {
    console.log('EduFlix API on http://localhost:' + PORT + ' (YouTube key ' + (hasKey() ? 'loaded' : 'MISSING') + ', ' + all().length + ' videos stored)');
    if (hasKey() && all().length === 0) {
      console.log('No videos stored yet, running first ingestion...');
      ingest().then((s) => console.log('Ingestion done:', JSON.stringify(s)));
    }
  });

  // Refresh periodically (default every 12h): 6 queries x 100 units per run
  if (hasKey()) setInterval(() => ingest().catch(() => {}), (Number(process.env.INGEST_HOURS) || 12) * 3600000).unref();
}
