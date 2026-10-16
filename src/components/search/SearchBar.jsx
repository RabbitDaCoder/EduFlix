import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SearchBar({ className, autoFocus = false, placeholder = 'Search lessons, subjects, topics...' }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [params] = useSearchParams();
  const current = pathname === '/search' ? params.get('q') || '' : '';
  const [value, setValue] = useState(current);

  useEffect(() => setValue(current), [current]);

  const submit = (e) => {
    e.preventDefault();
    const q = value.trim();
    if (q) navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <form onSubmit={submit} role="search" className={cn('relative w-full', className)}>
      <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
      <input
        type="search"
        value={value}
        autoFocus={autoFocus}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        aria-label="Search lessons"
        className="h-11 w-full rounded-full border border-line bg-surface pl-11 pr-10 text-sm text-fg placeholder:text-muted focus:border-accent focus:outline-none [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button type="button" onClick={() => setValue('')} aria-label="Clear search" className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer rounded-full p-1 text-muted hover:text-fg">
          <X size={16} />
        </button>
      )}
    </form>
  );
}
