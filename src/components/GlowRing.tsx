import { cn } from "@/lib/utils";

interface GlowRingProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  animate?: boolean;
}

const sizeClasses = {
  sm: "w-48 h-48",
  md: "w-64 h-64",
  lg: "w-80 h-80",
  xl: "w-96 h-96",
};

export const GlowRing = ({
  className,
  size = "lg",
  animate = true,
}: GlowRingProps) => {
  return (
    <div className={cn("relative", sizeClasses[size], className)}>
      {/* Outer glow ring */}
      <div
        className={cn(
          "absolute inset-0 rounded-full",
          "bg-gradient-to-r from-neon-violet via-neon-teal to-neon-violet",
          "opacity-30 blur-3xl",
          animate && "animate-ring-pulse",
        )}
      />

      {/* Middle ring */}
      <div
        className={cn(
          "absolute inset-4 rounded-full",
          "border-2 border-neon-violet/40",
          "shadow-neon",
          animate && "animate-ring-pulse animation-delay-200",
        )}
      />

      {/* Inner gradient ring */}
      <div
        className={cn(
          "absolute inset-8 rounded-full",
          "bg-gradient-to-br from-neon-violet/20 via-transparent to-neon-teal/20",
          "backdrop-blur-sm",
          animate && "animate-ring-pulse animation-delay-400",
        )}
      />

      {/* Core glow */}
      <div
        className={cn(
          "absolute inset-12 rounded-full",
          "bg-gradient-radial from-neon-teal/30 via-neon-violet/20 to-transparent",
          "blur-xl",
          animate && "animate-glow-pulse",
        )}
      />

      {/* Center accent */}
      <div
        className={cn(
          "absolute inset-[35%] rounded-full",
          "bg-gradient-to-br from-neon-violet/40 to-neon-teal/40",
          "blur-md",
        )}
      />
    </div>
  );
};
