
import React from 'react';
import { Card, CardContent } from '../../ui/card';
import { Plus } from 'lucide-react';

const PlaylistQuickAccess = ({ playlists, onCreatePlaylist }) => {
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-heading font-bold mb-4">Your Playlists</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        <Card 
          className="bg-card border-border flex flex-col items-center justify-center text-center p-6 cursor-pointer hover:bg-muted transition-colors duration-200 rounded-lg"
          onClick={onCreatePlaylist}
        >
          <Plus size={40} className="mb-2 text-primary" />
          <p className="font-sans font-semibold">Create Playlist</p>
        </Card>
        {playlists.map((playlist) => (
          <Card key={playlist.id} className="bg-card border-border cursor-pointer hover:bg-muted transition-colors duration-200 rounded-lg">
            <div className={`h-32 rounded-t-lg ${playlist.gradient}`}></div>
            <div className="p-4">
              <h3 className="font-sans font-semibold">{playlist.name}</h3>
              <p className="text-sm text-muted-foreground">{playlist.songCount} songs</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PlaylistQuickAccess;
