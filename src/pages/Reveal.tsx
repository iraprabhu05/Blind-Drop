import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";
import { Particles } from "@/components/Particles";
import { Play, Heart, Share2, ArrowRight, Music, Loader2 } from "lucide-react";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import { revealApi, RevealData } from "@/lib/api";
import { toast } from "sonner";

const Reveal = () => {
  const { songId } = useParams<{ songId: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const [revealed, setRevealed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<RevealData | null>(null);

  // score passed via navigation state (from Listen page)
  const passedScore = (location.state as { score?: number })?.score ?? null;

  useEffect(() => {
    if (!songId) {
      navigate("/listen");
      return;
    }

    revealApi.get(parseInt(songId, 10))
      .then((d) => {
        setData(d);
        setLoading(false);
        // Small delay then show reveal animation
        setTimeout(() => setRevealed(true), 400);
      })
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : "Could not reveal";
        if (msg.includes("rate this track")) {
          toast.error("Rate the track first to reveal the artist");
          navigate(`/listen`);
        } else if (msg.includes("Authentication")) {
          navigate("/auth");
        } else {
          toast.error(msg);
          navigate("/listen");
        }
      });
  }, [songId, navigate]);

  const userScore = passedScore ?? data?.userScore ?? 0;

  return (
    <div className="min-h-screen bg-background overflow-hidden relative">
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
          {/* Loading state */}
          {loading && (
            <div className="flex items-center justify-center">
              <Loader2 className="w-12 h-12 animate-spin text-neon-violet" />
            </div>
          )}

          {/* Pre-reveal animation */}
          {!loading && !revealed && (
            <div className="flex items-center justify-center">
              <div className="w-32 h-32 rounded-full bg-gradient-neon animate-pulse blur-xl" />
            </div>
          )}

          {/* Revealed content */}
          {!loading && revealed && data && (
            <>
              {/* Confetti particles */}
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
                  {/* Album art */}
                  <div className="w-32 h-32 mx-auto mb-6 rounded-2xl overflow-hidden border-2 border-border/30">
                    {data.albumArtUrl ? (
                      <img
                        src={data.albumArtUrl}
                        alt={`${data.title} album art`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-neon-violet/30 to-neon-teal/30 flex items-center justify-center">
                        <Music className="w-16 h-16 text-foreground/60" />
                      </div>
                    )}
                  </div>

                  {/* Track info */}
                  <div className="mb-6">
                    <h2 className="font-heading text-2xl sm:text-3xl font-bold text-gradient mb-2">
                      {data.title}
                    </h2>
                    <p className="text-lg text-foreground font-medium mb-1">
                      by {data.artist}
                    </p>
                    <p className="text-sm text-muted-foreground font-ui">
                      {data.genre}
                    </p>
                  </div>

                  {/* Your rating */}
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 mb-6">
                    <span className="text-sm text-muted-foreground">Your rating:</span>
                    <span className="text-lg font-bold text-neon-violet">{userScore}/10</span>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center justify-center gap-3">
                    <Button variant="outline" size="icon" className="rounded-full">
                      <Play className="w-5 h-5" />
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-full">
                      <Heart className="w-5 h-5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full"
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        toast.success("Link copied!");
                      }}
                    >
                      <Share2 className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="glass-panel p-4 rounded-xl">
                    <div className="font-heading text-xl font-bold text-gradient">
                      {data.avgRating.toFixed(1)}
                    </div>
                    <div className="text-xs text-muted-foreground font-ui">Avg Rating</div>
                  </div>
                  <div className="glass-panel p-4 rounded-xl">
                    <div className="font-heading text-xl font-bold text-gradient">
                      {data.ratingCount}
                    </div>
                    <div className="text-xs text-muted-foreground font-ui">Total Ratings</div>
                  </div>
                </div>

                {/* Continue */}
                <Link to="/listen">
                  <Button variant="hero" size="xl" className="w-full sm:w-auto">
                    Next Track
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
