
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Overview from './Overview';
import MyTracks from './MyTracks';
import UploadTrack from './UploadTrack';
import Analytics from './Analytics';
import Profile from './Profile';
import { Toaster } from '@/components/ui/sonner';

const ArtistDashboard = () => {
  return (
    <div className="bg-background text-foreground font-sans flex h-screen">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <Routes>
          <Route path="" element={<Navigate to="overview" />} />
          <Route path="overview" element={<Overview />} />
          <Route path="tracks" element={<MyTracks />} />
          <Route path="upload" element={<UploadTrack />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="profile" element={<Profile />} />
        </Routes>
      </main>
      <Toaster position="bottom-right" />
    </div>
  );
};

export default ArtistDashboard;
