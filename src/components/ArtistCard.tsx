import { Artist } from "@/utils/mockArtists";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
} from "./ui/card";
import { Button } from "./ui/button";
import { PlayIcon } from "@heroicons/react/24/solid";

interface ArtistCardProps {
  artist: Artist;
  playSong: () => void;
}

export const ArtistCard = ({ artist, playSong }: ArtistCardProps) => {
  return (
    <Card className="w-full max-w-sm bg-card/60 backdrop-blur-sm border-border/20 shadow-lg rounded-xl overflow-hidden transform transition-all hover:scale-105 hover:shadow-2xl group">
      <CardContent className="p-0">
        <div className="relative">
          <img
            src={artist.avatarUrl}
            alt={artist.name}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
            <div>
              <CardTitle className="text-lg font-bold text-white truncate">
                {artist.name}
              </CardTitle>
              <CardDescription className="text-sm text-gray-300">
                {artist.genre}
              </CardDescription>
            </div>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <Button
              size="icon"
              className="bg-primary/80 hover:bg-primary rounded-full h-12 w-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              onClick={playSong}
            >
              <PlayIcon className="h-7 w-7 text-primary-foreground" />
            </Button>
          </div>
        </div>
        {artist.distance && (
          <div className="p-4 bg-card/60">
            <p className="text-xs text-muted-foreground">
              {artist.distance.toFixed(2)} km away
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
