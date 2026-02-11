// components/GuestListModal.jsx
import React, { useState } from 'react';
import { XMarkIcon, UserPlusIcon, UserIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import toast from 'react-hot-toast';
import baseurl from '../Base/base';

const GuestListModal = ({ event, onClose }) => {
  const [formData, setFormData] = useState({
    guestName: '',
    phone: '',
    numberOfGuests: 1,
    additionalGuests: []
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'numberOfGuests') {
      const num = parseInt(value);
      setFormData(prev => ({
        ...prev,
        numberOfGuests: num,
        additionalGuests: Array(num - 1).fill('')
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleGuestNameChange = (index, value) => {
    const updatedGuests = [...formData.additionalGuests];
    updatedGuests[index] = value;
    setFormData(prev => ({
      ...prev,
      additionalGuests: updatedGuests
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const guestData = {
        eventId: event._id,
        guestName: formData.guestName,
        phone: formData.phone,
        numberOfGuests: parseInt(formData.numberOfGuests),
        additionalGuests: formData.additionalGuests.filter(name => name && name.trim() !== '')
      };
      
      await axios.post(`${baseurl}/guestlist`, guestData);
      toast.success('Added to guest list successfully!');
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to add to guest list');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="relative rounded-2xl bg-gradient-to-br from-purple-900/40 via-indigo-900/40 to-purple-800/40 backdrop-blur-sm border border-purple-500/20 max-w-md w-full overflow-hidden max-h-[90vh] overflow-y-auto">
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
              One phone number can register up to 10 guests
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">
                Primary Guest Name *
              </label>
              <input
                type="text"
                name="guestName"
                value={formData.guestName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2.5 rounded-xl bg-gray-900/50 border border-purple-500/20 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-transparent text-sm"
                placeholder="Enter primary guest name"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">
                Total Number of Guests (Max 10) *
              </label>
              <select
                name="numberOfGuests"
                value={formData.numberOfGuests}
                onChange={handleChange}
                className="w-full px-3 py-2.5 rounded-xl bg-gray-900/50 border border-purple-500/20 text-white focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-transparent text-sm"
              >
                {[1,2,3,4,5,6,7,8,9,10].map(num => (
                  <option key={num} value={num} className="bg-gray-900">
                    {num} {num === 1 ? 'Guest' : 'Guests'}
                  </option>
                ))}
              </select>
            </div>

            {formData.numberOfGuests > 1 && (
              <div className="space-y-3 mt-4 p-4 rounded-xl bg-purple-900/20 border border-purple-500/30">
                <div className="flex items-center space-x-2">
                  <UserIcon className="h-4 w-4 text-purple-400" />
                  <label className="text-sm font-medium text-purple-300">
                    Additional Guest Names
                  </label>
                </div>
                {Array.from({ length: formData.numberOfGuests - 1 }).map((_, index) => (
                  <div key={index}>
                    <input
                      type="text"
                      value={formData.additionalGuests[index] || ''}
                      onChange={(e) => handleGuestNameChange(index, e.target.value)}
                      placeholder={`Guest ${index + 2} name`}
                      className="w-full px-3 py-2 rounded-xl bg-gray-900/50 border border-purple-500/20 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-transparent text-sm"
                    />
                  </div>
                ))}
              </div>
            )}

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