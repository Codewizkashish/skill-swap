import React, { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { gsap } from 'gsap';
import Layout from '../../components/Layout';

interface User {
  _id: string;
  name: string;
  email: string;
  profilePhoto?: string;
}

interface Swap {
  _id: string;
  requester: User;
  receiver: User;
  skillOffered: string;
  skillRequested: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  message?: string;
  createdAt: string;
  updatedAt: string;
}

interface SwapDetailsPageProps {
  swap: Swap;
  currentUserId: string;
}

const SwapDetailsPage: React.FC<SwapDetailsPageProps> = ({ swap, currentUserId }) => {
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratingData, setRatingData] = useState({
    rating: 5,
    feedback: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  useEffect(() => {
    // GSAP animations
    gsap.from('.swap-details-container', {
      duration: 1,
      y: 50,
      opacity: 0,
      ease: 'power2.out',
    });
  }, []);

  const handleRatingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const isRequester = swap.requester._id === currentUserId;
      const rateeId = isRequester ? swap.receiver._id : swap.requester._id;

      const response = await fetch('/api/ratings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          swapId: swap._id,
          ratee: rateeId,
          rating: ratingData.rating,
          feedback: ratingData.feedback,
        }),
      });

      if (response.ok) {
        setSuccess('Rating submitted successfully!');
        setShowRatingModal(false);
        setRatingData({ rating: 5, feedback: '' });
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to submit rating');
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
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-600';
      case 'accepted':
        return 'bg-blue-600';
      case 'rejected':
        return 'bg-red-600';
      case 'completed':
        return 'bg-green-600';
      default:
        return 'bg-gray-600';
    }
  };

  const isRequester = swap.requester._id === currentUserId;
  const otherUser = isRequester ? swap.receiver : swap.requester;
  const canRate = swap.status === 'completed';

  return (
    <Layout>
      <div className="max-w-4xl mx-auto container-padding py-8">
        <div className="swap-details-container">
          <div className="mb-6">
            <Link href="/swaps" className="text-primary-400 hover:text-primary-300 mb-4 inline-block">
              ← Back to Swaps
            </Link>
            <h1 className="text-3xl font-bold text-white mb-2">Swap Details</h1>
          </div>

          {error && (
            <div className="bg-red-600 text-white p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-600 text-white p-4 rounded-lg mb-6">
              {success}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Swap Information */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-white">Swap Information</h2>
                <span className={`px-3 py-1 rounded-full text-sm text-white ${getStatusColor(swap.status)}`}>
                  {swap.status.toUpperCase()}
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-300 mb-2">Skill Exchange</h3>
                  <div className="flex items-center space-x-4">
                    <span className="px-3 py-2 bg-green-600 text-white rounded-lg text-sm">
                      {swap.skillOffered}
                    </span>
                    <span className="text-gray-400">↔</span>
                    <span className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm">
                      {swap.skillRequested}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-300 mb-2">Timeline</h3>
                  <div className="text-sm text-gray-400">
                    <div>Created: {formatDate(swap.createdAt)}</div>
                    <div>Updated: {formatDate(swap.updatedAt)}</div>
                  </div>
                </div>

                {swap.message && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-300 mb-2">Message</h3>
                    <div className="p-3 bg-gray-700 rounded-lg text-sm text-gray-300">
                      "{swap.message}"
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Other User Information */}
            <div className="card">
              <h2 className="text-2xl font-semibold text-white mb-6">
                {isRequester ? 'Receiver' : 'Requester'}
              </h2>

              <div className="flex items-center space-x-4 mb-6">
                <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gray-600">
                  {otherUser.profilePhoto ? (
                    <Image
                      src={otherUser.profilePhoto}
                      alt={otherUser.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-gray-400">
                      {otherUser.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">{otherUser.name}</h3>
                  <p className="text-gray-400">{otherUser.email}</p>
                </div>
              </div>

              <div className="space-y-4">
                <Link
                  href={`/profile/${otherUser._id}`}
                  className="btn-primary w-full text-center block"
                >
                  View Profile
                </Link>

                {canRate && (
                  <button
                    onClick={() => setShowRatingModal(true)}
                    className="btn-secondary w-full"
                  >
                    Rate & Review
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Swap Status Information */}
          <div className="card mt-8">
            <h2 className="text-2xl font-semibold text-white mb-4">Status Information</h2>
            <div className="text-gray-300">
              {swap.status === 'pending' && (
                <p>
                  This swap is still pending. 
                  {isRequester ? ' Wait for the receiver to accept or reject your request.' : ' You can accept or reject this request.'}
                </p>
              )}
              {swap.status === 'accepted' && (
                <p>
                  This swap has been accepted! You can now coordinate with each other to complete the skill exchange.
                  Once completed, mark it as complete and leave a rating.
                </p>
              )}
              {swap.status === 'rejected' && (
                <p>This swap request has been rejected.</p>
              )}
              {swap.status === 'completed' && (
                <p>
                  This swap has been completed successfully! 
                  {canRate && ' Don\'t forget to rate and review your experience.'}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Rating Modal */}
        {showRatingModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-dark-800 rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-xl font-bold text-white mb-4">
                Rate {otherUser.name}
              </h3>

              <form onSubmit={handleRatingSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Rating (1-5 stars)
                  </label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRatingData({ ...ratingData, rating: star })}
                        className={`text-2xl ${
                          star <= ratingData.rating ? 'text-yellow-400' : 'text-gray-600'
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Feedback (Optional)
                  </label>
                  <textarea
                    value={ratingData.feedback}
                    onChange={(e) => setRatingData({ ...ratingData, feedback: e.target.value })}
                    className="input-field"
                    rows={4}
                    placeholder="Share your experience with this skill swap..."
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary flex-1"
                  >
                    {loading ? 'Submitting...' : 'Submit Rating'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowRatingModal(false)}
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
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/swaps/${id}`, {
      headers: {
        cookie: context.req.headers.cookie || '',
      },
    });
    
    if (!response.ok) {
      return {
        notFound: true,
      };
    }
    
    const swap = await response.json();
    
    return {
      props: {
        swap,
        currentUserId: session.user.id,
      },
    };
  } catch (error) {
    console.error('Error fetching swap:', error);
    return {
      notFound: true,
    };
  }
};

export default SwapDetailsPage;