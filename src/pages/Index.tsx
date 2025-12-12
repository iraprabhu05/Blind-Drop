import { useState } from "react";
import { Button } from "@/components/ui/button";
import { GlowRing } from "@/components/GlowRing";
import { Particles } from "@/components/Particles";
import { Navigation } from "@/components/Navigation";
import { ArtistsNearYouPreview } from "@/components/ArtistsNearYouPreview";
import MusicPlayerBar from "@/components/dashboards/UserDashboard/MusicPlayerBar";
import { Play, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayUrl = (songUrl, artist) => {
    const song = {
      url: songUrl,
      title: artist.name,
      artist: artist.genre,
      cover: artist.avatarUrl,
    };
    setCurrentSong(song);
    setIsPlaying(true);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="min-h-screen bg-background relative">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-radial from-charcoal via-background to-background" />

      {/* Subtle gradient waves */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-neon-violet/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-neon-teal/10 rounded-full blur-[120px]" />
      </div>

      {/* Floating particles */}
      <Particles count={30} />

      {/* Navigation */}
      <Navigation />

      {/* Main content */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 pt-24 pb-24">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          {/* Animated glow ring */}
          <div className="relative mb-8 animate-fade-in">
            <GlowRing size="xl" animate />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="p-6 rounded-full bg-card/60 backdrop-blur-xl border border-border/30 shadow-neon-combined">
                <Play className="w-12 h-12 text-foreground ml-1" />
              </div>
            </div>
          </div>

          {/* Tagline */}
          <div className="flex items-center gap-2 mb-6 opacity-0 animate-fade-in animation-delay-200">
            <Sparkles className="w-5 h-5 text-neon-teal" />
            <span className="font-ui text-sm text-muted-foreground tracking-wider uppercase">
              Anonymous Audio Discovery
            </span>
            <Sparkles className="w-5 h-5 text-neon-violet" />
          </div>

          {/* Main heading */}
          <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl font-bold mb-6 opacity-0 animate-fade-in animation-delay-300">
            <span className="text-foreground">Listen Without</span>
            <br />
            <span className="text-gradient">Identity</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mb-10 leading-relaxed opacity-0 animate-fade-in animation-delay-400">
            Discover music purely by sound. No names, no biases. Just you and
            the music, waiting to be revealed.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 opacity-0 animate-fade-in animation-delay-500">
            <Link to="/discover">
              <Button variant="hero" size="xl">
                <Play className="w-5 h-5 mr-2" />
                Start Blind Discovery
              </Button>
            </Link>
            <Link to="/upload">
              <Button variant="ghost_neon" size="lg">
                Upload Your Track
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 sm:gap-16 opacity-0 animate-fade-in animation-delay-500">
            {[
              { value: "10K+", label: "Tracks" },
              { value: "50K+", label: "Discoveries" },
              { value: "98%", label: "Unbiased" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-heading text-2xl sm:text-3xl font-bold text-gradient mb-1">
                  {stat.value}
                </div>
                <div className="font-ui text-xs sm:text-sm text-muted-foreground uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-16 w-full max-w-3xl mx-auto opacity-0 animate-fade-in animation-delay-600">
            <Link to="/reality-wrapped">
              <div className="bg-card/60 backdrop-blur-xl border border-border/30 rounded-lg p-6 shadow-neon-combined hover:shadow-neon-violet-strong transition-shadow duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                      {" "}
                      Reality Check Wrapped (Demo)
                    </h2>
                    <p className="text-muted-foreground">
                      See how your blind ratings reveal your true taste.
                    </p>
                  </div>
                  <div className="relative">
                    <GlowRing size="sm" animate />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-neon-violet" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
        <ArtistsNearYouPreview playSong={handlePlayUrl} />
      </main>

      {/* Bottom gradient fade */}
      <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />

      {/* Music Player */}
      <MusicPlayerBar
        song={currentSong}
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
        onNext={() => {}} // Not implemented for landing page
        onPrev={() => {}} // Not implemented for landing page
      />
    </div>
  );
};

export default Index;
