import { useEffect, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Particles } from "@/components/Particles";
import { Button } from "@/components/ui/button";
import {
  Music,
  Headphones,
  Star,
  TrendingUp,
  LogOut,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { profileApi, ProfileData } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";

const Profile = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    profileApi.get()
      .then(setData)
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : "Failed to load profile";
        if (msg.includes("Authentication")) {
          navigate("/auth");
        } else {
          toast.error(msg);
        }
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="h-screen w-full bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-neon-violet" />
      </div>
    );
  }

  const profile = data?.user;
  const stats = data?.stats;
  const ratedSongs = data?.ratedSongs ?? [];

  const initials = Array.from(profile?.username ?? '').slice(0, 2).join('').toUpperCase() || '??';

  const statsCards = [
    { icon: Headphones, value: String(stats?.totalRated ?? 0), label: "Tracks Rated" },
    { icon: Star, value: stats?.avgScore?.toFixed(1) ?? "0", label: "Avg Score" },
    { icon: TrendingUp, value: String(ratedSongs.length), label: "Reveals" },
    { icon: Music, value: profile?.role ?? "user", label: "Role" },
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden relative">
      <div className="fixed inset-0 bg-gradient-radial from-charcoal via-background to-background" />
      <div className="fixed inset-0 opacity-15">
        <div className="absolute top-1/4 right-0 w-1/2 h-1/2 bg-neon-violet/20 rounded-full blur-[150px]" />
      </div>

      <Particles count={15} />
      <Navigation />

      <main className="relative z-10 min-h-screen px-6 pt-32 pb-20">
        <div className="max-w-4xl mx-auto">
          {/* Profile header */}
          <div className="flex flex-col sm:flex-row items-center gap-6 mb-12 opacity-0 animate-fade-in">
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-neon-violet/30 to-neon-teal/30 flex items-center justify-center border-2 border-border/30 overflow-hidden">
                {profile?.avatarUrl ? (
                  <img src={profile.avatarUrl} alt={profile.username} className="w-full h-full object-cover" />
                ) : (
                  <span className="font-heading text-3xl font-bold text-gradient">{initials}</span>
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-mint flex items-center justify-center">
                <span className="text-xs">✓</span>
              </div>
            </div>

            <div className="text-center sm:text-left flex-1">
              <h1 className="font-heading text-3xl font-bold text-foreground mb-1">
                {profile?.username ?? "Anonymous"}
              </h1>
              <p className="text-muted-foreground font-ui">
                {profile?.email}
              </p>
            </div>

            <div className="flex gap-3">
              <Button variant="ghost_neon" size="icon" className="rounded-xl" onClick={handleLogout}>
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {statsCards.map((stat, index) => (
              <div
                key={stat.label}
                className={cn("glass-panel p-6 rounded-2xl text-center opacity-0 animate-fade-in")}
                style={{ animationDelay: `${(index + 1) * 100}ms` }}
              >
                <stat.icon className="w-6 h-6 text-neon-teal mx-auto mb-3" />
                <div className="font-heading text-2xl font-bold text-gradient mb-1">{stat.value}</div>
                <div className="text-xs text-muted-foreground font-ui">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Rated tracks */}
          <div className="opacity-0 animate-fade-in animation-delay-500">
            <h2 className="font-heading text-xl font-semibold mb-6">Rated Tracks</h2>
            {ratedSongs.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                No tracks rated yet.{" "}
                <Link to="/listen" className="text-neon-violet hover:underline">Start listening</Link>
              </p>
            ) : (
              <div className="space-y-3">
                {ratedSongs.map((track) => (
                  <div
                    key={`${track.songId}-${track.ratedAt}`}
                    className="glass-panel p-4 rounded-xl flex items-center gap-4 hover:shadow-neon transition-all duration-300"
                  >
                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                      {track.albumArtUrl ? (
                        <img src={track.albumArtUrl} alt={track.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-neon-violet/30 to-neon-teal/30 flex items-center justify-center">
                          <Music className="w-6 h-6 text-foreground/60" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground truncate">{track.title}</h3>
                      <p className="text-sm text-muted-foreground font-ui truncate">{track.artist} · {track.genre}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="w-4 h-4 text-neon-violet fill-neon-violet" />
                        <span className="text-foreground font-medium">{track.userRating}/10</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        avg {track.avgRating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
