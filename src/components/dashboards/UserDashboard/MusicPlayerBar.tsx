
import React from 'react';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';

const MusicPlayerBar = ({ song, isPlaying, onPlayPause, onNext, onPrev }) => {
  if (!song) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 bg-opacity-80 backdrop-blur-md border-t border-gray-700 p-4 text-white z-50">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4 w-1/4">
          <img src={song.cover} alt={song.title} className="w-16 h-16 rounded-md object-cover" />
          <div>
            <h3 className="font-bold">{song.title}</h3>
            <p className="text-sm text-gray-400">{song.artist}</p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center w-1/2">
          <div className="flex items-center space-x-6">
            <button onClick={onPrev} className="text-gray-400 hover:text-white transition-colors duration-200"><SkipBack /></button>
            <button onClick={onPlayPause} className="bg-white text-black rounded-full p-3 hover:scale-105 transition-transform duration-200">
              {isPlaying ? <Pause /> : <Play />}
            </button>
            <button onClick={onNext} className="text-gray-400 hover:text-white transition-colors duration-200"><SkipForward /></button>
          </div>
          <div className="w-full mt-2 flex items-center space-x-2">
              <span className="text-xs text-gray-400">0:00</span>
              <div className="w-full bg-gray-600 rounded-full h-1"><div className="bg-white h-1 rounded-full" style={{ width: `25%` }}></div></div>
              <span className="text-xs text-gray-400">3:30</span>
          </div>
        </div>

        <div className="flex items-center space-x-4 w-1/4 justify-end">
           {/* Volume slider can be added here */}
        </div>
      </div>
    </div>
  );
};

export default MusicPlayerBar;
