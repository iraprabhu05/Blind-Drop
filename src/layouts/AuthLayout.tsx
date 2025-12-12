import React from "react";
import { Particles } from "../components/Particles";
import { Link } from "react-router-dom";
import { X } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background overflow-hidden relative">
      <div className="fixed inset-0 bg-gradient-radial from-charcoal via-background to-background" />
      <div className="fixed inset-0 opacity-30">
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-neon-violet/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-neon-teal/10 rounded-full blur-[120px]" />
      </div>
      <Particles count={30} />
      <Link
        to="/"
        className="absolute top-8 right-8 text-muted-foreground hover:text-foreground z-20"
      >
        <X className="w-6 h-6" />
      </Link>
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
        {children}
      </main>
    </div>
  );
};

export default AuthLayout;
