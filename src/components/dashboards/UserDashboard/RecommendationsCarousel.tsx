import React from "react";
import { Card, CardContent } from "../../ui/card";
import { PlayCircle } from "lucide-react";

const RecommendationsCarousel = ({ songs, onPlay }) => {
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-heading font-bold mb-4">
        Recommended For You
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {songs.map((song) => (
          <div
            key={song.id}
            className="relative group cursor-pointer"
            onClick={() => onPlay(song)}
          >
            <Card className="bg-card border-border overflow-hidden">
              <CardContent className="p-0">
                <img
                  src={song.cover}
                  alt={song.title}
                  className="w-full h-auto aspect-square object-cover transition-transform duration-300 group-hover:scale-105 rounded-lg"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
                  <PlayCircle size={48} className="text-primary" />
                </div>
              </CardContent>
            </Card>
            <h3 className="text-md font-sans font-semibold mt-2">
              {song.title}
            </h3>
            <p className="text-sm text-muted-foreground">{song.artist}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendationsCarousel;
