export const SUBJECTS = [
  { slug: 'mathematics', name: 'Mathematics', emoji: '∑', hue: 265, blurb: 'Explore lessons, explanations, and tutorials.', topics: ['Algebra', 'Calculus', 'Linear Algebra', 'Geometry', 'Statistics', 'Number Theory'] },
  { slug: 'physics', name: 'Physics', emoji: '⚛', hue: 200, blurb: 'From motion and forces to the quantum world.', topics: ['Mechanics', 'Electromagnetism', 'Quantum', 'Relativity'] },
  { slug: 'chemistry', name: 'Chemistry', emoji: '⚗', hue: 150, blurb: 'Atoms, reactions and everything made of them.', topics: ['Atoms', 'Organic', 'Reactions', 'Periodic Table'] },
  { slug: 'biology', name: 'Biology', emoji: '🧬', hue: 120, blurb: 'Cells, genes, evolution and ecosystems.', topics: ['Cells', 'Genetics', 'Evolution', 'Ecology'] },
  { slug: 'computer-science', name: 'Computer Science', emoji: '⌘', hue: 18, blurb: 'How computers think, compute and learn.', topics: ['Machine Learning', 'Algorithms', 'Computer Architecture', 'LLMs'] },
  { slug: 'programming', name: 'Programming', emoji: '</>', hue: 45, blurb: 'Hands-on coding tutorials, from first line to real projects.', topics: ['Python', 'JavaScript', 'Data Structures', 'Web Development'] },
  { slug: 'engineering', name: 'Engineering', emoji: '⚙', hue: 30, blurb: 'How things are designed, built and kept standing.', topics: ['Signal Processing', 'Civil', 'Electrical', 'Mechanical'] },
  { slug: 'economics', name: 'Economics', emoji: '📈', hue: 95, blurb: 'Markets, incentives and how economies work.', topics: ['Microeconomics', 'Macroeconomics', 'Game Theory'] },
  { slug: 'business', name: 'Business', emoji: '💼', hue: 220, blurb: 'Strategy, startups and management fundamentals.', topics: ['Strategy', 'Marketing', 'Startups'] },
  { slug: 'history', name: 'History', emoji: '🏛', hue: 15, blurb: 'The stories and forces that shaped our world.', topics: ['World History', 'Ancient', 'Modern'] },
  { slug: 'psychology', name: 'Psychology', emoji: '🧠', hue: 320, blurb: 'Mind, behavior and how we learn.', topics: ['Cognition', 'Behavior', 'Development'] },
  { slug: 'languages', name: 'Languages', emoji: 'Aあ', hue: 180, blurb: 'Grammar, vocabulary and fluency.', topics: ['English', 'Spanish', 'Grammar'] },
];

export const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];
export const subjectBySlug = (slug) => SUBJECTS.find((s) => s.slug === slug);
export const subjectByName = (name) => SUBJECTS.find((s) => s.name === name);
