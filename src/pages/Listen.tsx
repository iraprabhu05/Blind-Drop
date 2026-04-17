import { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  SkipForward,
  AlertCircle,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";
import { Particles } from "@/components/Particles";
import { cn } from "@/lib/utils";
import { songsApi, ratingApi, recommendApi, SafeSong } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const SCORE_COLORS: Record<number, string> = {
  1: "#60a5fa", 2: "#60a5fa",
  3: "#34d399", 4: "#34d399",
  5: "#fbbf24", 6: "#fbbf24",
  7: "#f4845f", 8: "#f4845f",
  9: "#f43f5e", 10: "#f43f5e",
};

const Listen = () => {
  const navigate = useNavigate();

  // Song state
  const [songs, setSongs] = useState<SafeSong[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadingSongs, setLoadingSongs] = useState(true);

  // Player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioError, setAudioError] = useState(false);
  const [loadingAudio, setLoadingAudio] = useState(false);

  // Rating state
  const [selectedScore, setSelectedScore] = useState<number | null>(null);
  const [hoveredScore, setHoveredScore] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [listenedEnough, setListenedEnough] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentSong = songs[currentIndex] ?? null;

  // Load songs from API on mount
  useEffect(() => {
    songsApi.getAll()
      .then((data) => {
        setSongs(data);
        setLoadingSongs(false);
      })
      .catch(() => {
        toast.error("Failed to load songs");
        setLoadingSongs(false);
      });
  }, []);

  // Load audio whenever the current song changes
  useEffect(() => {
    if (!currentSong) return;

    setAudioError(false);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setSelectedScore(null);
    setListenedEnough(false);
    setLoadingAudio(true);

    const audio = new Audio();
    audioRef.current = audio;

    songsApi.stream(currentSong.id)
      .then(({ audioUrl }) => {
        audio.src = audioUrl;
        audio.load();
        setLoadingAudio(false);
      })
      .catch(() => {
        setAudioError(true);
        setLoadingAudio(false);
      });

    const onTime = () => {
      setCurrentTime(audio.currentTime);
      if (audio.currentTime >= 30 || (audio.duration && audio.currentTime / audio.duration >= 0.3)) {
        setListenedEnough(true);
      }
    };
    const onDuration = () => setDuration(audio.duration);
    const onEnded = () => { setIsPlaying(false); setListenedEnough(true); };
    const onError = () => { setAudioError(true); setIsPlaying(false); };

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onDuration);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);

    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onDuration);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
    };
  }, [currentSong?.id]);

  // Sync play/pause
  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  const formatTime = (t: number) => {
    if (isNaN(t) || !isFinite(t)) return "0:00";
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s < 10 ? "0" + s : s}`;
  };

  const handleSkip = async () => {
    if (!currentSong) return;
    try {
      const next = await recommendApi.get(currentSong.id, selectedScore ?? 0);
      if (next) {
        const idx = songs.findIndex((s) => s.id === next.id);
        if (idx !== -1) {
          setCurrentIndex(idx);
          setIsPlaying(true);
          return;
        }
        setSongs((prev) => [...prev, next]);
        setCurrentIndex(songs.length);
      } else {
        setCurrentIndex((i) => (i + 1) % songs.length);
      }
    } catch {
      setCurrentIndex((i) => (i + 1) % songs.length);
    }
    setIsPlaying(true);
  };

  const handleSubmitRating = async () => {
    if (!currentSong || selectedScore === null || submitting) return;
    setSubmitting(true);
    try {
      await ratingApi.submit(currentSong.id, selectedScore);
      navigate(`/reveal/${currentSong.id}`, { state: { score: selectedScore } });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Rating failed";
      if (msg.includes("Authentication")) {
        toast.error("Please sign in to rate tracks");
        navigate("/auth");
      } else {
        toast.error(msg);
      }
      setSubmitting(false);
    }
  };

  const activeScore = hoveredScore ?? selectedScore;

  if (loadingSongs) {
    return (
      <div className="h-screen w-full bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-neon-violet" />
      </div>
    );
  }

  if (!currentSong) {
    return (
      <div className="h-screen w-full bg-background flex items-center justify-center text-muted-foreground">
        No tracks available
      </div>
    );
  }

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

        {/* GENRE BADGE */}
        <div className="text-center">
          <span className="px-3 py-1 rounded-full text-xs font-ui bg-neon-violet/20 text-neon-violet border border-neon-violet/30">
            {currentSong.genre}
          </span>
          <div className="mt-2 text-center text-muted-foreground blur-sm select-none">
            <h2 className="text-2xl font-bold">Hidden Track</h2>
            <p>Rate to reveal the artist</p>
          </div>
        </div>

        {/* PLAYER */}
        <div className="relative w-56 h-56">
          {audioError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 rounded-full text-red-500 text-xs">
              <AlertCircle className="w-6 h-6 mb-2" />
              Audio unavailable
            </div>
          )}
          {loadingAudio && !audioError && (
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40">
              <Loader2 className="w-8 h-8 animate-spin text-neon-violet" />
            </div>
          )}

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            disabled={loadingAudio || audioError}
            className="absolute inset-[20%] rounded-full glass-panel flex items-center justify-center disabled:opacity-40"
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
              className="h-full bg-gradient-to-r from-neon-violet to-neon-teal transition-all"
              style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* RATING 1-10 */}
        <div className="w-full">
          {!listenedEnough && (
            <p className="text-center text-xs text-muted-foreground mb-2">
              Listen for 30s to unlock rating
            </p>
          )}
          <div className="flex gap-1 justify-center flex-wrap">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
              <button
                key={score}
                disabled={!listenedEnough}
                onClick={() => setSelectedScore(score)}
                onMouseEnter={() => setHoveredScore(score)}
                onMouseLeave={() => setHoveredScore(null)}
                style={{
                  borderColor: (activeScore ?? 0) >= score ? SCORE_COLORS[score] : undefined,
                  color: (activeScore ?? 0) >= score ? SCORE_COLORS[score] : undefined,
                  backgroundColor: selectedScore === score ? `${SCORE_COLORS[score]}20` : undefined,
                }}
                className={cn(
                  "w-9 h-9 rounded-lg border text-sm font-bold transition-all duration-150",
                  listenedEnough
                    ? "border-muted-foreground/20 text-muted-foreground hover:scale-110"
                    : "border-muted-foreground/10 text-muted-foreground/30 cursor-not-allowed",
                  selectedScore === score && "scale-110",
                )}
              >
                {score}
              </button>
            ))}
          </div>
        </div>

        {/* CONTROLS */}
        <div className="flex gap-4">
          <Button variant="ghost" size="sm" onClick={handleSkip}>
            <SkipForward className="w-4 h-4 mr-2" />
            Skip
          </Button>
          <Button
            size="sm"
            disabled={selectedScore === null || submitting || !listenedEnough}
            onClick={handleSubmitRating}
          >
            {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {submitting ? "Submitting..." : "Rate & Reveal"}
          </Button>
        </div>

        {currentSong.ratingCount > 0 && (
          <p className="text-xs text-muted-foreground">
            Community avg: <strong>{currentSong.avgRating.toFixed(1)}</strong> from {currentSong.ratingCount} ratings
          </p>
        )}
      </main>
    </div>
  );
};

export default Listen;
