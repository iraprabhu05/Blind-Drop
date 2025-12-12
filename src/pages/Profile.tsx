import { Navigation } from "@/components/Navigation";
import { Particles } from "@/components/Particles";
import { Button } from "@/components/ui/button";
import {
  Music,
  Headphones,
  Star,
  TrendingUp,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const stats = [
  { icon: Music, value: "12", label: "Tracks Uploaded" },
  { icon: Headphones, value: "847", label: "Blind Listens" },
  { icon: Star, value: "4.6", label: "Avg Rating" },
  { icon: TrendingUp, value: "23", label: "Reveals" },
];

const recentTracks = [
  { title: "Neon Dreams", plays: 234, rating: 4.8 },
  { title: "Midnight Echo", plays: 156, rating: 4.5 },
  { title: "Digital Sunrise", plays: 89, rating: 4.2 },
];

const Profile = () => {
  return (
    <div className="min-h-screen bg-background overflow-hidden relative">
      {/* Background */}
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
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-neon-violet/30 to-neon-teal/30 flex items-center justify-center border-2 border-border/30">
                <span className="font-heading text-3xl font-bold text-gradient">
                  AW
                </span>
              </div>
              <div className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-mint flex items-center justify-center">
                <span className="text-xs">✓</span>
              </div>
            </div>

            {/* Info */}
            <div className="text-center sm:text-left flex-1">
              <h1 className="font-heading text-3xl font-bold text-foreground mb-1">
                Anonymous Creator
              </h1>
              <p className="text-muted-foreground font-ui">
                Member since January 2024
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button variant="outline" size="icon" className="rounded-xl">
                <Settings className="w-5 h-5" />
              </Button>
              <Button variant="ghost_neon" size="icon" className="rounded-xl">
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className={cn(
                  "glass-panel p-6 rounded-2xl text-center opacity-0 animate-fade-in",
                )}
                style={{ animationDelay: `${(index + 1) * 100}ms` }}
              >
                <stat.icon className="w-6 h-6 text-neon-teal mx-auto mb-3" />
                <div className="font-heading text-2xl font-bold text-gradient mb-1">
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground font-ui">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Recent tracks */}
          <div className="opacity-0 animate-fade-in animation-delay-500">
            <h2 className="font-heading text-xl font-semibold mb-6">
              Your Tracks
            </h2>
            <div className="space-y-3">
              {recentTracks.map((track, index) => (
                <div
                  key={track.title}
                  className="glass-panel p-4 rounded-xl flex items-center gap-4 hover:shadow-neon transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-neon-violet/30 to-neon-teal/30 flex items-center justify-center">
                    <Music className="w-6 h-6 text-foreground/60" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground">
                      {track.title}
                    </h3>
                    <p className="text-sm text-muted-foreground font-ui">
                      {track.plays} blind listens
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="w-4 h-4 text-neon-violet fill-neon-violet" />
                    <span className="text-foreground font-medium">
                      {track.rating}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
