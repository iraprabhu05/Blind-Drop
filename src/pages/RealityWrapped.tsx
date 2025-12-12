
import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { mockWrappedData } from '@/utils/mockWrappedData';
import { Play, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CountUp } from 'countup.js';

const AtmosphericBackground = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden bg-background">
    <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-background to-background opacity-50" />
    <motion.div
      className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-neon-violet/20 rounded-full blur-[150px]"
      animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
      transition={{ duration: 20, repeat: Infinity, repeatType: 'mirror' }}
    />
    <motion.div
      className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-neon-teal/20 rounded-full blur-[150px]"
      animate={{ scale: [1, 1.1, 1], rotate: [0, -5, 0] }}
      transition={{ duration: 25, repeat: Infinity, repeatType: 'mirror' }}
    />
  </div>
);

const Counter = ({ to }) => {
  const ref = useRef(null);

  useEffect(() => {
    const countUp = new CountUp(ref.current, to);
    if (!countUp.error) {
      countUp.start();
    }
  }, [to]);

  return <span ref={ref} />;
};

const RealityWrapped: React.FC = () => {
  const [step, setStep] = useState(0);

  const handleNext = () => {
    if (step < sections.length - 1) {
      setStep(step + 1);
    }
  };

  const sections = [
    // Intro Slide
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
      <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-teal to-neon-violet mb-4 animate-shimmer">Reality Check Wrapped</h1>
      <p className="text-2xl text-muted-foreground">Your listening biases, revealed.</p>
    </motion.div>,

    // Blind vs Visible Rating Comparison
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-center">
      <h2 className="text-4xl font-bold mb-8">Blind vs. Visible Ratings</h2>
      <div className="flex justify-center items-end gap-16">
        <div className="flex flex-col items-center">
          <motion.div initial={{ height: 0 }} animate={{ height: `${mockWrappedData.ratingComparison.blindVoted}%` }} transition={{ duration: 1 }} className="w-24 bg-gradient-to-t from-neon-violet to-indigo-700 rounded-t-lg shadow-neon-violet-strong mb-4" />
          <p className="text-2xl font-bold"><Counter to={mockWrappedData.ratingComparison.blindVoted} />%</p>
          <p className="text-muted-foreground">Blind</p>
        </div>
        <div className="flex flex-col items-center">
          <motion.div initial={{ height: 0 }} animate={{ height: `${mockWrappedData.ratingComparison.visibleVoted}%` }} transition={{ duration: 1 }} className="w-24 bg-gradient-to-t from-neon-teal to-cyan-700 rounded-t-lg shadow-neon-teal-strong mb-4" />
          <p className="text-2xl font-bold"><Counter to={mockWrappedData.ratingComparison.visibleVoted} />%</p>
          <p className="text-muted-foreground">Visible</p>
        </div>
      </div>
      <p className="mt-8 text-xl max-w-md mx-auto">{mockWrappedData.ratingComparison.insight}</p>
    </motion.div>,

    // Hidden Bias Insights
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
      <h2 className="text-4xl font-bold mb-12">Hidden Bias Insights</h2>
      <div className="space-y-4">
        {mockWrappedData.hiddenBias.insights.map((insight, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.3 }}
            className="bg-card/30 backdrop-blur-lg border border-border/20 rounded-lg p-6 shadow-lg shadow-neon-violet/10"
          >
            <p className="text-xl">{insight}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>,

    // Genre Preference Shift
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-center">
        <h2 className="text-4xl font-bold mb-8">Genre Preference Shift</h2>
        <div className="flex w-full max-w-4xl mx-auto">
            <div className="w-1/2 pr-4">
            <h3 className="text-2xl font-bold mb-4 text-center">Blind</h3>
            {mockWrappedData.genrePreference.blind.map((genre, index) => (
                <div key={index} className="mb-2">
                <div className="flex justify-between mb-1">
                    <span>{genre.genre}</span>
                    <span>{genre.value}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-4">
                    <motion.div
                    className="bg-primary h-4 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${genre.value}%` }}
                    transition={{ duration: 1, delay: index * 0.2 }}
                    />
                </div>
                </div>
            ))}
            </div>
            <div className="w-1/2 pl-4">
            <h3 className="text-2xl font-bold mb-4 text-center">Visible</h3>
            {mockWrappedData.genrePreference.visible.map((genre, index) => (
                <div key={index} className="mb-2">
                <div className="flex justify-between mb-1">
                    <span>{genre.genre}</span>
                    <span>{genre.value}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-4">
                    <motion.div
                    className="bg-secondary h-4 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${genre.value}%` }}
                    transition={{ duration: 1, delay: index * 0.2 }}
                    />
                </div>
                </div>
            ))}
            </div>
        </div>
    </motion.div>,

    // Surprise Favorites
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-center">
        <h2 className="text-4xl font-bold mb-8">Surprise Favorites</h2>
        <div className="grid grid-cols-3 gap-4">
            {mockWrappedData.surpriseFavorites.map((track, index) => (
            <motion.div
                key={track.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.2 }}
                className="bg-card p-4 rounded-lg shadow-lg text-center"
            >
                <img src={track.albumArt} alt={track.title} className="w-full h-auto rounded-md mb-4" />
                <h3 className="font-bold">{track.title}</h3>
                <p>{track.artist}</p>
                <Button variant="ghost" size="icon" className="mt-2">
                <Play />
                </Button>
            </motion.div>
            ))}
        </div>
    </motion.div>,

    // Gamified Stats
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
        <h2 className="text-4xl font-bold mb-12">Gamified Stats</h2>
        <div className="grid grid-cols-2 gap-8 max-w-2xl mx-auto">
            <div className="bg-card/30 backdrop-blur-lg p-6 rounded-lg border border-border/20 shadow-lg">
                <p className="text-5xl font-bold text-neon-teal"><Counter to={mockWrappedData.gamifiedStats.blindGuesses} /></p>
                <p className="text-muted-foreground mt-2">Blind Guesses</p>
            </div>
            <div className="bg-card/30 backdrop-blur-lg p-6 rounded-lg border border-border/20 shadow-lg">
                <p className="text-5xl font-bold text-neon-teal"><Counter to={mockWrappedData.gamifiedStats.correctGuesses} /></p>
                <p className="text-muted-foreground mt-2">Correct Guesses</p>
            </div>
            <div className="bg-card/30 backdrop-blur-lg p-6 rounded-lg border border-border/20 shadow-lg">
                <p className="text-5xl font-bold text-neon-violet"><Counter to={mockWrappedData.gamifiedStats.reveals} /></p>
                <p className="text-muted-foreground mt-2">Reveals</p>
            </div>
            <div className="bg-card/30 backdrop-blur-lg p-6 rounded-lg border border-border/20 shadow-lg">
                <p className="text-5xl font-bold text-neon-violet">{mockWrappedData.gamifiedStats.averageReactionTime}</p>
                <p className="text-muted-foreground mt-2">Avg. Reaction Time</p>
            </div>
        </div>
    </motion.div>,

    // Independent Artist Impact
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-center">
        <h2 className="text-4xl font-bold mb-8">Independent Artist Impact</h2>
        <div className="bg-card p-8 rounded-lg shadow-lg text-center">
            <p className="text-7xl font-bold">{mockWrappedData.indieDiscovery.newIndieArtists}</p>
            <p className="text-xl mt-2">New Indie Artists Discovered</p>
        </div>
        <p className="mt-8 text-xl max-w-md text-center">{mockWrappedData.indieDiscovery.insight}</p>
    </motion.div>,

    // Outro Slide
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
      <h1 className="text-5xl font-bold mb-4">Reality Check Complete</h1>
      <p className="text-2xl text-muted-foreground mb-8">Listen without limits.</p>
      <Link to="/">
        <Button size="lg">Back to Home</Button>
      </Link>
    </motion.div>,
  ];

  return (
    <div
      className="min-h-screen text-.foreground flex items-center justify-center relative cursor-pointer"
      onClick={handleNext}
    >
      <AtmosphericBackground />
      <Link to="/">
        <Button variant="ghost" size="icon" className="absolute top-6 right-6 z-20">
          <X className="h-8 w-8" />
        </Button>
      </Link>
      <AnimatePresence mode="wait">
        {sections[step]}
      </AnimatePresence>
      {step < sections.length - 1 && (
        <div className="absolute bottom-8 text-muted-foreground text-sm animate-pulse">
          Click anywhere to continue
        </div>
      )}
    </div>
  );
};

export default RealityWrapped;
