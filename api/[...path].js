// Vercel serverless entry: serves /api/* from the bundled snapshot (no YouTube key needed at runtime).
import { load } from '../server/store.js';
import { handle } from '../server/index.js';

load();
export default function handler(req, res) {
  return handle(req, res);
}
