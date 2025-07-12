import mongoose from 'mongoose';

export interface ISwap extends mongoose.Document {
  _id: string;
  requester: string; // User ID who requested the swap
  receiver: string; // User ID who received the swap request
  skillOffered: string;
  skillRequested: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  message?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SwapSchema = new mongoose.Schema({
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  skillOffered: {
    type: String,
    required: true,
  },
  skillRequested: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'completed'],
    default: 'pending',
  },
  message: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

// Index for efficient queries
SwapSchema.index({ requester: 1, receiver: 1 });
SwapSchema.index({ status: 1 });

export default mongoose.models.Swap || mongoose.model<ISwap>('Swap', SwapSchema);