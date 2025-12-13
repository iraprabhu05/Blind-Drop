import { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  SkipForward,
  Star,
  Eye,
  AlertCircle,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";
import { Particles } from "@/components/Particles";
import { cn } from "@/lib/utils";
import { songs } from "../utils/songs";
import { getSmartRecommendation } from "../utils/aiService";

const Listen = () => {
  // STATE
  const [isPlaying, setIsPlaying] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [currentSong, setCurrentSong] = useState(songs[0]);
  const [isRevealed, setIsRevealed] = useState(false);

  const [aiMessage, setAiMessage] = useState<string | null>(null);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioError, setAudioError] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(new Audio(songs[0].audio));

  // HELPERS
  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
  };

  // AUTO HIDE AI MESSAGE
  useEffect(() => {
    if (!aiMessage) return;
    const timer = setTimeout(() => setAiMessage(null), 3000);
    return () => clearTimeout(timer);
  }, [aiMessage]);

  // AUDIO EVENTS
  useEffect(() => {
    const audio = audioRef.current;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);
    const handleError = () => {
      setAudioError(true);
      setIsPlaying(false);
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
    };
  }, []);

  // PLAY / PAUSE
  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  // SONG CHANGE
  useEffect(() => {
    audioRef.current.pause();
    audioRef.current = new Audio(currentSong.audio);

    audioRef.current.addEventListener("timeupdate", () =>
      setCurrentTime(audioRef.current.currentTime),
    );
    audioRef.current.addEventListener("loadedmetadata", () =>
      setDuration(audioRef.current.duration),
    );
    audioRef.current.addEventListener("error", () => setAudioError(true));

    setRating(0);
    setHoveredRating(0);
    setIsRevealed(false);
    setAudioError(false);
    setCurrentTime(0);

    if (isPlaying) {
      audioRef.current.play().catch(() => {});
    }
  }, [currentSong]);

  // HANDLERS
  const handleRate = async (star: number) => {
    setRating(star);
    setIsRevealed(true);

    if (star >= 4) {
      try {
        const nextSong = await getSmartRecommendation(currentSong);

        // 👇 BLIND-SAFE AI MESSAGE
        const messageOptions = [
          "AI thinks you’ll like this vibe",
          "Next up: similar energy and genre",
          "Queued something with a matching feel",
          "Based on your rating, this should hit",
        ];

        setAiMessage(
          messageOptions[Math.floor(Math.random() * messageOptions.length)],
        );

        setCurrentSong(nextSong);
        setIsPlaying(true);
      } catch {
        setAiMessage("AI skipped ahead to a similar track");
        handleSkip();
      }
    }
  };

  const handleSkip = () => {
    const idx = songs.findIndex((s) => s.id === currentSong.id);
    setCurrentSong(songs[(idx + 1) % songs.length]);
    setIsPlaying(true);
  };

  return (
    <div className="h-screen w-full bg-background overflow-hidden relative flex flex-col">
      <Particles count={15} />

      <div className="relative z-50">
        <Navigation />
      </div>

      <main className="flex-1 flex flex-col items-center justify-center w-full max-w-lg mx-auto px-6 gap-5 z-10">
        {/* STATUS */}
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel text-xs font-ui text-muted-foreground">
          <div className="w-2 h-2 rounded-full bg-neon-teal animate-pulse" />
          Blind Listening Mode
        </span>

        {/* AI MESSAGE */}
        {aiMessage && (
          <div className="animate-in zoom-in duration-300">
            <div className="px-4 py-2 rounded-xl bg-neon-teal text-black font-ui text-sm shadow-xl">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                {aiMessage}
              </div>
            </div>
          </div>
        )}

        {/* SONG */}
        <div className="h-16 flex items-center justify-center">
          {isRevealed ? (
            <div className="text-center">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-neon-violet to-neon-teal bg-clip-text text-transparent">
                {currentSong.title}
              </h2>
              <p className="text-lg text-white">{currentSong.artist}</p>
            </div>
          ) : (
            <div className="text-center text-muted-foreground blur-sm">
              <h2 className="text-2xl font-bold">Hidden Track</h2>
              <p>Rate to reveal</p>
            </div>
          )}
        </div>

        {/* PLAYER */}
        <div className="relative w-56 h-56">
          {audioError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 rounded-full text-red-500 text-xs">
              <AlertCircle className="w-6 h-6 mb-2" />
              Audio error
            </div>
          )}

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="absolute inset-[20%] rounded-full glass-panel flex items-center justify-center"
          >
            {isPlaying ? (
              <Pause className="w-16 h-16 text-white" />
            ) : (
              <Play className="w-16 h-16 text-white ml-2" />
            )}
          </button>
        </div>

        {/* PROGRESS */}
        <div className="w-full">
          <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-neon-violet to-neon-teal"
              style={{
                width: `${duration ? (currentTime / duration) * 100 : 0}%`,
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* RATING */}
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => handleRate(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
            >
              <Star
                className={cn(
                  "w-8 h-8",
                  (hoveredRating || rating) >= star
                    ? "fill-neon-violet text-neon-violet"
                    : "text-muted-foreground/20",
                )}
              />
            </button>
          ))}
        </div>

        {/* CONTROLS */}
        <div className="flex gap-4">
          <Button variant="ghost" size="sm" onClick={handleSkip}>
            <SkipForward className="w-4 h-4 mr-2" />
            Skip
          </Button>
          <Button size="sm" onClick={() => setIsRevealed(true)}>
            <Eye className="w-4 h-4 mr-2" />
            Reveal
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Listen;
