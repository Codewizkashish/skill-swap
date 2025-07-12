import React, { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { gsap } from 'gsap';
import Layout from '../components/Layout';
import UserCard from '../components/UserCard';

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

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface HomePageProps {
  users: User[];
  pagination: Pagination;
  searchQuery: string;
}

const HomePage: React.FC<HomePageProps> = ({ users, pagination, searchQuery }) => {
  const [search, setSearch] = useState(searchQuery);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // GSAP animations
    gsap.from('.search-container', {
      duration: 0.8,
      y: -30,
      opacity: 0,
      ease: 'power2.out',
    });

    gsap.from('.user-grid', {
      duration: 1,
      y: 50,
      opacity: 0,
      ease: 'power2.out',
      delay: 0.2,
    });

    gsap.from('.pagination', {
      duration: 0.8,
      y: 30,
      opacity: 0,
      ease: 'power2.out',
      delay: 0.4,
    });
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const query = new URLSearchParams();
    if (search) query.append('search', search);
    
    await router.push(`/?${query.toString()}`);
    setLoading(false);
  };

  const handlePageChange = (page: number) => {
    const query = new URLSearchParams();
    if (search) query.append('search', search);
    query.append('page', page.toString());
    
    router.push(`/?${query.toString()}`);
  };

  const clearSearch = () => {
    setSearch('');
    router.push('/');
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto container-padding py-8">
        {/* Hero Section */}
        <div className="text-center mb-12 gsap-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Find Your Perfect <span className="text-primary-500">Skill Swap</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Connect with others to exchange skills and learn something new. 
            Browse profiles, request swaps, and grow your abilities together.
          </p>
        </div>

        {/* Search Section */}
        <div className="search-container mb-8">
          <form onSubmit={handleSearch} className="flex gap-4 max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Search by skill name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field flex-1"
            />
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
            {search && (
              <button
                type="button"
                onClick={clearSearch}
                className="btn-secondary"
              >
                Clear
              </button>
            )}
          </form>
        </div>

        {/* Results Info */}
        <div className="mb-6">
          <p className="text-gray-400 text-center">
            {searchQuery ? (
              <>
                Found {pagination.total} users matching "{searchQuery}"
              </>
            ) : (
              <>
                Showing {pagination.total} users
              </>
            )}
          </p>
        </div>

        {/* Users Grid */}
        <div className="user-grid">
          {users.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {users.map((user) => (
                <UserCard key={user._id} user={user} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 text-xl mb-4">
                {searchQuery ? 'No users found matching your search' : 'No users found'}
              </div>
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="btn-primary"
                >
                  View All Users
                </button>
              )}
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="pagination mt-12 flex justify-center">
            <nav className="flex space-x-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={!pagination.hasPrev}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pagination.hasPrev
                    ? 'bg-gray-700 text-white hover:bg-gray-600'
                    : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                }`}
              >
                Previous
              </button>
              
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    page === pagination.page
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-700 text-white hover:bg-gray-600'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={!pagination.hasNext}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pagination.hasNext
                    ? 'bg-gray-700 text-white hover:bg-gray-600'
                    : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                }`}
              >
                Next
              </button>
            </nav>
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

  const { search, page = 1 } = context.query;
  
  try {
    const query = new URLSearchParams();
    if (search) query.append('search', search as string);
    query.append('page', page as string);
    
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/users?${query.toString()}`);
    const data = await response.json();
    
    return {
      props: {
        users: data.users || [],
        pagination: data.pagination || {
          page: 1,
          limit: 9,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        },
        searchQuery: search || '',
      },
    };
  } catch (error) {
    console.error('Error fetching users:', error);
    return {
      props: {
        users: [],
        pagination: {
          page: 1,
          limit: 9,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        },
        searchQuery: '',
      },
    };
  }
};

export default HomePage;