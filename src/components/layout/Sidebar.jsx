import { NavLink } from 'react-router-dom';
import { Home, Compass, Bookmark, History } from 'lucide-react';
import { SUBJECTS } from '@/lib/subjects';
import { cn } from '@/lib/utils';

const MAIN = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/discover', label: 'Discover', icon: Compass },
  { to: '/saved', label: 'Saved', icon: Bookmark },
  { to: '/history', label: 'History', icon: History },
];

const linkCls = ({ isActive }) =>
  cn(
    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors lg:justify-start max-lg:justify-center',
    isActive ? 'bg-surface-2 text-fg' : 'text-muted hover:bg-surface hover:text-fg',
  );

export default function Sidebar() {
  return (
    <aside className="fixed bottom-0 left-0 top-[var(--header-h)] z-30 hidden w-[var(--sidebar-w)] overflow-y-auto border-r border-line bg-bg p-3 md:block">
      <nav aria-label="Main" className="space-y-1">
        {MAIN.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} className={linkCls} title={label}>
            <Icon size={20} /><span className="max-lg:hidden">{label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="my-4 border-t border-line" />
      <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted max-lg:hidden">Subjects</p>
      <nav aria-label="Subjects" className="space-y-1">
        {SUBJECTS.map((s) => (
          <NavLink key={s.slug} to={`/subjects/${s.slug}`} className={linkCls} title={s.name}>
            <span className="flex h-5 w-5 items-center justify-center text-[13px] leading-none">{s.emoji.length > 2 ? s.emoji[0] : s.emoji}</span>
            <span className="max-lg:hidden">{s.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
