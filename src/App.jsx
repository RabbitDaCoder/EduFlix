import { Route, Routes, Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import EmptyState from '@/components/ui/EmptyState';
import Button from '@/components/ui/Button';
import Home from '@/pages/Home';
import Discover from '@/pages/Discover';
import Subject from '@/pages/Subject';
import Search from '@/pages/Search';
import Saved from '@/pages/Saved';
import History from '@/pages/History';
import Profile from '@/pages/Profile';
import Watch from '@/pages/Watch';
import Creator from '@/pages/Creator';
import Playlist from '@/pages/Playlist';

const NotFound = () => (
  <EmptyState icon={Compass} title="Page not found" description="That page does not exist." action={<Button as={Link} to="/" variant="primary">Back to the feed</Button>} />
);

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Home />} />
        <Route path="discover" element={<Discover />} />
        <Route path="subjects/:slug" element={<Subject />} />
        <Route path="search" element={<Search />} />
        <Route path="saved" element={<Saved />} />
        <Route path="history" element={<History />} />
        <Route path="profile" element={<Profile />} />
        <Route path="watch/:id" element={<Watch />} />
        <Route path="creators/:id" element={<Creator />} />
        <Route path="paths/:id" element={<Playlist />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
