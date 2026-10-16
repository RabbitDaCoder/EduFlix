// npm run snapshot -> writes server/snapshot.json from the local store (commit/deploy it)
import { load, writeSnapshot } from './store.js';

load();
console.log('Snapshot written with ' + writeSnapshot() + ' videos.');
