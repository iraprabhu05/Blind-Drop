
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Play, Heart, Calendar } from 'lucide-react';

const TrackDetailModal = ({ isOpen, onClose, track }) => {
  if (!track) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1C1C1C] border-gray-700 max-w-2xl text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold mb-4">{track.title}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <img src={track.cover} alt={track.title} className="w-full h-auto rounded-xl object-cover"/>
          <div>
            <h3 className="text-lg font-semibold text-gray-300">Performance Stats</h3>
            <div className="space-y-3 mt-3">
                <div className="flex items-center gap-3 text-lg">
                    <Play className="text-violet-400" size={20}/>
                    <span><span className="font-bold">{track.plays}</span> plays</span>
                </div>
                <div className="flex items-center gap-3 text-lg">
                    <Heart className="text-pink-400" size={20}/>
                    <span><span className="font-bold">{track.likes}</span> likes</span>
                </div>
                <div className="flex items-center gap-3 text-lg">
                    <Calendar className="text-blue-400" size={20}/>
                    <span>Uploaded on <span className="font-bold">{track.date}</span></span>
                </div>
            </div>
            <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-300">Actions</h3>
                <div className="flex gap-3 mt-3">
                    <Button variant="outline" className="border-violet-500 text-violet-400 hover:bg-violet-500/10 hover:text-violet-300">Edit Details</Button>
                    <Button variant="destructive">Delete Track</Button>
                </div>
            </div>
          </div>
        </div>
        <DialogFooter className="mt-6">
          <DialogClose asChild>
            <Button variant="ghost">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TrackDetailModal;
