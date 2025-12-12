import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";
import { Particles } from "@/components/Particles";
import { MoodCard } from "@/components/MoodCard";
import { Smile, Moon, Zap, Heart, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const moods = [
  {
    id: "happy",
    mood: "Happy",
    icon: Smile,
    gradient: "bg-gradient-to-br from-yellow-500/30 to-orange-500/30",
  },
  {
    id: "chill",
    mood: "Chill",
    icon: Moon,
    gradient: "bg-gradient-to-br from-blue-500/30 to-cyan-500/30",
  },
  {
    id: "energetic",
    mood: "Energetic",
    icon: Zap,
    gradient: "bg-gradient-to-br from-neon-violet/30 to-pink-500/30",
  },
  {
    id: "romantic",
    mood: "Romantic",
    icon: Heart,
    gradient: "bg-gradient-to-br from-rose-500/30 to-neon-teal/30",
  },
];

const Discover = () => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background overflow-hidden relative">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-radial from-charcoal via-background to-background" />
      <div className="fixed inset-0 opacity-20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-neon-violet/10 rounded-full blur-[150px]" />
      </div>

      <Particles count={20} />
      <Navigation />

      <main className="relative z-10 flex flex-col items-center min-h-screen px-6 pt-32 pb-20">
        <div className="max-w-4xl mx-auto w-full">
          {/* Header */}
          <div className="text-center mb-12 opacity-0 animate-fade-in">
            <h1 className="font-heading text-4xl sm:text-5xl font-bold mb-4">
              Choose Your <span className="text-gradient">Mood</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg mx-auto">
              Select how you're feeling and we'll match you with the perfect
              anonymous track
            </p>
          </div>

          {/* Mood Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
            {moods.map((mood, index) => (
              <div
                key={mood.id}
                className="opacity-0 animate-fade-in"
                style={{ animationDelay: `${(index + 1) * 100}ms` }}
              >
                <MoodCard
                  mood={mood.mood}
                  icon={mood.icon}
                  gradient={mood.gradient}
                  selected={selectedMood === mood.id}
                  onClick={() => setSelectedMood(mood.id)}
                />
              </div>
            ))}
          </div>

          {/* Continue Button */}
          <div className="flex justify-center opacity-0 animate-fade-in animation-delay-500">
            <Link to={selectedMood ? "/listen" : "#"}>
              <Button
                variant="hero"
                size="xl"
                disabled={!selectedMood}
                className="disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                Continue to Listen
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>

          {/* Sound waves decoration */}
          <div className="flex justify-center gap-1 mt-16 opacity-0 animate-fade-in animation-delay-500">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="w-1 bg-gradient-to-t from-neon-violet to-neon-teal rounded-full animate-waveform"
                style={{
                  height: `${20 + Math.random() * 30}px`,
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Discover;
