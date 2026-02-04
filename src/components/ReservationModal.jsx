import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import toast from 'react-hot-toast';

const ReservationModal = ({ event, onClose }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    numberOfTickets: 1,
    specialRequirements: ''
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
        `Email: ${formData.email}%0A` +
        `Phone: ${formData.phone}%0A` +
        `Tickets: ${formData.numberOfTickets}%0A` +
        `Special Requirements: ${formData.specialRequirements || 'None'}`;

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
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Reserve Tickets for {event.title}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <XMarkIcon className="h-6 w-6 text-gray-500" />
            </button>
          </div>

          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700">Available Seats:</span>
              <span className="font-semibold text-dubai-blue">{maxTickets}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Price per ticket:</span>
              <span className="font-bold text-lg text-dubai-gold">AED {event.price}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dubai-blue focus:border-transparent"
                placeholder="Enter your full name"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dubai-blue focus:border-transparent"
                  placeholder="email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dubai-blue focus:border-transparent"
                  placeholder="+971 50 123 4567"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Tickets *
              </label>
              <select
                name="numberOfTickets"
                value={formData.numberOfTickets}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dubai-blue focus:border-transparent"
              >
                {Array.from({ length: Math.min(maxTickets, 10) }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1} Ticket{i + 1 > 1 ? 's' : ''}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-sm text-gray-500">
                Maximum {maxTickets} tickets available
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Special Requirements
              </label>
              <textarea
                name="specialRequirements"
                value={formData.specialRequirements}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dubai-blue focus:border-transparent"
                placeholder="Any special requirements or comments..."
              />
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between mb-2">
                <span className="text-gray-700">Subtotal:</span>
                <span className="font-semibold">
                  AED {event.price * formData.numberOfTickets}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total Amount:</span>
                <span className="text-dubai-gold">
                  AED {event.price * formData.numberOfTickets}
                </span>
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition duration-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 btn-primary disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Confirm Reservation'}
              </button>
            </div>

            <p className="text-xs text-gray-500 text-center mt-4">
              By confirming, you agree to our terms and conditions. 
              You'll be redirected to WhatsApp for final confirmation.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReservationModal;