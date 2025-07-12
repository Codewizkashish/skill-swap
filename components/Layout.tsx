import React from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { data: session } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      {/* Navigation */}
      <nav className="bg-dark-800 border-b border-gray-700 gsap-fade-in">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-primary-500">
              SkillSwap
            </Link>
            
            {session ? (
              <div className="flex items-center space-x-4">
                <Link
                  href="/"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    router.pathname === '/'
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  Browse
                </Link>
                <Link
                  href="/swaps"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    router.pathname === '/swaps'
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  My Swaps
                </Link>
                <Link
                  href="/edit-profile"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    router.pathname === '/edit-profile'
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  Profile
                </Link>
                <button
                  onClick={handleSignOut}
                  className="btn-secondary"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link href="/login" className="btn-primary">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-dark-800 border-t border-gray-700 py-8">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center text-gray-400">
            <p>&copy; 2024 SkillSwap Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;