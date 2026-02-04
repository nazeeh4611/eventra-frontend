import React, { useState, useEffect } from 'react';
import EventCard from '../components/EventCard';
import { 
  FunnelIcon,
  MagnifyingGlassIcon,
  CalendarIcon,
  MapPinIcon,
  AdjustmentsHorizontalIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

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

      const response = await axios.get(`http://localhost:5000/api/events?${params}`);
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-pink-50/30 to-purple-50 py-12 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Header */}
        <div className="text-center mb-16 lg:mb-20">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black bg-gradient-to-r from-gray-900 via-pink-600 to-purple-600 bg-clip-text text-transparent mb-6 drop-shadow-lg">
            Discover Events in Dubai
          </h1>
          <p className="text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Browse our vibrant collection of parties, conferences, festivals, and exclusive events across Dubai. 
            Find your perfect night out!
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 lg:p-12 mb-12 lg:mb-16 border border-white/50">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 mb-8">
            <form onSubmit={handleSearch} className="flex-1 relative group">
              <MagnifyingGlassIcon className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-pink-400 group-focus-within:text-pink-500 transition-colors" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="🔍 Search by event name, venue, or description..."
                className="w-full pl-14 pr-4 py-5 lg:py-6 text-lg border-2 border-pink-100 focus:border-purple-300 rounded-3xl focus:ring-4 focus:ring-purple-100/50 focus:outline-none shadow-lg hover:shadow-xl transition-all duration-300 placeholder-gray-400 bg-gradient-to-r from-white to-pink-50/50"
              />
            </form>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center justify-center gap-3 px-8 py-5 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold rounded-3xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 whitespace-nowrap"
            >
              <AdjustmentsHorizontalIcon className="h-6 w-6" />
              Filters
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        <div className={`${showFilters ? 'block' : 'hidden'} lg:block mb-16`}>
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl p-8 lg:p-12 border border-white/30">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl shadow-lg">
                  <FunnelIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 bg-gradient-to-r from-gray-900 to-pink-600 bg-clip-text">
                    Filter Your Party
                  </h3>
                  <p className="text-gray-600">Find exactly what you're looking for</p>
                </div>
              </div>
              <button
                onClick={clearFilters}
                className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 font-semibold rounded-2xl border border-gray-200 hover:from-pink-50 hover:to-purple-50 hover:border-pink-300 hover:shadow-lg transition-all duration-300"
              >
                <XMarkIcon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                Clear All
              </button>
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8">
              {/* Status Filters */}
              <div className="space-y-4">
                <label className="flex items-center gap-3 text-lg font-semibold text-gray-700">
                  <CalendarIcon className="h-6 w-6 text-pink-500" />
                  Status
                </label>
                <div className="flex flex-wrap gap-3">
                  {statuses.map((stat) => (
                    <button
                      key={stat}
                      onClick={() => handleStatusChange(stat)}
                      className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 hover:-translate-y-1 ${
                        status === stat || (!status && stat === 'All Status')
                          ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-pink-500/25' 
                          : 'bg-white/70 text-gray-700 border-2 border-gray-200 hover:border-pink-300 hover:bg-pink-50'
                      }`}
                    >
                      {stat === 'All Status' ? '🎉 All' : stat.charAt(0).toUpperCase() + stat.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Filter */}
              <div className="space-y-4">
                <label className="flex items-center gap-3 text-lg font-semibold text-gray-700">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-3xl focus:ring-4 focus:ring-purple-100/50 focus:border-purple-400 shadow-lg hover:shadow-xl transition-all duration-300 appearance-none bg-gradient-to-r from-white to-pink-50 bg-no-repeat bg-right"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat === 'All Categories' ? '' : cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Popular Venues */}
              <div className="lg:col-span-2 space-y-4">
                <label className="flex items-center gap-3 text-lg font-semibold text-gray-700">
                  <MapPinIcon className="h-6 w-6 text-purple-500" />
                  Hot Venues
                </label>
                <div className="flex flex-wrap gap-3">
                  {['Dubai World Trade Centre', 'Madinat Jumeirah', 'Dubai Opera', 'Atlantis The Palm', 'Address Downtown'].map((venue) => (
                    <button
                      key={venue}
                      onClick={() => setSearchTerm(venue)}
                      className="group px-5 py-3 bg-gradient-to-r from-pink-50 to-purple-50 text-gray-700 font-semibold rounded-2xl border border-pink-200 hover:from-pink-100 hover:to-purple-100 hover:shadow-lg hover:scale-105 transition-all duration-300 shadow-sm"
                    >
                      <span className="group-hover:scale-110 transition-transform">{venue}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="bg-gradient-to-br from-white to-pink-50 rounded-3xl shadow-xl h-96 lg:h-[28rem] animate-pulse border border-gray-100"></div>
            ))}
          </div>
        ) : filteredEvents.length > 0 ? (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
              <p className="text-xl lg:text-2xl font-semibold text-gray-900 bg-gradient-to-r from-gray-900 to-pink-600 bg-clip-text">
                Showing {filteredEvents.length} of {events.length} epic events
              </p>
              <div className="flex items-center gap-3">
                <span className="text-lg text-gray-600 font-medium">Sort by:</span>
                <select className="px-6 py-3 border-2 border-gray-200 rounded-2xl shadow-lg hover:shadow-xl focus:ring-4 focus:ring-pink-100/50 focus:border-purple-400 text-lg font-semibold bg-white transition-all duration-300">
                  <option>Newest First</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Date: Soonest First</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-10">
              {filteredEvents.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-24 lg:py-32">
            <div className="inline-flex items-center justify-center w-28 h-28 rounded-3xl bg-gradient-to-r from-pink-100 to-purple-100 mb-10 shadow-2xl p-6 mx-auto">
              <CalendarIcon className="h-14 w-14 text-pink-500" />
            </div>
            <h3 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6 bg-gradient-to-r from-gray-900 to-pink-600 bg-clip-text">
              No events found
            </h3>
            <p className="text-xl lg:text-2xl text-gray-600 mb-12 leading-relaxed max-w-2xl mx-auto">
              Try adjusting your search or filters to discover amazing events in Dubai
            </p>
            <button
              onClick={clearFilters}
              className="inline-flex items-center justify-center px-10 py-5 bg-gradient-to-r from-pink-500 to-purple-500 text-xl font-black text-white rounded-3xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300"
            >
              🎉 Show All Events
            </button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-20 mb-12">
            <nav className="flex items-center gap-2 bg-white/70 backdrop-blur-xl px-8 py-6 rounded-3xl shadow-2xl border border-white/50">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="group flex items-center gap-2 px-6 py-4 font-bold text-lg rounded-2xl border-2 border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:transform-none"
              >
                <ArrowLeftIcon className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                Previous
              </button>
              
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
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`px-6 py-4 font-bold text-lg rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 hover:-translate-y-1 ${
                      page === pageNum
                        ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-pink-500/25' 
                        : 'bg-white/80 border-2 border-gray-200 text-gray-700 hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="group flex items-center gap-2 px-6 py-4 font-bold text-lg rounded-2xl border-2 border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:transform-none"
              >
                Next
                <ArrowRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
