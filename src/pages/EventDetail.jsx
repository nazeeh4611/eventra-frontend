import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  MapPinIcon, 
  CalendarDaysIcon, 
  ClockIcon,
  UserGroupIcon,
  TicketIcon,
  ArrowLeftIcon,
  ShareIcon,
  HeartIcon,
  CheckBadgeIcon,
  BuildingOffice2Icon,
  PhoneIcon,
  EnvelopeIcon,
  StarIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import axios from 'axios';
import toast from 'react-hot-toast';
import ReservationModal from '../components/ReservationModal';
import GuestListModal from '../components/GuestListModal';
import baseurl from '../Base/base';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [showGuestListModal, setShowGuestListModal] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // Fetch event details with error handling
  const fetchEventDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${baseurl}/events/${id}`);
      setEvent(response.data.event);
      
      // Check if event is favorited (from localStorage)
      const favorites = JSON.parse(localStorage.getItem('favoriteEvents') || '[]');
      setIsFavorited(favorites.includes(id));
    } catch (error) {
      setError(error.response?.status === 404 ? 'notFound' : 'serverError');
      toast.error('Failed to load event details');
      console.error('Error fetching event:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchEventDetails();
    
    // Scroll to top on mount
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [fetchEventDetails]);

  // Memoized date calculations
  const dateInfo = useMemo(() => {
    if (!event?.date) return null;
    
    const date = new Date(event.date);
    return {
      day: date.toLocaleDateString('en-US', { day: '2-digit' }),
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      weekday: date.toLocaleDateString('en-US', { weekday: 'short' }),
      formatted: date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      isPast: date < new Date()
    };
  }, [event?.date]);

  // Memoized capacity calculations
  const capacityInfo = useMemo(() => {
    if (!event) return null;
    
    const availableSeats = event.capacity - event.bookedSeats;
    const occupancyRate = Math.round((event.bookedSeats / event.capacity) * 100);
    const isAlmostFull = occupancyRate >= 80;
    const isSoldOut = availableSeats <= 0;
    
    return { availableSeats, occupancyRate, isAlmostFull, isSoldOut };
  }, [event]);

  // Share event functionality
  const shareEvent = useCallback(async () => {
    const shareData = {
      title: event.title,
      text: event.shortDescription,
      url: window.location.href,
    };

    try {
      if (navigator.share && navigator.canShare?.(shareData)) {
        await navigator.share(shareData);
        toast.success('Event shared successfully!');
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error sharing:', error);
        toast.error('Failed to share event');
      }
    }
  }, [event]);

  // Toggle favorite
  const toggleFavorite = useCallback(() => {
    const favorites = JSON.parse(localStorage.getItem('favoriteEvents') || '[]');
    let newFavorites;
    
    if (isFavorited) {
      newFavorites = favorites.filter(fav => fav !== id);
      toast.success('Removed from favorites');
    } else {
      newFavorites = [...favorites, id];
      toast.success('Added to favorites');
    }
    
    localStorage.setItem('favoriteEvents', JSON.stringify(newFavorites));
    setIsFavorited(!isFavorited);
  }, [isFavorited, id]);

  // Handle image navigation with keyboard
  const handleImageNavigation = useCallback((direction) => {
    if (!event?.images?.length) return;
    
    setActiveImage(prev => {
      if (direction === 'next') {
        return (prev + 1) % event.images.length;
      }
      return prev === 0 ? event.images.length - 1 : prev - 1;
    });
  }, [event?.images?.length]);

  // Keyboard navigation for images
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (showReservationModal || showGuestListModal) return;
      
      if (e.key === 'ArrowLeft') handleImageNavigation('prev');
      if (e.key === 'ArrowRight') handleImageNavigation('next');
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleImageNavigation, showReservationModal, showGuestListModal]);

  // Handle reservation button click
  const handleReservation = useCallback(() => {
    if (capacityInfo?.isSoldOut) {
      toast.error('Sorry, this event is sold out');
      return;
    }
    if (dateInfo?.isPast) {
      toast.error('This event has already passed');
      return;
    }
    setShowReservationModal(true);
  }, [capacityInfo?.isSoldOut, dateInfo?.isPast]);

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="min-h-screen bg-gray-950">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
        <div className="animate-pulse space-y-12">
          <div className="flex items-center justify-between">
            <div className="h-10 bg-purple-900/40 rounded-xl w-48"></div>
            <div className="flex gap-2">
              <div className="h-12 w-12 bg-purple-900/40 rounded-2xl"></div>
              <div className="h-12 w-12 bg-purple-900/40 rounded-2xl"></div>
            </div>
          </div>
          <div className="h-96 bg-gradient-to-br from-purple-900/40 via-indigo-900/40 to-purple-800/40 rounded-3xl"></div>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="space-y-3">
                <div className="h-8 bg-purple-900/40 rounded-xl w-3/4"></div>
                <div className="h-6 bg-purple-900/40 rounded w-1/2"></div>
              </div>
              <div className="h-64 bg-gradient-to-br from-purple-900/40 via-indigo-900/40 to-purple-800/40 rounded-2xl"></div>
            </div>
            <div className="space-y-6">
              <div className="h-80 bg-gradient-to-br from-purple-900/40 via-indigo-900/40 to-purple-800/40 rounded-3xl"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Error state component
  const ErrorState = ({ type }) => {
    const isNotFound = type === 'notFound';
    
    return (
      <div className="min-h-screen bg-gray-950">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
          <div className="relative rounded-3xl bg-gradient-to-br from-purple-900/40 via-indigo-900/40 to-purple-800/40 backdrop-blur-sm border border-purple-500/20 p-12 lg:p-16 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-pink-600/10 to-purple-600/10" />
            
            <div className="relative">
              <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50 mb-8">
                {isNotFound ? (
                  <CalendarDaysIcon className="h-10 w-10 md:h-12 md:w-12" />
                ) : (
                  <ExclamationTriangleIcon className="h-10 w-10 md:h-12 md:w-12" />
                )}
              </div>
              <h3 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-white mb-6">
                {isNotFound ? 'Event Not Found' : 'Something Went Wrong'}
              </h3>
              <p className="text-xl text-gray-400 mb-10 leading-relaxed max-w-md mx-auto">
                {isNotFound 
                  ? "The event you're looking for doesn't exist or has been removed."
                  : "We couldn't load the event details. Please try again."}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {!isNotFound && (
                  <button
                    onClick={fetchEventDetails}
                    className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/60 transition-all duration-300 hover:scale-105"
                  >
                    Try Again
                  </button>
                )}
                <Link 
                  to="/events" 
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/60 transition-all duration-300 hover:scale-105"
                >
                  <ArrowLeftIcon className="h-5 w-5" />
                  Browse All Events
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render loading state
  if (loading) return <LoadingSkeleton />;

  // Render error state
  if (error) return <ErrorState type={error} />;

  // Render not found state
  if (!event) return <ErrorState type="notFound" />;

  const images = event.images || [event.featuredImage || event.image || 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg'];

  return (
    <>
      <div className="min-h-screen bg-gray-950">
        {/* Background effects */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse delay-500" />
        </div>

        <div className="relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
            {/* Header Section */}
            <div className="mb-8 lg:mb-12">
              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center text-purple-300 hover:text-purple-200 font-semibold mb-6 lg:mb-8 px-4 py-2 rounded-2xl bg-gradient-to-br from-purple-900/20 via-indigo-900/20 to-purple-800/20 backdrop-blur-sm border border-purple-500/20 hover:border-purple-400/50 transition-all duration-300"
                aria-label="Go back"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Back
              </button>
              
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div className="flex-1">
                  {/* Tags and Status */}
                  <div className="flex flex-wrap items-center gap-3 mb-6">
                    <span className="px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 text-purple-300">
                      {event.category}
                    </span>
                    {event.isFeatured && (
                      <span className="px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg shadow-pink-500/50 flex items-center gap-1">
                        <StarIcon className="h-3.5 w-3.5" />
                        Featured
                      </span>
                    )}
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${
                      event.status === 'upcoming' ? 'bg-green-500/20 text-green-300 border-green-500/30' : 
                      event.status === 'ongoing' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' : 
                      event.status === 'completed' ? 'bg-gray-500/20 text-gray-300 border-gray-500/30' : 
                      'bg-pink-500/20 text-pink-300 border-pink-500/30'
                    }`}>
                      {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                    </span>
                    {capacityInfo?.isAlmostFull && !capacityInfo?.isSoldOut && (
                      <span className="px-4 py-2 rounded-full text-sm font-semibold bg-orange-500/20 text-orange-300 border-orange-500/30 animate-pulse">
                        Almost Full!
                      </span>
                    )}
                    {capacityInfo?.isSoldOut && (
                      <span className="px-4 py-2 rounded-full text-sm font-semibold bg-red-500/20 text-red-300 border-red-500/30">
                        Sold Out
                      </span>
                    )}
                  </div>

                  {/* Title and Description */}
                  <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-white mb-4 leading-tight">
                    {event.title}
                  </h1>
                  <p className="text-lg lg:text-xl text-gray-300 leading-relaxed max-w-3xl">
                    {event.shortDescription}
                  </p>
                </div>
                
                {/* Action Buttons */}
                <div className="flex items-center gap-3 lg:self-start">
                  <button
                    onClick={shareEvent}
                    className="group p-3 rounded-2xl bg-gradient-to-br from-purple-900/40 via-indigo-900/40 to-purple-800/40 backdrop-blur-sm border border-purple-500/20 hover:border-purple-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20"
                    title="Share event"
                    aria-label="Share event"
                  >
                    <ShareIcon className="h-6 w-6 text-gray-400 group-hover:text-purple-300 transition-colors" />
                  </button>
                  <button 
                    onClick={toggleFavorite}
                    className="group p-3 rounded-2xl bg-gradient-to-br from-purple-600/20 via-pink-600/20 to-purple-600/20 border border-pink-500/30 hover:border-pink-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-pink-500/20"
                    title={isFavorited ? "Remove from favorites" : "Add to favorites"}
                    aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
                  >
                    {isFavorited ? (
                      <HeartIconSolid className="h-6 w-6 text-pink-400 transition-colors" />
                    ) : (
                      <HeartIcon className="h-6 w-6 text-pink-400 group-hover:text-pink-300 transition-colors" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
              {/* Left Column - Images and Details */}
              <div className="lg:col-span-2 space-y-8">
                {/* Hero Image Gallery */}
                <div className="relative rounded-3xl bg-gradient-to-br from-purple-900/40 via-indigo-900/40 to-purple-800/40 backdrop-blur-sm border border-purple-500/20 overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-pink-600/10 to-purple-600/10" />
                  
                  <div className="relative h-80 lg:h-[450px]">
                    {imageLoading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                    <img
                      src={images[activeImage]}
                      alt={`${event.title} - Image ${activeImage + 1}`}
                      className="w-full h-full object-cover transition-opacity duration-500"
                      onLoad={() => setImageLoading(false)}
                      onError={(e) => {
                        e.target.src = 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg';
                        setImageLoading(false);
                      }}
                      loading="eager"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/30 to-transparent" />
                    
                    {/* Date Badge */}
                    <div className="absolute top-4 left-4 flex flex-col items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 p-3 shadow-lg shadow-purple-500/50">
                      <span className="text-xs font-medium text-purple-100">{dateInfo?.weekday}</span>
                      <span className="text-2xl font-bold text-white leading-none">{dateInfo?.day}</span>
                      <span className="text-xs font-medium text-purple-100">{dateInfo?.month}</span>
                    </div>
                    
                    {/* Navigation Arrows for Desktop */}
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={() => handleImageNavigation('prev')}
                          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 backdrop-blur-sm text-white opacity-0 group-hover:opacity-100 hover:bg-black/70 transition-all duration-300"
                          aria-label="Previous image"
                        >
                          <ArrowLeftIcon className="h-6 w-6" />
                        </button>
                        <button
                          onClick={() => handleImageNavigation('next')}
                          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 backdrop-blur-sm text-white opacity-0 group-hover:opacity-100 hover:bg-black/70 transition-all duration-300"
                          aria-label="Next image"
                        >
                          <ArrowLeftIcon className="h-6 w-6 rotate-180" />
                        </button>
                      </>
                    )}
                    
                    {/* Image Indicators */}
                    {images.length > 1 && (
                      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-2xl">
                        {images.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setActiveImage(index)}
                            className={`w-3 h-3 rounded-full transition-all duration-200 ${
                              activeImage === index ? 'bg-white scale-125 shadow-lg' : 'bg-white/60 hover:bg-white'
                            }`}
                            aria-label={`View image ${index + 1}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Thumbnail Gallery */}
                {images.length > 1 && (
                  <div className="grid grid-cols-4 gap-3">
                    {images.slice(0, 4).map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveImage(index)}
                        className={`group relative h-24 lg:h-28 rounded-2xl overflow-hidden border-4 transition-all duration-300 ${
                          activeImage === index 
                            ? 'border-purple-400 ring-4 ring-purple-500/20 shadow-2xl scale-105' 
                            : 'border-transparent hover:border-purple-300 hover:shadow-xl'
                        }`}
                        aria-label={`View image ${index + 1}`}
                      >
                        <img
                          src={img}
                          alt={`${event.title} thumbnail ${index + 1}`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        {activeImage === index && (
                          <div className="absolute inset-0 bg-gradient-to-t from-purple-600/20 to-transparent" />
                        )}
                      </button>
                    ))}
                  </div>
                )}

                {/* Event Description */}
                <div className="relative rounded-3xl bg-gradient-to-br from-purple-900/40 via-indigo-900/40 to-purple-800/40 backdrop-blur-sm border border-purple-500/20 p-6 lg:p-10 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-pink-600/10 to-purple-600/10" />
                  
                  <div className="relative">
                    <h2 className="text-2xl lg:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-white mb-6">
                      About This Event
                    </h2>
                    <div className="text-gray-300 leading-relaxed space-y-4">
                      {event.description.split('\n').filter(p => p.trim()).map((paragraph, index) => (
                        <p key={index} className="text-base lg:text-lg">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Organizer Info */}
                <div className="relative rounded-3xl bg-gradient-to-br from-purple-900/40 via-indigo-900/40 to-purple-800/40 backdrop-blur-sm border border-purple-500/20 p-6 lg:p-10 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-pink-600/10 to-purple-600/10" />
                  
                  <div className="relative">
                    <h2 className="text-2xl lg:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-white mb-6 flex items-center gap-3">
                      <BuildingOffice2Icon className="h-8 w-8 text-purple-400" />
                      Organized By
                    </h2>
                    <div className="space-y-4">
                      <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-900/20 via-indigo-900/20 to-purple-800/20 border border-purple-500/30">
                        <h3 className="text-xl font-bold text-white mb-5">{event.organizer}</h3>
                        <div className="space-y-3">
                          <a 
                            href={`mailto:${event.contactEmail}`}
                            className="flex items-center text-base lg:text-lg text-purple-300 hover:text-purple-200 font-semibold transition-colors p-3 rounded-xl bg-gradient-to-r from-purple-900/20 to-pink-900/20 hover:from-purple-900/30 hover:to-pink-900/30"
                          >
                            <EnvelopeIcon className="h-5 w-5 mr-3 text-purple-400 flex-shrink-0" />
                            <span className="truncate">{event.contactEmail}</span>
                          </a>
                          <a 
                            href={`tel:${event.contactPhone}`}
                            className="flex items-center text-base lg:text-lg text-purple-300 hover:text-purple-200 font-semibold transition-colors p-3 rounded-xl bg-gradient-to-r from-purple-900/20 to-pink-900/20 hover:from-purple-900/30 hover:to-pink-900/30"
                          >
                            <PhoneIcon className="h-5 w-5 mr-3 text-purple-400 flex-shrink-0" />
                            {event.contactPhone}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Booking Card */}
              <div className="lg:sticky lg:top-24 h-fit space-y-6">
                <div className="relative rounded-3xl bg-gradient-to-br from-purple-900/40 via-indigo-900/40 to-purple-800/40 backdrop-blur-sm border border-purple-500/20 p-6 lg:p-8 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-pink-600/10 to-purple-600/10" />
                  
                  <div className="relative">
                    <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-white mb-6">
                      Event Details
                    </h3>

                    <div className="space-y-4 mb-8">
                      {/* Date */}
                      <div className="group p-4 rounded-2xl bg-gradient-to-br from-purple-900/20 via-indigo-900/20 to-purple-800/20 border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300">
                        <div className="flex items-start space-x-3">
                          <div className="p-2 rounded-xl bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30">
                            <CalendarDaysIcon className="h-5 w-5 text-purple-300" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Date</p>
                            <p className="text-base font-bold text-white leading-tight">{dateInfo?.formatted}</p>
                          </div>
                        </div>
                      </div>

                      {/* Time */}
                      <div className="group p-4 rounded-2xl bg-gradient-to-br from-purple-900/20 via-indigo-900/20 to-purple-800/20 border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300">
                        <div className="flex items-start space-x-3">
                          <div className="p-2 rounded-xl bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30">
                            <ClockIcon className="h-5 w-5 text-purple-300" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Time</p>
                            <p className="text-base font-bold text-white leading-tight">{event.time}</p>
                          </div>
                        </div>
                      </div>

                      {/* Location */}
                      <div className="group p-4 rounded-2xl bg-gradient-to-br from-purple-900/20 via-indigo-900/20 to-purple-800/20 border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300">
                        <div className="flex items-start space-x-3">
                          <div className="p-2 rounded-xl bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30">
                            <MapPinIcon className="h-5 w-5 text-purple-300" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Venue</p>
                            <p className="text-base font-bold text-white mb-1">{event.venue}</p>
                            <p className="text-sm text-gray-300">{event.location}</p>
                          </div>
                        </div>
                      </div>

                      {/* Capacity */}
                      <div className="group p-4 rounded-2xl bg-gradient-to-br from-purple-900/20 via-indigo-900/20 to-purple-800/20 border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300">
                        <div className="flex items-start space-x-3">
                          <div className="p-2 rounded-xl bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30">
                            <UserGroupIcon className="h-5 w-5 text-purple-300" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Availability</p>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className={`font-bold ${capacityInfo?.isSoldOut ? 'text-red-400' : 'text-green-400'}`}>
                                  {capacityInfo?.isSoldOut ? 'Sold Out' : `${capacityInfo?.availableSeats} seats left`}
                                </span>
                                <span className="font-bold text-gray-300">{capacityInfo?.occupancyRate}% booked</span>
                              </div>
                              <div className="h-2 rounded-full overflow-hidden shadow-inner bg-gray-800/50">
                                <div 
                                  className={`h-full transition-all duration-500 ${
                                    capacityInfo?.isSoldOut ? 'bg-gradient-to-r from-red-500 to-pink-500' :
                                    capacityInfo?.isAlmostFull ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                                    'bg-gradient-to-r from-green-500 to-emerald-500'
                                  }`}
                                  style={{ width: `${capacityInfo?.occupancyRate}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Price Card */}
                    <div className="relative rounded-3xl bg-gradient-to-br from-purple-600 via-pink-600 to-purple-500 text-white p-8 mb-8 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/80 via-pink-600/80 to-purple-500/80" />
                      
                      <div className="relative">
                        <div className="text-4xl lg:text-5xl font-black mb-3 drop-shadow-lg">
                          AED {event.price}
                        </div>
                        <p className="text-lg opacity-95 mb-6">Per person</p>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center gap-2 p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                            <CheckBadgeIcon className="h-4 w-4 flex-shrink-0" />
                            <span className="text-xs">All sessions</span>
                          </div>
                          <div className="flex items-center gap-2 p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                            <CheckBadgeIcon className="h-4 w-4 flex-shrink-0" />
                            <span className="text-xs">Networking</span>
                          </div>
                          <div className="flex items-center gap-2 p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                            <CheckBadgeIcon className="h-4 w-4 flex-shrink-0" />
                            <span className="text-xs">Refreshments</span>
                          </div>
                          <div className="flex items-center gap-2 p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                            <CheckBadgeIcon className="h-4 w-4 flex-shrink-0" />
                            <span className="text-xs">Materials</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                      <button
                        onClick={handleReservation}
                        disabled={capacityInfo?.isSoldOut || dateInfo?.isPast}
                        className={`w-full group relative inline-flex items-center justify-center gap-2 rounded-full px-6 py-4 text-base font-semibold text-white transition-all duration-300 ${
                          capacityInfo?.isSoldOut || dateInfo?.isPast
                            ? 'bg-gray-600 cursor-not-allowed opacity-50'
                            : 'bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/60 hover:scale-105'
                        }`}
                      >
                        <TicketIcon className="h-5 w-5" />
                        {capacityInfo?.isSoldOut ? 'Sold Out' : dateInfo?.isPast ? 'Event Passed' : 'Reserve Your Spot'}
                        {!capacityInfo?.isSoldOut && !dateInfo?.isPast && (
                          <svg className="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        )}
                      </button>
                      <button
                        onClick={() => setShowGuestListModal(true)}
                        className="w-full py-3 px-6 border-2 border-purple-500/30 text-purple-300 font-semibold rounded-2xl hover:border-purple-400/50 hover:bg-white/5 transition-all duration-300 flex items-center justify-center gap-2 text-sm"
                      >
                        <UserGroupIcon className="h-5 w-5" />
                        Join Guest List
                      </button>
                    </div>

                    {/* Contact Info */}
                    <div className="mt-8 pt-6 border-t border-purple-500/20 text-center">
                      <p className="text-sm text-gray-400 mb-2">
                        Questions? Contact us:
                      </p>
                      <a 
                        href={`tel:${event.contactPhone}`} 
                        className="inline-flex items-center text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-300 hover:to-pink-300 transition-all duration-300 gap-2"
                      >
                        <PhoneIcon className="h-5 w-5 text-purple-400" />
                        {event.contactPhone}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                {event.tags && event.tags.length > 0 && (
                  <div className="relative rounded-3xl bg-gradient-to-br from-purple-900/40 via-indigo-900/40 to-purple-800/40 backdrop-blur-sm border border-purple-500/20 p-6 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-pink-600/10 to-purple-600/10" />
                    
                    <div className="relative">
                      <h4 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-white mb-4">
                        Tags
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {event.tags.map((tag, index) => (
                          <span 
                            key={index}
                            className="px-3 py-1.5 rounded-xl bg-gradient-to-br from-purple-900/20 via-indigo-900/20 to-purple-800/20 border border-purple-500/30 text-purple-300 font-semibold hover:border-purple-400/50 transition-all duration-200 text-sm"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modals */}
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
      </div>
    </>
  );
};

export default EventDetail;