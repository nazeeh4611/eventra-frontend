import React, { useState } from 'react';
import { XMarkIcon, TicketIcon } from '@heroicons/react/24/outline';
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const reservationData = {
        ...formData,
        eventId: event._id,
        hosterId: event.hosterId?._id || event.hosterId
      };

      // Create reservation in database
      const response = await axios.post(`${baseurl}/reservations`, reservationData);
      
      // Get hoster WhatsApp number - check multiple possible locations
      const hosterWhatsapp = 
        event.contactWhatsapp || 
        event.hosterId?.whatsappNumber || 
        event.hosterWhatsapp ||
        '';

      // Get the reservation from response
      const reservation = response.data.reservation || response.data;

      // Format date and time properly
      const eventDate = event.date ? new Date(event.date).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }) : 'N/A';

      // Send WhatsApp message to hoster if number exists
      if (hosterWhatsapp) {
        // Clean the WhatsApp number (remove spaces, +, etc)
        let cleanWhatsapp = hosterWhatsapp.replace(/[\s+]/g, '');
        if (!cleanWhatsapp.startsWith('+')) {
          cleanWhatsapp = '+' + cleanWhatsapp;
        }

        // Comprehensive WhatsApp message with all details
        const whatsappMessage = `🎟️ *NEW RESERVATION RECEIVED* 🎟️%0A%0A` +
          `━━━━━━━━━━━━━━━━━━━━%0A` +
          `*EVENT DETAILS*%0A` +
          `━━━━━━━━━━━━━━━━━━━━%0A` +
          `📌 *Title:* ${event.title || 'N/A'}%0A` +
          `📅 *Date:* ${eventDate}%0A` +
          `⏰ *Time:* ${event.time || 'N/A'}%0A` +
          `📍 *Location:* ${event.location || 'N/A'}%0A` +
          `💰 *Price per Ticket:* AED ${event.price || 0}%0A` +
          `━━━━━━━━━━━━━━━━━━━━%0A%0A` +
          `*CUSTOMER DETAILS*%0A` +
          `━━━━━━━━━━━━━━━━━━━━%0A` +
          `👤 *Name:* ${formData.fullName}%0A` +
          `📞 *Phone:* ${formData.phone}%0A` +
          `🎫 *Tickets:* ${formData.numberOfTickets}%0A` +
          `💵 *Total Amount:* AED ${event.price * formData.numberOfTickets}%0A` +
          `━━━━━━━━━━━━━━━━━━━━%0A%0A` +
          `*RESERVATION INFO*%0A` +
          `━━━━━━━━━━━━━━━━━━━━%0A` +
          `🆔 *Reservation ID:* ${reservation?._id || 'N/A'}%0A` +
          `📊 *Status:* ${reservation?.status || 'Pending Confirmation'}%0A` +
          `⏱️ *Booked on:* ${reservation?.createdAt ? new Date(reservation.createdAt).toLocaleString() : new Date().toLocaleString()}%0A` +
          `━━━━━━━━━━━━━━━━━━━━%0A%0A` +
          `*ADDITIONAL INFORMATION*%0A` +
          `━━━━━━━━━━━━━━━━━━━━%0A` +
          `📝 *Event Description:* ${event.description?.substring(0, 100) || 'N/A'}${event.description?.length > 100 ? '...' : ''}%0A` +
          `👥 *Hosted by:* ${event.hosterId?.name || event.hosterName || 'N/A'}%0A` +
          `📧 *Customer Email:* ${formData.email || 'Not provided'}%0A` +
          `━━━━━━━━━━━━━━━━━━━━%0A%0A` +
          `*ACTION REQUIRED*%0A` +
          `━━━━━━━━━━━━━━━━━━━━%0A` +
          `✅ Please confirm this reservation by replying to this message or contacting the customer directly.%0A` +
          `📱 Customer WhatsApp: ${formData.phone}%0A` +
          `━━━━━━━━━━━━━━━━━━━━%0A%0A` +
          `_This is an automated message from EventFlow_ 🌟`;

        // Open WhatsApp with pre-filled message
        window.open(`https://wa.me/${cleanWhatsapp}?text=${whatsappMessage}`, '_blank');
      } else {
        // Fallback to admin number if hoster WhatsApp not found
        console.warn('Hoster WhatsApp number not found, sending to admin');
        
        const adminMessage = `🎟️ *NEW RESERVATION - NO HOSTER WHATSAPP* 🎟️%0A%0A` +
          `━━━━━━━━━━━━━━━━━━━━%0A` +
          `*EVENT: ${event.title || 'N/A'}*%0A` +
          `━━━━━━━━━━━━━━━━━━━━%0A%0A` +
          `*Customer:* ${formData.fullName}%0A` +
          `*Phone:* ${formData.phone}%0A` +
          `*Tickets:* ${formData.numberOfTickets}%0A` +
          `*Total:* AED ${event.price * formData.numberOfTickets}%0A` +
          `*Event Host:* ${event.hosterId?.name || event.hosterName || 'N/A'}%0A` +
          `*Reservation ID:* ${reservation?._id || 'N/A'}%0A%0A` +
          `⚠️ *ACTION NEEDED:* Please contact the event host and provide these details.`;

        window.open(`https://wa.me/+971504316900?text=${adminMessage}`, '_blank');
      }

      // Send confirmation message to customer
      const customerMessage = `🎟️ *Reservation Confirmation - EventFlow* 🎟️%0A%0A` +
        `━━━━━━━━━━━━━━━━━━━━%0A` +
        `Hello ${formData.fullName}! 👋%0A` +
        `━━━━━━━━━━━━━━━━━━━━%0A%0A` +
        `Your reservation has been received and is pending confirmation.%0A%0A` +
        `*EVENT DETAILS*%0A` +
        `━━━━━━━━━━━━━━━━━━━━%0A` +
        `📌 ${event.title || 'N/A'}%0A` +
        `📅 ${eventDate}%0A` +
        `⏰ ${event.time || 'N/A'}%0A` +
        `📍 ${event.location || 'N/A'}%0A` +
        `━━━━━━━━━━━━━━━━━━━━%0A%0A` +
        `*YOUR BOOKING*%0A` +
        `━━━━━━━━━━━━━━━━━━━━%0A` +
        `🎫 Tickets: ${formData.numberOfTickets}%0A` +
        `💰 Total: AED ${event.price * formData.numberOfTickets}%0A` +
        `🆔 Booking ID: ${reservation?._id?.slice(-6) || 'N/A'}%0A` +
        `━━━━━━━━━━━━━━━━━━━━%0A%0A` +
        `You will receive a confirmation message once the host approves your reservation.%0A%0A` +
        `Thank you for choosing EventFlow! ✨`;

      // Send message to customer
      if (formData.phone) {
        let customerPhone = formData.phone.replace(/[\s+]/g, '');
        if (!customerPhone.startsWith('+')) {
          customerPhone = '+' + customerPhone;
        }
        window.open(`https://wa.me/${customerPhone}?text=${customerMessage}`, '_blank');
      }

      toast.success('Reservation submitted successfully!');
      onClose();
    } catch (error) {
      console.error('Reservation error:', error);
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

  const maxTickets = (event.capacity || 0) - (event.bookedSeats || 0);
  const totalAmount = (event.price || 0) * (formData.numberOfTickets || 1);

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
                <p className="text-xs text-gray-400 line-clamp-1">{event.title}</p>
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
                <p className="text-sm font-semibold text-white">
                  {maxTickets > 0 ? maxTickets : 0} seats
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Price</p>
                <p className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  AED {event.price || 0}
                </p>
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
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email || ''}
                onChange={handleChange}
                className="w-full px-3 py-2.5 rounded-xl bg-gray-900/50 border border-purple-500/20 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-transparent text-sm"
                placeholder="your@email.com (optional)"
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
                {Array.from({ length: Math.min(maxTickets || 10, 10) }, (_, i) => (
                  <option key={i + 1} value={i + 1} className="bg-gray-900">
                    {i + 1} Ticket{i + 1 > 1 ? 's' : ''}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-400">
                Max {maxTickets || 10} tickets
              </p>
            </div>

            <div className="p-3 rounded-xl bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-500/30">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-400">Total</p>
                  <p className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                    AED {totalAmount}
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={loading || maxTickets <= 0}
                  className="py-2 px-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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