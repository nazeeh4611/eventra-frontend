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
    <div className="min-h-screen bg-gray-950">
      {/* Animated background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Hero Header */}
      <div className="relative overflow-hidden pt-32 pb-20 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/50 via-gray-950 to-gray-950" />
        
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="text-center space-y-6">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-white">
                Discover Events
              </span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 mt-2">
                in Dubai
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Browse our vibrant collection of parties, conferences, festivals, and exclusive events across Dubai.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Search & Filter Bar */}
        <div className="bg-gradient-to-br from-purple-900/40 via-indigo-900/40 to-purple-800/40 backdrop-blur-sm border border-purple-500/20 rounded-3xl shadow-xl p-6 mb-12">
          <form onSubmit={handleSearch} className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="absolute left-5 top-1/2 transform -translate-y-1/2 h-6 w-6 text-purple-300 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search events, venues, parties..."
                className="w-full pl-14 pr-4 py-4 text-lg border-2 border-purple-500/20 focus:border-purple-400/50 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:outline-none bg-gray-900/50 backdrop-blur-sm text-white placeholder-gray-400 transition-all duration-300"
              />
            </div>
            
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="group relative flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg rounded-2xl shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/60 transition-all duration-300 hover:scale-105"
            >
              <FunnelIcon className="h-6 w-6" />
              <span>Filters</span>
            </button>
          </form>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-gradient-to-br from-purple-900/40 via-indigo-900/40 to-purple-800/40 backdrop-blur-sm border border-purple-500/20 rounded-3xl shadow-xl p-8 mb-12">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  Filter Your Party
                </h3>
                <p className="text-gray-400 mt-2">Find exactly what you're looking for</p>
              </div>
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-6 py-3 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 font-semibold rounded-xl transition-all duration-300 hover:scale-105 border border-gray-700/50"
              >
                <XMarkIcon className="h-5 w-5" />
                Clear All
              </button>
            </div>

            <div className="space-y-8">
              {/* Status Filters */}
              <div>
                <label className="flex items-center gap-2 text-lg font-bold text-white mb-4">
                  <CalendarIcon className="h-6 w-6 text-purple-400" />
                  Status
                </label>
                <div className="flex flex-wrap gap-3">
                  {statuses.map((stat) => (
                    <button
                      key={stat}
                      onClick={() => handleStatusChange(stat)}
                      className={`px-6 py-3 rounded-xl text-base font-bold transition-all duration-300 shadow-lg hover:scale-105 ${
                        status === stat || (!status && stat === 'All Status')
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-purple-500/50'
                          : 'bg-gray-800/50 text-gray-300 border border-gray-700/50 hover:border-purple-500/50 hover:bg-gray-700/50'
                      }`}
                    >
                      {stat === 'All Status' ? '🎉 All' : stat.charAt(0).toUpperCase() + stat.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <label className="flex items-center gap-2 text-lg font-bold text-white mb-4">
                  <AdjustmentsHorizontalIcon className="h-6 w-6 text-purple-400" />
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full px-6 py-4 text-lg border-2 border-purple-500/20 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-400/50 bg-gray-900/50 backdrop-blur-sm text-white cursor-pointer transition-all duration-300"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat} className="bg-gray-900">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Popular Venues */}
              <div>
                <label className="flex items-center gap-2 text-lg font-bold text-white mb-4">
                  <MapPinIcon className="h-6 w-6 text-purple-400" />
                  Hot Venues
                </label>
                <div className="flex flex-wrap gap-3">
                  {['Dubai World Trade Centre', 'Madinat Jumeirah', 'Dubai Opera', 'Atlantis The Palm', 'Address Downtown'].map((venue) => (
                    <button
                      key={venue}
                      onClick={() => setSearchTerm(venue)}
                      className="px-5 py-3 bg-gradient-to-r from-purple-900/30 to-pink-900/30 text-gray-300 font-semibold text-base rounded-xl border border-purple-500/30 hover:from-purple-900/50 hover:to-pink-900/50 hover:border-purple-400/50 hover:scale-105 transition-all duration-300"
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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-1.5 h-10 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
              <div>
                <h2 className="text-3xl font-bold text-white">
                  {filteredEvents.length} {filteredEvents.length === 1 ? 'Event' : 'Events'} Found
                </h2>
                <p className="text-gray-400">
                  Showing {filteredEvents.length} of {events.length} epic events
                </p>
              </div>
            </div>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-6 py-3.5 text-base border-2 border-purple-500/20 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-400/50 bg-gray-900/50 backdrop-blur-sm text-white font-semibold cursor-pointer"
            >
              <option value="newest" className="bg-gray-900">📅 Newest First</option>
              <option value="price-low" className="bg-gray-900">💰 Price: Low to High</option>
              <option value="price-high" className="bg-gray-900">💎 Price: High to Low</option>
              <option value="date" className="bg-gray-900">🗓️ Date: Soonest First</option>
            </select>
          </div>
        )}

        {/* Events Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="bg-gradient-to-br from-purple-900/40 via-indigo-900/40 to-purple-800/40 backdrop-blur-sm border border-purple-500/20 rounded-3xl overflow-hidden animate-pulse"
              >
                <div className="h-72 bg-gradient-to-br from-gray-700 to-gray-800"></div>
                <div className="p-8 space-y-4">
                  <div className="h-8 bg-gray-700 rounded-xl w-3/4"></div>
                  <div className="h-4 bg-gray-700 rounded-lg w-full"></div>
                  <div className="h-4 bg-gray-700 rounded-lg w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        ) : sortedEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {sortedEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="text-center space-y-6 max-w-md">
              <div className="text-8xl">🎭</div>
              <h3 className="text-4xl font-bold text-white">No events found</h3>
              <p className="text-lg text-gray-400">
                Try adjusting your search or filters to discover amazing events in Dubai
              </p>
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg rounded-2xl shadow-xl shadow-purple-500/50 hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                🎉 Show All Events
              </button>
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && !loading && (
          <div className="flex flex-wrap justify-center items-center gap-3 mt-20">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center gap-2 px-6 py-4 font-bold text-lg rounded-xl border-2 border-purple-500/20 bg-gray-900/50 backdrop-blur-sm text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-purple-600/20 hover:border-purple-400/50 hover:scale-105 transition-all duration-300 disabled:transform-none"
            >
              ← Previous
            </button>

            <div className="flex flex-wrap justify-center gap-3">
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
                    className={`w-14 h-14 font-bold text-lg rounded-xl transition-all duration-300 hover:scale-110 ${
                      page === pageNum
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50 scale-110'
                        : 'bg-gray-900/50 backdrop-blur-sm border-2 border-purple-500/20 text-white hover:bg-purple-600/20 hover:border-purple-400/50'
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
              className="flex items-center gap-2 px-6 py-4 font-bold text-lg rounded-xl border-2 border-purple-500/20 bg-gray-900/50 backdrop-blur-sm text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-purple-600/20 hover:border-purple-400/50 hover:scale-105 transition-all duration-300 disabled:transform-none"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;