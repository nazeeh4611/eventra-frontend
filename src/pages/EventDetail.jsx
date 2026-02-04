import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MapPinIcon, 
  CalendarDaysIcon, 
  ClockIcon,
  UserGroupIcon,
  TicketIcon,
  PhoneIcon,
  EnvelopeIcon,
  BuildingOffice2Icon,
  ArrowLeftIcon,
  ShareIcon,
  HeartIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';
import toast from 'react-hot-toast';
import ReservationModal from '../components/ReservationModal';
import GuestListModal from '../components/GuestListModal';
import baseurl from '../Base/base';

const EventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [showGuestListModal, setShowGuestListModal] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      const response = await axios.get(`${baseurl}/events/${id}`);
      console.log(response)
      setEvent(response.data.event);
    } catch (error) {
      toast.error('Failed to load event details');
      console.error('Error fetching event:', error);
    } finally {
      setLoading(false);
    }
  };

  const shareEvent = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.shortDescription,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-gradient-to-b from-white to-pink-50">
        <div className="animate-pulse space-y-12 max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="h-10 bg-gray-200 rounded-xl w-48"></div>
            <div className="flex gap-2">
              <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
              <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
            </div>
          </div>
          <div className="h-96 bg-gradient-to-r from-gray-200 to-gray-300 rounded-3xl"></div>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="space-y-3">
                <div className="h-8 bg-gray-200 rounded-xl w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="h-64 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl"></div>
            </div>
            <div className="space-y-6">
              <div className="h-80 bg-white rounded-3xl p-6 space-y-4">
                <div className="h-6 bg-gray-200 rounded-xl"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
                <div className="space-y-4">
                  <div className="h-12 bg-gray-200 rounded-2xl"></div>
                  <div className="h-12 bg-gray-200 rounded-2xl"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center bg-gradient-to-b from-white to-pink-50">
        <div className="max-w-md mx-auto bg-white rounded-3xl p-12 shadow-2xl border border-gray-100">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-pink-50 mb-8 shadow-lg">
            <CalendarDaysIcon className="h-12 w-12 text-pink-500" />
          </div>
          <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-gray-900 to-pink-600 bg-clip-text">
            Event Not Found
          </h3>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-md mx-auto">
            The event you're looking for doesn't exist or has been removed.
          </p>
          <Link 
            to="/events" 
            className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-xl font-bold text-white rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            <ArrowLeftIcon className="h-6 w-6 mr-3" />
            Browse All Events
          </Link>
        </div>
      </div>
    );
  }

  const date = new Date(event.date);
  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const availableSeats = event.capacity - event.bookedSeats;
  const occupancyRate = Math.round((event.bookedSeats / event.capacity) * 100);

  return (
    <>
      <div className="bg-white min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="mb-12 lg:mb-16">
            <Link
              to="/events"
              className="inline-flex items-center text-gray-600 hover:text-pink-600 font-semibold mb-8 lg:mb-12 px-4 py-2 bg-white/50 hover:bg-pink-50 rounded-2xl border border-gray-200 hover:border-pink-200 transition-all duration-300 shadow-sm"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back to Events
            </Link>
            
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-8 lg:mb-12">
                  <span className="px-4 py-2 bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700 text-sm font-bold rounded-2xl border border-pink-200">
                    {event.category}
                  </span>
                  {event.isFeatured && (
                    <span className="px-4 py-2 bg-gradient-to-r from-yellow-100 to-pink-100 text-yellow-700 text-sm font-bold rounded-2xl border border-yellow-200 shadow-sm">
                      ✨ Featured Event
                    </span>
                  )}
                  <span className={`px-4 py-2 text-sm font-bold rounded-2xl border ${
                    event.status === 'upcoming' ? 'bg-green-100 text-green-800 border-green-200' :
                    event.status === 'ongoing' ? 'bg-purple-100 text-purple-800 border-purple-200' :
                    event.status === 'completed' ? 'bg-gray-100 text-gray-800 border-gray-200' : 'bg-pink-100 text-pink-800 border-pink-200'
                  }`}>
                    {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                  </span>
                </div>
                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-black text-gray-900 mb-6 leading-tight bg-gradient-to-r from-gray-900 via-pink-600 to-purple-600 bg-clip-text">
                  {event.title}
                </h1>
                <p className="text-xl lg:text-2xl text-gray-600 mb-0 leading-relaxed max-w-3xl">
                  {event.shortDescription}
                </p>
              </div>
              
              <div className="flex items-center gap-3 lg:self-start">
                <button
                  onClick={shareEvent}
                  className="group p-4 bg-white/70 hover:bg-white rounded-2xl border border-gray-200 hover:border-pink-300 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1"
                  title="Share event"
                >
                  <ShareIcon className="h-6 w-6 text-gray-700 group-hover:text-pink-500 transition-colors" />
                </button>
                <button className="group p-4 bg-gradient-to-br from-pink-50 to-purple-50 border border-pink-200 hover:border-pink-400 shadow-lg hover:shadow-2xl rounded-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1">
                  <HeartIcon className="h-6 w-6 text-pink-500 group-hover:text-pink-600 transition-colors" />
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
            <div className="lg:col-span-2 space-y-12">
              {/* Hero Image Gallery */}
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
                <div className="relative h-96 lg:h-[500px]">
                  <img
                    src={event.images?.[activeImage] || event.featuredImage || 'https://images.pexels.com/photos/1699156/pexels-photo-1699156.jpeg'}
                    alt={event.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-2xl">
                    {event.images?.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveImage(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-200 ${
                          activeImage === index ? 'bg-white scale-125 shadow-lg' : 'bg-white/60 hover:bg-white'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {event.images && event.images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {event.images.slice(0, 4).map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImage(index)}
                      className={`group relative h-28 lg:h-32 rounded-2xl overflow-hidden border-4 transition-all duration-300 shadow-lg ${
                        activeImage === index 
                          ? 'border-pink-500 ring-4 ring-pink-100/50 shadow-2xl scale-105' 
                          : 'border-transparent hover:border-pink-200 hover:shadow-xl hover:scale-102'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${event.title} ${index + 1}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      {activeImage === index && (
                        <div className="absolute inset-0 bg-gradient-to-t from-pink-500/20 to-transparent" />
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Event Description */}
              <div className="bg-white rounded-3xl shadow-2xl p-10 lg:p-12 border border-gray-100">
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8 flex items-center gap-4">
                  <span className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-2xl text-xl font-black">Details</span>
                </h2>
                <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                  {event.description.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-8 text-lg lg:text-xl text-gray-700">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {/* Organizer Info */}
              <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-3xl p-10 lg:p-12 shadow-xl border border-pink-100">
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8 flex items-center gap-4">
                  <BuildingOffice2Icon className="h-12 w-12 text-purple-500" />
                  Organizer
                </h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">{event.organizer}</h3>
                    <div className="space-y-4">
                      <a 
                        href={`mailto:${event.contactEmail}`}
                        className="flex items-center text-xl text-gray-700 hover:text-purple-600 font-semibold transition-colors p-4 bg-purple-50 rounded-xl hover:bg-purple-100"
                      >
                        <EnvelopeIcon className="h-6 w-6 mr-4 text-purple-500" />
                        {event.contactEmail}
                      </a>
                      <a 
                        href={`tel:${event.contactPhone}`}
                        className="flex items-center text-xl text-gray-700 hover:text-pink-600 font-semibold transition-colors p-4 bg-pink-50 rounded-xl hover:bg-pink-100"
                      >
                        <PhoneIcon className="h-6 w-6 mr-4 text-pink-500" />
                        {event.contactPhone}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar - Event Info & Actions */}
            <div className="lg:sticky lg:top-24 h-fit space-y-8">
              <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-10 border border-gray-100">
                <h3 className="text-3xl font-bold text-gray-900 mb-8 bg-gradient-to-r from-gray-900 to-pink-600 bg-clip-text">
                  Quick Info
                </h3>

                <div className="space-y-6 mb-10">
                  <div className="group p-6 bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl border border-pink-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className="flex items-start space-x-4 mb-2">
                      <div className="p-3 bg-pink-500 rounded-2xl shadow-lg">
                        <CalendarDaysIcon className="h-7 w-7 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-500 uppercase tracking-wide">Date</p>
                        <p className="text-2xl font-bold text-gray-900 leading-tight">{formattedDate}</p>
                      </div>
                    </div>
                  </div>

                  <div className="group p-6 bg-gradient-to-r from-purple-50 to-sky-50 rounded-2xl border border-purple-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className="flex items-start space-x-4 mb-2">
                      <div className="p-3 bg-purple-500 rounded-2xl shadow-lg">
                        <ClockIcon className="h-7 w-7 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-500 uppercase tracking-wide">Time</p>
                        <p className="text-2xl font-bold text-gray-900 leading-tight">{event.time}</p>
                      </div>
                    </div>
                  </div>

                  <div className="group p-6 bg-gradient-to-r from-sky-50 to-blue-50 rounded-2xl border border-sky-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className="flex items-start space-x-4 mb-2">
                      <div className="p-3 bg-sky-500 rounded-2xl shadow-lg">
                        <MapPinIcon className="h-7 w-7 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-500 uppercase tracking-wide">Venue</p>
                        <p className="text-xl font-bold text-gray-900 mb-1">{event.venue}</p>
                        <p className="text-lg text-gray-700">{event.location}</p>
                      </div>
                    </div>
                  </div>

                  <div className="group p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl border border-yellow-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className="flex items-start space-x-4 mb-2">
                      <div className="p-3 bg-yellow-500 rounded-2xl shadow-lg">
                        <UserGroupIcon className="h-7 w-7 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-500 uppercase tracking-wide">Availability</p>
                        <div className="space-y-2">
                          <div className="flex justify-between text-lg mb-2">
                            <span className="font-bold text-green-600">{availableSeats} seats left</span>
                            <span className="font-bold text-gray-600">{occupancyRate}% booked</span>
                          </div>
                          <div className="h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                            <div 
                              className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-pink-500 shadow-lg"
                              style={{ width: `${occupancyRate}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Price & What's Included */}
                <div className="bg-gradient-to-br from-yellow-400 via-pink-400 to-purple-500 text-white rounded-3xl p-10 mb-10 shadow-2xl text-center">
                  <div className="text-5xl lg:text-6xl font-black mb-4 drop-shadow-lg">
                    AED {event.price}
                  </div>
                  <p className="text-xl opacity-95 mb-8">Per person</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center justify-center gap-2 p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                      <CheckBadgeIcon className="h-5 w-5" />
                      All sessions included
                    </div>
                    <div className="flex items-center justify-center gap-2 p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                      <CheckBadgeIcon className="h-5 w-5" />
                      Networking access
                    </div>
                    <div className="flex items-center justify-center gap-2 p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                      <CheckBadgeIcon className="h-5 w-5" />
                      Refreshments
                    </div>
                    <div className="flex items-center justify-center gap-2 p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                      <CheckBadgeIcon className="h-5 w-5" />
                      Event materials
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-4">
                  <button
                    onClick={() => setShowReservationModal(true)}
                    className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-sky-500 hover:from-pink-600 hover:via-purple-600 hover:to-sky-600 text-white font-black py-5 px-8 rounded-3xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-300 text-xl flex items-center justify-center gap-3"
                  >
                    <TicketIcon className="h-7 w-7" />
                    🎉 Reserve Your Spot Now
                  </button>
                  <button
                    onClick={() => setShowGuestListModal(true)}
                    className="w-full bg-white border-2 border-pink-300 hover:border-purple-400 text-pink-600 hover:text-purple-600 font-bold py-4 px-8 rounded-2xl shadow-xl hover:shadow-2xl hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 transition-all duration-300 text-lg flex items-center justify-center gap-3"
                  >
                    👥 Join Guest List
                  </button>
                </div>

                <div className="mt-10 pt-8 border-t border-gray-200 text-center">
                  <p className="text-lg text-gray-600 mb-2">
                    Need help? Call us directly:
                  </p>
                  <a 
                    href={`tel:${event.contactPhone}`} 
                    className="inline-flex items-center text-xl font-bold text-pink-600 hover:text-pink-700 transition-colors gap-2"
                  >
                    📞 {event.contactPhone}
                  </a>
                </div>
              </div>

              {/* Tags */}
              <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-3xl p-8 shadow-lg border border-pink-100">
                <h4 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="w-2 h-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full animate-pulse"></span>
                  Event Tags
                </h4>
                <div className="flex flex-wrap gap-3">
                  {event.tags?.map((tag, index) => (
                    <span 
                      key={index}
                      className="px-6 py-3 bg-white text-gray-700 font-semibold rounded-2xl border border-gray-200 hover:border-pink-300 hover:shadow-md transition-all duration-200 text-sm shadow-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showReservationModal && (
        <ReservationModal
          event={event}
          onClose={() => setShowReservationModal(false)}
        />
      )}

      {showGuestListModal && (
        <GuestListModal
          event={event}
          onClose={() => setShowGuestListModal(false)}
        />
      )}
    </>
  );
};

export default EventDetail;
