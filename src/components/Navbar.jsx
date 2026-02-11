import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  CalendarDaysIcon, 
  Bars3Icon, 
  XMarkIcon,
  BuildingOffice2Icon,
  PhoneIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/', icon: <BuildingOffice2Icon className="h-5 w-5" /> },
    { name: 'Events', path: '/events', icon: <CalendarDaysIcon className="h-5 w-5" /> },
    { name: 'About', path: '/about', icon: <UserGroupIcon className="h-5 w-5" /> },
    { name: 'Contact', path: '/contact', icon: <PhoneIcon className="h-5 w-5" /> },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-gray-950/95 backdrop-blur-lg border-b border-purple-500/20 shadow-lg shadow-purple-500/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
            <img
  src="/logo.png"
  alt="Eventra Dubai Logo"
  className="h-16 w-auto object-contain"
/>
          

              

            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`group relative flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  location.pathname === item.path
                    ? 'text-white bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30'
                    : 'text-gray-300 hover:text-white hover:bg-purple-600/10'
                }`}
              >
                <div className={`transition-transform duration-300 ${
                  location.pathname === item.path ? 'scale-110' : 'group-hover:scale-110'
                }`}>
                  {item.icon}
                </div>
                <span>{item.name}</span>
                {location.pathname === item.path && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
                )}
              </Link>
            ))}
            
            
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="relative text-gray-300 hover:text-white focus:outline-none p-2 rounded-lg hover:bg-purple-600/10 transition-colors duration-300"
            >
              {isOpen ? (
                <XMarkIcon className="h-7 w-7" />
              ) : (
                <Bars3Icon className="h-7 w-7" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-900/95 backdrop-blur-lg border-t border-purple-500/20">
          <div className="px-4 pt-2 pb-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 ${
                  location.pathname === item.path
                    ? 'text-white bg-gradient-to-r from-purple-600/30 to-pink-600/30 border border-purple-500/30 shadow-lg shadow-purple-500/20'
                    : 'text-gray-300 hover:text-white hover:bg-purple-600/10'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <div className={`transition-transform duration-300 ${
                  location.pathname === item.path ? 'scale-110 text-purple-400' : ''
                }`}>
                  {item.icon}
                </div>
                <span>{item.name}</span>
              </Link>
            ))}
            
            <Link
              to="/admin/login"
              className="flex items-center justify-center mt-4 gap-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-purple-500/50"
              onClick={() => setIsOpen(false)}
            >
              <span>Admin Portal</span>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;