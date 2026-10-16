import { Link } from 'react-router-dom';
import { Thumbnail } from '../search/SearchResultCard';

export default function TrendingCarousel({ videos }) {
  return (
    <div className="no-scrollbar -mx-4 flex scroll-px-4 snap-x gap-4 overflow-x-auto px-4 pb-2 md:-mx-6 md:scroll-px-6 md:px-6">
      {videos.map((v, i) => (
        <Link key={v.id} to={`/watch/${v.id}`} className="group w-64 shrink-0 snap-start sm:w-72">
          <div className="relative">
            <Thumbnail video={v} />
            <span className="absolute left-2 top-2 flex h-6 w-6 items-center justify-center rounded-md bg-accent font-display text-xs font-bold text-accent-fg">{i + 1}</span>
          </div>
          <h3 className="mt-2 line-clamp-2 text-sm font-semibold leading-snug group-hover:text-accent">{v.title}</h3>
          <p className="mt-0.5 text-xs text-muted">{v.creator.name} · {v.subject}</p>
        </Link>
      ))}
    </div>
  );
}
