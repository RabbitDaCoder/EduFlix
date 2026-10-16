import { Heart, Bookmark, Share2 } from 'lucide-react';
import Button from '../ui/Button';
import { useToast } from '../ui/Toast';
import { useLiked, useSaved } from '@/hooks/useLibrary';
import { shareVideo, cn } from '@/lib/utils';

export default function VideoActions({ video, className }) {
  const toast = useToast();
  const { isLiked, toggle: toggleLike } = useLiked();
  const { isSaved, toggle: toggleSave } = useSaved();
  const liked = isLiked(video);
  const saved = isSaved(video);

  const share = async () => {
    const r = await shareVideo(video);
    if (r === 'copied') toast('Link copied to clipboard');
    if (r === 'failed') toast('Could not share this lesson');
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Button onClick={() => toggleLike(video)} aria-pressed={liked} className={liked ? 'border-accent/40 text-accent' : ''}>
        <Heart size={18} fill={liked ? 'currentColor' : 'none'} /> <span className="max-sm:sr-only">{liked ? 'Liked' : 'Like'}</span>
      </Button>
      <Button
        onClick={() => { toggleSave(video); toast(saved ? 'Removed from Saved' : 'Saved for later'); }}
        aria-pressed={saved}
        className={saved ? 'border-accent/40 text-accent' : ''}
      >
        <Bookmark size={18} fill={saved ? 'currentColor' : 'none'} /> <span className="max-sm:sr-only">{saved ? 'Saved' : 'Save'}</span>
      </Button>
      <Button onClick={share}><Share2 size={18} /> <span className="max-sm:sr-only">Share</span></Button>
    </div>
  );
}
