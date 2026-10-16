import { Link } from 'react-router-dom';
import { BadgeCheck } from 'lucide-react';
import Avatar from '../ui/Avatar';
import { formatCount } from '@/lib/utils';

export default function CreatorCard({ creator }) {
  return (
    <Link to={`/creators/${creator.id}`} className="flex w-36 shrink-0 flex-col items-center rounded-xl border border-line bg-surface p-4 text-center transition hover:bg-surface-2">
      <Avatar name={creator.name} hue={creator.hue} size="lg" />
      <span className="mt-3 flex max-w-full items-center gap-1 text-sm font-semibold"><span className="truncate">{creator.name}</span>{creator.verified && <BadgeCheck size={14} className="shrink-0 text-muted" />}</span>
      <span className="mt-0.5 text-xs text-muted">{formatCount(creator.followers)} followers</span>
    </Link>
  );
}
