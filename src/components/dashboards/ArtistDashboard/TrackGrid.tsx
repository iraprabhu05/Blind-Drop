import React from "react";
import { Play, Heart, Edit, Trash } from "lucide-react";

const TrackGrid = ({ tracks, onTrackClick }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {tracks.map((track) => (
        <div
          key={track.id}
          className="bg-[#1C1C1C] rounded-xl overflow-hidden shadow-lg border border-gray-800 group relative cursor-pointer transform transition-all hover:scale-105 hover:shadow-violet-500/20"
          onClick={() => onTrackClick(track)}
        >
          <div className="relative">
            <img
              src={track.cover}
              alt={track.title}
              className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Play size={36} className="text-violet-400 fill-current" />
            </div>
          </div>
          <div className="p-3">
            <h3 className="font-bold text-base text-white truncate">
              {track.title}
            </h3>
            <p className="text-xs text-gray-400 mt-1">{track.album || "Single"}</p>
            <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
              <div className="flex items-center gap-1">
                <Play size={12} />
                <span>{track.plays}</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart size={12} />
                <span>{track.likes}</span>
              </div>
            </div>
          </div>
          <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button className="p-1.5 rounded-full bg-black/50 hover:bg-violet-600 backdrop-blur-sm text-white">
              <Edit size={14} />
            </button>
            <button className="p-1.5 rounded-full bg-black/50 hover:bg-red-600 backdrop-blur-sm text-white">
              <Trash size={14} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrackGrid;
