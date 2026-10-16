// Subject names must match src/lib/subjects.js
export const TAXONOMY = {
  Mathematics: {
    kw: ['math', 'mathematics', 'algebra', 'calculus', 'geometry', 'trigonometry', 'statistics', 'probability', 'linear algebra', 'derivative', 'integral', 'number theory', 'equation'],
    topics: { Calculus: ['calculus', 'derivative', 'integral', 'limit'], Algebra: ['algebra', 'equation', 'polynomial'], 'Linear Algebra': ['linear algebra', 'matrix', 'vector', 'eigen'], Geometry: ['geometry', 'triangle', 'trigonometry'], Statistics: ['statistics', 'probability', 'regression'], 'Number Theory': ['number theory', 'prime'] },
    queries: ['calculus tutorial', 'algebra lesson', 'statistics tutorial'],
  },
  Physics: {
    kw: ['physics', 'quantum', 'relativity', 'mechanics', 'thermodynamics', 'electromagnetism', 'newton', 'kinematics', 'optics'],
    topics: { Mechanics: ['mechanics', 'newton', 'kinematics', 'force'], Electromagnetism: ['electromagnetism', 'electric', 'magnetic'], Quantum: ['quantum'], Relativity: ['relativity'] },
    queries: ['physics lesson', 'quantum mechanics explained'],
  },
  Chemistry: {
    kw: ['chemistry', 'chemical', 'organic chemistry', 'atom', 'molecule', 'periodic table', 'stoichiometry', 'reaction'],
    topics: { Atoms: ['atom', 'nucleus', 'electron'], Organic: ['organic'], Reactions: ['reaction', 'stoichiometry'], 'Periodic Table': ['periodic table'] },
    queries: ['chemistry tutorial', 'organic chemistry explained'],
  },
  Biology: {
    kw: ['biology', 'cell', 'genetics', 'dna', 'evolution', 'ecology', 'anatomy', 'photosynthesis'],
    topics: { Cells: ['cell', 'mitochondria'], Genetics: ['genetics', 'dna', 'gene'], Evolution: ['evolution'], Ecology: ['ecology', 'ecosystem'] },
    queries: ['biology lesson', 'genetics explained'],
  },
  'Computer Science': {
    kw: ['computer science', 'algorithm', 'machine learning', 'neural network', 'artificial intelligence', 'operating system', 'compiler', 'database', 'cpu', 'llm', 'deep learning'],
    topics: { 'Machine Learning': ['machine learning', 'neural network', 'deep learning'], Algorithms: ['algorithm', 'complexity'], 'Computer Architecture': ['cpu', 'architecture', 'computer organization'], LLMs: ['llm', 'language model', 'gpt', 'transformer'] },
    queries: ['computer science lecture', 'machine learning tutorial'],
  },
  Programming: {
    kw: ['programming', 'python', 'javascript', 'coding', 'java', 'typescript', 'react', 'web development', 'data structures', 'sql', 'rust', 'c++', 'git'],
    topics: { Python: ['python'], JavaScript: ['javascript', 'typescript', 'node'], 'Data Structures': ['data structures'], 'Web Development': ['web development', 'html', 'css', 'react'] },
    queries: ['python programming tutorial', 'javascript tutorial', 'data structures course'],
  },
  Engineering: {
    kw: ['engineering', 'circuit', 'signal processing', 'thermodynamics', 'control systems', 'civil engineering', 'electrical engineering', 'mechanical engineering', 'fourier'],
    topics: { 'Signal Processing': ['signal', 'fourier'], Civil: ['civil', 'bridge', 'structural'], Electrical: ['circuit', 'electrical', 'voltage'], Mechanical: ['mechanical', 'gear', 'engine'] },
    queries: ['engineering lecture', 'electrical engineering explained'],
  },
  Economics: {
    kw: ['economics', 'economy', 'inflation', 'supply and demand', 'microeconomics', 'macroeconomics', 'game theory', 'gdp'],
    topics: { Microeconomics: ['microeconomics', 'supply and demand'], Macroeconomics: ['macroeconomics', 'inflation', 'gdp'], 'Game Theory': ['game theory'] },
    queries: ['economics lecture', 'macroeconomics explained'],
  },
  Business: {
    kw: ['business', 'marketing', 'startup', 'management', 'finance', 'accounting', 'strategy', 'entrepreneurship'],
    topics: { Strategy: ['strategy'], Marketing: ['marketing'], Startups: ['startup', 'entrepreneurship'] },
    queries: ['business fundamentals course', 'accounting basics lesson'],
  },
  History: {
    kw: ['history', 'ancient', 'medieval', 'world war', 'revolution', 'empire', 'civilization'],
    topics: { 'World History': ['world history'], Ancient: ['ancient', 'rome', 'egypt', 'greece'], Modern: ['modern', 'world war', 'cold war'] },
    queries: ['history lesson', 'world history crash course'],
  },
  Psychology: {
    kw: ['psychology', 'cognitive', 'behavior', 'neuroscience', 'memory', 'learning theory', 'mental'],
    topics: { Cognition: ['cognitive', 'memory', 'perception'], Behavior: ['behavior', 'behaviour'], Development: ['development', 'child'] },
    queries: ['psychology lecture', 'cognitive psychology explained'],
  },
  Languages: {
    kw: ['english grammar', 'grammar', 'vocabulary', 'spanish', 'french', 'language learning', 'linguistics', 'pronunciation'],
    topics: { English: ['english'], Spanish: ['spanish'], Grammar: ['grammar'] },
    queries: ['english grammar lesson', 'learn spanish lesson'],
  },
};

export const slugify = (s) => s.toLowerCase().split(' ').join('-');
export const DISCOVERY_QUERIES = Object.values(TAXONOMY).flatMap((s) => s.queries);

// Channels trusted out of the box (+20). Extend freely.
export const APPROVED_CHANNELS = [
  'khan academy', '3blue1brown', 'crashcourse', 'crash course', 'mit opencourseware', 'freecodecamp', 'ted-ed', 'veritasium',
  'the organic chemistry tutor', 'professor leonard', 'cs50', 'statquest', 'andrej karpathy', 'programming with mosh', 'kurzgesagt',
  'numberphile', 'computerphile', 'practical engineering', 'stanford online', 'harvard university', 'yale courses', 'the coding train',
  'fireship', 'sentdex', 'corey schafer', 'academind', 'traversy media', 'jacob sorber', 'mathologer', 'minutephysics', 'sabine hossenfelder',
];
