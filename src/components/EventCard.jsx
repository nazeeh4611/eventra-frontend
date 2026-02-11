import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPinIcon, 
  CalendarDaysIcon,
  UsersIcon
} from '@heroicons/react/24/outline';
import ReservationModal from './ReservationModal';
import GuestListModal from './GuestListModal';

const EventCard = ({ event, isHomePage = false }) => {
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [showGuestListModal, setShowGuestListModal] = useState(false);
  const navigate = useNavigate();

  const availableSeats = event.capacity - event.bookedSeats;
  const date = new Date(event.date);

  const handleCardClick = (e) => {
    if (!e.target.closest('button') && !e.target.closest('a')) {
      navigate(`/events/${event._id}`);
    }
  };

  const handleDetailsClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/events/${event._id}`);
  };

  // HOMEPAGE - Small on mobile/tablet, normal on desktop
  if (isHomePage) {
    return (
      <>
        <div 
          onClick={handleCardClick}
          className="group relative block bg-gradient-to-br from-purple-900/40 via-indigo-900/40 to-purple-800/40 backdrop-blur-sm border border-purple-500/20 hover:border-purple-400/50 rounded-lg overflow-hidden cursor-pointer transition-all duration-300"
        >
          {/* Event Image - Smaller on mobile, normal on desktop */}
          <div className="relative h-32 md:h-48 w-full overflow-hidden">
            <img
              src={event.featuredImage || event.image}
              alt={event.title}
              className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
          </div>

          {/* Content - Small on mobile, normal on desktop */}
          <div className="p-2.5 md:p-4">
            {/* Date & Price Row */}
            <div className="flex justify-between items-center mb-1.5 md:mb-2">
              <span className="text-[10px] md:text-sm text-gray-400">
                {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
              <span className="text-xs md:text-base font-bold text-white">
                AED {event.price}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-xs md:text-lg font-bold text-white mb-1.5 md:mb-2 line-clamp-1 md:line-clamp-2">
              {event.title}
            </h3>

            {/* Venue */}
            <div className="flex items-center gap-1 text-gray-400 mb-1.5 md:mb-2">
              <MapPinIcon className="h-2.5 w-2.5 md:h-4 md:w-4" />
              <span className="text-[10px] md:text-sm truncate max-w-[140px] md:max-w-[200px]">
                {event.venue}
              </span>
            </div>

            {/* Seats */}
            <div className="flex items-center gap-1 text-gray-400 mb-2.5 md:mb-4">
              <UsersIcon className="h-2.5 w-2.5 md:h-4 md:w-4" />
              <span className="text-[10px] md:text-sm">
                {availableSeats} seats
              </span>
            </div>

            {/* Two Action Buttons */}
            <div className="grid grid-cols-2 gap-1.5 md:gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowReservationModal(true);
                }}
                className="py-1.5 md:py-2.5 px-1 bg-white/10 backdrop-blur-md border border-white/30 text-white text-[10px] md:text-sm font-medium rounded hover:bg-white/20 transition-all duration-300"
              >
                Book
              </button>
              <button
                onClick={handleDetailsClick}
                className="py-1.5 md:py-2.5 px-1 bg-white/10 backdrop-blur-md border border-white/30 text-white text-[10px] md:text-sm font-medium rounded hover:bg-white/20 transition-all duration-300"
              >
                Details
              </button>
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
      </>
    );
  }

  // EVENTS PAGE - Responsive, normal on desktop
  return (
    <>
      <div 
        onClick={handleCardClick}
        className="group relative block bg-gradient-to-br from-purple-900/40 via-indigo-900/40 to-purple-800/40 backdrop-blur-sm border border-purple-500/20 hover:border-purple-400/50 rounded-xl overflow-hidden cursor-pointer transition-all duration-300"
      >
        {/* Event Image - Responsive height */}
        <div className="relative h-40 md:h-56 w-full overflow-hidden">
          <img
            src={event.featuredImage || event.image}
            alt={event.title}
            className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
          
          {/* Featured Badge */}
          {event.isFeatured && (
            <div className="absolute top-2 left-2 md:top-3 md:left-3">
              <span className="px-2 py-1 md:px-3 md:py-1.5 bg-white/20 backdrop-blur-md border border-white/30 rounded-lg text-white text-[10px] md:text-xs font-semibold">
                FEATURED
              </span>
            </div>
          )}
        </div>

        {/* Content - Responsive padding and text */}
        <div className="p-3 md:p-5">
          {/* Date & Price Row */}
          <div className="flex justify-between items-center mb-2 md:mb-3">
            <span className="text-xs md:text-base text-gray-400">
              {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            <span className="text-sm md:text-lg font-bold text-white">
              AED {event.price}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-base md:text-xl font-bold text-white mb-2 md:mb-3 line-clamp-2">
            {event.title}
          </h3>

          {/* Category */}
          <span className="inline-block px-2 py-1 md:px-3 md:py-1.5 rounded-full text-[10px] md:text-xs font-medium bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 mb-2 md:mb-3">
            {event.category}
          </span>

          {/* Venue */}
          <div className="flex items-center gap-1 text-gray-400 mb-1 md:mb-2">
            <MapPinIcon className="h-3.5 w-3.5 md:h-5 md:w-5" />
            <span className="text-xs md:text-base truncate">
              {event.venue}
            </span>
          </div>

          {/* Time */}
          <div className="flex items-center gap-1 text-gray-400 mb-2 md:mb-3">
            <CalendarDaysIcon className="h-3.5 w-3.5 md:h-5 md:w-5" />
            <span className="text-xs md:text-base">
              {event.time}
            </span>
          </div>

          {/* Seats Available */}
          <div className="flex items-center gap-1 text-gray-400 mb-3 md:mb-4">
            <UsersIcon className="h-3.5 w-3.5 md:h-5 md:w-5" />
            <span className="text-xs md:text-base">
              {availableSeats} seats available
            </span>
          </div>

          {/* Three Action Buttons */}
          <div className="grid grid-cols-3 gap-1.5 md:gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowReservationModal(true);
              }}
              className="py-2 md:py-3 px-1 bg-white/10 backdrop-blur-md border border-white/30 text-white text-[10px] md:text-sm font-medium rounded-lg hover:bg-white/20 transition-all duration-300"
            >
              Book
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowGuestListModal(true);
              }}
              className="py-2 md:py-3 px-1 bg-white/10 backdrop-blur-md border border-white/30 text-white text-[10px] md:text-sm font-medium rounded-lg hover:bg-white/20 transition-all duration-300"
            >
              Guest
            </button>
            <button
              onClick={handleDetailsClick}
              className="py-2 md:py-3 px-1 bg-white/10 backdrop-blur-md border border-white/30 text-white text-[10px] md:text-sm font-medium rounded-lg hover:bg-white/20 transition-all duration-300"
            >
              Details
            </button>
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
    </>
  );
};

export default EventCard;