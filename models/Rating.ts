import mongoose from 'mongoose';

export interface IRating extends mongoose.Document {
  _id: string;
  swap: string; // Reference to the swap
  rater: string; // User who gave the rating
  ratee: string; // User who received the rating
  rating: number; // 1-5 stars
  feedback?: string;
  createdAt: Date;
  updatedAt: Date;
}

const RatingSchema = new mongoose.Schema({
  swap: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Swap',
    required: true,
  },
  rater: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  ratee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  feedback: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

// Ensure one rating per swap per user
RatingSchema.index({ swap: 1, rater: 1 }, { unique: true });

export default mongoose.models.Rating || mongoose.model<IRating>('Rating', RatingSchema);