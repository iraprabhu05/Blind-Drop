import { useMemo } from "react";
import { useGeolocation } from "@/hooks/useGeolocation";
import { mockArtists, Artist } from "@/utils/mockArtists";
import { haversineDistance } from "@/utils/distance";
import { ArtistCard } from "@/components/ArtistCard";
import { Navigation } from "@/components/Navigation";
import { Particles } from "@/components/Particles";
import { LocationBanner } from "@/components/LocationBanner";
import { Skeleton } from "@/components/ui/skeleton";

const Artists = () => {
  const { location, loading, error, retry } = useGeolocation();

  const artistsWithDistance = useMemo(() => {
    if (!location?.latitude || !location?.longitude) return mockArtists;
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

  const sortedArtists = useMemo(() => {
    return artistsWithDistance.sort((a, b) => {
      if (a.distance && b.distance) {
        return a.distance - b.distance;
      }
      return 0;
    });
  }, [artistsWithDistance]);

  return (
    <div className="min-h-screen bg-background overflow-hidden relative">
      <div className="fixed inset-0 bg-gradient-radial from-charcoal via-background to-background" />
      <div className="fixed inset-0 opacity-20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-neon-violet/10 rounded-full blur-[150px]" />
      </div>

      <Particles count={20} />
      <Navigation />

      <main className="relative z-10 flex flex-col items-center min-h-screen px-6 pt-32 pb-20">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center mb-12 opacity-0 animate-fade-in">
            <h1 className="font-heading text-4xl sm:text-5xl font-bold mb-4">
              Discover <span className="text-gradient">Artists</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg mx-auto">
              Browse artists near you and around the world.
            </p>
          </div>

          {loading && (
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
          )}

          {error && <LocationBanner onRetry={retry} />}

          {!loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {sortedArtists.map((artist) => (
                <ArtistCard
                  key={artist.id}
                  artist={artist}
                  playSong={() => {}}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Artists;
