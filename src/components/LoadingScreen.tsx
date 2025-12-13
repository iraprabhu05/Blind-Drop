import { useState, useEffect } from "react";

const loadingMessages = [
  "Tuning your ears…",
  "Dropping the blindfold…",
  "No names. Just sound.",
  "Discovering hidden gems...",
  "Breaking down creative walls...",
];

const LoadingScreen = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
    }, 2000); // Change message every 2 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-midnight flex flex-col items-center justify-center overflow-hidden z-50">
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Animated Sound Waves */}
        <div className="flex items-center justify-center space-x-2">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="w-3 h-16 bg-gradient-neon rounded-full"
              style={{
                animation: `bounce 1.2s ease-in-out ${i * 0.1}s infinite`,
              }}
            />
          ))}
        </div>

        {/* Blurred Album Cards */}
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute w-48 h-48 bg-charcoal rounded-2xl shadow-glass backdrop-blur-md"
            style={{
              animation: `slide ${5 + i}s linear infinite`,
              transform: `rotate(${i * 20}deg) translate(${(i - 2.5) * 150}px)`,
              opacity: 0.3,
            }}
          />
        ))}

        {/* Loading Message */}
        <div className="absolute bottom-24 text-center">
          <p className="text-lg text-gray-400 font-ui animate-fade-in">
            {loadingMessages[messageIndex]}
          </p>
        </div>
      </div>
      <style>{`
        @keyframes bounce {
          0%, 100% { transform: scaleY(0.5); }
          50% { transform: scaleY(1); }
        }
        @keyframes slide {
          0% { transform: translateY(150vh) scale(0.5) rotate(0deg); opacity: 0; }
          25% { opacity: 0.3; }
          75% { opacity: 0.3; }
          100% { transform: translateY(-150vh) scale(1.5) rotate(360deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
