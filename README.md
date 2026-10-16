# EduFlix

**Learn something new. Every scroll.**

A lightweight, JavaScript-only React frontend for an educational video discovery platform.
It consumes an existing EduFlix REST API that returns educational videos only. It never talks to YouTube search,
holds an API key, classifies, or re-hosts videos. Playback uses the YouTube IFrame Player API.

Stack: React, Vite, React Router, TanStack Query (`useInfiniteQuery`), Tailwind CSS v4, Lucide, IntersectionObserver.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
```

## Configuration (`.env`)

| Variable | Meaning |
| --- | --- |
| `VITE_API_URL` | Base URL of the EduFlix API (empty = same origin) |
| `VITE_USE_MOCK_API` | `true` = built-in mock data (default), `false` = real API |

## API contract

All list endpoints are cursor-paginated: `{ items, nextCursor }` (`nextCursor: null` at the end).

```
GET /api/videos?subject=&level=&topic=&sort=popular&cursor=&limit=
GET /api/videos/trending                -> { items }
GET /api/videos/:id                     -> video
GET /api/videos/:id/related             -> { items }
GET /api/search?q=&type=&level=&length=&cursor=   -> { items, nextCursor, creators }
GET /api/creators                       -> { items }
GET /api/creators/:id                   -> creator
GET /api/creators/:id/videos?sort=latest|popular&cursor=
GET /api/paths/:id                      -> { id, title, description, lessons: [video] }
```

Video: `{ id, youtubeId, title, description, thumbnail, subject, topic, level, duration, views,
creator: { id, name, hue, verified } }`.
Creator: `{ id, name, handle, followers, verified, bio, subjects }`.
Subject query values are slugs (`mathematics`, `computer-science`, ...).

## Structure

- `src/api/` - the only place that performs requests (`videos.js`, `search.js`, `client.js`) plus `mock/`
- `src/hooks/` - TanStack Query hooks and localStorage-backed library hooks (saved, liked, history, follows, path progress)
- `src/components/` - layout, video, feed, search, discover and ui building blocks
- `src/pages/` - Home, Discover, Subject, Search, Saved, History, Profile, Watch, Creator, Playlist

## Behaviour notes

- Feed: snap-scrolling list. IntersectionObserver picks the active item; only that item has a live YouTube player,
  neighbours render a card, everything else is an empty placeholder. Leaving the viewport destroys the player (pause).
- The next page is fetched when the viewer is within 3 items of the end or the sentinel approaches.
- Videos that fail with YouTube error 5/100/101/150 are hidden locally and skipped.
- Keyboard: `j`/`k` or arrow keys move between lessons.
- Saved, liked, history, follows, interests and learning-path progress live in localStorage (prototype only).
- Mock demo videos use real YouTube IDs; a few may go stale over time and fall back to a "Watch on YouTube" link.

## Using the YouTube API key (local testing)

The frontend never calls YouTube. A small Node server in `server/` holds the key, discovers videos with the
YouTube Data API v3, scores them for educational value, stores the approved ones in `server/.data/store.json`,
and serves the API this app consumes.

1. Put your key in `.env` (git-ignored): `YOUTUBE_API_KEY=your-key`
2. Switch the app to the real API in `.env`: `VITE_USE_MOCK_API=false`
3. `npm run dev:all` (API on :8787 + Vite on :5173; Vite proxies `/api`). On first start with an empty store
   the server runs one ingestion automatically (6 searches, about 600 quota units).
4. Check `http://localhost:5173/api/health` for `youtubeKeyConfigured`, `videos`, and `lastIngest`.

Other commands: `npm run api` (server only), `npm run ingest [maxQueries]` (one ingestion now),
`POST /api/admin/ingest` (localhost, or header `x-admin-token` matching `ADMIN_TOKEN`).

Quota: `search.list` costs 100 units, `videos.list`/`channels.list` 1 unit; the default daily quota is 10,000.
Only new videos are fetched and classified, rejected ids are remembered, and users never trigger YouTube calls.

Filtering (`server/classify.js`): deterministic score 0-100 (title relevance 25, description 20, educational
keywords 15, approved channel 20, subject match 10, duration 5, embeddable 5) minus weighted penalties for
reaction/prank/meme/compilation/gaming/vlog/etc. Videos must be embeddable, public, not age-restricted, at least 2 min,
and score at least `EDU_APPROVE_SCORE` (default 65). Quick check: `node server/classify.check.js`.

Security: the key lives only in the server process environment. Vite exposes only `VITE_*` variables to the
browser, so `YOUTUBE_API_KEY` is never bundled. Never prefix it with `VITE_`, never commit `.env`.

## Deploying to Vercel

`api/[...path].js` serves the same API as a serverless function from `server/snapshot.json` (a secret-free copy of
the ingested videos), and `vercel.json` adds the SPA fallback. No YouTube key is needed on Vercel.

1. Refresh data locally when you want new videos: `npm run ingest 12` then `npm run snapshot`.
2. Commit/deploy (the snapshot must be included; `server/.data/` is ignored).
3. In Vercel project settings set `VITE_USE_MOCK_API=false` and leave `VITE_API_URL` empty, then redeploy
   (Vite reads these at build time).

Vercel's filesystem is read-only, so ingestion there is not persisted; for automatic refreshes host `server/`
on a Node host with a disk (Render, Railway, Fly) and set `VITE_API_URL` to its URL.
