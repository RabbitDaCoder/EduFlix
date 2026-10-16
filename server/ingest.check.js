// Fake YouTube API to exercise the whole ingestion pipeline offline
process.env.YOUTUBE_API_KEY = 'fake-test-key';
const mk = (id, title, ch, dur, extra = {}) => ({
  id, snippet: { title, description: 'In this video we will learn and explain the lesson. Chapters and examples. ' + title, channelId: ch, channelTitle: ch === 'UC1' ? '3Blue1Brown' : 'Random Guy', publishedAt: '2024-01-01T00:00:00Z', thumbnails: { high: { url: 'x' } }, tags: [] },
  contentDetails: { duration: dur }, status: { embeddable: true, privacyStatus: 'public', uploadStatus: 'processed', ...extra }, statistics: { viewCount: '1000' },
});
const VIDS = [
  mk('good1', 'Calculus Derivatives Explained', 'UC1', 'PT15M'),
  mk('prank1', 'Funny Prank Compilation Gone Wrong', 'UC2', 'PT10M'),
  mk('noembed', 'Python Programming Tutorial', 'UC1', 'PT20M', { embeddable: false }),
  mk('short1', 'Python Programming Tutorial Part 2', 'UC1', 'PT30S'),
];
globalThis.fetch = async (url) => {
  const u = new URL(url);
  const p = u.pathname;
  const body = p.endsWith('/search') ? { items: [...VIDS, VIDS[0]].map((v) => ({ id: { videoId: v.id } })) }
    : p.endsWith('/videos') ? { items: VIDS.filter((v) => u.searchParams.get('id').split(',').includes(v.id)) }
    : { items: [{ id: 'UC1', snippet: { title: '3Blue1Brown', description: 'math' }, statistics: { subscriberCount: '6000000' } }, { id: 'UC2', snippet: { title: 'Random Guy', description: '' }, statistics: { subscriberCount: '10' } }] };
  return new Response(JSON.stringify(body), { status: 200 });
};
const { load, getState } = await import('./store.js');
const { ingest } = await import('./ingest.js');
load();
const r1 = await ingest({ maxQueries: 1 });
console.log(JSON.stringify(r1));
const r2 = await ingest({ maxQueries: 1 });
console.log('second run new:', r2.new, '(duplicates must be 0)');
console.log('stored:', Object.keys(getState().videos));
