import mongoose, { Document, Schema } from 'mongoose';

// Interface for the Song document
export interface ISong extends Document {
  id: number;
  title: string;
  artist: string;
  audio: string;
  tags: string[];
  genre: string;
  albumArtUrl: string;
  isPublished: boolean;
  avgRating: number;
  ratingCount: number;
  uploadedBy?: string; // userId of uploader (artist)
}

// Mongoose schema for the Song model
const SongSchema: Schema = new Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  artist: {
    type: String,
    required: true
  },
  audio: {
    type: String,
    required: true
  },
  tags: {
    type: [String],
    required: true
  },
  genre: {
    type: String,
    default: 'Other'
  },
  albumArtUrl: {
    type: String,
    default: ''
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  avgRating: {
    type: Number,
    default: 0
  },
  ratingCount: {
    type: Number,
    default: 0
  },
  uploadedBy: {
    type: String,
    default: null
  }
});

// Export the Mongoose model
export default mongoose.model<ISong>('Song', SongSchema);
