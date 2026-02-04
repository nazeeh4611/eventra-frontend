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

  return (
    <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <BuildingOffice2Icon className="h-8 w-8 text-dubai-gold" />
              <h2 className="text-2xl font-bold">Eventra Dubai</h2>
            </div>
            <p className="text-gray-300 mb-6">
              Premier event management and listing platform in Dubai. Connecting people with extraordinary experiences since 2023.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-dubai-gold transition-colors">
                <GlobeAltIcon className="h-6 w-6" />
              </a>
              <a href="#" className="hover:text-dubai-gold transition-colors">
                <CalendarDaysIcon className="h-6 w-6" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-6 text-dubai-gold">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-300 hover:text-dubai-gold transition-colors flex items-center"
                  >
                    <span className="w-2 h-2 bg-dubai-blue rounded-full mr-2"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-6 text-dubai-gold">Our Services</h3>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service} className="text-gray-300 hover:text-dubai-gold transition-colors">
                  {service}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-6 text-dubai-gold">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPinIcon className="h-6 w-6 text-dubai-blue mt-1" />
                <p className="text-gray-300">
                  Business Bay, Dubai, UAE<br />
                  Emirates Towers, Level 15
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <PhoneIcon className="h-6 w-6 text-dubai-blue" />
                <p className="text-gray-300">+971 4 123 4567</p>
              </div>
              <div className="flex items-center space-x-3">
                <EnvelopeIcon className="h-6 w-6 text-dubai-blue" />
                <p className="text-gray-300">info@eventradubai.ae</p>
              </div>
            </div>
            
            <div className="mt-8">
              <h4 className="text-lg font-semibold mb-4 text-dubai-gold">Coverage Areas</h4>
              <div className="flex flex-wrap gap-2">
                {locations.map((location) => (
                  <span key={location} className="px-3 py-1 bg-gray-700 rounded-full text-sm">
                    {location}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">
              &copy; {currentYear} Eventra Dubai. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-dubai-gold transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-dubai-gold transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-dubai-gold transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;