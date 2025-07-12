import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import Swap from '../models/Swap';
import Rating from '../models/Rating';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/skill-swap-platform';

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Swap.deleteMany({});
    await Rating.deleteMany({});
    console.log('Cleared existing data');

    // Create sample users
    const users = [
      {
        name: 'Alice Johnson',
        email: 'alice@example.com',
        password: await bcrypt.hash('password123', 12),
        location: 'San Francisco, CA',
        profilePhoto: 'https://images.unsplash.com/photo-1494790108755-2616b332161d?w=400&h=400&fit=crop&crop=face',
        skillsOffered: ['Web Development', 'React', 'Node.js'],
        skillsWanted: ['UI/UX Design', 'Photography', 'Spanish'],
        availability: 'evenings',
        profileVisibility: 'public',
        rating: 4.5,
        ratingsCount: 8,
      },
      {
        name: 'Bob Smith',
        email: 'bob@example.com',
        password: await bcrypt.hash('password123', 12),
        location: 'New York, NY',
        profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
        skillsOffered: ['Graphic Design', 'Adobe Photoshop', 'Branding'],
        skillsWanted: ['Web Development', 'Digital Marketing', 'Video Editing'],
        availability: 'weekends',
        profileVisibility: 'public',
        rating: 4.8,
        ratingsCount: 12,
      },
      {
        name: 'Carol Davis',
        email: 'carol@example.com',
        password: await bcrypt.hash('password123', 12),
        location: 'Los Angeles, CA',
        profilePhoto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
        skillsOffered: ['Photography', 'Photo Editing', 'Lightroom'],
        skillsWanted: ['Graphic Design', 'Music Production', 'Cooking'],
        availability: 'flexible',
        profileVisibility: 'public',
        rating: 4.2,
        ratingsCount: 6,
      },
      {
        name: 'David Wilson',
        email: 'david@example.com',
        password: await bcrypt.hash('password123', 12),
        location: 'Chicago, IL',
        profilePhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
        skillsOffered: ['Digital Marketing', 'SEO', 'Content Writing'],
        skillsWanted: ['Web Development', 'Data Analysis', 'Machine Learning'],
        availability: 'weekdays',
        profileVisibility: 'public',
        rating: 4.0,
        ratingsCount: 4,
      },
      {
        name: 'Emma Thompson',
        email: 'emma@example.com',
        password: await bcrypt.hash('password123', 12),
        location: 'Austin, TX',
        profilePhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face',
        skillsOffered: ['UI/UX Design', 'Figma', 'User Research'],
        skillsWanted: ['React', 'JavaScript', 'Frontend Development'],
        availability: 'evenings',
        profileVisibility: 'public',
        rating: 4.7,
        ratingsCount: 9,
      },
      {
        name: 'Frank Miller',
        email: 'frank@example.com',
        password: await bcrypt.hash('password123', 12),
        location: 'Seattle, WA',
        profilePhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
        skillsOffered: ['Music Production', 'Audio Engineering', 'Piano'],
        skillsWanted: ['Video Editing', 'Motion Graphics', 'Photography'],
        availability: 'weekends',
        profileVisibility: 'public',
        rating: 4.3,
        ratingsCount: 7,
      },
    ];

    const createdUsers = await User.insertMany(users);
    console.log(`Created ${createdUsers.length} users`);

    // Create sample swaps
    const swaps = [
      {
        requester: createdUsers[0]._id, // Alice
        receiver: createdUsers[1]._id,  // Bob
        skillOffered: 'Web Development',
        skillRequested: 'Graphic Design',
        status: 'pending',
        message: 'Hi Bob! I\'d love to learn graphic design from you. I can help you with modern web development techniques.',
      },
      {
        requester: createdUsers[1]._id, // Bob
        receiver: createdUsers[4]._id,  // Emma
        skillOffered: 'Branding',
        skillRequested: 'UI/UX Design',
        status: 'accepted',
        message: 'Hey Emma! I specialize in branding and would love to learn UX design from you.',
      },
      {
        requester: createdUsers[2]._id, // Carol
        receiver: createdUsers[3]._id,  // David
        skillOffered: 'Photography',
        skillRequested: 'Digital Marketing',
        status: 'completed',
        message: 'Hi David! I can teach you photography and would love to learn digital marketing strategies.',
      },
      {
        requester: createdUsers[4]._id, // Emma
        receiver: createdUsers[0]._id,  // Alice
        skillOffered: 'User Research',
        skillRequested: 'React',
        status: 'pending',
        message: 'Alice, I need help with React development. I can share user research techniques in return.',
      },
      {
        requester: createdUsers[5]._id, // Frank
        receiver: createdUsers[2]._id,  // Carol
        skillOffered: 'Music Production',
        skillRequested: 'Photography',
        status: 'rejected',
        message: 'Carol, I\'d love to learn photography from you. I can teach music production in return.',
      },
    ];

    const createdSwaps = await Swap.insertMany(swaps);
    console.log(`Created ${createdSwaps.length} swaps`);

    // Create sample ratings for completed swaps
    const ratings = [
      {
        swap: createdSwaps[2]._id, // Carol -> David swap
        rater: createdUsers[2]._id, // Carol rating David
        ratee: createdUsers[3]._id, // David
        rating: 5,
        feedback: 'David was an excellent teacher! Very patient and knowledgeable about digital marketing.',
      },
      {
        swap: createdSwaps[2]._id, // Carol -> David swap
        rater: createdUsers[3]._id, // David rating Carol
        ratee: createdUsers[2]._id, // Carol
        rating: 4,
        feedback: 'Carol has great photography skills and was very helpful with composition techniques.',
      },
    ];

    const createdRatings = await Rating.insertMany(ratings);
    console.log(`Created ${createdRatings.length} ratings`);

    // Update user ratings based on the ratings given
    await User.findByIdAndUpdate(createdUsers[3]._id, {
      rating: 5.0,
      ratingsCount: 1,
    });

    await User.findByIdAndUpdate(createdUsers[2]._id, {
      rating: 4.0,
      ratingsCount: 1,
    });

    console.log('Database seeded successfully!');
    console.log('\nSample login credentials:');
    console.log('Email: alice@example.com, Password: password123');
    console.log('Email: bob@example.com, Password: password123');
    console.log('Email: carol@example.com, Password: password123');
    console.log('Email: david@example.com, Password: password123');
    console.log('Email: emma@example.com, Password: password123');
    console.log('Email: frank@example.com, Password: password123');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

seedDatabase();