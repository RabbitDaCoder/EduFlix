import Page, { Section } from '@/components/ui/Page';
import Avatar from '@/components/ui/Avatar';
import { Chip } from '@/components/search/SearchFilters';
import { useProfile, useStats } from '@/hooks/useLibrary';
import { formatLearningTime } from '@/lib/utils';
import { SUBJECTS } from '@/lib/subjects';

function Stat({ value, label }) {
  return (
    <div className="rounded-xl border border-line bg-surface p-5">
      <div className="font-display text-3xl font-bold">{value}</div>
      <div className="mt-1 text-sm text-muted">{label}</div>
    </div>
  );
}

export default function Profile() {
  const { profile, setProfile } = useProfile();
  const stats = useStats();
  const toggleInterest = (name) =>
    setProfile((p) => ({ ...p, interests: p.interests.includes(name) ? p.interests.filter((i) => i !== name) : [...p.interests, name] }));

  return (
    <Page>
      <div className="flex items-center gap-5">
        <Avatar name={profile.name} hue={18} size="xl" />
        <div>
          <h1 className="font-display text-2xl font-bold md:text-3xl">{profile.name}</h1>
          <p className="text-muted">@{profile.username}</p>
        </div>
      </div>
      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Stat value={stats.completed} label="Lessons completed" />
        <Stat value={formatLearningTime(stats.seconds)} label="Learning time" />
        <Stat value={stats.subjects} label="Subjects explored" />
      </div>
      <Section title="Interests" className="mt-10">
        <p className="mb-3 text-sm text-muted">Pick what you want to learn. Stored on this device.</p>
        <div className="flex flex-wrap gap-2">
          {SUBJECTS.map((s) => <Chip key={s.slug} active={profile.interests.includes(s.name)} onClick={() => toggleInterest(s.name)}>{s.name}</Chip>)}
        </div>
      </Section>
    </Page>
  );
}
