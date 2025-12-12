
import React, { useState } from 'react';
import { LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import RecommendationsCarousel from '../../components/dashboards/UserDashboard/RecommendationsCarousel';
import FavoritesPanel from '../../components/dashboards/UserDashboard/FavoritesPanel';
import RecentlyPlayedRow from '../../components/dashboards/UserDashboard/RecentlyPlayedRow';
import GenreTags from '../../components/dashboards/UserDashboard/GenreTags';
import PlaylistQuickAccess from '../../components/dashboards/UserDashboard/PlaylistQuickAccess';
import MusicPlayerBar from '../../components/dashboards/UserDashboard/MusicPlayerBar';
import CreatePlaylistDialog from '../../components/dashboards/UserDashboard/CreatePlaylistDialog';
import { Button } from '../../components/ui/button';

// Mock Data
const recommendedSongs = [
  { id: 1, title: 'Mirage', artist: 'Stylo', cover: 'https://placehold.co/300x300/1a1a1a/ffffff?text=Mirage' },
  { id: 2, title: 'Odyssey', artist: 'A.L.I.S.O.N', cover: 'https://placehold.co/300x300/1a1a1a/ffffff?text=Odyssey' },
  { id: 3, title: 'Nightcall', artist: 'Kavinsky', cover: 'https://placehold.co/300x300/1a1a1a/ffffff?text=Nightcall' },
  { id: 4, title: 'Genesis', artist: 'Justice', cover: 'https://placehold.co/300x300/1a1a1a/ffffff?text=Genesis' },
  { id: 5, title: 'Hotline', artist: 'Jasper Byrne', cover: 'https://placehold.co/300x300/1a1a1a/ffffff?text=Hotline' },
];

const favoriteSongs = [
  { id: 6, title: 'Resonance', artist: 'Home', cover: 'https://placehold.co/100x100/1a1a1a/ffffff?text=Resonance' },
  { id: 7, title: 'Crystals', artist: 'M.O.O.N.', cover: 'https://placehold.co/100x100/1a1a1a/ffffff?text=Crystals' },
  { id: 8, title: 'Voyager', artist: 'Daft Punk', cover: 'https://placehold.co/100x100/1a1a1a/ffffff?text=Voyager' },
];

const recentlyPlayedSongs = [
    { id: 9, title: 'Turbo Killer', artist: 'Carpenter Brut', cover: 'https://placehold.co/200x200/1a1a1a/ffffff?text=Turbo+Killer' },
    { id: 10, title: 'Technoir', artist: 'Perturbator', cover: 'https://placehold.co/200x200/1a1a1a/ffffff?text=Technoir' },
    { id: 11, title: 'Miami Disco', artist: 'Miami Nights 1984', cover: 'https://placehold.co/200x200/1a1a1a/ffffff?text=Miami+Disco' },
    { id: 12, title: 'Sunset', artist: 'The Midnight', cover: 'https://placehold.co/200x200/1a1a1a/ffffff?text=Sunset' },
];

const genres = ['Synthwave', 'Retrowave', 'Vaporwave', 'Chillwave', 'Darkwave', 'Cyberpunk'];

const initialPlaylists = [
    { id: 1, name: 'Night Drive', songCount: 23, gradient: 'bg-gradient-to-br from-purple-900 to-blue-900' },
    { id: 2, name: 'Coding Focus', songCount: 42, gradient: 'bg-gradient-to-br from-green-900 to-gray-900' },
    { id: 3, name: '80s Nostalgia', songCount: 18, gradient: 'bg-gradient-to-br from-pink-900 to-yellow-900' },
];


const UserDashboard = () => {
    const { logout } = useAuth();
    const [currentSong, setCurrentSong] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [playlists, setPlaylists] = useState(initialPlaylists);
    const [isCreatePlaylistOpen, setCreatePlaylistOpen] = useState(false);

    const handlePlay = (song) => {
        setCurrentSong(song);
        setIsPlaying(true);
    };

    const handlePlayPause = () => {
        setIsPlaying(!isPlaying);
    }

    const handleNext = () => {
        // Mock next song
        const allSongs = [...recommendedSongs, ...favoriteSongs, ...recentlyPlayedSongs];
        const currentIndex = allSongs.findIndex(s => s.id === currentSong.id);
        const nextIndex = (currentIndex + 1) % allSongs.length;
        setCurrentSong(allSongs[nextIndex]);
    }

    const handlePrev = () => {
        // Mock prev song
        const allSongs = [...recommendedSongs, ...favoriteSongs, ...recentlyPlayedSongs];
        const currentIndex = allSongs.findIndex(s => s.id === currentSong.id);
        const prevIndex = (currentIndex - 1 + allSongs.length) % allSongs.length;
        setCurrentSong(allSongs[prevIndex]);
    }

    const handleCreatePlaylist = (newPlaylist) => {
        setPlaylists([...playlists, { 
            ...newPlaylist, 
            id: playlists.length + 1, 
            songCount: 0,
            gradient: 'bg-gradient-to-br from-gray-700 to-gray-800'
        }]);
    }

  return (
    <div className="bg-background text-foreground min-h-screen font-sans">
      <div className="container mx-auto p-6 lg:p-10">
        {/* Header */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-heading font-bold">Welcome back, User</h1>
            <p className="text-muted-foreground text-lg">Your personalized music dashboard</p>
          </div>
          <Button variant="ghost" onClick={logout}>
            <LogOut size={18} className="mr-2"/>
            Logout
          </Button>
        </header>

        <main className="pb-32 space-y-16">
          <RecommendationsCarousel songs={recommendedSongs} onPlay={handlePlay} />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2">
                <RecentlyPlayedRow songs={recentlyPlayedSongs} onPlay={handlePlay} />
              </div>
              <div>
                <FavoritesPanel songs={favoriteSongs} onPlay={handlePlay}/>
              </div>
          </div>
          <GenreTags genres={genres} />
          <PlaylistQuickAccess playlists={playlists} onCreatePlaylist={() => setCreatePlaylistOpen(true)} />
        </main>
      </div>

      <CreatePlaylistDialog 
        isOpen={isCreatePlaylistOpen}
        onClose={() => setCreatePlaylistOpen(false)}
        onCreate={handleCreatePlaylist}
      />

      {/* Music Player */}
      <MusicPlayerBar 
        song={currentSong} 
        isPlaying={isPlaying} 
        onPlayPause={handlePlayPause}
        onNext={handleNext}
        onPrev={handlePrev}
      />
    </div>
  );
};

export default UserDashboard;
