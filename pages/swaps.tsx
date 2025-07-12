import React, { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { gsap } from 'gsap';
import Layout from '../components/Layout';

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

interface SwapsPageProps {
  swaps: Swap[];
  currentUserId: string;
}

const SwapsPage: React.FC<SwapsPageProps> = ({ swaps, currentUserId }) => {
  const [filter, setFilter] = useState<'all' | 'sent' | 'received'>('all');
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  useEffect(() => {
    // GSAP animations
    gsap.from('.swaps-container', {
      duration: 1,
      y: 50,
      opacity: 0,
      ease: 'power2.out',
    });

    gsap.from('.swap-card', {
      duration: 0.8,
      y: 30,
      opacity: 0,
      ease: 'power2.out',
      stagger: 0.1,
    });
  }, []);

  const handleSwapAction = async (swapId: string, action: 'accept' | 'reject' | 'complete' | 'delete') => {
    setLoading(swapId);
    setError('');
    setSuccess('');

    try {
      if (action === 'delete') {
        const response = await fetch(`/api/swaps/${swapId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setSuccess('Swap deleted successfully!');
          router.reload();
        } else {
          const data = await response.json();
          setError(data.message || 'Failed to delete swap');
        }
      } else {
        const statusMap = {
          accept: 'accepted',
          reject: 'rejected',
          complete: 'completed',
        };

        const response = await fetch(`/api/swaps/${swapId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: statusMap[action],
          }),
        });

        if (response.ok) {
          setSuccess(`Swap ${action}ed successfully!`);
          router.reload();
        } else {
          const data = await response.json();
          setError(data.message || `Failed to ${action} swap`);
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  const filteredSwaps = swaps.filter((swap) => {
    if (filter === 'sent') return swap.requester._id === currentUserId;
    if (filter === 'received') return swap.receiver._id === currentUserId;
    return true;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
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

  return (
    <Layout>
      <div className="max-w-6xl mx-auto container-padding py-8">
        <div className="swaps-container">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">My Swaps</h1>
            <p className="text-gray-400">Manage your skill swap requests</p>
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

          {/* Filter Tabs */}
          <div className="flex space-x-4 mb-8">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              All Swaps
            </button>
            <button
              onClick={() => setFilter('sent')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'sent'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Sent Requests
            </button>
            <button
              onClick={() => setFilter('received')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'received'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Received Requests
            </button>
          </div>

          {/* Swaps List */}
          <div className="space-y-4">
            {filteredSwaps.length > 0 ? (
              filteredSwaps.map((swap) => {
                const isRequester = swap.requester._id === currentUserId;
                const otherUser = isRequester ? swap.receiver : swap.requester;
                const canAcceptReject = !isRequester && swap.status === 'pending';
                const canDelete = isRequester && swap.status === 'pending';
                const canComplete = swap.status === 'accepted';

                return (
                  <div key={swap._id} className="swap-card card">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-600">
                          {otherUser.profilePhoto ? (
                            <Image
                              src={otherUser.profilePhoto}
                              alt={otherUser.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-lg font-bold text-gray-400">
                              {otherUser.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <Link
                              href={`/profile/${otherUser._id}`}
                              className="text-lg font-semibold text-white hover:text-primary-400 transition-colors"
                            >
                              {otherUser.name}
                            </Link>
                            <span className={`px-2 py-1 rounded-full text-xs text-white ${getStatusColor(swap.status)}`}>
                              {swap.status.toUpperCase()}
                            </span>
                          </div>
                          <div className="text-sm text-gray-400 mb-2">
                            {isRequester ? 'You requested' : 'Requested from you'} • {formatDate(swap.createdAt)}
                          </div>
                          <div className="flex items-center space-x-4 text-sm">
                            <div>
                              <span className="text-gray-400">Offering:</span>{' '}
                              <span className="text-green-400">{swap.skillOffered}</span>
                            </div>
                            <div>
                              <span className="text-gray-400">Wanting:</span>{' '}
                              <span className="text-blue-400">{swap.skillRequested}</span>
                            </div>
                          </div>
                          {swap.message && (
                            <div className="mt-2 p-2 bg-gray-700 rounded text-sm text-gray-300">
                              "{swap.message}"
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex space-x-2">
                        <Link
                          href={`/swap/${swap._id}`}
                          className="btn-secondary text-sm"
                        >
                          View Details
                        </Link>

                        {canAcceptReject && (
                          <>
                            <button
                              onClick={() => handleSwapAction(swap._id, 'accept')}
                              disabled={loading === swap._id}
                              className="btn-success text-sm"
                            >
                              {loading === swap._id ? 'Processing...' : 'Accept'}
                            </button>
                            <button
                              onClick={() => handleSwapAction(swap._id, 'reject')}
                              disabled={loading === swap._id}
                              className="btn-danger text-sm"
                            >
                              {loading === swap._id ? 'Processing...' : 'Reject'}
                            </button>
                          </>
                        )}

                        {canComplete && (
                          <button
                            onClick={() => handleSwapAction(swap._id, 'complete')}
                            disabled={loading === swap._id}
                            className="btn-success text-sm"
                          >
                            {loading === swap._id ? 'Processing...' : 'Mark Complete'}
                          </button>
                        )}

                        {canDelete && (
                          <button
                            onClick={() => handleSwapAction(swap._id, 'delete')}
                            disabled={loading === swap._id}
                            className="btn-danger text-sm"
                          >
                            {loading === swap._id ? 'Deleting...' : 'Delete'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 text-xl mb-4">
                  {filter === 'all' ? 'No swaps found' : `No ${filter} swaps found`}
                </div>
                <Link href="/" className="btn-primary">
                  Browse Users
                </Link>
              </div>
            )}
          </div>
        </div>
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

  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/swaps`, {
      headers: {
        cookie: context.req.headers.cookie || '',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch swaps');
    }
    
    const swaps = await response.json();
    
    return {
      props: {
        swaps,
        currentUserId: session.user.id,
      },
    };
  } catch (error) {
    console.error('Error fetching swaps:', error);
    return {
      props: {
        swaps: [],
        currentUserId: session.user.id,
      },
    };
  }
};

export default SwapsPage;