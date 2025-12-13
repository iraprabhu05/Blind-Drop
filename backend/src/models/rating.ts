
import mongoose, { Document, Schema } from 'mongoose';

export interface IRating extends Document {
  songId: number;
  rating: number;
  createdAt: Date;
}

const RatingSchema: Schema = new Schema({
  songId: {
    type: Number,
    required: true
  },
  rating: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model<IRating>('Rating', RatingSchema);
