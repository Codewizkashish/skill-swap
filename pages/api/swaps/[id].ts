import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import connectToDatabase from '../../../lib/mongodb';
import Swap from '../../../models/Swap';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: 'Swap ID is required' });
  }

  await connectToDatabase();

  try {
    if (req.method === 'GET') {
      const session = await getServerSession(req, res, {});
      
      if (!session) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const swap = await Swap.findById(id)
        .populate('requester', 'name email profilePhoto')
        .populate('receiver', 'name email profilePhoto');

      if (!swap) {
        return res.status(404).json({ message: 'Swap not found' });
      }

      // Check if user is involved in the swap
      if (swap.requester._id.toString() !== session.user.id && 
          swap.receiver._id.toString() !== session.user.id) {
        return res.status(403).json({ message: 'Access denied' });
      }

      res.status(200).json(swap);
    } else if (req.method === 'PUT') {
      const session = await getServerSession(req, res, {});
      
      if (!session) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const { status } = req.body;

      if (!status || !['accepted', 'rejected', 'completed'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
      }

      const swap = await Swap.findById(id);

      if (!swap) {
        return res.status(404).json({ message: 'Swap not found' });
      }

      // Check permissions
      if (status === 'accepted' || status === 'rejected') {
        // Only receiver can accept or reject
        if (swap.receiver.toString() !== session.user.id) {
          return res.status(403).json({ message: 'Only receiver can accept/reject' });
        }
      } else if (status === 'completed') {
        // Both parties can mark as completed
        if (swap.requester.toString() !== session.user.id && 
            swap.receiver.toString() !== session.user.id) {
          return res.status(403).json({ message: 'Access denied' });
        }
      }

      const updatedSwap = await Swap.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      ).populate('requester', 'name email profilePhoto')
       .populate('receiver', 'name email profilePhoto');

      res.status(200).json(updatedSwap);
    } else if (req.method === 'DELETE') {
      const session = await getServerSession(req, res, {});
      
      if (!session) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const swap = await Swap.findById(id);

      if (!swap) {
        return res.status(404).json({ message: 'Swap not found' });
      }

      // Only requester can delete their own swap request
      if (swap.requester.toString() !== session.user.id) {
        return res.status(403).json({ message: 'Only requester can delete' });
      }

      await Swap.findByIdAndDelete(id);

      res.status(200).json({ message: 'Swap deleted successfully' });
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Swap API error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}