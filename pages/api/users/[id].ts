import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import connectToDatabase from '../../../lib/mongodb';
import User from '../../../models/User';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  await connectToDatabase();

  try {
    if (req.method === 'GET') {
      const user = await User.findById(id).select('-password');
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Check if profile is private and user is not the owner
      const session = await getServerSession(req, res, {});
      if (user.profileVisibility === 'private' && session?.user?.id !== id) {
        return res.status(403).json({ message: 'Profile is private' });
      }

      res.status(200).json(user);
    } else if (req.method === 'PUT') {
      const session = await getServerSession(req, res, {});
      
      if (!session || session.user.id !== id) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const {
        name,
        location,
        skillsOffered,
        skillsWanted,
        availability,
        profileVisibility,
        profilePhoto,
      } = req.body;

      const updatedUser = await User.findByIdAndUpdate(
        id,
        {
          name,
          location,
          skillsOffered,
          skillsWanted,
          availability,
          profileVisibility,
          profilePhoto,
        },
        { new: true }
      ).select('-password');

      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json(updatedUser);
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('User API error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}