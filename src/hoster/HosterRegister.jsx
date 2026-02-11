import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  BuildingOfficeIcon,
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
  PhoneIcon,
  MapPinIcon,
  IdentificationIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';
import toast from 'react-hot-toast';
import baseurl from '../Base/base';

const HosterRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    website: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${baseurl}/hoster/register`, formData);

      toast.success(response.data.message);
      
      // Navigate back to login
      navigate('/hoster/login');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        
        <div className="text-center">
          <div className="flex justify-center">
            <div className="bg-gradient-to-r from-green-600 to-green-500 p-4 rounded-2xl">
              <BuildingOfficeIcon className="h-12 w-12 text-white" />
            </div>
          </div>
          
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Hoster Registration
          </h2>
          
          <p className="mt-2 text-sm text-gray-600">
            Register your company to host and manage events
          </p>
        </div>

        <div className="bg-white py-8 px-4 shadow-xl rounded-2xl sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {/* Company Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                Company Information
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center">
                    <BuildingOfficeIcon className="h-5 w-5 text-gray-400 mr-2" />
                    Company Name *
                  </div>
                </label>
                <input
                  name="companyName"
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Your company name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center">
                    <IdentificationIcon className="h-5 w-5 text-gray-400 mr-2" />
                    Tax / VAT Number
                  </div>
                </label>
                <input
                  name="taxNumber"
                  type="text"
                  value={formData.taxNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., VAT-123456789"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center">
                    <GlobeAltIcon className="h-5 w-5 text-gray-400 mr-2" />
                    Website
                  </div>
                </label>
                <input
                  name="website"
                  type="url"
                  value={formData.website}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="https://www.yourcompany.com"
                />
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                Contact Information
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center">
                    <UserIcon className="h-5 w-5 text-gray-400 mr-2" />
                    Contact Person *
                  </div>
                </label>
                <input
                  name="contactPerson"
                  type="text"
                  required
                  value={formData.contactPerson}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Full name of primary contact"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center">
                    <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-2" />
                    Email Address *
                  </div>
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="company@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center">
                    <PhoneIcon className="h-5 w-5 text-gray-400 mr-2" />
                    Phone Number *
                  </div>
                </label>
                <input
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="+1 234 567 8900"
                />
              </div>
            </div>

            {/* Account Security Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                Account Security
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center">
                      <LockClosedIcon className="h-5 w-5 text-gray-400 mr-2" />
                      Password *
                    </div>
                  </label>
                  <input
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password *
                  </label>
                  <input
                    name="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <div className="flex space-x-4 pt-4">
              <Link
                to="/hoster/login"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-gray-700 text-center"
              >
                Back to Login
              </Link>

              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium"
              >
                {loading ? 'Registering...' : 'Register Company'}
              </button>
            </div>
          </form>

          {/* Approval Notice */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Registration Review Process
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>
                    Your registration will be reviewed by our team within 24-48 hours.
                    You will receive an email notification once your account is approved.
                    You can only log in after approval.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 text-center text-sm text-gray-500">
            By registering, you agree to our{' '}
            <a href="#" className="text-green-600 hover:text-green-500">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-green-600 hover:text-green-500">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HosterRegister;