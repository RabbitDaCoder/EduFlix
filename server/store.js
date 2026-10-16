import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const FILE = new URL('./.data/store.json', import.meta.url);

const empty = () => ({ videos: {}, channels: {}, rejected: {}, queryState: {}, lastIngest: null });
let state = empty();

export function load() {
  try {
    if (existsSync(FILE)) state = { ...empty(), ...JSON.parse(readFileSync(FILE, 'utf8')) };
  } catch (e) {
    console.warn('Could not read store, starting empty:', e.message);
  }
  return state;
}

export function save() {
  mkdirSync(dirname(fileURLToPath(FILE)), { recursive: true });
  writeFileSync(FILE, JSON.stringify(state));
}

export const getState = () => state;
