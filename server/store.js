import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// Live store (written by ingestion) and a read-only snapshot that ships with deployments.
const FILE = new URL('./.data/store.json', import.meta.url);
const SNAPSHOT = new URL('./snapshot.json', import.meta.url);

const empty = () => ({ videos: {}, channels: {}, rejected: {}, queryState: {}, lastIngest: null });
let state = empty();

export function load() {
  const src = existsSync(FILE) ? FILE : existsSync(SNAPSHOT) ? SNAPSHOT : null;
  if (!src) return state;
  try {
    state = { ...empty(), ...JSON.parse(readFileSync(src, 'utf8')) };
  } catch (e) {
    console.warn('Could not read store, starting empty:', e.message);
  }
  return state;
}

export function save() {
  try {
    mkdirSync(dirname(fileURLToPath(FILE)), { recursive: true });
    writeFileSync(FILE, JSON.stringify(state));
  } catch (e) {
    console.warn('Store is read-only here, ingestion results are not persisted:', e.code || e.message);
  }
}

export const getState = () => state;

// Compact, secret-free copy for deployment: `npm run snapshot`
export function writeSnapshot() {
  const videos = Object.fromEntries(Object.entries(state.videos).map(([id, v]) => [id, { ...v, description: (v.description || '').slice(0, 600) }]));
  writeFileSync(SNAPSHOT, JSON.stringify({ videos, channels: state.channels, lastIngest: state.lastIngest }));
  return Object.keys(videos).length;
}
