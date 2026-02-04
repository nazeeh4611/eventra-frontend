import React, { useState, useEffect } from 'react';
import { 
  UserPlusIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  EnvelopeIcon,
  PhoneIcon,
  BuildingOfficeIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  QrCodeIcon,
  ClipboardDocumentCheckIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';
import toast from 'react-hot-toast';

const AdminGuestList = () => {
  const [guests, setGuests] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [eventFilter, setEventFilter] = useState('');
  const [rsvpFilter, setRsvpFilter] = useState('all');
  const [checkedInFilter, setCheckedInFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({ total: 0, confirmed: 0, checkedIn: 0 });

  useEffect(() => {
    fetchEvents();
    fetchGuests();
  }, [currentPage, eventFilter, rsvpFilter, checkedInFilter]);

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${baseurl}/events?limit=100`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEvents(response.data.events);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const fetchGuests = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const params = new URLSearchParams({
        page: currentPage,
        limit: 15,
        ...(eventFilter && { eventId: eventFilter }),
        ...(rsvpFilter !== 'all' && { rsvpStatus: rsvpFilter }),
        ...(checkedInFilter !== 'all' && { checkedIn: checkedInFilter === 'true' })
      }).toString();

      const response = await axios.get(`${baseurl}/guestlist?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setGuests(response.data.guests);
      setStats(response.data.stats || { total: 0, confirmed: 0, checkedIn: 0 });
      setTotalPages(response.data.totalPages);
    } catch (error) {
      toast.error('Failed to fetch guest list');
      console.error('Error fetching guests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async (guestId) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(`${baseurl}/guestlist/${guestId}/checkin`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Guest checked in successfully');
      fetchGuests();
    } catch (error) {
      toast.error('Failed to check in guest');
    }
  };

  const handleUpdateRsvp = async (guestId, rsvpStatus) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(`${baseurl}/guestlist/${guestId}`, 
        { rsvpStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(`RSVP status updated to ${rsvpStatus}`);
      fetchGuests();
    } catch (error) {
      toast.error('Failed to update RSVP status');
    }
  };

  const handleSendInvitation = async (guestId) => {
    try {
      const guest = guests.find(g => g._id === guestId);
      const invitationLink = `https://eventra-dubai.com/invitation/${guestId}`;
      
      const emailBody = `
Dear ${guest.guestName},

You're invited to attend: ${guest.eventId?.title}
Date: ${new Date(guest.eventId?.date).toLocaleDateString()}
Venue: ${guest.eventId?.venue}

Please RSVP using this link: ${invitationLink}

Best regards,
Eventra Dubai Team
      `;

      // In production, integrate with email service like SendGrid
      console.log('Email to send:', {
        to: guest.email,
        subject: `Invitation: ${guest.eventId?.title}`,
        body: emailBody
      });

      toast.success('Invitation email prepared');
    } catch (error) {
      toast.error('Failed to prepare invitation');
    }
  };

  const filteredGuests = guests.filter(guest =>
    guest.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guest.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guest.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guest.position?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Guest List Management</h1>
            <p className="text-gray-600">Manage event guests and check-ins</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Guests</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <UserPlusIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Confirmed RSVPs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.confirmed}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Checked In</p>
                <p className="text-2xl font-bold text-gray-900">{stats.checkedIn}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <ClipboardDocumentCheckIcon className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search guests..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dubai-blue focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <select
                value={eventFilter}
                onChange={(e) => setEventFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dubai-blue focus:border-transparent"
              >
                <option value="">All Events</option>
                {events.map(event => (
                  <option key={event._id} value={event._id}>
                    {event.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <select
                value={rsvpFilter}
                onChange={(e) => setRsvpFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dubai-blue focus:border-transparent"
              >
                <option value="all">All RSVP Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="declined">Declined</option>
              </select>
            </div>
            <div>
              <select
                value={checkedInFilter}
                onChange={(e) => setCheckedInFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dubai-blue focus:border-transparent"
              >
                <option value="all">Check-in Status</option>
                <option value="true">Checked In</option>
                <option value="false">Not Checked In</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((n) => (
            <div key={n} className="bg-white rounded-xl shadow p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : filteredGuests.length > 0 ? (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Guest
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Event
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredGuests.map((guest) => (
                  <tr key={guest._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {guest.guestName}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <BuildingOfficeIcon className="h-4 w-4 mr-1" />
                          {guest.company || 'No company'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {guest.position || 'No position'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-900">
                          <EnvelopeIcon className="h-4 w-4 mr-2 text-gray-400" />
                          {guest.email}
                        </div>
                        <div className="flex items-center text-sm text-gray-900">
                          <PhoneIcon className="h-4 w-4 mr-2 text-gray-400" />
                          {guest.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {guest.eventId?.title || 'Event not found'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {guest.plusOnes > 0 ? `+${guest.plusOnes} guests` : 'No plus ones'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          guest.rsvpStatus === 'confirmed' ? 'bg-green-100 text-green-800' :
                          guest.rsvpStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {guest.rsvpStatus.charAt(0).toUpperCase() + guest.rsvpStatus.slice(1)}
                        </span>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          guest.checkedIn ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {guest.checkedIn ? 'Checked In' : 'Not Checked In'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        {!guest.checkedIn && guest.rsvpStatus === 'confirmed' && (
                          <button
                            onClick={() => handleCheckIn(guest._id)}
                            className="px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm flex items-center"
                          >
                            <ClipboardDocumentCheckIcon className="h-4 w-4 mr-1" />
                            Check In
                          </button>
                        )}
                        
                        {guest.rsvpStatus === 'pending' && (
                          <>
                            <button
                              onClick={() => handleUpdateRsvp(guest._id, 'confirmed')}
                              className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm flex items-center"
                            >
                              <CheckCircleIcon className="h-4 w-4 mr-1" />
                              Confirm
                            </button>
                            <button
                              onClick={() => handleUpdateRsvp(guest._id, 'declined')}
                              className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm flex items-center"
                            >
                              <XCircleIcon className="h-4 w-4 mr-1" />
                              Decline
                            </button>
                          </>
                        )}
                        
                        <button
                          onClick={() => handleSendInvitation(guest._id)}
                          className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm flex items-center"
                        >
                          <EnvelopeIcon className="h-4 w-4 mr-1" />
                          Invite
                        </button>
                        
                        <button
                          className="p-2 text-gray-400 hover:text-gray-600"
                          title="Generate QR Code"
                        >
                          <QrCodeIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-white px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">{(currentPage - 1) * 15 + 1}</span> to{' '}
                <span className="font-medium">{Math.min(currentPage * 15, filteredGuests.length)}</span> of{' '}
                <span className="font-medium">{filteredGuests.length}</span> guests
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-2 rounded-lg text-sm ${
                        currentPage === pageNum
                          ? 'bg-dubai-blue text-white'
                          : 'border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6">
            <UserPlusIcon className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No guests found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm ? 'Try adjusting your search terms' : 'No guests have been added yet'}
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminGuestList;