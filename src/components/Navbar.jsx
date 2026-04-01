import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import Logo from './Logo';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/home' },
    { name: 'Bookings', path: '/bookings' },
    { name: 'Profile', path: '/profile' }
  ];

  return (
    <nav className={`sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all duration-300 ${scrolled ? 'shadow-sm py-1' : 'py-2'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/home" className="flex items-center">
            <Logo textSize="text-2xl" />
          </Link>

          <div className="hidden md:flex items-center gap-8 ml-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-indigo-600 ${location.pathname === link.path ? 'text-indigo-600 font-semibold' : 'text-gray-500'
                  }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {user && (
              <span className="text-sm font-medium text-gray-700 hidden sm:block">
                Hello, <span className="text-indigo-600">{user.name}</span>
              </span>
            )}
            <div className="h-6 w-[1px] bg-gray-200 hidden sm:block"></div>
            <button
              onClick={logout}
              className="text-sm font-medium text-gray-500 hover:text-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Mobile navigation */}
      <div className="md:hidden border-t border-gray-100 bg-white px-4 py-2 flex justify-around">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`text-xs font-medium py-2 px-3 rounded-lg ${location.pathname === link.path ? 'bg-indigo-50 text-indigo-700' : 'text-gray-500'
              }`}
          >
            {link.name}
          </Link>
        ))}
      </div>
    </nav>
  );
}
