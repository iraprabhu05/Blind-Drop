
import mongoose, { Document, Schema } from 'mongoose';

export interface IRating extends Document {
  songId: number;
  rating: number;
  userId: string;
  createdAt: Date;
}

const RatingSchema: Schema = new Schema({
  songId: {
    type: Number,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  userId: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// One rating per user per song
RatingSchema.index({ userId: 1, songId: 1 }, { unique: true });

export default mongoose.model<IRating>('Rating', RatingSchema);
