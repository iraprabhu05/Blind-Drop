import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium font-heading transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-[0_0_40px_hsl(var(--primary)/0.4)] hover:shadow-[0_0_60px_hsl(var(--primary)/0.3),0_0_100px_hsl(var(--secondary)/0.2)] hover:scale-105",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border-2 border-primary/50 bg-transparent text-foreground hover:border-primary hover:shadow-[0_0_40px_hsl(var(--primary)/0.4)] backdrop-blur-sm",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-[0_0_40px_hsl(var(--secondary)/0.4)]",
        ghost: "text-foreground hover:bg-muted hover:text-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        neon: "relative bg-card border-2 border-transparent text-foreground font-semibold overflow-hidden before:absolute before:inset-[-2px] before:rounded-xl before:bg-gradient-to-r before:from-primary before:to-secondary before:z-[-1] before:opacity-80 hover:before:opacity-100 hover:shadow-[0_0_60px_hsl(var(--primary)/0.3),0_0_100px_hsl(var(--secondary)/0.2)] hover:scale-105",
        ghost_neon:
          "border border-primary/30 bg-transparent text-foreground hover:border-primary/60 hover:shadow-[0_0_40px_hsl(var(--primary)/0.4)] backdrop-blur-sm",
        hero: "relative px-8 py-4 text-lg bg-gradient-to-r from-primary to-secondary text-primary-foreground font-semibold shadow-[0_0_60px_hsl(var(--primary)/0.3),0_0_100px_hsl(var(--secondary)/0.2)] hover:shadow-[0_0_80px_hsl(var(--primary)/0.5),0_0_140px_hsl(var(--secondary)/0.4)] hover:scale-105 active:scale-100",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 rounded-lg px-4",
        lg: "h-12 rounded-xl px-8 text-base",
        xl: "h-14 rounded-2xl px-10 text-lg",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);
