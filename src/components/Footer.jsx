import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPinIcon, 
  PhoneIcon, 
  EnvelopeIcon,
  GlobeAltIcon,
  BuildingOffice2Icon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Upcoming Events', path: '/events?status=upcoming' },
    { name: 'Featured Events', path: '/events?featured=true' },
    { name: 'Business Events', path: '/events?category=business' },
    { name: 'Cultural Events', path: '/events?category=cultural' },
    { name: 'Entertainment', path: '/events?category=entertainment' },
  ];

  const services = [
    'Event Planning',
    'Venue Booking',
    'Guest Management',
    'Ticketing Solutions',
    'Marketing & Promotion',
    'VIP Services',
  ];

  const locations = [
    'Downtown Dubai',
    'Dubai Marina',
    'Jumeirah',
    'Business Bay',
    'Dubai Hills',
    'Palm Jumeirah',
  ];

  const socialLinks = [
    { icon: <GlobeAltIcon className="h-5 w-5" />, label: 'Website' },
    { icon: <CalendarDaysIcon className="h-5 w-5" />, label: 'Events' },
  ];

  return (
    <footer className="relative bg-gray-950 text-white overflow-hidden">
      {/* Gradient background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur-md opacity-75" />
                <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-xl shadow-lg shadow-purple-500/50">
                  <BuildingOffice2Icon className="h-7 w-7 text-white" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-white">
                Eventra Dubai
              </h2>
            </div>
            
            <p className="text-gray-400 leading-relaxed">
              Premier event management and listing platform in Dubai. Connecting people with extraordinary experiences since 2023.
            </p>
            
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a 
                  key={index}
                  href="#" 
                  className="group relative p-3 rounded-xl bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-purple-500/20 hover:border-purple-400/50 transition-all duration-300 hover:scale-110"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 to-pink-600/0 group-hover:from-purple-600/20 group-hover:to-pink-600/20 rounded-xl transition-all duration-300" />
                  <div className="relative text-purple-300 group-hover:text-white transition-colors">
                    {social.icon}
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="group flex items-center text-gray-400 hover:text-white transition-colors duration-300"
                  >
                    <span className="w-2 h-2 rounded-full mr-3 bg-gradient-to-r from-purple-500 to-pink-500 group-hover:scale-150 transition-transform duration-300" />
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      {link.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Our Services */}
          <div>
            <h3 className="text-xl font-semibold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              Our Services
            </h3>
            <ul className="space-y-3">
              {services.map((service) => (
                <li 
                  key={service} 
                  className="group flex items-center text-gray-400 hover:text-white transition-colors duration-300 cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full mr-3 bg-gradient-to-r from-purple-500 to-pink-500 group-hover:scale-150 transition-transform duration-300" />
                  <span className="group-hover:translate-x-1 transition-transform duration-300">
                    {service}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-semibold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              Contact Us
            </h3>
            <div className="space-y-4">
              <div className="group flex items-start space-x-3 p-3 rounded-xl bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-500/10 hover:border-purple-400/30 transition-all duration-300">
                <MapPinIcon className="h-6 w-6 text-purple-400 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <div className="text-gray-400 text-sm">
                  <p className="font-medium text-white mb-1">Business Bay, Dubai, UAE</p>
                  <p>Emirates Towers, Level 15</p>
                </div>
              </div>
              
              <div className="group flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-500/10 hover:border-purple-400/30 transition-all duration-300">
                <PhoneIcon className="h-6 w-6 text-purple-400 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <p className="text-gray-400 text-sm">+971 4 123 4567</p>
              </div>
              
              <div className="group flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-500/10 hover:border-purple-400/30 transition-all duration-300">
                <EnvelopeIcon className="h-6 w-6 text-purple-400 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <p className="text-gray-400 text-sm">info@eventradubai.ae</p>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-3 text-purple-300">Coverage Areas</h4>
              <div className="flex flex-wrap gap-2">
                {locations.map((location) => (
                  <span 
                    key={location} 
                    className="px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-purple-900/40 to-pink-900/40 border border-purple-500/20 text-purple-200 hover:border-purple-400/50 hover:scale-105 transition-all duration-300 cursor-pointer"
                  >
                    {location}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="relative mt-16 pt-8 border-t border-purple-500/20">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              &copy; {currentYear} Eventra Dubai. All rights reserved.
            </p>
            
            <div className="flex flex-wrap justify-center gap-6">
              <a 
                href="#" 
                className="text-sm text-gray-400 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-purple-400 hover:to-pink-400 transition-all duration-300"
              >
                Privacy Policy
              </a>
              <a 
                href="#" 
                className="text-sm text-gray-400 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-purple-400 hover:to-pink-400 transition-all duration-300"
              >
                Terms of Service
              </a>
              <a 
                href="#" 
                className="text-sm text-gray-400 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-purple-400 hover:to-pink-400 transition-all duration-300"
              >
                Cookie Policy
              </a>
            </div>
          </div>

          {/* Tagline */}
          <div className="mt-6 text-center">
            <p className="text-sm text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 font-medium">
              Find the Party. Live the Night. 🎉
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;