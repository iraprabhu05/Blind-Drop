import React from "react";
import { Card, CardContent } from "../../ui/card";
import { MoreHorizontal } from "lucide-react";

const FavoritesPanel = ({ songs, onPlay }) => {
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-heading font-bold mb-4">Favorites</h2>
      <Card className="bg-card border-border">
        <CardContent className="p-4 space-y-2">
          {songs.map((song) => (
            <div
              key={song.id}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors duration-200 cursor-pointer"
              onClick={() => onPlay(song)}
            >
              <div className="flex items-center space-x-4">
                <img
                  src={song.cover}
                  alt={song.title}
                  className="w-12 h-12 rounded-md object-cover"
                />
                <div>
                  <h3 className="font-sans font-semibold">{song.title}</h3>
                  <p className="text-sm text-muted-foreground">{song.artist}</p>
                </div>
              </div>
              <button className="text-muted-foreground hover:text-foreground">
                <MoreHorizontal size={20} />
              </button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default FavoritesPanel;
