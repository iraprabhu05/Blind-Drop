import dotenv from 'dotenv';
import path from 'path';

// Explicitly load the .env file from the parent directory of the compiled code
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import crypto from 'crypto';
import { connectDB } from './db';
import Song from './models/song';
import Rating from './models/rating';
import { sendOTPEmail } from './email';

const app = express();

const corsOptions = {
  origin: 'http://localhost:5173',
};

app.use(cors(corsOptions));
app.use(express.json());

// Middleware for logging requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Wrapper for async route handlers to simplify error handling
const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => 
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

app.get('/api/songs', asyncHandler(async (req: Request, res: Response) => {
  const songs = await Song.find({});
  const formattedSongs = songs.map(song => ({
    id: song.id,
    title: song.title,
    artist: song.artist,
    audio: song.audio,
    tags: song.tags,
  }));
  res.json(formattedSongs);
}));

app.post('/api/recommend', asyncHandler(async (req: Request, res: Response) => {
  const { songId, rating } = req.body;
  console.log(`Recommendation request for songId: ${songId} with rating: ${rating}`);

  if (songId === undefined || rating === undefined) {
    return res.status(400).json({ error: 'songId and rating are required' });
  }

  if (typeof rating !== 'number') {
    return res.status(400).json({ error: 'rating must be a number' });
  }

  await new Rating({ songId, rating }).save();

  if (rating < 4) {
    console.log(`No recommendation for songId: ${songId} because rating is less than 4.`);
    return res.json(null);
  }

  const originalSong = await Song.findOne({ id: songId });
  if (!originalSong) {
    return res.status(404).json({ error: 'Song not found' });
  }

  let recommendedSong = await Song.findOne({
    tags: { $in: originalSong.tags },
    id: { $ne: originalSong.id },
  });

  if (recommendedSong) {
    console.log(`Found recommendation for songId: ${songId} via tag overlap. Recommending songId: ${recommendedSong.id}`);
  } else {
    console.log(`No recommendation for songId: ${songId} via tag overlap, using fallback.`);
    recommendedSong = await Song.findOne({ id: { $ne: originalSong.id } }).sort({ title: 1 });
    if (recommendedSong) {
      console.log(`Found fallback recommendation for songId: ${songId}. Recommending songId: ${recommendedSong.id}`);
    }
  }

  if (recommendedSong) {
    res.json({
      id: recommendedSong.id,
      title: recommendedSong.title,
      artist: recommendedSong.artist,
      audio: recommendedSong.audio,
      tags: recommendedSong.tags,
    });
  } else {
    console.log(`Could not find any song to recommend for songId: ${songId}`);
    res.json(null);
  }
}));

// Centralized error-handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(`[${new Date().toISOString()}] Unhandled error:`, err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
});
