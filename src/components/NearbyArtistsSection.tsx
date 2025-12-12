import { useState, useMemo } from "react";
import { useGeolocation } from "@/hooks/useGeolocation";
import { mockArtists, Artist } from "@/utils/mockArtists";
import { haversineDistance } from "@/utils/distance";
import { ArtistCard } from "./ArtistCard";
import { LocationBanner } from "./LocationBanner";
import { RadiusFilter } from "./RadiusFilter";
import { Skeleton } from "./ui/skeleton";

interface NearbyArtistsSectionProps {
  playSong: (songUrl: string) => void;
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
        artist.lon,
      ),
    }));
  }, [location]);

  const filteredArtists = useMemo(() => {
    return artistsWithDistance
      .filter(
        (artist) => artist.distance !== undefined && artist.distance <= radius,
      )
      .sort((a, b) => a.distance! - b.distance!);
  }, [artistsWithDistance, radius]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="w-[250px] bg-card/60 backdrop-blur-sm border-border/20 shadow-lg rounded-xl p-4"
          >
            <Skeleton className="w-full h-40 rounded-lg mb-4" />
            <Skeleton className="w-3/4 h-6 mb-2" />
            <Skeleton className="w-1/2 h-4" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <LocationBanner message="Could not access your location. Please enable location services in your browser settings." />
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Nearby Artists</h2>
        <RadiusFilter selectedRadius={radius} onRadiusChange={setRadius} />
      </div>
      {filteredArtists.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredArtists.map((artist) => (
            <ArtistCard key={artist.id} artist={artist} playSong={playSong} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No artists found within {radius}km. Try expanding your radius.
          </p>
        </div>
      )}
    </div>
  );
};
