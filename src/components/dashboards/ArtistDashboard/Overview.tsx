
import React from 'react';
import { ArrowUpRight, BarChart, Heart, PlayCircle, Users } from 'lucide-react';
import { overviewStats, topTracks } from './mock-data';

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className={`p-6 rounded-2xl bg-gradient-to-br from-gray-900 via-[#1C1C1C] to-[#111111] border border-gray-800 shadow-lg`}>
    <div className="flex justify-between items-start">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-full bg-${color}-500/10`}>
          <Icon size={22} className={`text-${color}-400`} />
        </div>
        <p className="text-gray-400 text-sm">{label}</p>
      </div>
      <ArrowUpRight size={18} className="text-green-400" />
    </div>
    <p className="text-4xl font-bold mt-4 text-white">{value}</p>
  </div>
);

const TopTrackCard = ({ track }) => (
    <div className="group bg-gradient-to-br from-gray-900 via-[#1C1C1C] to-[#111111] p-4 rounded-xl border border-gray-800 transition-all hover:border-primary">
      <div className="relative rounded-lg overflow-hidden cursor-pointer mb-3">
          <img src={track.cover} alt={track.title} className="w-full h-auto aspect-square object-cover transition-transform duration-300 group-hover:scale-105"/>
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <PlayCircle size={50} className="text-primary"/>
          </div>
      </div>
      <div>
          <h3 className="font-semibold text-white truncate">{track.title}</h3>
          <p className="text-sm text-gray-400">{track.plays} plays</p>
      </div>
    </div>
  )

const Overview = () => {
  return (
    <div className="space-y-12 animate-fade-in">
      <header>
        <h1 className="text-4xl font-bold text-white">Dashboard Overview</h1>
        <p className="text-gray-400 mt-2">A quick look at your creator stats.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={PlayCircle} label="Total Plays" value={overviewStats.totalPlays} color="violet" />
        <StatCard icon={Heart} label="Total Likes" value={overviewStats.totalLikes} color="pink" />
        <StatCard icon={Users} label="Followers" value={overviewStats.followers} color="blue" />
        <StatCard icon={BarChart} label="Monthly Listeners" value={overviewStats.monthlyListeners} color="green" />
      </div>

      {/* Top Performing Tracks */}
      <div>
        <h2 className="text-2xl font-bold mb-6 text-white">Top Performing Tracks</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {topTracks.map(track => <TopTrackCard key={track.id} track={track} />)}
        </div>
      </div>
    </div>
  );
};

export default Overview;
