import { Link } from 'react-router-dom';

export default function SubjectCard({ subject }) {
  return (
    <Link
      to={`/subjects/${subject.slug}`}
      className="group relative flex h-28 flex-col justify-between overflow-hidden rounded-xl border border-line bg-surface p-4 transition hover:border-line hover:bg-surface-2"
      style={{ borderLeft: `3px solid hsl(${subject.hue} 70% 60%)` }}
    >
      <span className="font-display text-2xl leading-none" style={{ color: `hsl(${subject.hue} 70% 65%)` }} aria-hidden="true">{subject.emoji}</span>
      <span className="font-display text-base font-semibold group-hover:text-accent">{subject.name}</span>
    </Link>
  );
}
