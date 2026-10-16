import { cn } from '@/lib/utils';

export const TYPES = [
  { value: 'all', label: 'All' }, { value: 'lessons', label: 'Lessons' }, { value: 'tutorials', label: 'Tutorials' },
  { value: 'courses', label: 'Courses' }, { value: 'creators', label: 'Creators' },
];
const LEVELS = [{ value: 'Beginner' }, { value: 'Intermediate' }, { value: 'Advanced' }];
const LENGTHS = [{ value: 'short', label: 'Short' }, { value: 'long', label: 'Long' }];

export function Chip({ active, children, onClick, className }) {
  return (
    <button
      type="button" onClick={onClick} aria-pressed={active}
      className={cn('shrink-0 cursor-pointer whitespace-nowrap rounded-full border px-3.5 py-1.5 text-sm font-medium transition',
        active ? 'border-fg bg-fg text-bg' : 'border-line bg-surface text-muted hover:text-fg', className)}
    >
      {children}
    </button>
  );
}

export default function SearchFilters({ type, level, length, onChange }) {
  const toggle = (key, current, value) => onChange({ [key]: current === value ? undefined : value });
  return (
    <div className="space-y-3">
      <div className="no-scrollbar flex gap-2 overflow-x-auto" role="group" aria-label="Result type">
        {TYPES.map((t) => <Chip key={t.value} active={(type || 'all') === t.value} onClick={() => onChange({ type: t.value === 'all' ? undefined : t.value })}>{t.label}</Chip>)}
      </div>
      <div className="no-scrollbar flex gap-2 overflow-x-auto" role="group" aria-label="Level and length">
        {LEVELS.map((l) => <Chip key={l.value} active={level === l.value} onClick={() => toggle('level', level, l.value)}>{l.value}</Chip>)}
        <span className="mx-1 w-px shrink-0 self-stretch bg-line" />
        {LENGTHS.map((l) => <Chip key={l.value} active={length === l.value} onClick={() => toggle('length', length, l.value)}>{l.label}</Chip>)}
      </div>
    </div>
  );
}
