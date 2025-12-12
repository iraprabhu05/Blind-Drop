import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useGeolocation } from '@/hooks/useGeolocation';
import { mockArtists, Artist } from '@/utils/mockArtists';
import { haversineDistance } from '@/utils/distance';
import { ArtistCard } from './ArtistCard';
import { Button } from './ui/button';
import { ArrowRight } from 'lucide-react';
import { Skeleton } from './ui/skeleton';
import { LocationBanner } from './LocationBanner';

interface ArtistsNearYouPreviewProps {
  playSong: (songUrl: string, artist: Artist) => void;
}

export const ArtistsNearYouPreview = ({ playSong }: ArtistsNearYouPreviewProps) => {
  const { location, loading, error, retry } = useGeolocation();

  const artistsWithDistance = useMemo(() => {
    if (!location?.latitude || !location?.longitude) return [];
    return mockArtists.map(artist => ({
      ...artist,
      distance: haversineDistance(
        location.latitude,
        location.longitude,
        artist.lat,
        artist.lon
      ),
    }));
  }, [location]);

  const nearbyArtists = useMemo(() => {
    return artistsWithDistance
      .filter(artist => artist.distance !== undefined)
      .sort((a, b) => a.distance! - b.distance!)
      .slice(0, 4);
  }, [artistsWithDistance]);

  if (loading) {
    return (
      <section className="relative z-10 w-full max-w-7xl mx-auto py-16">
        <div className="flex justify-between items-center mb-8 px-6">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-9 w-28" />
        </div>
        <div className="flex gap-6 pb-8 px-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-[250px] bg-card/60 backdrop-blur-sm border-border/20 shadow-lg rounded-xl p-4">
              <Skeleton className="w-full h-40 rounded-lg mb-4" />
              <Skeleton className="w-3/4 h-6 mb-2" />
              <Skeleton className="w-1/2 h-4" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
        <section className="relative z-10 w-full max-w-7xl mx-auto py-16 px-6">
            <LocationBanner onRetry={retry} />
        </section>
    );
  }

  if (nearbyArtists.length === 0) {
    return null; // Don't show the section if no location or no artists
  }

  return (
    <section className="relative z-10 w-full max-w-7xl mx-auto py-16">
      <div className="flex justify-between items-center mb-8 px-6">
        <h2 className="font-heading text-4xl font-bold text-foreground">Artists Near You</h2>
        <Link to="/discover">
          <Button variant="ghost">
            View More
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
      <div className="relative">
        <div className="flex overflow-x-auto scrolling-touch gap-6 pb-8 px-6">
          {nearbyArtists.map(artist => (
            <div key={artist.id} className="flex-shrink-0">
              <ArtistCard artist={artist} playSong={(songUrl) => playSong(songUrl, artist)} />
            </div>
          ))}
        </div>
        {/* Gradient overlays for scroll effect */}
        <div className="absolute top-0 bottom-0 left-0 w-12 bg-gradient-to-r from-background to-transparent pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-12 bg-gradient-to-l from-background to-transparent pointer-events-none" />
      </div>
    </section>
  );
};