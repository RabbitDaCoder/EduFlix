// npm run ingest [maxQueries]  -> runs one ingestion now (uses YOUTUBE_API_KEY from .env)
import { existsSync } from 'node:fs';
import { load } from './store.js';
import { ingest } from './ingest.js';

if (existsSync('.env')) process.loadEnvFile('.env');
load();
const max = Number(process.argv[2]) || 6;
console.log('Ingesting with up to ' + max + ' queries (~' + max * 100 + ' quota units)...');
console.log(JSON.stringify(await ingest({ maxQueries: max }), null, 2));
