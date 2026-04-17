import dotenv from 'dotenv';
import path from 'path';

// Explicitly load the .env file from the parent directory of the compiled code
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import session from 'express-session';
import bcrypt from 'bcryptjs';
import rateLimit from 'express-rate-limit';
import { connectDB } from './db';
import Song from './models/song';
import Rating from './models/rating';
import User from './models/user';

// Extend express-session types
declare module 'express-session' {
  interface SessionData {
    userId: string;
    userRole: string;
  }
}

const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

const app = express();

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || 'blind-drop-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: SESSION_DURATION_MS,
  },
}));

// ─── RATE LIMITERS ────────────────────────────────────────────────────────────

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later' },
});

const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later' },
});

// Middleware for logging requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Auth middleware
const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.session.userId) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }
  next();
};

const requireArtistOrAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  if (!req.session.userId) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }
  if (!['artist', 'admin'].includes(req.session.userRole || '')) {
    res.status(403).json({ error: 'Insufficient permissions' });
    return;
  }
  next();
};

// Wrapper for async route handlers
const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

const port = process.env.PORT || 3000;

// ─── AUTH ROUTES ──────────────────────────────────────────────────────────────

app.post('/api/auth/register', authLimiter, asyncHandler(async (req: Request, res: Response) => {
  const username = String(req.body.username ?? '').trim();
  const email = String(req.body.email ?? '').trim().toLowerCase();
  const password = String(req.body.password ?? '');
  const { role } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'username, email, and password are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  // Basic email format validation
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  const allowedRoles = ['user', 'artist'];
  const userRole = allowedRoles.includes(role) ? role : 'user';

  const existing = await User.findOne({ $or: [{ email }, { username }] });
  if (existing) {
    return res.status(409).json({ error: 'Email or username already in use' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await new User({ username, email, passwordHash, role: userRole }).save();

  req.session.userId = String(user._id);
  req.session.userRole = userRole;

  res.status(201).json({
    id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
    avatarUrl: user.avatarUrl,
  });
}));

app.post('/api/auth/login', authLimiter, asyncHandler(async (req: Request, res: Response) => {
  const email = String(req.body.email ?? '').trim().toLowerCase();
  const password = String(req.body.password ?? '');

  if (!email || !password) {
    return res.status(400).json({ error: 'email and password are required' });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const valid = await user.comparePassword(password);
  if (!valid) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  req.session.userId = String(user._id);
  req.session.userRole = user.role;

  res.json({
    id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
    avatarUrl: user.avatarUrl,
  });
}));

app.post('/api/auth/logout', (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.clearCookie('connect.sid');
    res.json({ success: true });
  });
});

app.get('/api/auth/me', asyncHandler(async (req: Request, res: Response) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  const user = await User.findById(req.session.userId).select('-passwordHash');
  if (!user) {
    req.session.destroy(() => {});
    return res.status(401).json({ error: 'User not found' });
  }
  res.json({
    id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
    avatarUrl: user.avatarUrl,
  });
}));

// ─── SONG ROUTES (BLIND SAFE) ─────────────────────────────────────────────────

// Returns ONLY safe fields — no artist, no title, no audio
app.get('/api/songs', apiLimiter, asyncHandler(async (req: Request, res: Response) => {
  const genre = typeof req.query.genre === 'string' ? req.query.genre : undefined;
  const filter: Record<string, unknown> = { isPublished: true };
  if (genre && genre !== 'All') {
    filter.genre = genre;
  }

  const songs = await Song.find(filter).select('id genre tags avgRating ratingCount');
  const safe = songs.map(s => ({
    id: s.id,
    genre: s.genre,
    tags: s.tags,
    avgRating: s.avgRating,
    ratingCount: s.ratingCount,
  }));
  res.json(safe);
}));

// Returns audio URL for playback — blind safe (no artist)
app.get('/api/songs/:id/stream', apiLimiter, requireAuth, asyncHandler(async (req: Request, res: Response) => {
  const songId = parseInt(req.params.id, 10);
  if (isNaN(songId)) return res.status(400).json({ error: 'Invalid song id' });

  const song = await Song.findOne({ id: songId, isPublished: true }).select('id audio');
  if (!song) return res.status(404).json({ error: 'Song not found' });

  res.json({ audioUrl: song.audio });
}));

// ─── RATING ───────────────────────────────────────────────────────────────────

app.post('/api/rate', apiLimiter, requireAuth, asyncHandler(async (req: Request, res: Response) => {
  const { songId, rating } = req.body;
  const userId = req.session.userId!;

  if (songId === undefined || rating === undefined) {
    return res.status(400).json({ error: 'songId and rating are required' });
  }

  const score = parseInt(String(rating), 10);
  if (isNaN(score) || score < 1 || score > 10) {
    return res.status(400).json({ error: 'rating must be an integer between 1 and 10' });
  }

  const song = await Song.findOne({ id: parseInt(String(songId), 10), isPublished: true });
  if (!song) return res.status(404).json({ error: 'Song not found' });

  // Idempotent: check if already rated
  const existing = await Rating.findOne({ userId, songId: song.id });
  if (existing) {
    return res.json({ success: true, alreadyRated: true, rating: existing.rating });
  }

  await new Rating({ songId: song.id, rating: score, userId }).save();

  // Update song aggregate stats
  const allRatings = await Rating.find({ songId: song.id });
  const avg = allRatings.length > 0
    ? allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length
    : 0;
  await Song.findOneAndUpdate(
    { id: song.id },
    { avgRating: Math.round(avg * 100) / 100, ratingCount: allRatings.length }
  );

  res.json({ success: true, alreadyRated: false });
}));

// ─── REVEAL (server-side gate) ────────────────────────────────────────────────

// Only returns full metadata if the authenticated user has already rated this song
app.get('/api/reveal/:id', apiLimiter, requireAuth, asyncHandler(async (req: Request, res: Response) => {
  const songId = parseInt(req.params.id, 10);
  const userId = req.session.userId!;

  if (isNaN(songId)) return res.status(400).json({ error: 'Invalid song id' });

  // Security gate: confirm rating exists before revealing
  const ratingRecord = await Rating.findOne({ userId, songId });
  if (!ratingRecord) {
    return res.status(403).json({ error: 'You must rate this track before revealing the artist' });
  }

  const song = await Song.findOne({ id: songId });
  if (!song) return res.status(404).json({ error: 'Song not found' });

  res.json({
    id: song.id,
    title: song.title,
    artist: song.artist,
    genre: song.genre,
    albumArtUrl: song.albumArtUrl,
    avgRating: song.avgRating,
    ratingCount: song.ratingCount,
    userScore: ratingRecord.rating,
  });
}));

// ─── RECOMMENDATION ───────────────────────────────────────────────────────────

app.post('/api/recommend', apiLimiter, asyncHandler(async (req: Request, res: Response) => {
  const songId = parseInt(String(req.body.songId ?? ''), 10);
  const rating = Number(req.body.rating);

  if (isNaN(songId) || isNaN(rating)) {
    return res.status(400).json({ error: 'songId and rating are required' });
  }

  if (rating < 4) {
    return res.json(null);
  }

  const originalSong = await Song.findOne({ id: songId });
  if (!originalSong) {
    return res.status(404).json({ error: 'Song not found' });
  }

  let recommendedSong = await Song.findOne({
    tags: { $in: originalSong.tags },
    id: { $ne: originalSong.id },
    isPublished: true,
  });

  if (!recommendedSong) {
    // Use avgRating desc as a better fallback than alphabetical sort
    recommendedSong = await Song.findOne({ id: { $ne: originalSong.id }, isPublished: true }).sort({ avgRating: -1 });
  }

  if (recommendedSong) {
    // Return blind-safe data only
    res.json({
      id: recommendedSong.id,
      genre: recommendedSong.genre,
      tags: recommendedSong.tags,
      avgRating: recommendedSong.avgRating,
      ratingCount: recommendedSong.ratingCount,
    });
  } else {
    res.json(null);
  }
}));

// ─── UPLOAD ───────────────────────────────────────────────────────────────────

app.post('/api/upload', apiLimiter, requireArtistOrAdmin, asyncHandler(async (req: Request, res: Response) => {
  const title = String(req.body.title ?? '').trim();
  const artist = String(req.body.artist ?? '').trim();
  const audio = String(req.body.audio ?? '').trim();
  const { tags, genre, albumArtUrl } = req.body;
  const userId = req.session.userId!;

  if (!title || !artist || !audio) {
    return res.status(400).json({ error: 'title, artist, and audio are required' });
  }

  const lastSong = await Song.findOne().sort({ id: -1 });
  const newId = lastSong ? lastSong.id + 1 : 1;

  const song = await new Song({
    id: newId,
    title,
    artist,
    audio,
    tags: Array.isArray(tags) ? tags : [],
    genre: genre || 'Other',
    albumArtUrl: albumArtUrl || '',
    isPublished: false,
    uploadedBy: userId,
  }).save();

  res.status(201).json({
    id: song.id,
    genre: song.genre,
    tags: song.tags,
    isPublished: song.isPublished,
  });
}));

// ─── USER PROFILE ─────────────────────────────────────────────────────────────

app.get('/api/profile', apiLimiter, requireAuth, asyncHandler(async (req: Request, res: Response) => {
  const userId = req.session.userId!;

  const user = await User.findById(userId).select('-passwordHash');
  if (!user) return res.status(404).json({ error: 'User not found' });

  const ratings = await Rating.find({ userId });

  // Fetch full song info for rated songs (revealed since user rated them)
  const ratedSongs = await Promise.all(
    ratings.map(async (r) => {
      const song = await Song.findOne({ id: r.songId });
      return song ? {
        songId: r.songId,
        userRating: r.rating,
        ratedAt: r.createdAt,
        title: song.title,
        artist: song.artist,
        genre: song.genre,
        albumArtUrl: song.albumArtUrl,
        avgRating: song.avgRating,
        ratingCount: song.ratingCount,
      } : null;
    })
  );

  res.json({
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
    },
    stats: {
      totalRated: ratings.length,
      avgScore: ratings.length
        ? Math.round((ratings.reduce((s, r) => s + r.rating, 0) / ratings.length) * 10) / 10
        : 0,
    },
    ratedSongs: ratedSongs.filter(Boolean),
  });
}));

// ─── HEALTH CHECK ─────────────────────────────────────────────────────────────

app.get('/', (req, res) => {
  res.send('Blind Drop API is running');
});

// ─── ERROR HANDLER ────────────────────────────────────────────────────────────

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(`[${new Date().toISOString()}] Unhandled error:`, err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Blind Drop API running on port ${port}`);
  });
});

