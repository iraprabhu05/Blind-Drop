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
  },
  {
    id: 2,
    title: "City Lights",
    artist: "Urban Groove",
    tags: ["upbeat", "electronic", "dance", "fast"],
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  },
];

const seedDB = async () => {
  await connectDB();
  try {
    await Song.deleteMany({});
    await Song.insertMany(songs);
    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.disconnect();
  }
};

seedDB();
