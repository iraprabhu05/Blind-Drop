import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface MoodCardProps {
  mood: string;
  icon: LucideIcon;
  gradient: string;
  selected?: boolean;
  onClick?: () => void;
}

export const MoodCard = ({ mood, icon: Icon, gradient, selected, onClick }: MoodCardProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative flex flex-col items-center justify-center gap-4 p-8 rounded-3xl transition-all duration-500",
        "bg-card/40 backdrop-blur-xl border border-border/30",
        "hover:scale-105 hover:shadow-float cursor-pointer",
        "min-h-[180px] w-full",
        selected && "border-primary/60 shadow-neon scale-105"
      )}
    >
      {/* Gradient background on hover/select */}
      <div 
        className={cn(
          "absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500",
          "group-hover:opacity-20",
          selected && "opacity-30",
          gradient
        )}
      />
      
      {/* Icon container */}
      <div 
        className={cn(
          "relative flex items-center justify-center w-16 h-16 rounded-2xl transition-all duration-500",
          "bg-gradient-to-br from-muted/50 to-muted/30",
          "group-hover:shadow-neon",
          selected && "shadow-neon",
          gradient
        )}
      >
        <Icon className="w-8 h-8 text-foreground transition-transform duration-500 group-hover:scale-110" />
      </div>

      {/* Label */}
      <span className={cn(
        "font-heading font-medium text-lg transition-all duration-300",
        selected ? "text-gradient" : "text-foreground"
      )}>
        {mood}
      </span>

      {/* Selection indicator */}
      {selected && (
        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gradient-neon shadow-neon animate-pulse" />
      )}
    </button>
  );
};
