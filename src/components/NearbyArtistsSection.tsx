import { useState, useMemo } from "react";
import { useGeolocation } from "@/hooks/useGeolocation";
import { mockArtists, Artist } from "@/utils/mockArtists";
import { haversineDistance } from "@/utils/distance";
import { ArtistCard } from "./ArtistCard";
import { LocationBanner } from "./LocationBanner";
import { RadiusFilter } from "./RadiusFilter";
import { Skeleton } from "./ui/skeleton";

interface NearbyArtistsSectionProps {
  playSong: (songUrl: string, artist: Artist) => void;
}

export const NearbyArtistsSection = ({
  playSong,
}: NearbyArtistsSectionProps) => {
  const { location, error, loading } = useGeolocation();
  const [radius, setRadius] = useState(5); // Default radius in km

  const artistsWithDistance = useMemo(() => {
    if (!location) return [];
    return mockArtists.map((artist) => ({
      ...artist,
      distance: haversineDistance(
        location.latitude,
        location.longitude,
        artist.lat,
        artist.lon
      ),
    }));
  }, [location]);

  const filteredArtists = useMemo(() => {
    return artistsWithDistance
      .filter(
        (artist) => artist.distance !== undefined && artist.distance <= radius
      )
      .sort((a, b) => a.distance! - b.distance!);
  }, [artistsWithDistance, radius]);

  const handlePlaySong = (artist: Artist) => {
    playSong(artist.topSongUrl, artist);
  };

  if (loading) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-full">
              <Skeleton className="w-full h-40 rounded-lg mb-3" />
              <Skeleton className="w-3/4 h-5 mb-2" />
              <Skeleton className="w-1/2 h-4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <LocationBanner message="Could not access your location. Please enable location services in your browser settings." />
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-white">Artists Near You</h2>
        <RadiusFilter selectedRadius={radius} onRadiusChange={setRadius} />
      </div>
      {filteredArtists.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredArtists.map((artist) => (
            <ArtistCard
              key={artist.id}
              artist={artist}
              playSong={() => handlePlaySong(artist)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-900/50 rounded-lg">
          <p className="text-lg text-gray-400">
            No artists found within {radius}km.
          </p>
          <p className="text-gray-500 mt-2">Try expanding your search radius.</p>
        </div>
      )}
    </div>
  );
};
