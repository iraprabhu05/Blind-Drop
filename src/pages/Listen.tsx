import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";
import { Particles } from "@/components/Particles";
import { Play, Pause, SkipForward, Star, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

const Listen = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [progress, setProgress] = useState(35);

  return (
    <div className="min-h-screen bg-background overflow-hidden relative">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-radial from-charcoal via-background to-background" />
      <div className="fixed inset-0 opacity-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neon-violet/15 rounded-full blur-[200px]" />
      </div>
      
      <Particles count={15} />
      <Navigation />

      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 pt-24 pb-20">
        <div className="max-w-lg mx-auto w-full text-center">
          {/* Status */}
          <div className="mb-8 opacity-0 animate-fade-in">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel text-sm font-ui text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-neon-teal animate-pulse" />
              Listening Without Identity
            </span>
          </div>

          {/* Waveform Player */}
          <div className="relative mb-12 opacity-0 animate-fade-in animation-delay-200">
            {/* Circular waveform container */}
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 mx-auto">
              {/* Outer glow rings */}
              <div className={cn(
                "absolute inset-0 rounded-full border-2 border-neon-violet/20 transition-all duration-500",
                isPlaying && "animate-ring-pulse"
              )} />
              <div className={cn(
                "absolute inset-4 rounded-full border border-neon-teal/15 transition-all duration-500",
                isPlaying && "animate-ring-pulse animation-delay-200"
              )} />
              <div className={cn(
                "absolute inset-8 rounded-full border border-neon-violet/10 transition-all duration-500",
                isPlaying && "animate-ring-pulse animation-delay-400"
              )} />

              {/* Waveform bars around circle */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-48 h-48 sm:w-56 sm:h-56">
                  {Array.from({ length: 24 }).map((_, i) => {
                    const angle = (i * 15 * Math.PI) / 180;
                    const radius = 85;
                    const x = Math.cos(angle) * radius;
                    const y = Math.sin(angle) * radius;
                    const height = 15 + Math.random() * 25;
                    
                    return (
                      <div
                        key={i}
                        className={cn(
                          "absolute w-1 bg-gradient-to-t from-neon-violet to-neon-teal rounded-full origin-bottom transition-all duration-300",
                          isPlaying && "animate-waveform"
                        )}
                        style={{
                          height: `${height}px`,
                          left: `calc(50% + ${x}px)`,
                          top: `calc(50% + ${y}px)`,
                          transform: `translateX(-50%) rotate(${i * 15}deg)`,
                          animationDelay: `${i * 0.05}s`,
                        }}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Center play button */}
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={cn(
                  "absolute inset-[25%] rounded-full glass-panel flex items-center justify-center transition-all duration-300",
                  "hover:scale-105 hover:shadow-neon-combined",
                  isPlaying && "shadow-neon-combined"
                )}
              >
                {isPlaying ? (
                  <Pause className="w-12 h-12 text-foreground" />
                ) : (
                  <Play className="w-12 h-12 text-foreground ml-1" />
                )}
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mb-8 px-4 opacity-0 animate-fade-in animation-delay-300">
            <div className="h-1 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-neon rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs font-ui text-muted-foreground">
              <span>1:24</span>
              <span>3:45</span>
            </div>
          </div>

          {/* Rating */}
          <div className="mb-8 opacity-0 animate-fade-in animation-delay-400">
            <p className="text-sm text-muted-foreground mb-4 font-ui">Rate this track</p>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="p-1 transition-all duration-200 hover:scale-110"
                >
                  <Star
                    className={cn(
                      "w-8 h-8 transition-all duration-200",
                      (hoveredRating || rating) >= star
                        ? "fill-neon-violet text-neon-violet drop-shadow-[0_0_10px_hsl(var(--neon-violet)/0.5)]"
                        : "text-muted-foreground/30"
                    )}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 animate-fade-in animation-delay-500">
            <Button variant="ghost_neon" size="lg" onClick={() => setIsPlaying(false)}>
              <SkipForward className="w-5 h-5 mr-2" />
              Skip Track
            </Button>
            <Link to="/reveal">
              <Button variant="hero" size="lg" disabled={rating === 0}>
                <Eye className="w-5 h-5 mr-2" />
                Reveal Artist
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Listen;
