import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const transparentPaths = ['/', '/about'];
  const isTransparent = transparentPaths.includes(location.pathname);

  useEffect(() => {
    setIsMenuOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <header
      className={`top-0 left-0 w-full z-50 ${
        isTransparent ? 'absolute text-white' : 'relative bg-white shadow text-black'
      }`}
    >
      <div className={`${isTransparent ? 'bg-transparent' : 'bg-white'} backdrop-blur-sm`}>
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            to="/"
            className={`text-2xl font-bold tracking-tight ${
              isTransparent ? 'text-white' : 'text-black'
            } drop-shadow-md`}
          >
            MentorLoop
          </Link>

          <nav
            className={`hidden md:flex items-center space-x-8 font-medium text-sm drop-shadow-md ${
              isTransparent ? 'text-white' : 'text-black'
            }`}
          >
            <Link
              to="/"
              className={`transition-colors ${
                isTransparent ? 'hover:text-gray-300' : 'hover:text-blue-500'
              }`}
            >
              Home
            </Link>
            <Link
              to="/about"
              className={`transition-colors ${
                isTransparent ? 'hover:text-gray-300' : 'hover:text-blue-500'
              }`}
            >
              About Us
            </Link>
            <Link
              to={currentUser ? '/sessions' : '/contact'}
              className={`transition-colors ${
                isTransparent ? 'hover:text-gray-300' : 'hover:text-blue-500'
              }`}
            >
              {currentUser ? 'Book a Session' : 'Connect'}
            </Link>
            {currentUser && (
              <Link
                to="/ai-quiz"
                className={`transition-colors ${
                  isTransparent ? 'hover:text-gray-300' : 'hover:text-blue-500'
                }`}
              >
                AI Quiz
              </Link>
            )}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            {currentUser ? (
              <div className="relative">
                <button onClick={() => setDropdownOpen(!dropdownOpen)}>
                  {dropdownOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white text-gray-800 rounded-lg shadow-xl p-4 space-y-3 z-50">
                    <Link to="/profile" className="hover:text-blue-600 block">Profile</Link>
                    <Link to="/aptitude" className="hover:text-blue-600 block">Mock Tests</Link>
                    <Link to="/handouts" className="hover:text-blue-600 block">Notes</Link>
                    <Link to="/mentorship" className="hover:text-blue-600 block">Mentors</Link>
                    <Link to="/hack" className="hover:text-blue-600 block">Hack & Quiz Hub</Link>
                    <Link to="/code" className="hover:text-blue-600 block">Coding Point</Link>
                    <button
                      onClick={handleLogout}
                      className="text-red-500 hover:underline w-full text-left text-sm"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`px-4 py-1.5 border ${
                    isTransparent ? 'border-white text-white hover:bg-white/20' : 'border-black text-black hover:bg-black/10'
                  } rounded-md text-sm`}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-black/90 backdrop-blur-md px-4 py-5 text-white space-y-4 text-sm">
          <Link to="/" className="block hover:text-blue-300">Home</Link>
          <Link to="/about" className="block hover:text-blue-300">About Us</Link>
          <Link to={currentUser ? '/sessions' : '/contact'} className="block hover:text-blue-300">
            {currentUser ? 'Book a Session' : 'Connect'}
          </Link>
          {currentUser && (
            <>
              <Link to="/ai-quiz" className="block hover:text-blue-300">AI Quiz</Link>
              <Link to="/profile" className="block hover:text-blue-300">Profile</Link>
              <Link to="/aptitude" className="block hover:text-blue-300">Mock Tests</Link>
              <Link to="/handouts" className="block hover:text-blue-300">Notes</Link>
              <Link to="/mentorship" className="block hover:text-blue-300">Mentors</Link>
              <Link to="/hack" className="block hover:text-blue-300">Hack & Quiz Hub</Link>
              <Link to="/code" className="block hover:text-blue-300">Coding Point</Link>
            </>
          )}
          <div className="pt-4 border-t border-white/30">
            {currentUser ? (
              <button
                onClick={handleLogout}
                className="w-full text-left text-red-400 hover:underline"
              >
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" className="block hover:text-blue-300">Login</Link>
                <Link to="/signup" className="block hover:text-blue-300">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
