import { Artist } from "@/utils/mockArtists";
import { Card, CardContent, CardFooter, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { PlayIcon } from "@heroicons/react/24/solid";
import { cn } from "@/lib/utils";

interface ArtistCardProps {
  artist: Artist;
  playSong: (songUrl: string) => void;
}

export const ArtistCard = ({ artist, playSong }: ArtistCardProps) => {
  return (
    <Card className="w-[250px] bg-card/60 backdrop-blur-sm border-border/20 shadow-lg rounded-xl overflow-hidden transform transition-all hover:scale-105 hover:shadow-2xl">
      <CardContent className="p-4">
        <div className="relative mb-4">
          <img
            src={artist.avatarUrl}
            alt={artist.name}
            className="w-full h-40 object-cover rounded-lg"
          />
          <Button
            size="icon"
            className="absolute bottom-2 right-2 bg-primary/80 hover:bg-primary rounded-full h-10 w-10"
            onClick={() => playSong(artist.topSongUrl)}
          >
            <PlayIcon className="h-6 w-6 text-primary-foreground" />
          </Button>
        </div>
        <CardTitle className="text-lg font-bold truncate">{artist.name}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">{artist.genre}</CardDescription>
        {artist.distance && (
          <p className="text-xs text-muted-foreground mt-2">
            {artist.distance.toFixed(2)} km away
          </p>
        )}
      </CardContent>
    </Card>
  );
};
