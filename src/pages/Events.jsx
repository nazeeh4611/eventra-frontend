import React, { useState, useEffect } from 'react';
import EventCard from '../components/EventCard';
import { FunnelIcon, MagnifyingGlassIcon, CalendarIcon, MapPinIcon, AdjustmentsHorizontalIcon, XMarkIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import baseurl from '../Base/base';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('newest');

  const categories = [
    'All Categories',
    'Business',
    'Technology',
    'Music',
    'Sports',
    'Arts & Culture',
    'Food & Drink',
    'Networking',
    'Entertainment',
    'Education'
  ];

  const statuses = [
    'All Status',
    'upcoming',
    'ongoing',
    'completed'
  ];

  useEffect(() => {
    fetchEvents();
  }, [page, category, status]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page,
        limit: 12,
        ...(category && category !== 'All Categories' && { category }),
        ...(status && status !== 'All Status' && { status })
      }).toString();

      const response = await axios.get(`${baseurl}/events?${params}`);
      setEvents(response.data.events);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchEvents();
  };

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    setPage(1);
  };

  const handleStatusChange = (stat) => {
    setStatus(stat);
    setPage(1);
  };

  const clearFilters = () => {
    setCategory('');
    setStatus('');
    setSearchTerm('');
    setPage(1);
  };

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.venue.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedEvents = [...filteredEvents].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return (a.price || 0) - (b.price || 0);
      case 'price-high':
        return (b.price || 0) - (a.price || 0);
      case 'date':
        return new Date(a.date) - new Date(b.date);
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="text-center space-y-4 sm:space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight">
              Discover Events in Dubai
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-pink-100 max-w-3xl mx-auto px-4">
              Browse our vibrant collection of parties, conferences, festivals, and exclusive events across Dubai. Find your perfect night out!
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Search & Filter Bar */}
        <div className="bg-white rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8 mb-8 sm:mb-12 border border-pink-100">
          <form onSubmit={handleSearch} className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="absolute left-5 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by event name, venue, or description..."
                className="w-full pl-14 pr-4 py-4 sm:py-5 text-base sm:text-lg border-2 border-pink-100 focus:border-purple-400 rounded-2xl sm:rounded-3xl focus:ring-4 focus:ring-purple-100 focus:outline-none shadow-md hover:shadow-lg transition-all duration-300 placeholder-gray-400 bg-gradient-to-r from-white to-pink-50"
              />
            </div>
            
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-4 sm:py-5 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-base sm:text-lg rounded-2xl sm:rounded-3xl shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300"
            >
              <FunnelIcon className="h-5 w-5 sm:h-6 sm:w-6" />
              <span className="hidden sm:inline">Filters</span>
              <span className="sm:hidden">Filter</span>
            </button>
          </form>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10 mb-8 sm:mb-12 border-2 border-purple-100 animate-fadeIn">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  Filter Your Party
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">Find exactly what you're looking for</p>
              </div>
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl sm:rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95 text-sm sm:text-base"
              >
                <XMarkIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                Clear All
              </button>
            </div>

            <div className="space-y-6 sm:space-y-8">
              {/* Status Filters */}
              <div>
                <label className="flex items-center gap-2 text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4">
                  <CalendarIcon className="h-5 w-5 sm:h-6 sm:w-6 text-purple-500" />
                  Status
                </label>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {statuses.map((stat) => (
                    <button
                      key={stat}
                      onClick={() => handleStatusChange(stat)}
                      className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-sm sm:text-base font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 ${
                        status === stat || (!status && stat === 'All Status')
                          ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-pink-500/30'
                          : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-pink-300 hover:bg-pink-50'
                      }`}
                    >
                      {stat === 'All Status' ? '🎉 All' : stat.charAt(0).toUpperCase() + stat.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <label className="flex items-center gap-2 text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4">
                  <AdjustmentsHorizontalIcon className="h-5 w-5 sm:h-6 sm:w-6 text-purple-500" />
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-purple-400 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-white to-pink-50 cursor-pointer"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Popular Venues */}
              <div>
                <label className="flex items-center gap-2 text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4">
                  <MapPinIcon className="h-5 w-5 sm:h-6 sm:w-6 text-purple-500" />
                  Hot Venues
                </label>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {['Dubai World Trade Centre', 'Madinat Jumeirah', 'Dubai Opera', 'Atlantis The Palm', 'Address Downtown'].map((venue) => (
                    <button
                      key={venue}
                      onClick={() => setSearchTerm(venue)}
                      className="px-4 sm:px-5 py-2 sm:py-3 bg-gradient-to-r from-pink-50 to-purple-50 text-gray-700 font-semibold text-sm sm:text-base rounded-xl sm:rounded-2xl border-2 border-pink-200 hover:from-pink-100 hover:to-purple-100 hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300"
                    >
                      📍 {venue}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Header */}
        {!loading && filteredEvents.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-1.5 h-8 sm:h-10 bg-gradient-to-b from-pink-500 to-purple-600 rounded-full"></div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
                  {filteredEvents.length} {filteredEvents.length === 1 ? 'Event' : 'Events'} Found
                </h2>
                <p className="text-sm sm:text-base text-gray-600">
                  Showing {filteredEvents.length} of {events.length} epic events
                </p>
              </div>
            </div>
            
            <div className="w-full sm:w-auto">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full sm:w-auto px-4 sm:px-6 py-3 sm:py-3.5 text-sm sm:text-base border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-purple-400 shadow-lg hover:shadow-xl transition-all duration-300 bg-white font-semibold cursor-pointer"
              >
                <option value="newest">📅 Newest First</option>
                <option value="price-low">💰 Price: Low to High</option>
                <option value="price-high">💎 Price: High to Low</option>
                <option value="date">🗓️ Date: Soonest First</option>
              </select>
            </div>
          </div>
        )}

        {/* Events Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="bg-white rounded-3xl shadow-xl overflow-hidden animate-pulse"
              >
                <div className="h-64 sm:h-72 lg:h-80 bg-gradient-to-br from-gray-200 to-gray-300"></div>
                <div className="p-6 sm:p-8 space-y-4">
                  <div className="h-6 sm:h-8 bg-gray-200 rounded-xl w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded-lg w-full"></div>
                  <div className="h-4 bg-gray-200 rounded-lg w-5/6"></div>
                  <div className="flex gap-3 mt-6">
                    <div className="h-12 sm:h-14 bg-gray-200 rounded-2xl flex-1"></div>
                    <div className="h-12 sm:h-14 bg-gray-200 rounded-2xl w-20 sm:w-24"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : sortedEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            {sortedEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 sm:py-20 lg:py-24">
            <div className="text-center space-y-4 sm:space-y-6 max-w-md px-4">
              <div className="text-6xl sm:text-7xl lg:text-8xl">🎭</div>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">No events found</h3>
              <p className="text-base sm:text-lg text-gray-600">
                Try adjusting your search or filters to discover amazing events in Dubai
              </p>
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-base sm:text-lg rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 mt-4"
              >
                🎉 Show All Events
              </button>
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && !loading && (
          <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 mt-12 sm:mt-16 lg:mt-20">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center gap-2 px-4 sm:px-6 py-3 sm:py-4 font-bold text-sm sm:text-base lg:text-lg rounded-xl sm:rounded-2xl border-2 border-gray-200 bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 disabled:transform-none disabled:hover:shadow-none"
            >
              <span className="hidden sm:inline">←</span> Previous
            </button>

            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }

                return (
                  <button
                    key={i}
                    onClick={() => setPage(pageNum)}
                    className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 font-bold text-sm sm:text-base lg:text-lg rounded-xl sm:rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-110 active:scale-95 ${
                      page === pageNum
                        ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-pink-500/30 scale-110'
                        : 'bg-white border-2 border-gray-200 text-gray-700 hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 hover:border-pink-300'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex items-center gap-2 px-4 sm:px-6 py-3 sm:py-4 font-bold text-sm sm:text-base lg:text-lg rounded-xl sm:rounded-2xl border-2 border-gray-200 bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 disabled:transform-none disabled:hover:shadow-none"
            >
              Next <span className="hidden sm:inline">→</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;