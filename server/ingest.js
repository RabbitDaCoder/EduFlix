import * as yt from './youtube.js';
import { classify, THRESHOLDS } from './classify.js';
import { DISCOVERY_QUERIES } from './taxonomy.js';
import { getState, save } from './store.js';

let running = false;
export const isRunning = () => running;

const hash = (s) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);

// Freshness 0-100 (decays over ~2 years) + engagement 0-100 (log views) + stable variety jitter
export function rank(v) {
  const ageDays = Math.max(0, (Date.now() - new Date(v.publishedAt).getTime()) / 86400000);
  const freshness = 100 * Math.exp(-ageDays / 730);
  const engagement = Math.min(100, Math.log10((v.views || 0) + 1) * 14);
  const variety = hash(v.youtubeId) % 12;
  return v.educationalScore * 0.5 + (v.creatorQuality || 0) * 0.2 + freshness * 0.1 + engagement * 0.15 + variety * 0.4;
}

function toVideo(item, ch, result) {
  const sn = item.snippet;
  return {
    id: item.id,
    youtubeId: item.id,
    title: sn.title,
    description: sn.description || '',
    thumbnail: sn.thumbnails?.high?.url || sn.thumbnails?.medium?.url || 'https://i.ytimg.com/vi/' + item.id + '/hqdefault.jpg',
    subject: result.subject,
    topic: result.topic,
    level: result.level,
    duration: yt.parseDuration(item.contentDetails?.duration),
    views: Number(item.statistics?.viewCount || 0),
    likes: Number(item.statistics?.likeCount || 0),
    publishedAt: sn.publishedAt,
    educationalScore: result.score,
    creatorQuality: result.approvedChannel ? 100 : ch ? Math.min(100, Math.log10(ch.subscribers + 1) * 14) : 0,
    channelId: sn.channelId,
    channelName: sn.channelTitle,
    status: 'approved',
    addedAt: Date.now(),
  };
}

// Embeddable, public, processed, not age-restricted
const playable = (item) =>
  item.status?.embeddable && item.status?.privacyStatus === 'public' && item.status?.uploadStatus === 'processed' &&
  item.contentDetails?.contentRating?.ytRating !== 'ytAgeRestricted';

export async function ingest({ maxQueries = 6, queries } = {}) {
  if (running) return { skipped: 'already running' };
  if (!yt.hasKey()) return { skipped: 'YOUTUBE_API_KEY is not set' };
  running = true;
  const state = getState();
  const summary = { queries: [], found: 0, new: 0, approved: 0, rejected: 0, unplayable: 0, quotaUsed: 0, error: null };
  const startQuota = yt.quota.used;
  try {
    // Least-recently-run queries first, so repeated runs rotate through the whole list
    const picked = queries || [...DISCOVERY_QUERIES].sort((a, b) => (state.queryState[a]?.lastRun || 0) - (state.queryState[b]?.lastRun || 0)).slice(0, maxQueries);
    const ids = new Set();
    for (const q of picked) {
      const res = await yt.search(q);
      state.queryState[q] = { lastRun: Date.now() };
      summary.queries.push(q);
      (res.items || []).forEach((it) => it.id?.videoId && ids.add(it.id.videoId));
    }
    summary.found = ids.size;

    // Skip anything already stored or previously rejected: saves quota and prevents duplicates
    const fresh = [...ids].filter((id) => !state.videos[id] && !state.rejected[id]);
    summary.new = fresh.length;
    const items = [];
    for (const group of yt.chunk(fresh, 50)) items.push(...((await yt.videos(group)).items || []));

    const chIds = [...new Set(items.map((i) => i.snippet.channelId))].filter((id) => !state.channels[id]);
    for (const group of yt.chunk(chIds, 50)) {
      for (const c of (await yt.channels(group)).items || []) {
        state.channels[c.id] = { id: c.id, name: c.snippet.title, subscribers: Number(c.statistics?.subscriberCount || 0), bio: (c.snippet.description || '').slice(0, 220) };
      }
    }

    for (const item of items) {
      if (!playable(item)) { state.rejected[item.id] = 1; summary.unplayable++; continue; }
      const ch = state.channels[item.snippet.channelId];
      const dur = yt.parseDuration(item.contentDetails?.duration);
      const result = classify({
        title: item.snippet.title, description: item.snippet.description, tags: item.snippet.tags,
        channelName: item.snippet.channelTitle, subscribers: ch?.subscribers, duration: dur, embeddable: true,
      });
      if (!result.isEducational || dur < 120) { state.rejected[item.id] = 1; summary.rejected++; continue; }
      const v = toVideo(item, ch, result);
      v.rank = rank(v);
      state.videos[v.id] = v;
      summary.approved++;
    }
    state.lastIngest = { at: Date.now(), threshold: THRESHOLDS.approve, ...summary };
  } catch (e) {
    summary.error = (e.reason ? e.reason + ': ' : '') + e.message;
    console.error('Ingestion failed:', summary.error);
  } finally {
    summary.quotaUsed = yt.quota.used - startQuota;
    running = false;
    save();
  }
  return summary;
}
