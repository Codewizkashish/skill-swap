import React, { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { gsap } from 'gsap';
import Layout from '../../components/Layout';

interface User {
  _id: string;
  name: string;
  email: string;
  location?: string;
  profilePhoto?: string;
  skillsOffered: string[];
  skillsWanted: string[];
  availability: string;
  rating: number;
  ratingsCount: number;
  createdAt: string;
}

interface ProfilePageProps {
  user: User;
  isOwnProfile: boolean;
  currentUserId: string;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user, isOwnProfile, currentUserId }) => {
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [swapData, setSwapData] = useState({
    skillOffered: '',
    skillRequested: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  useEffect(() => {
    // GSAP animations
    gsap.from('.profile-container', {
      duration: 1,
      y: 50,
      opacity: 0,
      ease: 'power2.out',
    });

    gsap.from('.profile-card', {
      duration: 0.8,
      x: -30,
      opacity: 0,
      ease: 'power2.out',
      delay: 0.2,
    });

    gsap.from('.skills-section', {
      duration: 0.8,
      x: 30,
      opacity: 0,
      ease: 'power2.out',
      delay: 0.4,
    });
  }, []);

  const handleSwapRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/swaps', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          receiver: user._id,
          skillOffered: swapData.skillOffered,
          skillRequested: swapData.skillRequested,
          message: swapData.message,
        }),
      });

      if (response.ok) {
        setSuccess('Swap request sent successfully!');
        setShowSwapModal(false);
        setSwapData({ skillOffered: '', skillRequested: '', message: '' });
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to send swap request');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto container-padding py-8">
        {success && (
          <div className="bg-green-600 text-white p-4 rounded-lg mb-6">
            {success}
          </div>
        )}

        <div className="profile-container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <div className="profile-card card sticky top-8">
                <div className="text-center mb-6">
                  <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-gray-600">
                    {user.profilePhoto ? (
                      <Image
                        src={user.profilePhoto}
                        alt={user.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-gray-400">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <h1 className="text-3xl font-bold text-white mb-2">{user.name}</h1>
                  {user.location && (
                    <p className="text-gray-400 mb-4">{user.location}</p>
                  )}
                  <div className="flex items-center justify-center mb-4">
                    <span className="text-yellow-400 text-lg">
                      {'★'.repeat(Math.floor(user.rating))}
                      {'☆'.repeat(5 - Math.floor(user.rating))}
                    </span>
                    <span className="text-gray-400 ml-2">
                      ({user.ratingsCount} reviews)
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-300 mb-2">Availability</h3>
                    <p className="text-white capitalize">{user.availability}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-300 mb-2">Member Since</h3>
                    <p className="text-white">{formatDate(user.createdAt)}</p>
                  </div>
                </div>

                {!isOwnProfile && (
                  <div className="mt-6">
                    <button
                      onClick={() => setShowSwapModal(true)}
                      className="btn-primary w-full"
                    >
                      Request Swap
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Skills Section */}
            <div className="lg:col-span-2">
              <div className="skills-section space-y-8">
                <div className="card">
                  <h2 className="text-2xl font-bold text-white mb-6">Skills Offered</h2>
                  <div className="flex flex-wrap gap-2">
                    {user.skillsOffered.length > 0 ? (
                      user.skillsOffered.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-2 bg-green-600 text-white rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-400">No skills offered yet</p>
                    )}
                  </div>
                </div>

                <div className="card">
                  <h2 className="text-2xl font-bold text-white mb-6">Skills Wanted</h2>
                  <div className="flex flex-wrap gap-2">
                    {user.skillsWanted.length > 0 ? (
                      user.skillsWanted.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-2 bg-blue-600 text-white rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-400">No skills wanted yet</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Swap Request Modal */}
        {showSwapModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-dark-800 rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-xl font-bold text-white mb-4">
                Request Swap with {user.name}
              </h3>

              {error && (
                <div className="bg-red-600 text-white p-3 rounded-lg mb-4 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSwapRequest} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Skill You're Offering
                  </label>
                  <input
                    type="text"
                    required
                    value={swapData.skillOffered}
                    onChange={(e) => setSwapData({ ...swapData, skillOffered: e.target.value })}
                    className="input-field"
                    placeholder="e.g., Web Development"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Skill You Want
                  </label>
                  <input
                    type="text"
                    required
                    value={swapData.skillRequested}
                    onChange={(e) => setSwapData({ ...swapData, skillRequested: e.target.value })}
                    className="input-field"
                    placeholder="e.g., Graphic Design"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Message (Optional)
                  </label>
                  <textarea
                    value={swapData.message}
                    onChange={(e) => setSwapData({ ...swapData, message: e.target.value })}
                    className="input-field"
                    rows={3}
                    placeholder="Tell them why you'd like to swap..."
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary flex-1"
                  >
                    {loading ? 'Sending...' : 'Send Request'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowSwapModal(false)}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  
  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  const { id } = context.params!;
  
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/users/${id}`, {
      headers: {
        cookie: context.req.headers.cookie || '',
      },
    });
    
    if (!response.ok) {
      return {
        notFound: true,
      };
    }
    
    const user = await response.json();
    
    return {
      props: {
        user,
        isOwnProfile: session.user.id === id,
        currentUserId: session.user.id,
      },
    };
  } catch (error) {
    console.error('Error fetching user:', error);
    return {
      notFound: true,
    };
  }
};

export default ProfilePage;