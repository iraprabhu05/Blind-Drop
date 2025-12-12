import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";
import { Particles } from "@/components/Particles";
import { Upload as UploadIcon, Music, ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const moods = ["Happy", "Chill", "Energetic", "Romantic", "Melancholic", "Uplifting"];

const Upload = () => {
  const [dragOver, setDragOver] = useState(false);
  const [selectedMood, setSelectedMood] = useState("");
  const [showMoods, setShowMoods] = useState(false);
  const [fileName, setFileName] = useState("");

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) setFileName(file.name);
  };

  return (
    <div className="min-h-screen bg-background overflow-hidden relative">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-radial from-charcoal via-background to-background" />
      <div className="fixed inset-0 opacity-20">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-neon-teal/10 rounded-full blur-[150px]" />
      </div>
      
      <Particles count={15} />
      <Navigation />

      <main className="relative z-10 flex flex-col items-center min-h-screen px-6 pt-32 pb-20">
        <div className="max-w-xl mx-auto w-full">
          {/* Header */}
          <div className="text-center mb-10 opacity-0 animate-fade-in">
            <h1 className="font-heading text-4xl sm:text-5xl font-bold mb-4">
              Upload Your <span className="text-gradient">Track</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Share your music anonymously and let the sound speak for itself
            </p>
          </div>

          {/* Upload form */}
          <div className="glass-panel p-8 rounded-3xl opacity-0 animate-fade-in animation-delay-200">
            {/* Drop zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={cn(
                "relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer mb-6",
                dragOver 
                  ? "border-primary bg-primary/5 shadow-neon" 
                  : "border-border/50 hover:border-primary/50 hover:bg-muted/20"
              )}
            >
              {/* Corner glows */}
              <div className={cn(
                "absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 rounded-tl-lg transition-colors duration-300",
                dragOver ? "border-primary shadow-neon" : "border-primary/50"
              )} />
              <div className={cn(
                "absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 rounded-tr-lg transition-colors duration-300",
                dragOver ? "border-primary shadow-neon" : "border-primary/50"
              )} />
              <div className={cn(
                "absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 rounded-bl-lg transition-colors duration-300",
                dragOver ? "border-secondary shadow-neon-teal" : "border-secondary/50"
              )} />
              <div className={cn(
                "absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 rounded-br-lg transition-colors duration-300",
                dragOver ? "border-secondary shadow-neon-teal" : "border-secondary/50"
              )} />

              <input
                type="file"
                accept="audio/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setFileName(file.name);
                }}
              />

              <div className="flex flex-col items-center gap-4">
                <div className={cn(
                  "w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300",
                  fileName ? "bg-mint/20" : "bg-gradient-to-br from-neon-violet/20 to-neon-teal/20"
                )}>
                  {fileName ? (
                    <Music className="w-8 h-8 text-mint" />
                  ) : (
                    <UploadIcon className="w-8 h-8 text-foreground" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-foreground mb-1">
                    {fileName || "Drop your audio file here"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {fileName ? "File selected" : "or click to browse"}
                  </p>
                </div>
              </div>
            </div>

            {/* Title input */}
            <div className="mb-6">
              <label className="block text-sm font-ui text-muted-foreground mb-2">
                Track Title
              </label>
              <input
                type="text"
                placeholder="Enter track title..."
                className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:shadow-neon transition-all duration-300"
              />
            </div>

            {/* Mood dropdown */}
            <div className="mb-8 relative">
              <label className="block text-sm font-ui text-muted-foreground mb-2">
                Mood
              </label>
              <button
                onClick={() => setShowMoods(!showMoods)}
                className={cn(
                  "w-full px-4 py-3 rounded-xl bg-muted/50 border border-border/30 text-left flex items-center justify-between transition-all duration-300",
                  showMoods && "border-primary/50 shadow-neon"
                )}
              >
                <span className={selectedMood ? "text-foreground" : "text-muted-foreground"}>
                  {selectedMood || "Select a mood..."}
                </span>
                <ChevronDown className={cn(
                  "w-5 h-5 text-muted-foreground transition-transform duration-300",
                  showMoods && "rotate-180"
                )} />
              </button>

              {showMoods && (
                <div className="absolute top-full left-0 right-0 mt-2 glass-panel rounded-xl overflow-hidden z-20 border border-border/30">
                  {moods.map((mood) => (
                    <button
                      key={mood}
                      onClick={() => { setSelectedMood(mood); setShowMoods(false); }}
                      className={cn(
                        "w-full px-4 py-3 text-left hover:bg-muted/50 transition-colors duration-200 flex items-center justify-between",
                        selectedMood === mood && "bg-primary/10 text-primary"
                      )}
                    >
                      {mood}
                      {selectedMood === mood && <Check className="w-4 h-4" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Submit button */}
            <Button 
              variant="hero" 
              size="xl" 
              className="w-full"
              disabled={!fileName || !selectedMood}
            >
              <UploadIcon className="w-5 h-5 mr-2" />
              Submit Track
            </Button>
          </div>

          {/* Info */}
          <p className="text-center text-sm text-muted-foreground mt-6 opacity-0 animate-fade-in animation-delay-300">
            Your identity will remain hidden until listeners choose to reveal it
          </p>
        </div>
      </main>
    </div>
  );
};

export default Upload;
