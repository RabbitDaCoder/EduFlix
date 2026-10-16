import { BASE_VIDEOS, CREATORS, PATHS } from './data';

const delay = (ms = 350) => new Promise((r) => setTimeout(r, ms));

// Long deterministic feed: base list in a mixed order, repeated with unique ids.
const ORDER = [0, 1, 2, 4, 6, 3, 9, 5, 10, 8, 11, 7, 12, 13, 14, 15, 16, 17, 18, 19, 20];
const ROUNDS = 3;
const FEED = [];
for (let r = 0; r < ROUNDS; r++) {
  ORDER.forEach((idx) => {
    const v = BASE_VIDEOS[idx % BASE_VIDEOS.length];
    FEED.push(r === 0 ? v : { ...v, id: `${v.id}~${r}` });
  });
}

const slugify = (s) => s.toLowerCase().replace(/\s+/g, '-');
const baseId = (id) => String(id).split('~')[0];

function page(list, { cursor, limit = 8 }) {
  const start = Number(cursor) || 0;
  const end = start + limit;
  return { items: list.slice(start, end), nextCursor: end < list.length ? String(end) : null };
}

function filterVideos(list, { subject, level, topic, sort }) {
  let out = list;
  if (subject) out = out.filter((v) => slugify(v.subject) === subject);
  if (topic) out = out.filter((v) => v.topic.toLowerCase() === topic.toLowerCase());
  if (level) out = out.filter((v) => v.level.toLowerCase() === level.toLowerCase());
  if (sort === 'popular') out = [...out].sort((a, b) => b.views - a.views);
  return out;
}

const notFound = (msg) => Object.assign(new Error(msg), { status: 404 });

export const mockApi = {
  async getVideos(params) {
    await delay();
    return page(filterVideos(FEED, params), params);
  },
  async getTrending() {
    await delay();
    return { items: [...BASE_VIDEOS].sort((a, b) => b.views - a.views).slice(0, 10) };
  },
  async getVideo(id) {
    await delay(200);
    const v = BASE_VIDEOS.find((x) => x.id === baseId(id));
    if (!v) throw notFound('Video not found');
    return v;
  },
  async getRelated(id) {
    await delay();
    const v = BASE_VIDEOS.find((x) => x.id === baseId(id));
    const items = BASE_VIDEOS.filter((x) => x.id !== baseId(id))
      .map((x) => ({
        x,
        s: (v && x.subject === v.subject ? 2 : 0) + (v && x.topic === v.topic ? 2 : 0) + (v && x.creator.id === v.creator.id ? 1 : 0),
      }))
      .sort((a, b) => b.s - a.s || b.x.views - a.x.views)
      .slice(0, 10)
      .map((o) => o.x);
    return { items };
  },
  async search({ q = '', type, level, length, cursor, limit = 8 }) {
    await delay(300);
    const tokens = q.toLowerCase().split(/\s+/).filter(Boolean);
    const hay = (v) => `${v.title} ${v.topic} ${v.subject} ${v.creator.name} ${v.description}`.toLowerCase();
    let items = BASE_VIDEOS.filter((v) => tokens.every((t) => hay(v).includes(t)));
    if (level) items = items.filter((v) => v.level.toLowerCase() === level.toLowerCase());
    if (length === 'short') items = items.filter((v) => v.duration < 900);
    if (length === 'long') items = items.filter((v) => v.duration >= 1800);
    if (type === 'tutorials') items = items.filter((v) => /tutorial|learn|how|beginners/i.test(v.title));
    if (type === 'courses') items = items.filter((v) => v.duration >= 3600 || /course/i.test(v.title));
    if (type === 'lessons') items = items.filter((v) => v.duration < 3600 && !/course/i.test(v.title));
    const creators = CREATORS.filter((c) => tokens.every((t) => `${c.name} ${c.subjects.join(' ')}`.toLowerCase().includes(t)));
    if (type === 'creators') return { items: [], nextCursor: null, creators };
    return { ...page(items, { cursor, limit }), creators: cursor ? [] : creators };
  },
  async getCreators() {
    await delay(250);
    return { items: [...CREATORS].sort((a, b) => b.followers - a.followers) };
  },
  async getCreator(id) {
    await delay(200);
    const c = CREATORS.find((x) => x.id === id);
    if (!c) throw notFound('Creator not found');
    return c;
  },
  async getCreatorVideos(id, { sort, cursor, limit = 8 }) {
    await delay();
    let list = BASE_VIDEOS.filter((v) => v.creator.id === id);
    list = sort === 'popular'
      ? [...list].sort((a, b) => b.views - a.views)
      : [...list].sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));
    return page(list, { cursor, limit });
  },
  async getPath(id) {
    await delay(250);
    const p = PATHS.find((x) => x.id === id);
    if (!p) throw notFound('Learning path not found');
    const lessons = p.lessonIds.map((vid, i) => {
      const src = BASE_VIDEOS.find((v) => v.id === vid);
      return { ...src, id: `${vid}~path${i}`, title: p.lessonTitles[i], sourceTitle: src.title };
    });
    return { id: p.id, title: p.title, description: p.description, subject: p.subject, lessons };
  },
};
