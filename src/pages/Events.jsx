import React, { useState, useEffect } from 'react';
import EventCard from '../components/EventCard';
import { 
  FunnelIcon, 
  MagnifyingGlassIcon, 
  CalendarIcon, 
  MapPinIcon, 
  AdjustmentsHorizontalIcon, 
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
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

  const popularVenues = [
    'Dubai World Trade Centre',
    'Madinat Jumeirah',
    'Dubai Opera',
    'Atlantis The Palm',
    'Address Downtown'
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
      const response = await axios.get(`${baseurl}/allevents?${params}`);
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
    event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.venue?.toLowerCase().includes(searchTerm.toLowerCase())
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-600/20 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-pink-600/20 via-transparent to-transparent"></div>

      <div className="relative z-10 px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 lg:py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header - Responsive */}
          <div className="text-center mb-5 sm:mb-8 md:mb-10 lg:mb-12">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent mb-2 sm:mb-3 md:mb-4 lg:mb-6 px-2">
              Discover Events in Dubai
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 max-w-2xl lg:max-w-3xl mx-auto px-3">
              Browse our vibrant collection of parties, conferences, festivals, and exclusive events across Dubai.
            </p>
          </div>

          {/* Search and Filter Bar - Responsive */}
          <div className="mb-4 sm:mb-6 md:mb-8 lg:mb-10">
            <div className="bg-gray-900/50 backdrop-blur-lg border-2 border-purple-500/20 rounded-xl sm:rounded-2xl md:rounded-3xl p-3 sm:p-4 md:p-5 lg:p-6 shadow-2xl shadow-purple-500/20">
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4">
                <div className="relative flex-1">
                  <MagnifyingGlassIcon className="absolute left-3 sm:left-4 md:left-5 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-purple-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search events, venues, parties..."
                    className="w-full pl-9 sm:pl-11 md:pl-14 pr-3 sm:pr-4 py-2.5 sm:py-3 md:py-4 text-sm sm:text-base md:text-lg border-2 border-purple-500/20 focus:border-purple-400/50 rounded-lg sm:rounded-xl md:rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:outline-none bg-gray-900/50 backdrop-blur-sm text-white placeholder-gray-400 transition-all duration-300"
                  />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="group relative flex items-center justify-center gap-1.5 sm:gap-2 md:gap-3 px-4 sm:px-5 md:px-6 lg:px-8 py-2.5 sm:py-3 md:py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-sm sm:text-base md:text-lg rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/60 transition-all duration-300 hover:scale-105 whitespace-nowrap"
                >
                  <FunnelIcon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                  <span className="hidden xs:inline">Filters</span>
                  <span className="xs:hidden">Filter</span>
                </button>
              </div>
            </div>
          </div>

          {/* Filters Panel - Responsive */}
          {showFilters && (
            <div className="mb-4 sm:mb-6 md:mb-8 lg:mb-10 bg-gradient-to-br from-gray-900/95 via-purple-900/30 to-gray-900/95 backdrop-blur-xl border-2 border-purple-500/30 rounded-xl sm:rounded-2xl md:rounded-3xl p-3 sm:p-4 md:p-5 lg:p-6 shadow-2xl shadow-purple-500/30 animate-slideDown">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-3 mb-4 sm:mb-5 md:mb-6">
                <div>
                  <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Filter Your Party
                  </h2>
                  <p className="text-xs sm:text-sm md:text-base text-gray-400 mt-0.5 sm:mt-1">Find exactly what you're looking for</p>
                </div>
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1.5 px-3 sm:px-4 md:px-5 lg:px-6 py-1.5 sm:py-2 md:py-2.5 lg:py-3 bg-red-600/20 hover:bg-red-600/30 text-red-400 font-bold rounded-lg sm:rounded-xl border border-red-500/30 hover:border-red-400/50 transition-all duration-300 hover:scale-105 text-xs sm:text-sm md:text-base"
                >
                  <XMarkIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                  Clear All
                </button>
              </div>

              <div className="space-y-4 sm:space-y-5 md:space-y-6">
                {/* Status Filters */}
                <div>
                  <label className="flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base md:text-lg font-bold text-white mb-2 sm:mb-3">
                    <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-purple-400" />
                    Status
                  </label>
                  <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-1.5 sm:gap-2 md:gap-3">
                    {statuses.map((stat) => (
                      <button
                        key={stat}
                        onClick={() => handleStatusChange(stat)}
                        className={`px-2.5 sm:px-3 md:px-4 lg:px-5 py-1.5 sm:py-2 md:py-2.5 lg:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm md:text-base font-bold transition-all duration-300 shadow-lg hover:scale-105 ${
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

                {/* Category Select */}
                <div>
                  <label className="flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base md:text-lg font-bold text-white mb-2 sm:mb-3">
                    <AdjustmentsHorizontalIcon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-purple-400" />
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full px-3 sm:px-4 md:px-5 lg:px-6 py-2 sm:py-2.5 md:py-3 lg:py-4 text-sm sm:text-base md:text-lg border-2 border-purple-500/20 rounded-lg sm:rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-400/50 bg-gray-900/50 backdrop-blur-sm text-white cursor-pointer transition-all duration-300"
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
                  <label className="flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base md:text-lg font-bold text-white mb-2 sm:mb-3">
                    <MapPinIcon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-purple-400" />
                    Hot Venues
                  </label>
                  <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1.5 sm:gap-2 md:gap-3">
                    {popularVenues.map((venue) => (
                      <button
                        key={venue}
                        onClick={() => setSearchTerm(venue)}
                        className="px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 bg-gradient-to-r from-purple-900/30 to-pink-900/30 text-gray-300 font-semibold text-xs sm:text-sm md:text-base rounded-lg sm:rounded-xl border border-purple-500/30 hover:from-purple-900/50 hover:to-pink-900/50 hover:border-purple-400/50 hover:scale-105 transition-all duration-300 text-left truncate"
                      >
                        📍 {venue}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Results Header - Responsive */}
          {!loading && filteredEvents.length > 0 && (
            <div className="mb-4 sm:mb-5 md:mb-6 flex flex-col xs:flex-row justify-between items-start xs:items-center gap-2 sm:gap-3 md:gap-4 px-1 sm:px-0">
              <div>
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black text-white mb-0.5 sm:mb-1">
                  {filteredEvents.length} {filteredEvents.length === 1 ? 'Event' : 'Events'} Found
                </h2>
                <p className="text-xs sm:text-sm md:text-base text-gray-400">
                  Showing {filteredEvents.length} of {events.length} epic events
                </p>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full xs:w-auto px-3 sm:px-4 md:px-5 lg:px-6 py-2 sm:py-2.5 md:py-3 text-xs sm:text-sm md:text-base border-2 border-purple-500/20 rounded-lg sm:rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-400/50 bg-gray-900/50 backdrop-blur-sm text-white font-semibold cursor-pointer"
              >
                <option value="newest">📅 Newest First</option>
                <option value="price-low">💰 Price: Low to High</option>
                <option value="price-high">💎 Price: High to Low</option>
                <option value="date">🗓️ Date: Soonest First</option>
              </select>
            </div>
          )}

          {/* Events Grid - Fully Responsive */}
          {loading ? (
            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <div
                  key={n}
                  className="bg-gray-800/50 rounded-xl sm:rounded-2xl md:rounded-3xl h-80 xs:h-96 sm:h-[400px] md:h-[450px] animate-pulse border-2 border-purple-500/10"
                ></div>
              ))}
            </div>
          ) : sortedEvents.length > 0 ? (
            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
              {sortedEvents.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 sm:py-10 md:py-12 lg:py-16 px-3">
              <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-3 sm:mb-4">🎭</div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white mb-2 sm:mb-3">No events found</h3>
              <p className="text-sm sm:text-base md:text-lg text-gray-400 mb-4 sm:mb-5 md:mb-6 max-w-md mx-auto">
                Try adjusting your search or filters to discover amazing events in Dubai
              </p>
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 md:px-6 lg:px-8 py-2.5 sm:py-3 md:py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-sm sm:text-base md:text-lg rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/60 transition-all duration-300 hover:scale-105"
              >
                🎉 Show All Events
              </button>
            </div>
          )}

          {/* Pagination - Fully Responsive */}
          {totalPages > 1 && !loading && (
            <div className="mt-6 sm:mt-8 md:mt-10 lg:mt-12 flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 px-2 sm:px-0">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 md:py-4 font-bold text-sm sm:text-base md:text-lg rounded-lg sm:rounded-xl border-2 border-purple-500/20 bg-gray-900/50 backdrop-blur-sm text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-purple-600/20 hover:border-purple-400/50 hover:scale-105 transition-all duration-300 disabled:transform-none"
              >
                <ChevronLeftIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden xs:inline">Previous</span>
                <span className="xs:hidden">Prev</span>
              </button>

              <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 md:gap-3">
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
                      className={`w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 lg:w-14 lg:h-14 font-bold text-sm sm:text-base md:text-lg rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-110 ${
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
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 md:py-4 font-bold text-sm sm:text-base md:text-lg rounded-lg sm:rounded-xl border-2 border-purple-500/20 bg-gray-900/50 backdrop-blur-sm text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-purple-600/20 hover:border-purple-400/50 hover:scale-105 transition-all duration-300 disabled:transform-none"
              >
                <span className="hidden xs:inline">Next</span>
                <span className="xs:hidden">Next</span>
                <ChevronRightIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Events;