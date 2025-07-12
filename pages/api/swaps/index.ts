import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import connectToDatabase from '../../../lib/mongodb';
import Swap from '../../../models/Swap';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectToDatabase();

  try {
    if (req.method === 'POST') {
      const session = await getServerSession(req, res, {});
      
      if (!session) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const { receiver, skillOffered, skillRequested, message } = req.body;

      if (!receiver || !skillOffered || !skillRequested) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      // Check if swap already exists
      const existingSwap = await Swap.findOne({
        requester: session.user.id,
        receiver,
        status: { $in: ['pending', 'accepted'] },
      });

      if (existingSwap) {
        return res.status(400).json({ message: 'Swap request already exists' });
      }

      const newSwap = new Swap({
        requester: session.user.id,
        receiver,
        skillOffered,
        skillRequested,
        message,
        status: 'pending',
      });

      await newSwap.save();

      const populatedSwap = await Swap.findById(newSwap._id)
        .populate('requester', 'name email profilePhoto')
        .populate('receiver', 'name email profilePhoto');

      res.status(201).json(populatedSwap);
    } else if (req.method === 'GET') {
      const session = await getServerSession(req, res, {});
      
      if (!session) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const { type } = req.query;

      let query: any = {};
      
      if (type === 'sent') {
        query.requester = session.user.id;
      } else if (type === 'received') {
        query.receiver = session.user.id;
      } else {
        query.$or = [
          { requester: session.user.id },
          { receiver: session.user.id },
        ];
      }

      const swaps = await Swap.find(query)
        .populate('requester', 'name email profilePhoto')
        .populate('receiver', 'name email profilePhoto')
        .sort({ createdAt: -1 });

      res.status(200).json(swaps);
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Swaps API error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}