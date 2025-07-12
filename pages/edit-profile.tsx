import React, { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { gsap } from 'gsap';
import Layout from '../components/Layout';

interface User {
  _id: string;
  name: string;
  email: string;
  location?: string;
  profilePhoto?: string;
  skillsOffered: string[];
  skillsWanted: string[];
  availability: string;
  profileVisibility: 'public' | 'private';
}

interface EditProfilePageProps {
  user: User;
}

const EditProfilePage: React.FC<EditProfilePageProps> = ({ user }) => {
  const [formData, setFormData] = useState({
    name: user.name,
    location: user.location || '',
    profilePhoto: user.profilePhoto || '',
    skillsOffered: user.skillsOffered.join(', '),
    skillsWanted: user.skillsWanted.join(', '),
    availability: user.availability,
    profileVisibility: user.profileVisibility,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  useEffect(() => {
    // GSAP animations
    gsap.from('.form-container', {
      duration: 1,
      y: 50,
      opacity: 0,
      ease: 'power2.out',
    });
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`/api/users/${user._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          location: formData.location,
          profilePhoto: formData.profilePhoto,
          skillsOffered: formData.skillsOffered
            .split(',')
            .map((skill) => skill.trim())
            .filter((skill) => skill.length > 0),
          skillsWanted: formData.skillsWanted
            .split(',')
            .map((skill) => skill.trim())
            .filter((skill) => skill.length > 0),
          availability: formData.availability,
          profileVisibility: formData.profileVisibility,
        }),
      });

      if (response.ok) {
        setSuccess('Profile updated successfully!');
        setTimeout(() => {
          router.push(`/profile/${user._id}`);
        }, 2000);
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to update profile');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto container-padding py-8">
        <div className="form-container">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Edit Profile</h1>
            <p className="text-gray-400">Update your profile information and skills</p>
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

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="card">
              <h2 className="text-xl font-semibold text-white mb-4">Basic Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="e.g., San Francisco, CA"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="profilePhoto" className="block text-sm font-medium text-gray-300 mb-2">
                  Profile Photo URL
                </label>
                <input
                  type="url"
                  id="profilePhoto"
                  name="profilePhoto"
                  value={formData.profilePhoto}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="https://example.com/photo.jpg"
                />
                <p className="text-gray-500 text-sm mt-1">
                  Paste a URL to your profile photo (optional)
                </p>
              </div>

              <div>
                <label htmlFor="availability" className="block text-sm font-medium text-gray-300 mb-2">
                  Availability
                </label>
                <select
                  id="availability"
                  name="availability"
                  value={formData.availability}
                  onChange={handleInputChange}
                  className="input-field"
                >
                  <option value="weekends">Weekends</option>
                  <option value="evenings">Evenings</option>
                  <option value="weekdays">Weekdays</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>

              <div>
                <label htmlFor="profileVisibility" className="block text-sm font-medium text-gray-300 mb-2">
                  Profile Visibility
                </label>
                <select
                  id="profileVisibility"
                  name="profileVisibility"
                  value={formData.profileVisibility}
                  onChange={handleInputChange}
                  className="input-field"
                >
                  <option value="public">Public - Anyone can view</option>
                  <option value="private">Private - Only you can view</option>
                </select>
              </div>
            </div>

            <div className="card">
              <h2 className="text-xl font-semibold text-white mb-4">Skills</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="skillsOffered" className="block text-sm font-medium text-gray-300 mb-2">
                    Skills I Can Offer
                  </label>
                  <textarea
                    id="skillsOffered"
                    name="skillsOffered"
                    value={formData.skillsOffered}
                    onChange={handleInputChange}
                    className="input-field"
                    rows={3}
                    placeholder="e.g., Web Development, Graphic Design, Photography (separate with commas)"
                  />
                  <p className="text-gray-500 text-sm mt-1">
                    Enter skills separated by commas
                  </p>
                </div>

                <div>
                  <label htmlFor="skillsWanted" className="block text-sm font-medium text-gray-300 mb-2">
                    Skills I Want to Learn
                  </label>
                  <textarea
                    id="skillsWanted"
                    name="skillsWanted"
                    value={formData.skillsWanted}
                    onChange={handleInputChange}
                    className="input-field"
                    rows={3}
                    placeholder="e.g., Spanish, Cooking, Piano (separate with commas)"
                  />
                  <p className="text-gray-500 text-sm mt-1">
                    Enter skills separated by commas
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex-1"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </form>
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
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/users/${session.user.id}`, {
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
      },
    };
  } catch (error) {
    console.error('Error fetching user:', error);
    return {
      notFound: true,
    };
  }
};

export default EditProfilePage;