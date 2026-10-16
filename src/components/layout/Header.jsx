import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import SearchBar from '../search/SearchBar';
import Avatar from '../ui/Avatar';
import { useProfile } from '@/hooks/useLibrary';

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold tracking-tight" aria-label="EduFlix home">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-fg">
        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M2 0.5v13l11-6.5z" fill="currentColor" /></svg>
      </span>
      <span>Edu<span className="text-accent">Flix</span></span>
    </Link>
  );
}

export default function Header() {
  const { profile } = useProfile();
  return (
    <header className="fixed inset-x-0 top-0 z-40 flex h-[var(--header-h)] items-center gap-4 border-b border-line bg-bg/95 px-4 backdrop-blur md:px-6">
      <div className="md:w-[calc(var(--sidebar-w)-24px)] md:shrink-0"><Logo /></div>
      <div className="hidden max-w-xl flex-1 md:block"><SearchBar /></div>
      <div className="flex-1 md:hidden" />
      <Link to="/search" aria-label="Search" className="flex h-10 w-10 items-center justify-center rounded-full text-muted hover:bg-surface-2 hover:text-fg md:hidden">
        <Search size={22} />
      </Link>
      <Link to="/profile" aria-label="Profile" className="ml-auto hidden md:block"><Avatar name={profile.name} hue={18} /></Link>
    </header>
  );
}
