import React, { useState, useEffect } from 'react';
import { 
  CalendarDaysIcon, 
  UserGroupIcon, 
  TicketIcon, 
  CurrencyDollarIcon,
  ClockIcon,
  BuildingOfficeIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';
import { Link } from 'react-router-dom';
import baseurl from '../Base/base';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalHosters: 0,
    pendingHosters: 0,
    totalReservations: 0,
    pendingReservations: 0,
    totalGuests: 0,
    monthlyRevenue: 0,
    monthlyCommission: 0
  });
  const [recentEvents, setRecentEvents] = useState([]);
  const [pendingEvents, setPendingEvents] = useState([]);
  const [recentHosters, setRecentHosters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${baseurl}/admin/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const apiStats = response.data.stats || {};
      setStats({
        totalEvents: apiStats.totalEvents || 0,
        totalHosters: apiStats.totalHosters || 0,
        pendingHosters: apiStats.pendingHosters || 0,
        totalReservations: apiStats.totalReservations || 0,
        pendingReservations: apiStats.pendingReservations || 0,
        totalGuests: apiStats.totalGuests || 0,
        monthlyRevenue: apiStats.monthlyRevenue || 0,
        monthlyCommission: apiStats.monthlyCommission || 0
      });
      
      setRecentEvents(response.data.recentEvents || []);
      setPendingEvents(response.data.pendingEvents || []);
      setRecentHosters(response.data.recentHosters || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return 'Invalid Date';
    }
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
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Overview of platform performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Events</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalEvents}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <CalendarDaysIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Hosters</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalHosters}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <BuildingOfficeIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 text-sm text-yellow-600">
            <ClockIcon className="h-4 w-4 inline mr-1" />
            {stats.pendingHosters} pending approval
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Reservations</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalReservations}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <TicketIcon className="h-6 w-6 text-purple-600" />
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
              <p className="text-sm text-gray-500">Monthly Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                AED {stats.monthlyRevenue?.toLocaleString() || '0'}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <CurrencyDollarIcon className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            Commission: AED {stats.monthlyCommission?.toLocaleString() || '0'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Pending Hosters</h3>
            <Link to="/admin/hosters" className="text-sm text-blue-600 hover:text-blue-700">
              View All →
            </Link>
          </div>
          <div className="space-y-4">
            {recentHosters.length > 0 ? (
              recentHosters.map((hoster) => (
                <div key={hoster._id || hoster.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{hoster.companyName || 'N/A'}</p>
                    <p className="text-sm text-gray-500">{hoster.contactPerson || 'N/A'}</p>
                    <p className="text-sm text-gray-500">{hoster.email || 'N/A'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">{formatDate(hoster.createdAt)}</p>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Pending
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No pending hosters</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Pending Events</h3>
            <Link to="/admin/events" className="text-sm text-blue-600 hover:text-blue-700">
              View All →
            </Link>
          </div>
          <div className="space-y-4">
            {pendingEvents.length > 0 ? (
              pendingEvents.map((event) => (
                <div key={event._id || event.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{event.title || 'N/A'}</p>
                    <p className="text-sm text-gray-500">{(event.hosterId?.companyName) || (event.companyName) || 'N/A'}</p>
                    <p className="text-sm text-gray-500">{formatDate(event.date)}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Pending
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No pending events</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Recent Events</h3>
          <Link to="/admin/events" className="text-sm text-blue-600 hover:text-blue-700">
            View All →
          </Link>
        </div>
        <div className="space-y-4">
          {recentEvents.length > 0 ? (
            recentEvents.map((event) => (
              <div key={event._id || event.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  {event.featuredImage && (
                    <img 
                      src={event.featuredImage} 
                      alt={event.title || 'Event'} 
                      className="h-12 w-12 rounded-lg object-cover mr-4" 
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.classList.add('ml-0');
                      }}
                    />
                  )}
                  <div>
                    <p className="font-medium text-gray-900">{event.title || 'N/A'}</p>
                    <p className="text-sm text-gray-500">{(event.hosterId?.companyName) || (event.companyName) || 'N/A'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{formatDate(event.date)}</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    event.status === 'approved' ? 'bg-green-100 text-green-800' :
                    event.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {event.status || 'unknown'}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">No recent events</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;