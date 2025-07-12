import mongoose from 'mongoose';

export interface IUser extends mongoose.Document {
  _id: string;
  email: string;
  password: string;
  name: string;
  location?: string;
  profilePhoto?: string;
  skillsOffered: string[];
  skillsWanted: string[];
  availability: string;
  profileVisibility: 'public' | 'private';
  rating: number;
  ratingsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  location: {
    type: String,
    trim: true,
  },
  profilePhoto: {
    type: String,
    default: null,
  },
  skillsOffered: {
    type: [String],
    default: [],
  },
  skillsWanted: {
    type: [String],
    default: [],
  },
  availability: {
    type: String,
    default: 'weekends',
  },
  profileVisibility: {
    type: String,
    enum: ['public', 'private'],
    default: 'public',
  },
  rating: {
    type: Number,
    default: 0,
  },
  ratingsCount: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// Index for search functionality
UserSchema.index({ 
  name: 'text', 
  skillsOffered: 'text', 
  skillsWanted: 'text' 
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);