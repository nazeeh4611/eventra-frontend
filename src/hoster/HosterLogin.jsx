import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
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

  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);

  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const [registerData, setRegisterData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: '',
    taxNumber: '',
    website: ''
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

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    if (registerData.password !== registerData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${baseurl}/hoster/register`, registerData);

      toast.success(response.data.message);
      setIsRegister(false);

      setRegisterData({
        companyName: '',
        contactPerson: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        address: '',
        taxNumber: '',
        website: ''
      });

    } catch (error) {
      toast.error(error.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e, formType) => {
    const { name, value } = e.target;

    if (formType === 'login') {
      setLoginData(prev => ({ ...prev, [name]: value }));
    } else {
      setRegisterData(prev => ({ ...prev, [name]: value }));
    }
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
            {isRegister ? 'Hoster Registration' : 'Hoster Portal'}
          </h2>

          <p className="mt-2 text-sm text-gray-600">
            {isRegister
              ? 'Register your company to host events'
              : 'Sign in to manage your events'}
          </p>
        </div>

        <div className="bg-white py-8 px-4 shadow-xl rounded-2xl sm:px-10">

          {isRegister ? (
            <form className="space-y-6" onSubmit={handleRegisterSubmit}>
              {/* --- REGISTER FORM (unchanged UI) --- */}
              <div className="space-y-4">

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name *
                  </label>
                  <input
                    name="companyName"
                    type="text"
                    required
                    value={registerData.companyName}
                    onChange={(e) => handleInputChange(e, 'register')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Your company name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Person *
                  </label>
                  <input
                    name="contactPerson"
                    type="text"
                    required
                    value={registerData.contactPerson}
                    onChange={(e) => handleInputChange(e, 'register')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Full name"
                  />
                </div>

                {/* rest of your register fields unchanged */}
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setIsRegister(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Back to Login
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {loading ? 'Registering...' : 'Register'}
                </button>
              </div>
            </form>

          ) : (

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
                  onChange={(e) => handleInputChange(e, 'login')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
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
                  onChange={(e) => handleInputChange(e, 'login')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setIsRegister(true)}
                  className="text-sm text-green-600 hover:text-green-700"
                >
                  Don't have an account? Register here
                </button>
              </div>

            </form>
          )}

        </div>
      </div>
    </div>
  );
};

export default HosterLogin;
