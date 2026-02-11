import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  CalendarDaysIcon, 
  CurrencyDollarIcon, 
  TicketIcon, 
  UserGroupIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';
import baseurl from '../Base/base';

const HosterDashboard = () => {
  const [stats, setStats] = useState({
    totalEvents: 0,
    activeEvents: 0,
    totalReservations: 0,
    pendingReservations: 0,
    totalGuests: 0,
    confirmedGuests: 0,
    monthlyRevenue: 0,
    monthlyCommission: 0,
    monthlyNet: 0
  });
  const [recentEvents, setRecentEvents] = useState([]);
  const [recentReservations, setRecentReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('hosterToken');
      const response = await axios.get(`${baseurl}/hoster/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data.stats);
      setRecentEvents(response.data.recentEvents);
      setRecentReservations(response.data.recentReservations);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Hoster Dashboard</h1>
        <p className="text-gray-600">Manage your events and view performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Events</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalEvents}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CalendarDaysIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 text-sm text-green-600">
            <ArrowTrendingUpIcon className="h-4 w-4 inline mr-1" />
            {stats.activeEvents} active
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Reservations</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalReservations}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <TicketIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 text-sm text-yellow-600">
            <ClockIcon className="h-4 w-4 inline mr-1" />
            {stats.pendingReservations} pending
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Guest List</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalGuests}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <UserGroupIcon className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 text-sm text-green-600">
            <ChartBarIcon className="h-4 w-4 inline mr-1" />
            {stats.confirmedGuests} confirmed
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Monthly Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                AED {stats.monthlyNet.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <CurrencyDollarIcon className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            Commission: AED {stats.monthlyCommission.toLocaleString()}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Events</h3>
            <Link to="/hoster/events" className="text-sm text-green-600 hover:text-green-700">
              View All →
            </Link>
          </div>
          <div className="space-y-4">
            {recentEvents.map((event) => (
              <div key={event._id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <img src={event.featuredImage} alt={event.title} className="h-12 w-12 rounded-lg object-cover mr-4" />
                  <div>
                    <p className="font-medium text-gray-900">{event.title}</p>
                    <p className="text-sm text-gray-500">{formatDate(event.date)}</p>
                  </div>
                </div>
                <div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    event.status === 'approved' ? 'bg-green-100 text-green-800' :
                    event.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {event.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Reservations</h3>
            <Link to="/hoster/reservations" className="text-sm text-green-600 hover:text-green-700">
              View All →
            </Link>
          </div>
          <div className="space-y-4">
            {recentReservations.map((reservation) => (
              <div key={reservation._id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{reservation.fullName}</p>
                  <p className="text-sm text-gray-500">
                    {reservation.eventId?.title}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">
                    {reservation.numberOfTickets} tickets
                  </p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    reservation.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    reservation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {reservation.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HosterDashboard;