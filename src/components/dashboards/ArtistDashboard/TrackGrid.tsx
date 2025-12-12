import React from "react";
import { Play, Heart, Edit, Trash } from "lucide-react";

const TrackGrid = ({ tracks, onTrackClick }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {tracks.map((track) => (
        <div
          key={track.id}
          className="bg-[#1C1C1C] rounded-xl overflow-hidden shadow-lg border border-gray-800 group relative cursor-pointer"
          onClick={() => onTrackClick(track)}
        >
          <div className="relative">
            <img
              src={track.cover}
              alt={track.title}
              className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Play size={40} className="text-violet-400 fill-current" />
            </div>
          </div>
          <div className="p-4">
            <h3 className="font-bold text-lg text-white truncate">
              {track.title}
            </h3>
            <p className="text-sm text-gray-400">Uploaded: {track.date}</p>
            <div className="flex items-center gap-4 mt-3 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <Play size={14} />
                <span>{track.plays}</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart size={14} />
                <span>{track.likes}</span>
              </div>
            </div>
          </div>
          <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="p-2 rounded-full bg-black/50 hover:bg-violet-600 backdrop-blur-sm">
              <Edit size={16} />
            </button>
            <button className="p-2 rounded-full bg-black/50 hover:bg-red-600 backdrop-blur-sm">
              <Trash size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrackGrid;
