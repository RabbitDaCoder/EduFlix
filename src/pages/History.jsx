import { Link } from 'react-router-dom';
import { History as HistoryIcon, Trash2 } from 'lucide-react';
import Page, { Section } from '@/components/ui/Page';
import EmptyState from '@/components/ui/EmptyState';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import SearchResultCard from '@/components/search/SearchResultCard';
import { useHistory } from '@/hooks/useLibrary';
import { timeAgo } from '@/lib/utils';

export default function History() {
  const { entries, clear } = useHistory();
  const resume = entries.filter((e) => !e.completed && e.duration && e.seconds / e.duration > 0.02).slice(0, 3);

  return (
    <Page
      title="Your Learning History"
      subtitle="Everything you have watched, in one place."
      actions={entries.length > 0 && <Button variant="ghost" size="sm" onClick={clear}><Trash2 size={15} /> Clear history</Button>}
    >
      {entries.length === 0 ? (
        <EmptyState icon={HistoryIcon} title="Your learning history is empty" description="Start watching lessons to build your learning history." action={<Button as={Link} to="/" variant="primary">Start learning</Button>} />
      ) : (
        <>
          {resume.length > 0 && (
            <Section title="Continue where you left off">
              <div className="space-y-4">
                {resume.map((e) => <SearchResultCard key={e.video.youtubeId} video={e.video} progress={e.seconds / e.duration} compact />)}
              </div>
            </Section>
          )}
          <Section title="Watched">
            <div className="space-y-5">
              {entries.map((e) => {
                const pct = e.duration ? Math.round(Math.min(1, e.seconds / e.duration) * 100) : 0;
                return (
                  <SearchResultCard
                    key={e.video.youtubeId}
                    video={e.video}
                    progress={e.duration ? e.seconds / e.duration : 0}
                    meta={
                      <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted">
                        <span>{timeAgo(e.watchedAt)}</span>
                        <span>{e.completed ? '100' : pct}% complete</span>
                        {e.completed && <Badge tone="good">Completed</Badge>}
                      </p>
                    }
                  />
                );
              })}
            </div>
          </Section>
        </>
      )}
    </Page>
  );
}
