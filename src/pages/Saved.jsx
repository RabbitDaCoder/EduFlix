import { Link } from 'react-router-dom';
import { Bookmark, X } from 'lucide-react';
import Page, { Section } from '@/components/ui/Page';
import EmptyState from '@/components/ui/EmptyState';
import Button from '@/components/ui/Button';
import SearchResultCard from '@/components/search/SearchResultCard';
import { useSaved, useHistory } from '@/hooks/useLibrary';

export default function Saved() {
  const { items, toggle } = useSaved();
  const { progressOf } = useHistory();
  const inProgress = items.filter((s) => { const p = progressOf(s.video); return p > 0 && p < 0.9; });

  return (
    <Page title="Saved Lessons" subtitle="Keep the lessons you want to come back to.">
      {items.length === 0 ? (
        <EmptyState icon={Bookmark} title="No saved lessons yet" description="Save a lesson and it will appear here." action={<Button as={Link} to="/" variant="primary">Browse the feed</Button>} />
      ) : (
        <>
          {inProgress.length > 0 && (
            <Section title="Continue Learning">
              <div className="space-y-4">
                {inProgress.slice(0, 3).map(({ video }) => <SearchResultCard key={video.youtubeId} video={video} progress={progressOf(video)} compact />)}
              </div>
            </Section>
          )}
          <Section title={'All saved (' + items.length + ')'}>
            <div className="space-y-5">
              {items.map(({ video }) => {
                const p = progressOf(video);
                return (
                  <SearchResultCard
                    key={video.youtubeId}
                    video={video}
                    progress={p}
                    meta={p > 0 ? <p className="mt-1 text-xs text-accent">{Math.round(p * 100)}% watched</p> : null}
                    actions={<Button variant="ghost" size="icon" aria-label={'Remove ' + video.title + ' from saved'} onClick={() => toggle(video)}><X size={18} /></Button>}
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
