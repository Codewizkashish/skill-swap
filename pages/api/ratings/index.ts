import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import connectToDatabase from '../../../lib/mongodb';
import Rating from '../../../models/Rating';
import User from '../../../models/User';
import Swap from '../../../models/Swap';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  await connectToDatabase();

  try {
    const session = await getServerSession(req, res, {});
    
    if (!session) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { swapId, ratee, rating, feedback } = req.body;

    if (!swapId || !ratee || !rating) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Check if swap exists and is completed
    const swap = await Swap.findById(swapId);
    if (!swap || swap.status !== 'completed') {
      return res.status(400).json({ message: 'Swap not found or not completed' });
    }

    // Check if user is involved in the swap
    if (swap.requester.toString() !== session.user.id && 
        swap.receiver.toString() !== session.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Check if rating already exists
    const existingRating = await Rating.findOne({
      swap: swapId,
      rater: session.user.id,
    });

    if (existingRating) {
      return res.status(400).json({ message: 'Rating already exists' });
    }

    // Create new rating
    const newRating = new Rating({
      swap: swapId,
      rater: session.user.id,
      ratee,
      rating,
      feedback,
    });

    await newRating.save();

    // Update user's average rating
    const userRatings = await Rating.find({ ratee });
    const totalRating = userRatings.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalRating / userRatings.length;

    await User.findByIdAndUpdate(ratee, {
      rating: averageRating,
      ratingsCount: userRatings.length,
    });

    res.status(201).json({ message: 'Rating submitted successfully' });
  } catch (error) {
    console.error('Rating API error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}