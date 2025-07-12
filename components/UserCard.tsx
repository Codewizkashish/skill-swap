import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface User {
  _id: string;
  name: string;
  location?: string;
  profilePhoto?: string;
  skillsOffered: string[];
  skillsWanted: string[];
  availability: string;
  rating: number;
  ratingsCount: number;
}

interface UserCardProps {
  user: User;
}

const UserCard: React.FC<UserCardProps> = ({ user }) => {
  return (
    <div className="card gsap-slide-up">
      <div className="flex items-center space-x-4 mb-4">
        <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-600">
          {user.profilePhoto ? (
            <Image
              src={user.profilePhoto}
              alt={user.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-gray-400">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div>
          <h3 className="text-xl font-semibold text-white">{user.name}</h3>
          {user.location && (
            <p className="text-gray-400 text-sm">{user.location}</p>
          )}
          <div className="flex items-center mt-1">
            <span className="text-yellow-400 text-sm">
              {'★'.repeat(Math.floor(user.rating))}
              {'☆'.repeat(5 - Math.floor(user.rating))}
            </span>
            <span className="text-gray-400 text-sm ml-1">
              ({user.ratingsCount} reviews)
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <h4 className="text-sm font-medium text-gray-300 mb-1">Skills Offered</h4>
          <div className="flex flex-wrap gap-1">
            {user.skillsOffered.length > 0 ? (
              user.skillsOffered.map((skill, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-green-600 text-white text-xs rounded-full"
                >
                  {skill}
                </span>
              ))
            ) : (
              <span className="text-gray-400 text-sm">No skills offered</span>
            )}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-300 mb-1">Skills Wanted</h4>
          <div className="flex flex-wrap gap-1">
            {user.skillsWanted.length > 0 ? (
              user.skillsWanted.map((skill, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full"
                >
                  {skill}
                </span>
              ))
            ) : (
              <span className="text-gray-400 text-sm">No skills wanted</span>
            )}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-300 mb-1">Availability</h4>
          <p className="text-gray-400 text-sm capitalize">{user.availability}</p>
        </div>
      </div>

      <div className="mt-6">
        <Link
          href={`/profile/${user._id}`}
          className="btn-primary w-full text-center block"
        >
          View Profile
        </Link>
      </div>
    </div>
  );
};

export default UserCard;