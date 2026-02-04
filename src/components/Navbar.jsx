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
    <nav className="glass-effect sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-dubai-blue to-dubai-gold p-2 rounded-lg">
                <CalendarDaysIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gradient">Eventra Dubai</h1>
                <p className="text-xs text-gray-600">Premier Event Management</p>
              </div>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  location.pathname === item.path
                    ? 'text-dubai-blue bg-blue-50'
                    : 'text-gray-700 hover:text-dubai-blue hover:bg-blue-50'
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
            <Link
              to="/admin/login"
              className="btn-primary text-sm py-2 px-4"
            >
              Admin Portal
            </Link>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-dubai-blue focus:outline-none"
            >
              {isOpen ? (
                <XMarkIcon className="h-8 w-8" />
              ) : (
                <Bars3Icon className="h-8 w-8" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center space-x-2 px-3 py-3 rounded-md text-base font-medium ${
                  location.pathname === item.path
                    ? 'text-dubai-blue bg-blue-50'
                    : 'text-gray-700 hover:text-dubai-blue hover:bg-blue-50'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
            <Link
              to="/admin/login"
              className="flex items-center justify-center mt-4 btn-primary"
              onClick={() => setIsOpen(false)}
            >
              Admin Portal
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;