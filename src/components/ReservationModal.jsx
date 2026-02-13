// components/ReservationModal.jsx
import React, { useState, useEffect } from 'react';
import { XMarkIcon, TicketIcon, UserIcon, PhoneIcon, CalendarIcon, MapPinIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import toast from 'react-hot-toast';
import baseurl from '../Base/base';

const ReservationModal = ({ event, onClose }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    numberOfTickets: 1
  });
  const [loading, setLoading] = useState(false);

  // Prevent body scroll when modal is open
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';
    
    return () => {
      document.body.style.overflow = originalStyle;
      document.body.style.touchAction = '';
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const reservationData = {
        ...formData,
        eventId: event._id,
        hosterId: event.hosterId?._id || event.hosterId
      };

      await axios.post(`${baseurl}/reservations`, reservationData);
      
      // Send WhatsApp notification to hoster
      const hosterWhatsapp = event.contactWhatsapp || event.hosterId?.whatsappNumber || event.hosterWhatsapp;
      if (hosterWhatsapp) {
        const cleanWhatsapp = hosterWhatsapp.replace(/[\s+]/g, '');
        window.open(`https://wa.me/${cleanWhatsapp.startsWith('+') ? cleanWhatsapp : '+' + cleanWhatsapp}`, '_blank');
      }

      toast.success('Booking confirmed!');
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Booking failed');
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

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const availableSeats = (event.capacity || 0) - (event.bookedSeats || 0);
  const totalAmount = (event.price || 0) * (formData.numberOfTickets || 1);
  const eventDate = event.date ? new Date(event.date) : new Date();

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(4px)',
      }}
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-sm bg-gradient-to-b from-[#1a1a24] to-[#0d0d12] rounded-2xl border border-purple-500/30 shadow-2xl shadow-purple-500/20 overflow-hidden">
        
        {/* Header - Compact */}
        <div className="relative px-4 pt-4 pb-2 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-purple-600/30 to-pink-600/30 border border-purple-500/40">
                <TicketIcon className="h-4 w-4 text-purple-300" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  Reserve Tickets
                </h3>
                <p className="text-[0.65rem] text-gray-400 line-clamp-1 max-w-[180px]">
                  {event?.title || 'Event'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-white/10 rounded-lg transition-all"
            >
              <XMarkIcon className="h-4 w-4 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Event Quick Info - Mini */}
        <div className="px-4 py-2 bg-white/5 border-b border-white/5">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-3 w-3 text-purple-400" />
              <span className="text-gray-300">
                {eventDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPinIcon className="h-3 w-3 text-pink-400" />
              <span className="text-gray-300 truncate max-w-[120px]">
                {event.venue || 'Dubai'}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className={`inline-flex h-2 w-2 rounded-full ${availableSeats > 0 ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
              <span className="text-gray-400 text-[0.6rem]">
                {availableSeats} left
              </span>
            </div>
          </div>
        </div>

        {/* Form - Compact */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          
          {/* Full Name */}
          <div>
            <label className="flex items-center gap-1 text-[0.65rem] font-medium text-gray-300 mb-1">
              <UserIcon className="h-3 w-3 text-purple-400" />
              Full Name <span className="text-purple-400">*</span>
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 text-sm bg-black/40 border border-purple-500/30 rounded-lg 
                       text-white placeholder-gray-600 focus:border-purple-400 focus:ring-1 
                       focus:ring-purple-400/50 outline-none transition-all"
              placeholder="John Doe"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="flex items-center gap-1 text-[0.65rem] font-medium text-gray-300 mb-1">
              <PhoneIcon className="h-3 w-3 text-purple-400" />
              Phone <span className="text-purple-400">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 text-sm bg-black/40 border border-purple-500/30 rounded-lg 
                       text-white placeholder-gray-600 focus:border-purple-400 focus:ring-1 
                       focus:ring-purple-400/50 outline-none transition-all"
              placeholder="+971 50 123 4567"
            />
          </div>

          {/* Tickets & Price Row */}
          <div className="flex items-center gap-3">
            {/* Tickets Select */}
            <div className="flex-1">
              <label className="block text-[0.65rem] font-medium text-gray-300 mb-1">
                Tickets
              </label>
              <select
                name="numberOfTickets"
                value={formData.numberOfTickets}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm bg-black/40 border border-purple-500/30 rounded-lg 
                         text-white focus:border-purple-400 focus:ring-1 focus:ring-purple-400/50 
                         outline-none transition-all cursor-pointer"
              >
                {[1,2,3,4,5,6,7,8,9,10].map(num => (
                  <option key={num} value={num} className="bg-gray-900">
                    {num} {num === 1 ? 'ticket' : 'tickets'}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Display */}
            <div className="flex-1">
              <label className="block text-[0.65rem] font-medium text-gray-300 mb-1">
                Total
              </label>
              <div className="px-3 py-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg border border-purple-500/30">
                <p className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  AED {totalAmount}
                </p>
              </div>
            </div>
          </div>

          {/* Price per ticket hint */}
          {event.price > 0 && (
            <p className="text-[0.6rem] text-gray-500 flex items-center gap-1">
              <span className="inline-block w-1 h-1 rounded-full bg-purple-500"></span>
              AED {event.price} per ticket
            </p>
          )}

          {/* Action Buttons - Side by side */}
          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-3 text-xs font-medium text-gray-300 
                       bg-white/5 border border-white/10 rounded-lg
                       hover:bg-white/10 transition-all active:scale-95"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || availableSeats <= 0}
              className="flex-1 py-2.5 px-3 text-xs font-bold text-white
                       bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg
                       hover:shadow-lg hover:shadow-purple-500/30 
                       transition-all active:scale-95 disabled:opacity-50
                       border border-white/20"
            >
              {loading ? '...' : availableSeats <= 0 ? 'Sold Out' : 'Book Now'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReservationModal;