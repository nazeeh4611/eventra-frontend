import React, { useState } from 'react';
import { XMarkIcon, UserPlusIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import toast from 'react-hot-toast';

const GuestListModal = ({ event, onClose }) => {
  const [formData, setFormData] = useState({
    guestName: '',
    phone: ''
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const guestData = {
        ...formData,
        eventId: event._id
      };

      await axios.post('http://localhost:5000/api/guestlist', guestData);
      
      toast.success('Added to guest list successfully!');
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to add to guest list');
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="relative rounded-2xl bg-gradient-to-br from-purple-900/40 via-indigo-900/40 to-purple-800/40 backdrop-blur-sm border border-purple-500/20 max-w-sm w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-pink-600/10 to-purple-600/10" />
        
        <div className="relative p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-xl bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30">
                <UserPlusIcon className="h-5 w-5 text-purple-300" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  Join Guest List
                </h2>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/5 rounded-lg transition-colors"
            >
              <XMarkIcon className="h-5 w-5 text-gray-400" />
            </button>
          </div>

          <div className="mb-4 p-3 rounded-xl bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-500/30">
            <p className="text-sm text-gray-300">
              Get priority access and special offers
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                name="guestName"
                value={formData.guestName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2.5 rounded-xl bg-gray-900/50 border border-purple-500/20 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-transparent text-sm"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-3 py-2.5 rounded-xl bg-gray-900/50 border border-purple-500/20 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-transparent text-sm"
                placeholder="+971 50 123 4567"
              />
            </div>

            <div className="flex space-x-2 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 px-4 border border-purple-500/30 text-gray-300 text-sm font-semibold rounded-xl hover:bg-white/5 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2.5 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-200 disabled:opacity-50"
              >
                {loading ? 'Adding...' : 'Join'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GuestListModal;