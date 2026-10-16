import { useSearchParams } from 'react-router-dom';
import VideoFeed from '@/components/feed/VideoFeed';
import { Chip } from '@/components/search/SearchFilters';
import { SUBJECTS } from '@/lib/subjects';

const CHIPS = ['mathematics', 'physics', 'computer-science', 'programming', 'engineering', 'business', 'history'];

export default function Home() {
  const [params, setParams] = useSearchParams();
  const subject = params.get('subject') || undefined;
  const select = (slug) => setParams(slug ? { subject: slug } : {}, { replace: true });

  const header = (
    <div className="snap-start px-4 pb-3 pt-5 md:px-6">
      <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">Learn something new. <span className="text-accent">Every scroll.</span></h1>
      <p className="mt-1 text-sm text-muted">Short lessons. Deep explanations. One endless educational feed.</p>
      <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto" role="group" aria-label="Subjects">
        <Chip active={!subject} onClick={() => select(null)}>For You</Chip>
        {CHIPS.map((slug) => {
          const s = SUBJECTS.find((x) => x.slug === slug);
          return <Chip key={slug} active={subject === slug} onClick={() => select(slug)}>{s.name}</Chip>;
        })}
      </div>
    </div>
  );

  return <VideoFeed key={subject || 'all'} subject={subject} header={header} />;
}
