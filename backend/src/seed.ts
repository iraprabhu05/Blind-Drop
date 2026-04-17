import mongoose from 'mongoose';
import { connectDB } from './db';
import Song from './models/song';

const songs = [
  {
    id: 1,
    title: "Sunset Bliss",
    artist: "Mellow Waves",
    tags: ["chill", "lo-fi", "relaxing", "instrumental", "slow"],
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    genre: "Electronic",
    albumArtUrl: "https://picsum.photos/seed/9/300/300",
    isPublished: true,
  },
  {
    id: 2,
    title: "City Lights",
    artist: "Urban Groove",
    tags: ["upbeat", "electronic", "dance", "fast"],
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    genre: "Hip-Hop",
    albumArtUrl: "https://picsum.photos/seed/10/300/300",
    isPublished: true,
  },
  {
    id: 3,
    title: "Ocean Breath",
    artist: "Deep Dive",
    tags: ["ambient", "calm", "meditative", "instrumental", "slow"],
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    genre: "Indie/Rock",
    albumArtUrl: "https://picsum.photos/seed/11/300/300",
    isPublished: true,
  },
  {
    id: 4,
    title: "Midnight Drive",
    artist: "Neon Echo",
    tags: ["upbeat", "synth", "party", "80s vibe", "fast"],
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    genre: "Pop",
    albumArtUrl: "https://picsum.photos/seed/12/300/300",
    isPublished: true,
  },
  {
    id: 5,
    title: "Golden Hour",
    artist: "The Velvet Dusk",
    tags: ["soul", "warm", "groove", "slow"],
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    genre: "R&B/Soul",
    albumArtUrl: "https://picsum.photos/seed/13/300/300",
    isPublished: true,
  },
  {
    id: 6,
    title: "Smoke & Strings",
    artist: "Jazz Collective",
    tags: ["jazz", "acoustic", "smooth", "instrumental"],
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
    genre: "Jazz",
    albumArtUrl: "https://picsum.photos/seed/14/300/300",
    isPublished: true,
  },
  {
    id: 7,
    title: "Phantom Keys",
    artist: "Clara Renaud",
    tags: ["classical", "piano", "elegant", "instrumental"],
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
    genre: "Classical",
    albumArtUrl: "https://picsum.photos/seed/15/300/300",
    isPublished: true,
  },
  {
    id: 8,
    title: "Static Rain",
    artist: "Void Collective",
    tags: ["experimental", "noise", "abstract", "dark"],
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
    genre: "Other",
    albumArtUrl: "https://picsum.photos/seed/16/300/300",
    isPublished: true,
  },
];

const seedDB = async () => {
  await connectDB();
  try {
    await Song.deleteMany({});
    await Song.insertMany(songs);
    console.log('Database seeded successfully with', songs.length, 'songs');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.disconnect();
  }
};

seedDB();
