import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import session from 'express-session';
import MongoStore from 'connect-mongo';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load .env variables
dotenv.config();

const app = express();

// 1. DATABASE CONFIGURATION
const MONGO_URI = "mongodb+srv://lbingi402_db_user:lUVvMS4eQ58C2HZT@cluster0.wcydsxc.mongodb.net/?appName=Cluster0";

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected!"))
  .catch(err => console.error("❌ DB Connection Error:", err));

// 2. NODEMAILER CONFIGURATION
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'lbingi402@gmail.com', 
    pass: 'ciua asym iafs nvtn'  // Your 16-character App Password
  }
});

// 3. DATA MODELS (SCHEMAS MUST COME BEFORE MODELS)

// Song Schema
const SongSchema = new mongoose.Schema({
  title: String,
  artist: String,
  tags: [String],
  audioUrl: String,
  coverUrl: String,
  dateUploaded: { type: Date, default: Date.now }
});

// User Schema (NEW: Defined the missing schema)
const UserSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    role: { type: String, enum: ['listener', 'uploader'], default: 'listener' },
    dateJoined: { type: Date, default: Date.now }
});

// Rating Schema (NEW: Defined the missing schema)
const RatingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    songId: { type: mongoose.Schema.Types.ObjectId, ref: 'Song', required: true },
    score: { type: Number, min: 1, max: 5, required: true },
    comment: String,
    dateRated: { type: Date, default: Date.now }
});

// OTP Schema (Expires automatically after 5 minutes)
const OTPSchema = new mongoose.Schema({
  email: String,
  otp: String,
  createdAt: { type: Date, default: Date.now, expires: 300 } // 300 seconds = 5 mins
});

// DEFINE MODELS FROM SCHEMAS (FIXED ORDER)
const Song = mongoose.model("Song", SongSchema);
const User = mongoose.model("User", UserSchema);
const Rating = mongoose.model("Rating", RatingSchema);
const OTPModel = mongoose.model("OTP", OTPSchema);


// 4. MIDDLEWARE
app.use(cors({
  origin: "http://localhost:5173", // Your frontend URL
  credentials: true // Required for sessions to work
}));
app.use(express.json());

// Session Setup
app.use(session({
  secret: 'lavbingi_secret_key', 
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: MONGO_URI }),
  cookie: { 
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    secure: false, // Set to true only if using HTTPS
    httpOnly: true 
  }
}));

// 5. API ROUTES

// --- Song Routes ---
app.get("/api/songs", async (req, res) => {
  try {
    const songs = await Song.find().sort({ dateUploaded: -1 });
    res.json(songs);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch songs" });
  }
});

app.post("/api/upload", async (req, res) => {
  const { title, artist, tags } = req.body;
  try {
    const newSong = new Song({
      title,
      artist,
      tags: tags || [],
      audioUrl: "/songs/placeholder.mp3",
      coverUrl: "/covers/default.jpg",
    });
    await newSong.save();
    res.status(201).json({ message: "Song Uploaded!", song: newSong });
  } catch (error) {
    res.status(500).json({ message: "Failed to upload song" });
  }
});

// --- Auth / OTP Routes ---

// Route 1: Send OTP
app.post('/api/auth/send-otp', async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    // Save OTP to DB
    await OTPModel.findOneAndUpdate({ email }, { otp, createdAt: new Date() }, { upsert: true });

    // Send the Email
    await transporter.sendMail({
      from: '"BlindDrop" <lbingi402@gmail.com>',
      to: email,
      subject: "Your Login OTP",
      text: `Your OTP is: ${otp}. It expires in 5 minutes.`
    });

    res.json({ message: "OTP sent to email!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error sending OTP" });
  }
});

// Route 2: Verify OTP and Create Session
app.post('/api/auth/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  try {
    const record = await OTPModel.findOne({ email });

    if (record && record.otp === otp) {
      // SUCCESS: Create the session
      req.session.userEmail = email;
      await OTPModel.deleteOne({ email }); 
      res.json({ message: "Login successful!", email });
    } else {
      res.status(400).json({ message: "Invalid or expired OTP" });
    }
  } catch (error) {
    res.status(500).json({ message: "Verification failed" });
  }
});

// Route 3: Check Session (To see if user is logged in)
app.get('/api/auth/status', (req, res) => {
  if (req.session.userEmail) {
    res.json({ loggedIn: true, email: req.session.userEmail });
  } else {
    res.json({ loggedIn: false });
  }
});

// --- AI Recommendation Route ---

app.post('/api/recommendation', async (req, res) => {
    // ⚠️ NOTE: This logic assumes the user is logged in and you can get their ID.
    // If you are testing the live site, replace this with the actual ID from your 'users' collection!
    const TEST_USER_ID = "65b9c02d4f0e9b25f8d9c123"; 

    const { songId, rating } = req.body; 

    if (!songId || !rating) {
        return res.status(400).json({ message: "Missing songId or rating." });
    }

    try {
        // 1. SAVE THE RATING (The crucial sync with your database!)
        await Rating.create({
            userId: TEST_USER_ID, 
            songId: songId,
            score: rating
        });
        
        // --- 2. THE AI LOGIC (Find a similar song) ---
        
        const ratedSong = await Song.findById(songId);
        if (!ratedSong) {
             const randomFallback = await Song.aggregate([{ $sample: { size: 1 } }]);
             return res.json({ recommendation: randomFallback[0], message: "Song not found, returning random." });
        }
        
        const currentTags = ratedSong.tags || [];
        
        // Find songs that share at least ONE tag (EASY CONTENT-BASED FILTER)
        const similarSongs = await Song.find({
            _id: { $ne: songId }, // Exclude the song they just rated
            tags: { $in: currentTags } // Match any of the tags
        }).limit(5); // Get the top 5 matches

        let nextSong;
        if (similarSongs.length > 0) {
            // Pick a random song from the similar ones
            nextSong = similarSongs[Math.floor(Math.random() * similarSongs.length)];
            return res.json({ recommendation: nextSong, message: "Recommended based on matching tags." });
        } else {
            // Fallback: If no similar tags, return a completely random song
            const randomFallback = await Song.aggregate([{ $sample: { size: 1 } }]);
            nextSong = randomFallback[0];
            return res.json({ recommendation: nextSong, message: "No tags matched, returning random song." });
        }
        
    } catch (error) {
        console.error("AI Recommendation/Rating Sync Error:", error);
        // A friendly way to return a song even on error
        try {
            const randomFallback = await Song.aggregate([{ $sample: { size: 1 } }]);
            return res.status(500).json({ recommendation: randomFallback[0], message: "Server error, returning random fallback." });
        } catch (e) {
            return res.status(500).json({ message: "Server error during recommendation." });
        }
    }
});

// 6. START SERVER
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
