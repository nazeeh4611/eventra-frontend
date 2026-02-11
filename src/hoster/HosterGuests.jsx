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
  ClipboardDocumentCheckIcon,
  PencilIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';
import toast from 'react-hot-toast';
import baseurl from '../Base/base';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const HosterGuests = () => {
  const [guests, setGuests] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [eventFilter, setEventFilter] = useState('all');
  const [rsvpFilter, setRsvpFilter] = useState('all');
  const [checkedInFilter, setCheckedInFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [newGuest, setNewGuest] = useState({
    guestName: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    plusOnes: 0,
    eventId: '',
    rsvpStatus: 'pending'
  });

  useEffect(() => {
    fetchGuests();
    fetchEvents();
  }, [currentPage, eventFilter, rsvpFilter, checkedInFilter]);

  const fetchGuests = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('hosterToken');
      const params = new URLSearchParams({
        page: currentPage,
        limit: 15,
        ...(eventFilter !== 'all' && { eventId: eventFilter }),
        ...(rsvpFilter !== 'all' && { rsvpStatus: rsvpFilter }),
        ...(checkedInFilter !== 'all' && { checkedIn: checkedInFilter === 'true' })
      }).toString();

      const response = await axios.get(`${baseurl}/hoster/guests?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setGuests(response.data.guests);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      toast.error('Failed to fetch guests');
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem('hosterToken');
      const response = await axios.get(`${baseurl}/hoster/events?limit=100`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEvents(response.data.events);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleAddGuest = async () => {
    try {
      const token = localStorage.getItem('hosterToken');
      await axios.post(`${baseurl}/hoster/guests`, newGuest, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Guest added successfully');
      setShowAddModal(false);
      setNewGuest({
        guestName: '',
        email: '',
        phone: '',
        company: '',
        position: '',
        plusOnes: 0,
        eventId: '',
        rsvpStatus: 'pending'
      });
      fetchGuests();
    } catch (error) {
      toast.error('Failed to add guest');
    }
  };

  const handleUpdateGuest = async () => {
    try {
      const token = localStorage.getItem('hosterToken');
      await axios.put(`${baseurl}/hoster/guests/${selectedGuest._id}`, selectedGuest, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Guest updated successfully');
      setShowEditModal(false);
      fetchGuests();
    } catch (error) {
      toast.error('Failed to update guest');
    }
  };

  const handleCheckIn = async (guestId) => {
    try {
      const token = localStorage.getItem('hosterToken');
      await axios.put(`${baseurl}/hoster/guests/${guestId}/checkin`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Guest checked in successfully');
      fetchGuests();
    } catch (error) {
      toast.error('Failed to check in guest');
    }
  };

  const handleDeleteGuest = async (guestId) => {
    if (!window.confirm('Are you sure you want to delete this guest?')) return;

    try {
      const token = localStorage.getItem('hosterToken');
      await axios.delete(`${baseurl}/hoster/guests/${guestId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Guest deleted successfully');
      fetchGuests();
    } catch (error) {
      toast.error('Failed to delete guest');
    }
  };

  const exportToExcel = () => {
    const data = guests.map(guest => ({
      'Guest Name': guest.guestName,
      'Email': guest.email,
      'Phone': guest.phone,
      'Company': guest.company || '',
      'Position': guest.position || '',
      'Event': guest.eventId?.title || '',
      'RSVP Status': guest.rsvpStatus,
      'Checked In': guest.checkedIn ? 'Yes' : 'No',
      'Plus Ones': guest.plusOnes,
      'Date Added': new Date(guest.createdAt).toLocaleDateString()
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Guests');
    
    const eventTitle = eventFilter !== 'all' 
      ? events.find(e => e._id === eventFilter)?.title 
      : 'All_Events';
    
    const fileName = `Guests_${eventTitle}_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
    toast.success('Exported to Excel successfully');
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    const eventTitle = eventFilter !== 'all' 
      ? events.find(e => e._id === eventFilter)?.title 
      : 'All Events';
    
    doc.setFontSize(18);
    doc.text(`Guest List - ${eventTitle}`, 14, 22);
    doc.setFontSize(11);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
    
    const tableColumn = ['Name', 'Email', 'Phone', 'RSVP', 'Checked In', 'Plus Ones'];
    const tableRows = guests.map(guest => [
      guest.guestName,
      guest.email,
      guest.phone,
      guest.rsvpStatus,
      guest.checkedIn ? 'Yes' : 'No',
      guest.plusOnes
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      theme: 'grid',
      styles: { fontSize: 9 },
      headStyles: { fillColor: [34, 197, 94] }
    });

    const fileName = `Guests_${eventTitle.replace(/ /g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
    toast.success('Exported to PDF successfully');
  };

  const filteredGuests = guests.filter(guest =>
    guest.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guest.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guest.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Guest List Management</h1>
            <p className="text-gray-600">Manage your event guests</p>
          </div>
          <div className="flex space-x-3 mt-4 md:mt-0">
            <button
              onClick={exportToPDF}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center"
            >
              <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
              PDF
            </button>
            <button
              onClick={exportToExcel}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
            >
              <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
              Excel
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
            >
              <UserPlusIcon className="h-5 w-5 mr-2" />
              Add Guest
            </button>
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
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <select
                value={eventFilter}
                onChange={(e) => setEventFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Events</option>
                {events.map(event => (
                  <option key={event._id} value={event._id}>{event.title}</option>
                ))}
              </select>
            </div>
            <div>
              <select
                value={rsvpFilter}
                onChange={(e) => setRsvpFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All RSVP</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="declined">Declined</option>
              </select>
            </div>
            <div>
              <select
                value={checkedInFilter}
                onChange={(e) => setCheckedInFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Guest</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredGuests.map((guest) => (
                  <tr key={guest._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{guest.guestName}</div>
                        <div className="text-sm text-gray-500">{guest.company}</div>
                        <div className="text-sm text-gray-500">{guest.position}</div>
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
                      <div className="text-sm text-gray-900">{guest.eventId?.title}</div>
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
                          {guest.rsvpStatus}
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
                            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg"
                            title="Check In"
                          >
                            <ClipboardDocumentCheckIcon className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setSelectedGuest(guest);
                            setShowEditModal(true);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="Edit"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteGuest(guest._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          title="Delete"
                        >
                          <TrashIcon className="h-4 w-4" />
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
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50"
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
          <p className="text-gray-600">
            {searchTerm ? 'Try adjusting your search terms' : 'No guests added yet'}
          </p>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Add Guest</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Guest Name *
                  </label>
                  <input
                    type="text"
                    value={newGuest.guestName}
                    onChange={(e) => setNewGuest(prev => ({ ...prev, guestName: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={newGuest.email}
                      onChange={(e) => setNewGuest(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      value={newGuest.phone}
                      onChange={(e) => setNewGuest(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event *
                  </label>
                  <select
                    value={newGuest.eventId}
                    onChange={(e) => setNewGuest(prev => ({ ...prev, eventId: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Event</option>
                    {events.map(event => (
                      <option key={event._id} value={event._id}>{event.title}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    RSVP Status
                  </label>
                  <select
                    value={newGuest.rsvpStatus}
                    onChange={(e) => setNewGuest(prev => ({ ...prev, rsvpStatus: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="declined">Declined</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddGuest}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Guest
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showEditModal && selectedGuest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Edit Guest</h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Guest Name
                  </label>
                  <input
                    type="text"
                    value={selectedGuest.guestName}
                    onChange={(e) => setSelectedGuest(prev => ({ ...prev, guestName: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={selectedGuest.email}
                    onChange={(e) => setSelectedGuest(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    RSVP Status
                  </label>
                  <select
                    value={selectedGuest.rsvpStatus}
                    onChange={(e) => setSelectedGuest(prev => ({ ...prev, rsvpStatus: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="declined">Declined</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateGuest}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HosterGuests;