import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";
import { Particles } from "@/components/Particles";
import { Upload as UploadIcon, Music, ChevronDown, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { uploadApi } from "@/lib/api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const GENRES = ["Electronic", "Hip-Hop", "Indie/Rock", "R&B/Soul", "Jazz", "Classical", "Pop", "Other"];

const Upload = () => {
  const navigate = useNavigate();
  const [dragOver, setDragOver] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [showGenres, setShowGenres] = useState(false);
  const [fileName, setFileName] = useState("");
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [albumArtUrl, setAlbumArtUrl] = useState("");
  const [tags, setTags] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) setFileName(file.name);
  };

  const handleSubmit = async () => {
    if (!title || !artist || !audioUrl || !selectedGenre) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    try {
      await uploadApi.song({
        title,
        artist,
        audio: audioUrl,
        genre: selectedGenre,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        albumArtUrl: albumArtUrl || undefined,
      });
      toast.success("Track submitted for review!");
      navigate("/profile");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Upload failed";
      if (msg.includes("Authentication")) {
        toast.error("Please sign in to upload tracks");
        navigate("/auth");
      } else if (msg.includes("Insufficient")) {
        toast.error("Only artists can upload tracks");
      } else {
        toast.error(msg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background overflow-hidden relative">
      <div className="fixed inset-0 bg-gradient-radial from-charcoal via-background to-background" />
      <div className="fixed inset-0 opacity-20">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-neon-teal/10 rounded-full blur-[150px]" />
      </div>

      <Particles count={15} />
      <Navigation />

      <main className="relative z-10 flex flex-col items-center min-h-screen px-6 pt-32 pb-20">
        <div className="max-w-xl mx-auto w-full">
          <div className="text-center mb-10 opacity-0 animate-fade-in">
            <h1 className="font-heading text-4xl sm:text-5xl font-bold mb-4">
              Upload Your <span className="text-gradient">Track</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Share your music anonymously and let the sound speak for itself
            </p>
          </div>

          <div className="glass-panel p-8 rounded-3xl opacity-0 animate-fade-in animation-delay-200 space-y-6">
            {/* Drop zone (visual only — URL input used for actual audio) */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={cn(
                "relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer",
                dragOver
                  ? "border-primary bg-primary/5 shadow-neon"
                  : "border-border/50 hover:border-primary/50 hover:bg-muted/20",
              )}
            >
              <input
                type="file"
                accept="audio/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setFileName(file.name);
                }}
              />
              <div className="flex flex-col items-center gap-3">
                <div className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center",
                  fileName ? "bg-mint/20" : "bg-gradient-to-br from-neon-violet/20 to-neon-teal/20",
                )}>
                  {fileName ? <Music className="w-7 h-7 text-mint" /> : <UploadIcon className="w-7 h-7 text-foreground" />}
                </div>
                <div>
                  <p className="font-medium text-foreground mb-0.5">
                    {fileName || "Drop audio file here"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {fileName ? "File selected (direct upload coming soon)" : "or use the audio URL field below"}
                  </p>
                </div>
              </div>
            </div>

            {/* Track title */}
            <div>
              <label className="block text-sm font-ui text-muted-foreground mb-2">
                Track Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter track title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:shadow-neon transition-all"
              />
            </div>

            {/* Artist name */}
            <div>
              <label className="block text-sm font-ui text-muted-foreground mb-2">
                Artist Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                placeholder="Your artist name..."
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-all"
              />
            </div>

            {/* Audio URL */}
            <div>
              <label className="block text-sm font-ui text-muted-foreground mb-2">
                Audio URL <span className="text-red-400">*</span>
              </label>
              <input
                type="url"
                placeholder="https://example.com/track.mp3"
                value={audioUrl}
                onChange={(e) => setAudioUrl(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-all"
              />
            </div>

            {/* Album Art URL */}
            <div>
              <label className="block text-sm font-ui text-muted-foreground mb-2">
                Album Art URL (optional)
              </label>
              <input
                type="url"
                placeholder="https://example.com/cover.jpg"
                value={albumArtUrl}
                onChange={(e) => setAlbumArtUrl(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-all"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-ui text-muted-foreground mb-2">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                placeholder="chill, lo-fi, relaxing"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-all"
              />
            </div>

            {/* Genre dropdown */}
            <div className="relative">
              <label className="block text-sm font-ui text-muted-foreground mb-2">
                Genre <span className="text-red-400">*</span>
              </label>
              <button
                onClick={() => setShowGenres(!showGenres)}
                className={cn(
                  "w-full px-4 py-3 rounded-xl bg-muted/50 border border-border/30 text-left flex items-center justify-between transition-all",
                  showGenres && "border-primary/50 shadow-neon",
                )}
              >
                <span className={selectedGenre ? "text-foreground" : "text-muted-foreground"}>
                  {selectedGenre || "Select a genre..."}
                </span>
                <ChevronDown className={cn("w-5 h-5 text-muted-foreground transition-transform", showGenres && "rotate-180")} />
              </button>

              {showGenres && (
                <div className="absolute top-full left-0 right-0 mt-2 glass-panel rounded-xl overflow-hidden z-20 border border-border/30">
                  {GENRES.map((genre) => (
                    <button
                      key={genre}
                      onClick={() => { setSelectedGenre(genre); setShowGenres(false); }}
                      className={cn(
                        "w-full px-4 py-3 text-left hover:bg-muted/50 transition-colors flex items-center justify-between",
                        selectedGenre === genre && "bg-primary/10 text-primary",
                      )}
                    >
                      {genre}
                      {selectedGenre === genre && <Check className="w-4 h-4" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Submit */}
            <Button
              variant="hero"
              size="xl"
              className="w-full"
              disabled={!title || !artist || !audioUrl || !selectedGenre || submitting}
              onClick={handleSubmit}
            >
              {submitting ? (
                <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Submitting...</>
              ) : (
                <><UploadIcon className="w-5 h-5 mr-2" /> Submit Track</>
              )}
            </Button>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6 opacity-0 animate-fade-in animation-delay-300">
            Your identity will remain hidden until listeners choose to reveal it
          </p>
        </div>
      </main>
    </div>
  );
};

export default Upload;
