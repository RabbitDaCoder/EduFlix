import { classify } from './classify.js';

const base = { embeddable: true, duration: 900, subscribers: 20000 };
const cases = [
  ['Calculus Derivatives Explained', 'In this video we will explain derivatives with examples and a full lesson on limits.', true],
  ['Python Programming Tutorial', 'Learn python in this tutorial. Chapters: variables, functions, loops. Great for beginners.', true],
  ['Top 10 Celebrity Moments', 'Gossip and best celebrity moments of the year! Subscribe!', false],
  ['Funny Gaming Compilation', 'The funniest gaming highlights, fails and memes', false],
];
let bad = 0;
for (const [title, description, want] of cases) {
  const r = classify({ ...base, title, description, channelName: 'Some Channel' });
  const ok = r.isEducational === want;
  if (!ok) bad++;
  console.log((ok ? 'PASS' : 'FAIL') + '  ' + String(r.score).padStart(3) + '  ' + title + '  -> ' + (r.subject || '-') + ' / ' + r.topic + ' / ' + r.level);
}
process.exit(bad ? 1 : 0);
