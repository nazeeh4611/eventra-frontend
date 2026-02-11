import React, { useState, useEffect } from 'react';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ClockIcon,
  EyeIcon,
  PhoneIcon,
  EnvelopeIcon,
  UserIcon,
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';
import toast from 'react-hot-toast';
import baseurl from '../Base/base';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const HosterReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [eventFilter, setEventFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchReservations();
    fetchEvents();
  }, [currentPage, statusFilter, eventFilter]);

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('hosterToken');
      const params = new URLSearchParams({
        page: currentPage,
        limit: 15,
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(eventFilter !== 'all' && { eventId: eventFilter })
      }).toString();

      const response = await axios.get(`${baseurl}/hoster/reservations?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setReservations(response.data.reservations);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      toast.error('Failed to fetch reservations');
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

  const handleUpdateStatus = async (reservationId, status) => {
    try {
      const token = localStorage.getItem('hosterToken');
      await axios.put(`${baseurl}/hoster/reservations/${reservationId}/status`, 
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(`Reservation ${status}`);
      fetchReservations();
    } catch (error) {
      toast.error('Failed to update reservation status');
    }
  };

  const exportToExcel = () => {
    const data = reservations.map(reservation => ({
      'Customer Name': reservation.fullName,
      'Email': reservation.email,
      'Phone': reservation.phone,
      'Event': reservation.eventId?.title || '',
      'Tickets': reservation.numberOfTickets,
      'Status': reservation.status,
      'Amount': `AED ${reservation.amount || '0'}`,
      'Payment Status': reservation.paymentStatus || 'N/A',
      'Booking Date': new Date(reservation.createdAt).toLocaleDateString()
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Reservations');
    
    const eventTitle = eventFilter !== 'all' 
      ? events.find(e => e._id === eventFilter)?.title 
      : 'All_Events';
    
    const fileName = `Reservations_${eventTitle}_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
    toast.success('Exported to Excel successfully');
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    const eventTitle = eventFilter !== 'all' 
      ? events.find(e => e._id === eventFilter)?.title 
      : 'All Events';
    
    doc.setFontSize(18);
    doc.text(`Reservations - ${eventTitle}`, 14, 22);
    doc.setFontSize(11);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
    
    const tableColumn = ['Customer', 'Email', 'Phone', 'Tickets', 'Status', 'Amount'];
    const tableRows = reservations.map(reservation => [
      reservation.fullName,
      reservation.email,
      reservation.phone,
      reservation.numberOfTickets,
      reservation.status,
      `AED ${reservation.amount || '0'}`
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      theme: 'grid',
      styles: { fontSize: 9 },
      headStyles: { fillColor: [34, 197, 94] }
    });

    const fileName = `Reservations_${eventTitle.replace(/ /g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
    toast.success('Exported to PDF successfully');
  };

  const filteredReservations = reservations.filter(reservation =>
    reservation.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reservation.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reservation.phone.includes(searchTerm)
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reservations</h1>
            <p className="text-gray-600">Manage event reservations</p>
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
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search reservations..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <select
                value={eventFilter}
                onChange={(e) => setEventFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Events</option>
                {events.map(event => (
                  <option key={event._id} value={event._id}>{event.title}</option>
                ))}
              </select>
            </div>
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
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
      ) : filteredReservations.length > 0 ? (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredReservations.map((reservation) => (
                  <tr key={reservation._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{reservation.fullName}</div>
                      <div className="text-sm text-gray-500">{reservation.numberOfTickets} tickets</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-900">
                          <EnvelopeIcon className="h-4 w-4 mr-2 text-gray-400" />
                          {reservation.email}
                        </div>
                        <div className="flex items-center text-sm text-gray-900">
                          <PhoneIcon className="h-4 w-4 mr-2 text-gray-400" />
                          {reservation.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{reservation.eventId?.title}</div>
                      <div className="text-sm text-gray-500">
                        {reservation.eventId?.date ? 
                          new Date(reservation.eventId.date).toLocaleDateString() : ''
                        }
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(reservation.status)}`}>
                        {reservation.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        {reservation.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(reservation._id, 'confirmed')}
                              className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm flex items-center"
                            >
                              <CheckCircleIcon className="h-4 w-4 mr-1" />
                              Confirm
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(reservation._id, 'cancelled')}
                              className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm flex items-center"
                            >
                              <XCircleIcon className="h-4 w-4 mr-1" />
                              Cancel
                            </button>
                          </>
                        )}
                        {reservation.status === 'confirmed' && (
                          <button
                            onClick={() => handleUpdateStatus(reservation._id, 'cancelled')}
                            className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm flex items-center"
                          >
                            <XCircleIcon className="h-4 w-4 mr-1" />
                            Cancel
                          </button>
                        )}
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
            <UserIcon className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No reservations found</h3>
          <p className="text-gray-600">
            {searchTerm ? 'Try adjusting your search terms' : 'No reservations made yet'}
          </p>
        </div>
      )}
    </div>
  );
};

export default HosterReservations;