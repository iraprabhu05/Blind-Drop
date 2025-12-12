import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";
import { Particles } from "@/components/Particles";
import { Play, Heart, Share2, ArrowRight, Music } from "lucide-react";
import { Link } from "react-router-dom";

const Reveal = () => {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setRevealed(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-hidden relative">
      {/* Background with burst effect */}
      <div className="fixed inset-0 bg-gradient-radial from-charcoal via-background to-background" />

      {/* Radial burst on reveal */}
      <div
        className={`fixed inset-0 transition-opacity duration-1000 ${revealed ? "opacity-100" : "opacity-0"}`}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-radial from-neon-violet/20 via-neon-teal/10 to-transparent rounded-full blur-[100px]" />
      </div>

      <Particles count={40} />
      <Navigation />

      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 pt-24 pb-20">
        <div className="max-w-md mx-auto w-full text-center">
          {/* Pre-reveal state */}
          {!revealed && (
            <div className="flex items-center justify-center">
              <div className="w-32 h-32 rounded-full bg-gradient-neon animate-pulse blur-xl" />
            </div>
          )}

          {/* Revealed content */}
          {revealed && (
            <>
              {/* Celebration particles burst effect */}
              <div className="absolute inset-0 pointer-events-none">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 rounded-full bg-gradient-neon animate-reveal"
                    style={{
                      left: `${50 + (Math.random() - 0.5) * 60}%`,
                      top: `${40 + (Math.random() - 0.5) * 40}%`,
                      animationDelay: `${i * 0.05}s`,
                    }}
                  />
                ))}
              </div>

              {/* Artist card */}
              <div className="animate-reveal">
                <div className="glass-panel p-8 rounded-3xl shadow-neon-combined mb-8">
                  {/* Artist image placeholder */}
                  <div className="w-32 h-32 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-neon-violet/30 to-neon-teal/30 flex items-center justify-center overflow-hidden border-2 border-border/30">
                    <Music className="w-16 h-16 text-foreground/60" />
                  </div>

                  {/* Track info */}
                  <div className="mb-6">
                    <h2 className="font-heading text-2xl sm:text-3xl font-bold text-gradient mb-2">
                      Midnight Echo
                    </h2>
                    <p className="text-lg text-foreground font-medium mb-1">
                      by Aurora Waves
                    </p>
                    <p className="text-sm text-muted-foreground font-ui">
                      Electronic • 2024
                    </p>
                  </div>

                  {/* Rating you gave */}
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 mb-6">
                    <span className="text-sm text-muted-foreground">
                      Your rating:
                    </span>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={
                            star <= 4
                              ? "text-neon-violet"
                              : "text-muted-foreground/30"
                          }
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center justify-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full"
                    >
                      <Play className="w-5 h-5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full"
                    >
                      <Heart className="w-5 h-5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full"
                    >
                      <Share2 className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  {[
                    { value: "4.8", label: "Avg Rating" },
                    { value: "12.3K", label: "Plays" },
                    { value: "89%", label: "Match" },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="glass-panel p-4 rounded-xl"
                    >
                      <div className="font-heading text-xl font-bold text-gradient">
                        {stat.value}
                      </div>
                      <div className="text-xs text-muted-foreground font-ui">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Continue button */}
                <Link to="/discover">
                  <Button variant="hero" size="xl" className="w-full sm:w-auto">
                    Discover More
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Reveal;
