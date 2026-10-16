import { TAXONOMY, APPROVED_CHANNELS } from './taxonomy.js';

export const THRESHOLDS = {
  approve: Number(process.env.EDU_APPROVE_SCORE) || 65,
};

const EDU_WORDS = ['tutorial', 'lesson', 'lecture', 'course', 'explained', 'how to', 'introduction', 'intro to', 'fundamentals', 'beginner', 'beginners', 'advanced', 'guide', 'theory', 'concepts', 'crash course', 'basics', 'full course', 'learn', 'explanation', 'walkthrough', 'overview'];
const DESC_WORDS = ['learn', 'lesson', 'lecture', 'tutorial', 'course', 'chapter', 'topics', 'in this video', 'we will', 'explain', 'example', 'theory', 'concept', 'syllabus', 'timestamps', 'chapters', 'curriculum'];

// [needle, penalty] - weighted, never an automatic reject on its own
const NEGATIVE = [
  ['reaction', 25], ['reacts', 25], ['react to', 25], ['prank', 40], ['meme', 30], ['compilation', 25], ['funny', 20], ['celebrity', 35],
  ['gossip', 35], ['challenge', 15], ['gaming', 25], ['gameplay', 30], ['highlights', 25], ['official music video', 40], ['music video', 35],
  ['lyrics', 30], ['vlog', 25], ['#shorts', 25], ['shorts compilation', 35], ['you wont believe', 25], ['gone wrong', 25], ['trailer', 20],
  ['unboxing', 25], ['asmr', 25], ['mukbang', 35], ['giveaway', 30], ['clickbait', 20],
];

const isWordChar = (c) => c !== undefined && /[a-z0-9]/.test(c);

// Whole-word / whole-phrase match without building regexes from data
function has(text, needle) {
  let i = text.indexOf(needle);
  while (i !== -1) {
    const end = i + needle.length;
    const after = text[end] === 's' ? end + 1 : end; // allow simple plurals
    if (!isWordChar(text[i - 1]) && !isWordChar(text[after])) return true;
    i = text.indexOf(needle, i + 1);
  }
  return false;
}
const count = (text, list) => list.reduce((n, w) => n + (has(text, w) ? 1 : 0), 0);

export function detectSubject(title, desc, tags) {
  let best = { subject: null, score: 0 };
  for (const [subject, def] of Object.entries(TAXONOMY)) {
    const score = count(title, def.kw) * 3 + count(tags, def.kw) * 1.5 + count(desc, def.kw);
    if (score > best.score) best = { subject, score };
  }
  return best;
}

function detectTopic(subject, text) {
  if (!subject) return null;
  let best = [null, 0];
  for (const [topic, words] of Object.entries(TAXONOMY[subject].topics)) {
    const n = count(text, words);
    if (n > best[1]) best = [topic, n];
  }
  return best[0] || subject;
}

export function detectLevel(text) {
  const t = text.toLowerCase();
  if (/(advanced|graduate|research|deep dive|from scratch|phd)/.test(t)) return 'Advanced';
  if (/(intermediate|university|college|undergraduate|stanford)/.test(t)) return 'Intermediate';
  return 'Beginner';
}

export const isApprovedChannel = (name) => APPROVED_CHANNELS.some((c) => name.toLowerCase().includes(c));

/**
 * Deterministic educational score (0-100).
 * Title 25, description 20, keywords 15, channel 20, subject 10, duration 5, embeddable 5, minus weighted penalties.
 */
export function classify(v) {
  const title = v.title.toLowerCase();
  const desc = (v.description || '').toLowerCase().slice(0, 2500);
  const tags = (v.tags || []).join(' ').toLowerCase();
  const channel = v.channelName.toLowerCase();
  const { subject, score: subjectScore } = detectSubject(title, desc, tags);

  const titleHits = subject ? count(title, TAXONOMY[subject].kw) : 0;
  const titleRel = titleHits >= 2 ? 25 : titleHits === 1 ? 15 : 0;
  const descRel = Math.min(20, (count(desc, DESC_WORDS) + (subject ? count(desc, TAXONOMY[subject].kw) : 0)) * 3);
  const kwHits = count(title, EDU_WORDS);
  const keywords = Math.min(15, kwHits * 8);
  const approvedChannel = isApprovedChannel(channel);
  const subs = v.subscribers || 0;
  const channelScore = approvedChannel ? 20 : subs >= 500000 ? 8 : subs >= 50000 ? 4 : 0;
  const subjectPts = subjectScore >= 3 ? 10 : subjectScore > 0 ? 5 : 0;
  const d = v.duration || 0;
  const durationPts = d >= 240 && d <= 3 * 3600 ? 5 : d >= 120 && d < 240 ? 2 : d > 3 * 3600 ? 3 : 0;
  const embedPts = v.embeddable ? 5 : 0;

  let penalty = 0;
  const flags = [];
  for (const [needle, p] of NEGATIVE) {
    if (has(title, needle)) { penalty += p; flags.push(needle); }
    else if (has(desc, needle) || has(tags, needle)) penalty += p * 0.4;
  }
  // A clearly educational title softens (but never cancels) a negative signal
  if (kwHits >= 2) penalty *= 0.7;

  const raw = titleRel + descRel + keywords + channelScore + subjectPts + durationPts + embedPts - penalty;
  const score = Math.max(0, Math.min(100, Math.round(raw)));
  return {
    score,
    isEducational: score >= THRESHOLDS.approve && !!subject,
    subject,
    topic: detectTopic(subject, title + ' ' + tags + ' ' + desc.slice(0, 600)),
    level: detectLevel(title + ' ' + desc.slice(0, 400)),
    approvedChannel,
    flags,
  };
}
