import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  MapPinIcon, 
  CalendarDaysIcon, 
  ClockIcon,
  TicketIcon,
  StarIcon,
  UserGroupIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import ReservationModal from './ReservationModal';
import GuestListModal from './GuestListModal';

const EventCard = ({ event }) => {
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

  return (
    <>
      <div 
        onClick={handleCardClick}
        className="group relative block overflow-hidden rounded-2xl bg-gradient-to-br from-purple-900/40 via-indigo-900/40 to-purple-800/40 backdrop-blur-sm border border-purple-500/20 hover:border-purple-400/50 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20 cursor-pointer"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 via-pink-600/0 to-purple-600/0 group-hover:from-purple-600/10 group-hover:via-pink-600/10 group-hover:to-purple-600/10 transition-all duration-500" />
        
        <div className="relative h-48 sm:h-52 md:h-60 overflow-hidden">
          <img
            src={event.featuredImage || event.image}
            alt={event.title}
            className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
          
          <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="px-2 py-1 bg-black/50 backdrop-blur-sm rounded-lg text-white text-xs font-semibold">
                {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
              {event.isFeatured && (
                <div className="px-2 py-1 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg text-white text-xs font-semibold">
                  Featured
                </div>
              )}
            </div>
          </div>

          <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 right-2 sm:right-3 flex justify-between items-center">
            <span className="px-2 py-1 bg-black/50 backdrop-blur-sm rounded-lg text-white text-xs sm:text-sm font-bold">
              AED {event.price}
            </span>
            <div className="flex items-center gap-1 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-lg text-white text-xs">
              <UserGroupIcon className="h-3.5 w-3.5" />
              <span>{availableSeats}</span>
            </div>
          </div>
        </div>

        <div className="relative p-3 sm:p-4">
          <div className="flex items-start justify-between mb-2 gap-2">
            <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-300 group-hover:to-pink-300 transition-all duration-300 line-clamp-1 flex-1">
              {event.title}
            </h3>
            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-purple-300 whitespace-nowrap flex-shrink-0">
              {event.category}
            </span>
          </div>

          <div className="flex items-center justify-between mb-3 text-xs text-gray-400 gap-2">
            <div className="flex items-center gap-1 flex-shrink-0">
              <CalendarDaysIcon className="h-3.5 w-3.5" />
              <span className="truncate">{event.time}</span>
            </div>
            <div className="flex items-center gap-1 min-w-0">
              <MapPinIcon className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="truncate">{event.venue}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowReservationModal(true);
              }}
              className="py-1.5 sm:py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs sm:text-sm font-semibold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 flex items-center justify-center gap-1"
            >
              <TicketIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Book</span>
              <span className="sm:hidden">Book</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowGuestListModal(true);
              }}
              className="py-1.5 sm:py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs sm:text-sm font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 flex items-center justify-center gap-1"
            >
              <UserGroupIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Guest List</span>
              <span className="sm:hidden">Guests</span>
            </button>
            <button
              onClick={handleDetailsClick}
              className="py-1.5 sm:py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-xs sm:text-sm font-semibold rounded-lg hover:shadow-lg hover:shadow-green-500/50 transition-all duration-300 flex items-center justify-center gap-1"
            >
              <EyeIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Details</span>
              <span className="sm:hidden">View</span>
            </button>
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

export default EventCard;