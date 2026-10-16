import { thumbFor } from '@/lib/utils';

export const CREATORS = [
  { id: '3blue1brown', name: '3Blue1Brown', handle: '@3blue1brown', followers: 6700000, verified: true, hue: 215, subjects: ['Mathematics', 'Computer Science', 'Engineering'], bio: 'Animated explanations that build real intuition for math and the ideas built on it.' },
  { id: 'freecodecamp', name: 'freeCodeCamp.org', handle: '@freecodecamp', followers: 10100000, verified: true, hue: 150, subjects: ['Programming', 'Computer Science'], bio: 'Full-length courses and tutorials to help you learn to code for free.' },
  { id: 'mosh', name: 'Programming with Mosh', handle: '@programmingwithmosh', followers: 4000000, verified: true, hue: 20, subjects: ['Programming'], bio: 'Clear, practical programming tutorials for beginners and working developers.' },
  { id: 'crashcourse', name: 'CrashCourse', handle: '@crashcourse', followers: 16000000, verified: true, hue: 340, subjects: ['Physics', 'Chemistry', 'Biology', 'History', 'Economics', 'Psychology', 'Mathematics', 'Computer Science'], bio: 'Fast, fun and visual courses across science, humanities and more.' },
  { id: 'karpathy', name: 'Andrej Karpathy', handle: '@AndrejKarpathy', followers: 1100000, verified: true, hue: 270, subjects: ['Computer Science'], bio: 'Deep dives into neural networks and large language models, built from scratch.' },
];

// Real, embeddable educational videos. A few IDs may go stale over time; the player degrades gracefully.
const B = [
  ['aircAruvnKk', 'But what is a neural network?', '3blue1brown', 'Computer Science', 'Machine Learning', 'Beginner', 1121, 'A visual introduction to neurons, layers and how a network can recognise handwritten digits.', 18000000],
  ['WUvTyaaNkzM', 'The essence of calculus', '3blue1brown', 'Mathematics', 'Calculus', 'Beginner', 1017, 'A bird-eye view of the big ideas of calculus, rediscovered from a simple geometry puzzle.', 9400000],
  ['rfscVS0vtbw', 'Learn Python - Full Course for Beginners', 'freecodecamp', 'Programming', 'Python', 'Beginner', 16011, 'A complete Python course: variables, functions, loops, classes and more, with practice along the way.', 40000000],
  ['zouPoc49xbk', 'Intro to Statistics: Crash Course Statistics #1', 'crashcourse', 'Mathematics', 'Statistics', 'Beginner', 727, 'Why statistics matters, and how data helps us make decisions about the world.', 1900000],
  ['O5nskjZ_GoI', 'Early Computing: Crash Course Computer Science #1', 'crashcourse', 'Computer Science', 'Computer Architecture', 'Beginner', 721, 'From abacus to the first mechanical calculators, the story of how computing began.', 3200000],
  ['IHZwWFHWa-w', 'Gradient descent, how neural networks learn', '3blue1brown', 'Computer Science', 'Machine Learning', 'Intermediate', 1257, 'How a network improves itself by walking downhill on a cost function.', 6100000],
  ['Yocja_N5s1I', 'The Agricultural Revolution: Crash Course World History #1', 'crashcourse', 'History', 'World History', 'Beginner', 696, 'How farming reshaped human societies, for better and for worse.', 4800000],
  ['PkZNo7MFNFg', 'Learn JavaScript - Full Course for Beginners', 'freecodecamp', 'Programming', 'JavaScript', 'Beginner', 12402, 'Everything you need to start writing JavaScript, from syntax to DOM and functions.', 9800000],
  ['fNk_zzaMoSs', 'Vectors - Essence of linear algebra, Chapter 1', '3blue1brown', 'Mathematics', 'Linear Algebra', 'Beginner', 593, 'What vectors really are, and why three different views of them are all correct.', 5600000],
  ['3ez10ADR_gM', 'Intro to Economics: Crash Course Econ #1', 'crashcourse', 'Economics', 'Microeconomics', 'Beginner', 579, 'Scarcity, trade-offs and incentives: the foundation of every economic question.', 3900000],
  ['kqtD5dpn9C8', 'Python for Beginners - Learn Python in 1 Hour', 'mosh', 'Programming', 'Python', 'Beginner', 3693, 'A fast-paced, hands-on first hour with Python. Install, code, and build a small program.', 11000000],
  ['ZM8ECpBuQYE', 'Intro to Physics: Crash Course Physics Preview', 'crashcourse', 'Physics', 'Mechanics', 'Beginner', 540, 'What physicists actually do and how we describe motion in the universe.', 2100000],
  ['FSyAehMdpyI', 'The Nucleus: Crash Course Chemistry #1', 'crashcourse', 'Chemistry', 'Atoms', 'Beginner', 610, 'What is inside an atom, and why the nucleus matters for chemistry.', 3500000],
  ['Ilg3gGewQ5U', 'Backpropagation, intuitively', '3blue1brown', 'Computer Science', 'Machine Learning', 'Intermediate', 834, 'The core algorithm behind neural network learning, explained step by step.', 4300000],
  ['QnQe0xW_JY4', 'Carbon: Crash Course Biology #1', 'crashcourse', 'Biology', 'Cells', 'Beginner', 600, 'Why carbon is the backbone of life and how living things are built.', 2800000],
  ['vo4pMVb0R6M', 'Intro to Psychology: Crash Course Psychology #1', 'crashcourse', 'Psychology', 'Cognition', 'Beginner', 600, 'What psychology is, how it began, and the questions it tries to answer.', 15000000],
  ['spUNpyF58BY', 'But what is the Fourier Transform?', '3blue1brown', 'Engineering', 'Signal Processing', 'Intermediate', 1230, 'A visual tour of the Fourier transform, the engine behind audio, images and communication.', 9500000],
  ['zjkBMFhNj_g', 'Intro to Large Language Models (1 hour talk)', 'karpathy', 'Computer Science', 'LLMs', 'Intermediate', 3591, 'A busy-person introduction to LLMs: what they are, how they are trained, and where they are going.', 2900000],
  ['3d6DsjIBzJ4', 'Taylor series - Chapter 11, Essence of calculus', '3blue1brown', 'Mathematics', 'Calculus', 'Advanced', 1347, 'Approximating complicated functions with polynomials, and why it works so well.', 4000000],
  ['8hly31xKli0', 'Algorithms and Data Structures Tutorial - Full Course', 'freecodecamp', 'Programming', 'Data Structures', 'Intermediate', 20012, 'Core algorithms and data structures taught with clear examples and complexity analysis.', 3800000],
  ['kCc8FmEb1nY', 'Build GPT: from scratch, in code, spelled out', 'karpathy', 'Computer Science', 'LLMs', 'Advanced', 6982, 'Build a small GPT from an empty file, following the Attention Is All You Need paper.', 5200000],
];

const creatorById = Object.fromEntries(CREATORS.map((c) => [c.id, c]));
const DAY = 86400000;

export const BASE_VIDEOS = B.map(([youtubeId, title, creatorId, subject, topic, level, duration, description, views], i) => ({
  id: youtubeId,
  youtubeId,
  title,
  description,
  thumbnail: thumbFor(youtubeId),
  subject,
  topic,
  level,
  duration,
  views,
  likes: Math.round(views * 0.03),
  publishedAt: new Date(Date.now() - (i + 1) * 37 * DAY).toISOString(),
  educationalScore: 96 - (i % 7),
  creator: { id: creatorId, name: creatorById[creatorId].name, hue: creatorById[creatorId].hue, verified: true },
}));

export const PATHS = [
  {
    id: 'python-fundamentals',
    title: 'Python Fundamentals',
    description: 'Go from zero to writing real Python programs, one lesson at a time.',
    subject: 'Programming',
    lessonIds: ['rfscVS0vtbw', 'kqtD5dpn9C8', '8hly31xKli0', 'WUvTyaaNkzM', 'zouPoc49xbk'],
    lessonTitles: ['What is Python?', 'Variables and Data Types', 'Functions', 'Lists and Dictionaries', 'Loops'],
  },
];
