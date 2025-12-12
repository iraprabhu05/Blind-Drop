import React from "react";
import { Card, CardContent } from "../../ui/card";

const RecentlyPlayedRow = ({ songs, onPlay }) => {
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-heading font-bold mb-4">Recently Played</h2>
      <div className="flex overflow-x-auto space-x-6 pb-4">
        {songs.map((song) => (
          <div
            key={song.id}
            className="min-w-[200px] cursor-pointer"
            onClick={() => onPlay(song)}
          >
            <Card className="bg-transparent border-none">
              <CardContent className="p-0">
                <img
                  src={song.cover}
                  alt={song.title}
                  className="w-full h-auto rounded-lg mb-2"
                />
                <h3 className="font-sans font-semibold">{song.title}</h3>
                <p className="text-sm text-muted-foreground">{song.artist}</p>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentlyPlayedRow;
