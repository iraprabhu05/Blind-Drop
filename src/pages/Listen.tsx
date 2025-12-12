import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";
import { Particles } from "@/components/Particles";
import { Play, Pause, SkipForward, Star, Eye, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { songs } from "../utils/songs";
import { getSmartRecommendation } from "../utils/aiService";

const Listen = () => {
  // --- STATE ---
  const [isPlaying, setIsPlaying] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [currentSong, setCurrentSong] = useState(songs[0]);
  const [isRevealed, setIsRevealed] = useState(false);

  // Audio Time State
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioError, setAudioError] = useState(false);

  // Audio Ref
  const audioRef = useRef(new Audio(songs[0].audio));

  // --- HELPER: Format Time ---
  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
  };

  // --- AUDIO LOGIC ---
  useEffect(() => {
    const audio = audioRef.current;

    // Event Handlers
    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    // ERROR HANDLER (Crucial for debugging)
    const handleError = (e: any) => {
      console.error("Audio Load Error:", e);
      setAudioError(true);
      setIsPlaying(false);
    };

    // Attach Listeners
    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
      audio.pause();
    };
  }, [currentSong]);

  // Handle Play/Pause Toggle
  useEffect(() => {
    if (isPlaying) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.error("Playback prevented:", error);
          setIsPlaying(false);
        });
      }
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  // Handle Song Change
  useEffect(() => {
    audioRef.current.pause();
    audioRef.current = new Audio(currentSong.audio);

    // Re-attach critical listeners for new audio object
    audioRef.current.addEventListener("timeupdate", () =>
      setCurrentTime(audioRef.current.currentTime)
    );
    audioRef.current.addEventListener("loadedmetadata", () =>
      setDuration(audioRef.current.duration)
    );
    audioRef.current.addEventListener("error", () => setAudioError(true));

    setIsRevealed(false);
    setRating(0);
    setAudioError(false);
    setCurrentTime(0);

    if (isPlaying)
      audioRef.current
        .play()
        .catch((e) => console.error("Auto-play failed:", e));
  }, [currentSong]);

  // --- HANDLERS ---
  const handleRate = async (star: number) => {
    setRating(star);
    setIsRevealed(true);

    if (star >= 4) {
      try {
        const nextSong = await getSmartRecommendation(currentSong);
        alert(`✨ AI Suggestion: We queued "${nextSong.title}" next!`);
      } catch (e) {
        console.error("AI Error", e);
      }
    }
  };

  const handleSkip = () => {
    const currentIndex = songs.findIndex((s) => s.id === currentSong.id);
    const nextIndex = (currentIndex + 1) % songs.length;
    setCurrentSong(songs[nextIndex]);
    setIsPlaying(true);
  };

  return (
    // FIX: h-screen prevents scrolling, overflow-hidden stops bounce
    <div className="h-screen w-full bg-background overflow-hidden relative flex flex-col">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-radial from-charcoal via-background to-background pointer-events-none" />
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-violet/15 rounded-full blur-[150px]" />
      </div>

      <Particles count={15} />

      {/* Header stays at top */}
      <div className="relative z-50">
        <Navigation />
      </div>

      {/* Main Content - Centered Perfectly */}
      <main className="flex-1 flex flex-col items-center justify-center w-full max-w-lg mx-auto px-6 gap-6 z-10">
        {/* 1. Status Badge */}
        <div className="animate-fade-in">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel text-xs font-ui text-muted-foreground">
            <div className="w-2 h-2 rounded-full bg-neon-teal animate-pulse" />
            Blind Listening Mode
          </span>
        </div>

        {/* 2. Song Title Area (Fixed Height to prevent jumping) */}
        <div className="h-16 flex items-center justify-center w-full">
          {isRevealed ? (
            <div className="text-center animate-in fade-in zoom-in duration-300">
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-violet to-neon-teal font-heading truncate max-w-md">
                {currentSong.title}
              </h2>
              <p className="text-lg text-white mt-1 font-ui">
                {currentSong.artist}
              </p>
            </div>
          ) : (
            <div className="text-center animate-pulse">
              <h2 className="text-2xl font-bold text-muted-foreground/50 font-heading blur-sm select-none">
                Hidden Track
              </h2>
              <p className="text-muted-foreground/30 font-ui blur-sm select-none">
                Rate to reveal...
              </p>
            </div>
          )}
        </div>

        {/* 3. The Player Visualizer (Slightly smaller to fit screen) */}
        <div className="relative w-56 h-56 flex-shrink-0">
          {/* Error Message if Audio Fails */}
          {audioError && (
            <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/80 rounded-full text-red-500 font-bold text-center p-4">
              <AlertCircle className="w-6 h-6 mb-2 mx-auto" />
              <span className="text-xs">
                File Not Found: {currentSong.audio}
              </span>
            </div>
          )}

          {/* Rings */}
          <div
            className={cn(
              "absolute inset-0 rounded-full border-2 border-neon-violet/20 transition-all duration-500",
              isPlaying && "animate-ring-pulse"
            )}
          />
          <div
            className={cn(
              "absolute inset-3 rounded-full border border-neon-teal/15 transition-all duration-500",
              isPlaying && "animate-ring-pulse animation-delay-200"
            )}
          />

          {/* BIG Play Button */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={cn(
              "absolute inset-[20%] rounded-full glass-panel flex items-center justify-center transition-all duration-300 z-20 group",
              "hover:scale-105 hover:shadow-neon-combined active:scale-95",
              isPlaying && "shadow-neon-combined border-neon-violet/50"
            )}
          >
            {isPlaying ? (
              <Pause className="w-16 h-16 text-white group-hover:text-neon-teal transition-colors" />
            ) : (
              <Play className="w-16 h-16 text-white ml-2 group-hover:text-neon-violet transition-colors" />
            )}
          </button>
        </div>

        {/* 4. Progress Bar & Time */}
        <div className="w-full space-y-2">
          <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden w-full">
            <div
              className="h-full bg-gradient-to-r from-neon-violet to-neon-teal transition-all duration-100 ease-linear"
              style={{
                width: `${duration ? (currentTime / duration) * 100 : 0}%`,
              }}
            />
          </div>
          <div className="flex justify-between text-xs font-ui text-muted-foreground px-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* 5. Rating Stars */}
        <div className="flex justify-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => handleRate(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="p-1.5 transition-all duration-200 hover:scale-110 active:scale-90"
            >
              <Star
                className={cn(
                  "w-8 h-8 transition-all duration-200",
                  (hoveredRating || rating) >= star
                    ? "fill-neon-violet text-neon-violet drop-shadow-lg"
                    : "text-muted-foreground/20"
                )}
              />
            </button>
          ))}
        </div>

        {/* 6. Controls */}
        <div className="flex gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSkip}
            className="text-muted-foreground hover:text-white"
          >
            <SkipForward className="w-4 h-4 mr-2" />
            Skip
          </Button>
          <Button
            className="bg-neon-violet/20 text-neon-violet hover:bg-neon-violet/40 border border-neon-violet/50"
            size="sm"
            onClick={() => setIsRevealed(true)}
          >
            <Eye className="w-4 h-4 mr-2" />
            Reveal
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Listen;
