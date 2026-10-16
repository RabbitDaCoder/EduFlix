import { useCallback, useMemo } from 'react';
import { useStore } from '@/lib/store';

// Prototype-only persistence in localStorage. Keys are YouTube IDs so repeats dedupe.
const snapshot = (v) => ({
  id: v.id, youtubeId: v.youtubeId, title: v.title, thumbnail: v.thumbnail, subject: v.subject,
  topic: v.topic, level: v.level, duration: v.duration, creator: v.creator, description: v.description,
});

export function useSaved() {
  const [map, setMap] = useStore('saved', {});
  const items = useMemo(() => Object.values(map).sort((a, b) => b.savedAt - a.savedAt), [map]);
  const isSaved = useCallback((v) => !!map[v.youtubeId], [map]);
  const toggle = useCallback((v) => setMap((m) => {
    const next = { ...m };
    if (next[v.youtubeId]) delete next[v.youtubeId];
    else next[v.youtubeId] = { video: snapshot(v), savedAt: Date.now() };
    return next;
  }), [setMap]);
  return { items, isSaved, toggle };
}

export function useLiked() {
  const [map, setMap] = useStore('liked', {});
  const isLiked = useCallback((v) => !!map[v.youtubeId], [map]);
  const toggle = useCallback((v) => setMap((m) => {
    const next = { ...m };
    if (next[v.youtubeId]) delete next[v.youtubeId];
    else next[v.youtubeId] = true;
    return next;
  }), [setMap]);
  return { isLiked, toggle };
}

export function useHistory() {
  const [map, setMap] = useStore('history', {});
  const entries = useMemo(() => Object.values(map).sort((a, b) => b.watchedAt - a.watchedAt), [map]);
  const record = useCallback((v, seconds, duration, completed = false) => setMap((m) => {
    const prev = m[v.youtubeId];
    const dur = duration || v.duration || prev?.duration || 0;
    const secs = Math.min(Math.max(seconds, prev?.seconds || 0), dur || seconds);
    // Accumulate watch time as growth in max position (simple + stable for a prototype).
    const total = (prev?.totalSeconds || 0) + Math.max(0, secs - (prev?.seconds || 0));
    return {
      ...m,
      [v.youtubeId]: {
        video: snapshot(v), watchedAt: Date.now(), seconds: secs, duration: dur, totalSeconds: total,
        completed: completed || prev?.completed || (dur > 0 && secs / dur >= 0.9),
      },
    };
  }), [setMap]);
  const clear = useCallback(() => setMap({}), [setMap]);
  const progressOf = useCallback((v) => {
    const e = map[v.youtubeId];
    return e && e.duration ? Math.min(1, e.seconds / e.duration) : 0;
  }, [map]);
  return { entries, record, clear, progressOf, map };
}

export function useFollows() {
  const [map, setMap] = useStore('follows', {});
  const isFollowing = useCallback((id) => !!map[id], [map]);
  const toggle = useCallback((id) => setMap((m) => {
    const next = { ...m };
    if (next[id]) delete next[id]; else next[id] = true;
    return next;
  }), [setMap]);
  return { isFollowing, toggle };
}

export function usePathProgress(pathId) {
  const [map, setMap] = useStore('paths', {});
  const done = useMemo(() => map[pathId] || [], [map, pathId]);
  const toggle = useCallback((i, force) => setMap((m) => {
    const cur = new Set(m[pathId] || []);
    const on = force ?? !cur.has(i);
    if (on) cur.add(i); else cur.delete(i);
    return { ...m, [pathId]: [...cur].sort((a, b) => a - b) };
  }), [setMap, pathId]);
  return { done, toggle };
}

export function useProfile() {
  const [profile, setProfile] = useStore('profile', { name: 'Alex Learner', username: 'alexlearns', interests: ['Programming', 'Mathematics', 'Computer Science'] });
  return { profile, setProfile };
}

export function useStats() {
  const { entries } = useHistory();
  return useMemo(() => ({
    completed: entries.filter((e) => e.completed).length,
    seconds: entries.reduce((s, e) => s + (e.totalSeconds || 0), 0),
    subjects: new Set(entries.map((e) => e.video.subject)).size,
  }), [entries]);
}
