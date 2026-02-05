import React, { useState } from 'react';
import { XMarkIcon, TicketIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import toast from 'react-hot-toast';

const ReservationModal = ({ event, onClose }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    numberOfTickets: 1
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const reservationData = {
        ...formData,
        eventId: event._id
      };

      await axios.post('http://localhost:5000/api/reservations', reservationData);

      const whatsappMessage = `New Reservation for ${event.title}%0A%0A` +
        `Name: ${formData.fullName}%0A` +
        `Phone: ${formData.phone}%0A` +
        `Tickets: ${formData.numberOfTickets}`;

      window.open(`https://wa.me/+971501234567?text=${whatsappMessage}`, '_blank');

      toast.success('Reservation submitted successfully!');
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to submit reservation');
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

  const maxTickets = event.capacity - event.bookedSeats;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="relative rounded-2xl bg-gradient-to-br from-purple-900/40 via-indigo-900/40 to-purple-800/40 backdrop-blur-sm border border-purple-500/20 max-w-sm w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-pink-600/10 to-purple-600/10" />
        
        <div className="relative p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-xl bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30">
                <TicketIcon className="h-5 w-5 text-purple-300" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  Reserve Tickets
                </h2>
                <p className="text-xs text-gray-400">{event.title}</p>
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-400">Available</p>
                <p className="text-sm font-semibold text-white">{maxTickets} seats</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Price</p>
                <p className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">AED {event.price}</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
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

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">
                Number of Tickets *
              </label>
              <select
                name="numberOfTickets"
                value={formData.numberOfTickets}
                onChange={handleChange}
                required
                className="w-full px-3 py-2.5 rounded-xl bg-gray-900/50 border border-purple-500/20 text-white focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-transparent text-sm appearance-none"
              >
                {Array.from({ length: Math.min(maxTickets, 10) }, (_, i) => (
                  <option key={i + 1} value={i + 1} className="bg-gray-900">
                    {i + 1} Ticket{i + 1 > 1 ? 's' : ''}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-400">
                Max {maxTickets} tickets
              </p>
            </div>

            <div className="p-3 rounded-xl bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-500/30">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-400">Total</p>
                  <p className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                    AED {event.price * formData.numberOfTickets}
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="py-2 px-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-200 disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Confirm'}
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 px-4 border border-purple-500/30 text-gray-300 text-sm font-semibold rounded-xl hover:bg-white/5 transition-all duration-200 mt-2"
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReservationModal;