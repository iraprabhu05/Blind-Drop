import React, { useState } from "react";
import { Plus, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { allTracks } from "./mock-data";
import TrackGrid from "./TrackGrid";
import TrackDetailModal from "./TrackDetailModal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const MyTracks = () => {
  const navigate = useNavigate();
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleTrackClick = (track) => {
    setSelectedTrack(track);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTrack(null);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-white">My Tracks</h1>
          <p className="text-gray-400 mt-2">Manage your uploaded music.</p>
        </div>
        <Button
          onClick={() => navigate("../upload")}
          className="bg-violet-600 hover:bg-violet-700 text-white font-semibold"
        >
          <Plus size={18} className="mr-2" />
          Upload New Track
        </Button>
      </header>

      <div className="flex justify-between items-center gap-4">
        <div className="relative w-full max-w-sm">
          <Input
            placeholder="Search tracks..."
            className="bg-gray-800 border-gray-700 pl-10"
          />
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
          />
        </div>
        {/* Add filter/sort dropdowns here if needed */}
      </div>

      <TrackGrid tracks={allTracks} onTrackClick={handleTrackClick} />

      {selectedTrack && (
        <TrackDetailModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          track={selectedTrack}
        />
      )}
    </div>
  );
};

export default MyTracks;
