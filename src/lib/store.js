import { useCallback, useSyncExternalStore } from 'react';

// Tiny localStorage-backed store. Prototype-only persistence (saved, history, prefs, ...).
const listeners = new Set();
const cache = new Map();

function read(key, fallback) {
  if (cache.has(key)) return cache.get(key);
  let value = fallback;
  try {
    const raw = localStorage.getItem(`eduflix:${key}`);
    if (raw != null) value = JSON.parse(raw);
  } catch {
    /* storage unavailable or corrupt: use fallback */
  }
  cache.set(key, value);
  return value;
}

function write(key, value) {
  cache.set(key, value);
  try {
    localStorage.setItem(`eduflix:${key}`, JSON.stringify(value));
  } catch {
    /* quota / private mode: keep in memory only */
  }
  listeners.forEach((l) => l());
}

const subscribe = (cb) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key?.startsWith('eduflix:')) {
      cache.delete(e.key.slice(8));
      listeners.forEach((l) => l());
    }
  });
}

export function useStore(key, fallback) {
  const value = useSyncExternalStore(subscribe, () => read(key, fallback));
  const set = useCallback(
    (next) => write(key, typeof next === 'function' ? next(read(key, fallback)) : next),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key],
  );
  return [value, set];
}

export const getStore = (key, fallback) => read(key, fallback);
export const setStore = write;
