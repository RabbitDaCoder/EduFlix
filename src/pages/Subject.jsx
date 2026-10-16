import { Link, useParams, useSearchParams } from 'react-router-dom';
import { Compass } from 'lucide-react';
import VideoFeed from '@/components/feed/VideoFeed';
import EmptyState from '@/components/ui/EmptyState';
import Button from '@/components/ui/Button';
import { Chip } from '@/components/search/SearchFilters';
import { subjectBySlug } from '@/lib/subjects';

const FILTERS = [
  { id: 'foryou', label: 'For You' }, { id: 'Beginner', label: 'Beginner' }, { id: 'Intermediate', label: 'Intermediate' },
  { id: 'Advanced', label: 'Advanced' }, { id: 'popular', label: 'Popular' },
];
const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

export default function Subject() {
  const { slug } = useParams();
  const subject = subjectBySlug(slug);
  const [params, setParams] = useSearchParams();
  const filter = params.get('filter') || 'foryou';
  const topic = params.get('topic') || undefined;

  if (!subject) {
    return <EmptyState icon={Compass} title="Subject not found" description="Pick a subject from Discover." action={<Button as={Link} to="/discover" variant="primary">Go to Discover</Button>} />;
  }

  const update = (patch) => {
    const next = new URLSearchParams(params);
    Object.entries(patch).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)));
    setParams(next, { replace: true });
  };

  const header = (
    <div className="snap-start px-4 pb-3 pt-5 md:px-6">
      <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">{subject.name}</h1>
      <p className="mt-1 text-sm text-muted">{subject.blurb}</p>
      <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto" role="group" aria-label="Topics">
        <Chip active={!topic} onClick={() => update({ topic: null })}>All topics</Chip>
        {subject.topics.map((t) => <Chip key={t} active={topic === t} onClick={() => update({ topic: t })}>{t}</Chip>)}
      </div>
      <div className="no-scrollbar mt-2 flex gap-2 overflow-x-auto" role="group" aria-label="Filters">
        {FILTERS.map((f) => <Chip key={f.id} active={filter === f.id} onClick={() => update({ filter: f.id === 'foryou' ? null : f.id })}>{f.label}</Chip>)}
      </div>
    </div>
  );

  return (
    <VideoFeed
      key={`${slug}|${filter}|${topic}`}
      subject={slug}
      topic={topic}
      level={LEVELS.includes(filter) ? filter : undefined}
      sort={filter === 'popular' ? 'popular' : undefined}
      header={header}
    />
  );
}
