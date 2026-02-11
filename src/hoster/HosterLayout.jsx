import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ChartBarIcon,
  CalendarDaysIcon,
  TicketIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const HosterLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const hosterData = JSON.parse(localStorage.getItem('hosterData') || '{}');

  const navigation = [
    { name: 'Dashboard', href: '/hoster/dashboard', icon: ChartBarIcon },
    { name: 'Events', href: '/hoster/events', icon: CalendarDaysIcon },
    { name: 'Reservations', href: '/hoster/reservations', icon: TicketIcon },
    { name: 'Guests', href: '/hoster/guests', icon: UserGroupIcon },
    { name: 'Settings', href: '/hoster/settings', icon: Cog6ToothIcon },
  ];

  const handleLogout = () => {
    localStorage.removeItem('hosterToken');
    localStorage.removeItem('hosterData');
    toast.success('Logged out successfully');
    navigate('/hoster/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* Mobile sidebar */}
        <div className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? '' : 'hidden'}`}>
          <div className="fixed inset-0 bg-gray-600/75" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-xl">
            <div className="flex items-center justify-between h-16 px-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Hoster Menu</h2>
              <button onClick={() => setSidebarOpen(false)} className="p-2">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <nav className="mt-5 px-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-3 py-3 text-sm font-medium rounded-md ${
                    location.pathname.includes(item.href)
                      ? 'bg-green-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Desktop sidebar */}
        <div className="hidden lg:flex lg:flex-col lg:w-64">
          <div className="flex flex-col flex-grow bg-white border-r pt-5 pb-4">
            <div className="flex items-center flex-shrink-0 px-4 mb-8">
              <BuildingOfficeIcon className="h-6 w-6 text-green-600 mr-3" />
              <h1 className="text-lg font-bold text-gray-900">Hoster Portal</h1>
            </div>
            <nav className="flex-1 px-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-3 py-3 text-sm font-medium rounded-md ${
                    location.pathname.includes(item.href)
                      ? 'bg-green-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              ))}
            </nav>
            <div className="border-t px-4 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{hosterData.companyName}</p>
                  <p className="text-xs text-gray-500">{hosterData.contactPerson}</p>
                </div>
                <button onClick={handleLogout} className="p-2 hover:text-red-500">
                  <ArrowLeftOnRectangleIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="lg:hidden">
            <div className="flex items-center justify-between h-16 px-4 bg-white border-b">
              <button onClick={() => setSidebarOpen(true)} className="p-2">
                <Bars3Icon className="h-6 w-6" />
              </button>
              <h1 className="text-lg font-semibold text-gray-900">Hoster</h1>
              <div className="w-10"></div>
            </div>
          </div>
          <main className="flex-1 overflow-y-auto">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Outlet />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default HosterLayout;