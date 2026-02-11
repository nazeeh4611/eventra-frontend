import React, { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { LockClosedIcon, EnvelopeIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import toast from 'react-hot-toast';
import baseurl from '../Base/base';

const HosterLogin = () => {
  const navigate = useNavigate();

  // ✅ block login page if already logged in
  const token = localStorage.getItem('hosterToken');
  const hosterData = localStorage.getItem('hosterData');

  if (token && hosterData) {
    try {
      const hoster = JSON.parse(hosterData);
      if (hoster?.status === 'approved') {
        return <Navigate to="/hoster/dashboard" replace />;
      }
    } catch {}
  }

  const [loading, setLoading] = useState(false);
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${baseurl}/hoster/login`, loginData);

      localStorage.setItem('hosterToken', response.data.token);
      localStorage.setItem('hosterData', JSON.stringify(response.data.hoster));

      toast.success('Login successful!');

      // ✅ prevent back to login page
      navigate('/hoster/dashboard', { replace: true });

    } catch (error) {
      toast.error(error.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">

        <div className="text-center">
          <div className="flex justify-center">
            <div className="bg-gradient-to-r from-green-600 to-green-500 p-4 rounded-2xl">
              <BuildingOfficeIcon className="h-12 w-12 text-white" />
            </div>
          </div>

          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Hoster Portal
          </h2>

          <p className="mt-2 text-sm text-gray-600">
            Sign in to manage your events
          </p>
        </div>

        <div className="bg-white py-8 px-4 shadow-xl rounded-2xl sm:px-10">

          <form className="space-y-6" onSubmit={handleLoginSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <EnvelopeIcon className="h-5 w-5 text-gray-400 inline mr-2" />
                Email Address
              </label>
              <input
                name="email"
                type="email"
                required
                value={loginData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="company@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <LockClosedIcon className="h-5 w-5 text-gray-400 inline mr-2" />
                Password
              </label>
              <input
                name="password"
                type="password"
                required
                value={loginData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            <div className="text-center">
              <Link
                to="/hoster/register"
                className="text-sm text-green-600 hover:text-green-700"
              >
                Don't have an account? Register here
              </Link>
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Need help?
                </span>
              </div>
            </div>

            <div className="text-center text-sm text-gray-500">
              <Link to="/forgot-password" className="text-green-600 hover:text-green-500">
                Forgot your password?
              </Link>
            </div>
          </form>

          {/* Approval Notice for Pending Accounts */}
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Account Pending?
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    If you've registered but can't log in, your account is still under review.
                    You'll receive an email once approved.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HosterLogin;