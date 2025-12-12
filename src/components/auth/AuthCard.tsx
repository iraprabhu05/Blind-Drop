
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AuthCardProps {
  title: string;
  description: string;
  userType: 'user' | 'artist';
  children: React.ReactNode;
  footer: React.ReactNode;
}

const AuthCard: React.FC<AuthCardProps> = ({ title, description, userType, children, footer }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "relative w-full max-w-md p-8 space-y-6 rounded-2xl shadow-xl",
        "bg-card/40 backdrop-blur-xl border",
        userType === 'user' 
          ? "border-neon-teal/30 shadow-neon-teal/20"
          : "border-neon-violet/30 shadow-neon-violet/20"
      )}
    >
      <div className="text-center space-y-2 animate-fade-in">
        <h1 className="font-heading text-3xl font-bold text-gradient">
          {title}
        </h1>
        <p className="text-muted-foreground">
          {description}
        </p>
      </div>
      <div className="animate-fade-in animation-delay-200">
        {children}
      </div>
      <div className="text-center text-sm text-muted-foreground animate-fade-in animation-delay-300">
        {footer}
      </div>
    </motion.div>
  );
};

export default AuthCard;
