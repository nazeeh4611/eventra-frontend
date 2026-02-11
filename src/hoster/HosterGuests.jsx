import React, { useState, useEffect } from 'react';
import { 
  UserPlusIcon,
  PhoneIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  DocumentArrowDownIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';
import toast from 'react-hot-toast';
import baseurl from '../Base/base';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const HosterGuests = () => {
  const [guests, setGuests] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [eventFilter, setEventFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [newGuest, setNewGuest] = useState({
    guestName: '',
    phone: '',
    eventId: '',
    numberOfGuests: 1,
    additionalGuests: []
  });

  useEffect(() => {
    fetchGuests();
    fetchEvents();
  }, [currentPage, eventFilter]);

  const fetchGuests = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('hosterToken');
      const params = new URLSearchParams({
        page: currentPage,
        limit: 15,
        ...(eventFilter !== 'all' && { eventId: eventFilter })
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
        phone: '',
        eventId: '',
        numberOfGuests: 1,
        additionalGuests: []
      });
      fetchGuests();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to add guest');
    }
  };

  const handleUpdateGuest = async () => {
    try {
      const token = localStorage.getItem('hosterToken');
      await axios.put(`${baseurl}/hoster/guests/${selectedGuest._id}`, {
        guestName: selectedGuest.guestName,
        phone: selectedGuest.phone,
        additionalGuests: selectedGuest.additionalGuests,
        numberOfGuests: selectedGuest.numberOfGuests
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Guest updated successfully');
      setShowEditModal(false);
      fetchGuests();
    } catch (error) {
      toast.error('Failed to update guest');
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
      'Primary Guest': guest.guestName,
      'Phone Number': guest.phone,
      'Event Name': guest.eventId?.title || '',
      'Event Date': guest.eventId?.date ? new Date(guest.eventId.date).toLocaleDateString() : '',
      'Total Guests': guest.numberOfGuests,
      'Additional Guests': guest.additionalGuests?.length > 0 
        ? guest.additionalGuests.join(', ') 
        : 'None',
      'Added On': guest.addedAt ? new Date(guest.addedAt).toLocaleDateString() : ''
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);
    
    const wscols = [
      { wch: 25 },
      { wch: 20 },
      { wch: 35 },
      { wch: 15 },
      { wch: 12 },
      { wch: 40 },
      { wch: 15 }
    ];
    ws['!cols'] = wscols;

    XLSX.utils.book_append_sheet(wb, ws, 'Guest List');
    
    const eventTitle = eventFilter !== 'all' 
      ? events.find(e => e._id === eventFilter)?.title?.replace(/[^a-z0-9]/gi, '_') 
      : 'All_Events';
    
    const fileName = `Guest_List_${eventTitle}_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
    toast.success('Exported to Excel successfully');
  };

  const exportToPDF = () => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    const eventTitle = eventFilter !== 'all' 
      ? events.find(e => e._id === eventFilter)?.title 
      : 'All Events';
    
    doc.setFontSize(20);
    doc.setTextColor(44, 62, 80);
    doc.text(`Guest List - ${eventTitle}`, 14, 15);
    
    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 25);
    doc.text(`Total Guests: ${guests.length}`, 14, 32);
    
    const tableColumn = [
      'Primary Guest',
      'Phone',
      'Event',
      'Event Date',
      'Total',
      'Additional Guests'
    ];
    
    const tableRows = guests.map(guest => [
      guest.guestName,
      guest.phone,
      guest.eventId?.title || '',
      guest.eventId?.date ? new Date(guest.eventId.date).toLocaleDateString() : '',
      guest.numberOfGuests.toString(),
      guest.additionalGuests?.length > 0 
        ? guest.additionalGuests.join(', ') 
        : 'None'
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      theme: 'grid',
      styles: {
        fontSize: 9,
        cellPadding: 3,
        lineColor: [200, 200, 200],
        lineWidth: 0.1
      },
      headStyles: {
        fillColor: [147, 51, 234],
        textColor: [255, 255, 255],
        fontSize: 10,
        fontStyle: 'bold',
        halign: 'center'
      },
      columnStyles: {
        0: { cellWidth: 35 },
        1: { cellWidth: 30 },
        2: { cellWidth: 50 },
        3: { cellWidth: 25 },
        4: { cellWidth: 15 },
        5: { cellWidth: 65 }
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      margin: { top: 40, left: 10, right: 10 },
      didDrawPage: function(data) {
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(
          `Page ${data.pageNumber}`,
          data.settings.margin.left,
          doc.internal.pageSize.height - 10
        );
      }
    });

    const fileName = `Guest_List_${eventTitle.replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
    toast.success('Exported to PDF successfully');
  };

  const filteredGuests = guests.filter(guest =>
    guest.guestName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guest.phone?.includes(searchTerm) ||
    guest.eventId?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Guest List Management</h1>
            <p className="text-gray-600">View and manage event guests</p>
          </div>
          <div className="flex space-x-3 mt-4 md:mt-0">
            <button
              onClick={exportToPDF}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center shadow-sm"
            >
              <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
              PDF
            </button>
            <button
              onClick={exportToExcel}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center shadow-sm"
            >
              <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
              Excel
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center shadow-sm"
            >
              <UserPlusIcon className="h-5 w-5 mr-2" />
              Add Guest
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, phone or event..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <select
                value={eventFilter}
                onChange={(e) => setEventFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Events</option>
                {events.map(event => (
                  <option key={event._id} value={event._id}>{event.title}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1,2,3,4,5].map((n) => (
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Primary Guest</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Additional Guests</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredGuests.map((guest) => (
                  <tr key={guest._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                          <UserGroupIcon className="h-5 w-5 text-purple-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {guest.guestName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <PhoneIcon className="h-4 w-4 mr-2 text-gray-400" />
                        {guest.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{guest.eventId?.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">
                        {guest.eventId?.date ? new Date(guest.eventId.date).toLocaleDateString() : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-purple-600">
                        {guest.numberOfGuests}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 max-w-xs truncate">
                        {guest.additionalGuests && guest.additionalGuests.length > 0 
                          ? guest.additionalGuests.join(', ')
                          : <span className="text-gray-400">No additional guests</span>
                        }
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedGuest({
                              ...guest,
                              additionalGuests: guest.additionalGuests || []
                            });
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
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 hover:bg-gray-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-purple-100 mb-6">
            <UserGroupIcon className="h-10 w-10 text-purple-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No guests found</h3>
          <p className="text-gray-600">
            {searchTerm ? 'Try adjusting your search terms' : 'No guests have been added to your events yet'}
          </p>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Add Guest Manually</h3>
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
                    Event *
                  </label>
                  <select
                    value={newGuest.eventId}
                    onChange={(e) => setNewGuest(prev => ({ ...prev, eventId: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    <option value="">Select Event</option>
                    {events.map(event => (
                      <option key={event._id} value={event._id}>{event.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={newGuest.phone}
                    onChange={(e) => setNewGuest(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="+971 50 123 4567"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Primary Guest Name *
                  </label>
                  <input
                    type="text"
                    value={newGuest.guestName}
                    onChange={(e) => setNewGuest(prev => ({ ...prev, guestName: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter primary guest name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Number of Guests (Max 10) *
                  </label>
                  <select
                    value={newGuest.numberOfGuests}
                    onChange={(e) => {
                      const num = parseInt(e.target.value);
                      setNewGuest(prev => ({
                        ...prev,
                        numberOfGuests: num,
                        additionalGuests: Array(num - 1).fill('')
                      }));
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    {[1,2,3,4,5,6,7,8,9,10].map(num => (
                      <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                    ))}
                  </select>
                </div>

                {newGuest.numberOfGuests > 1 && (
                  <div className="space-y-3 mt-4 p-4 bg-purple-50 rounded-lg">
                    <label className="block text-sm font-medium text-purple-700">
                      Additional Guest Names
                    </label>
                    {Array.from({ length: newGuest.numberOfGuests - 1 }).map((_, index) => (
                      <input
                        key={index}
                        type="text"
                        value={newGuest.additionalGuests[index] || ''}
                        onChange={(e) => {
                          const updated = [...newGuest.additionalGuests];
                          updated[index] = e.target.value;
                          setNewGuest(prev => ({ ...prev, additionalGuests: updated }));
                        }}
                        placeholder={`Guest ${index + 2} name`}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    ))}
                  </div>
                )}
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
                  disabled={!newGuest.eventId || !newGuest.phone || !newGuest.guestName}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
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
                    Primary Guest Name
                  </label>
                  <input
                    type="text"
                    value={selectedGuest.guestName || ''}
                    onChange={(e) => setSelectedGuest(prev => ({ ...prev, guestName: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={selectedGuest.phone || ''}
                    onChange={(e) => setSelectedGuest(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Number of Guests
                  </label>
                  <select
                    value={selectedGuest.numberOfGuests || 1}
                    onChange={(e) => {
                      const num = parseInt(e.target.value);
                      const currentAdditional = selectedGuest.additionalGuests || [];
                      const updatedAdditional = Array(num - 1).fill('').map((_, i) => 
                        i < currentAdditional.length ? currentAdditional[i] : ''
                      );
                      setSelectedGuest(prev => ({
                        ...prev,
                        numberOfGuests: num,
                        additionalGuests: updatedAdditional
                      }));
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    {[1,2,3,4,5,6,7,8,9,10].map(num => (
                      <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                    ))}
                  </select>
                </div>

                {selectedGuest.numberOfGuests > 1 && (
                  <div className="space-y-3 mt-4 p-4 bg-purple-50 rounded-lg">
                    <label className="block text-sm font-medium text-purple-700">
                      Additional Guest Names
                    </label>
                    {Array.from({ length: selectedGuest.numberOfGuests - 1 }).map((_, index) => (
                      <input
                        key={index}
                        type="text"
                        value={selectedGuest.additionalGuests?.[index] || ''}
                        onChange={(e) => {
                          const updated = [...(selectedGuest.additionalGuests || [])];
                          updated[index] = e.target.value;
                          setSelectedGuest(prev => ({ ...prev, additionalGuests: updated }));
                        }}
                        placeholder={`Guest ${index + 2} name`}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    ))}
                  </div>
                )}
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
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Update Guest
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