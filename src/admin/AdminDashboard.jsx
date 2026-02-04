import React, { useState, useEffect } from 'react';
import { 
  CalendarDaysIcon,
  UserGroupIcon,
  TicketIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  BuildingOffice2Icon,
  ClockIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import baseurl from '../Base/base';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalEvents: 0,
    upcomingEvents: 0,
    totalReservations: 0,
    pendingReservations: 0,
    totalGuests: 0,
    confirmedGuests: 0,
    monthlyEvents: 0,
    monthlyRevenue: 0
  });
  const [recentEvents, setRecentEvents] = useState([]);
  const [recentReservations, setRecentReservations] = useState([]);
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

      setStats(response.data.stats);
      setRecentEvents(response.data.recentEvents);
      setRecentReservations(response.data.recentReservations);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue (AED)',
        data: [120000, 190000, 150000, 250000, 220000, 300000],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const eventsData = {
    labels: ['Business', 'Music', 'Sports', 'Cultural', 'Entertainment'],
    datasets: [
      {
        label: 'Events by Category',
        data: [12, 19, 8, 15, 10],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(236, 72, 153, 0.8)',
        ],
      },
    ],
  };

  const reservationsData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Reservations',
        data: [45, 52, 38, 65, 72, 48, 35],
        backgroundColor: 'rgba(212, 175, 55, 0.8)',
      },
    ],
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
        <p className="text-gray-600">Welcome back! Here's what's happening with your events.</p>
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
          <div className="mt-4 flex items-center text-sm text-green-600">
            <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
            <span>{stats.upcomingEvents} upcoming</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Reservations</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalReservations}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <TicketIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-yellow-600">
            <ClockIcon className="h-4 w-4 mr-1" />
            <span>{stats.pendingReservations} pending</span>
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
          <div className="mt-4 flex items-center text-sm text-green-600">
            <ChartBarIcon className="h-4 w-4 mr-1" />
            <span>{stats.confirmedGuests} confirmed</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Monthly Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                AED {stats.monthlyRevenue.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <CurrencyDollarIcon className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
            <span>From {stats.monthlyEvents} events</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Overview</h3>
          <Line data={revenueData} options={{ responsive: true }} height={300} />
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Events by Category</h3>
          <Pie data={eventsData} options={{ responsive: true }} height={300} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Events</h3>
            <a href="/admin/events" className="text-sm text-dubai-blue hover:text-blue-700">
              View All →
            </a>
          </div>
          <div className="space-y-4">
            {recentEvents.map((event) => (
              <div key={event._id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{event.title}</p>
                  <p className="text-sm text-gray-500">{event.venue}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">
                    {new Date(event.date).toLocaleDateString()}
                  </p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    event.status === 'upcoming' ? 'bg-green-100 text-green-800' :
                    event.status === 'ongoing' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
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
            <a href="/admin/reservations" className="text-sm text-dubai-blue hover:text-blue-700">
              View All →
            </a>
          </div>
          <div className="space-y-4">
            {recentReservations.map((reservation) => (
              <div key={reservation._id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{reservation.fullName}</p>
                  <p className="text-sm text-gray-500">
                    {reservation.eventId?.title || 'Event'}
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

export default AdminDashboard;