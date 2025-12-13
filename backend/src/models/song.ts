import mongoose, { Document, Schema } from 'mongoose';

// Interface for the Song document
export interface ISong extends Document {
  id: number;
  title: string;
  artist: string;
  audio: string;
  tags: string[];
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
  }
});

// Export the Mongoose model
export default mongoose.model<ISong>('Song', SongSchema);
