import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPinIcon,
  CalendarDaysIcon,
  UsersIcon,
  MusicalNoteIcon,
  CurrencyDollarIcon,
  TicketIcon,
  UserGroupIcon,
  EyeIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import ReservationModal from './ReservationModal';
import GuestListModal from './GuestListModal';

const EventCard = ({ event, variant = 'default', isHomePage = false }) => {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [showGuestListModal, setShowGuestListModal] = useState(false);

  const date = new Date(event.date);
  const day = date.toLocaleDateString('en-US', { day: '2-digit' });
  const month = date.toLocaleDateString('en-US', { month: 'short' });
  const weekday = date.toLocaleDateString('en-US', { weekday: 'short' });

  const availableSeats = event.capacity && event.bookedSeats !== undefined
    ? Math.max(event.capacity - event.bookedSeats, 0)
    : null;

  const musicGenres = Array.isArray(event.musicGenres)
    ? event.musicGenres
    : (event.musicGenres || 'BOLLYWOOD, SOUTH, TECHNO').split(',').map(g => g.trim());

  const musicArtists = Array.isArray(event.musicArtists)
    ? event.musicArtists
    : (event.musicArtists || 'ALASANDRA, VIPIN, TORTA').split(',').map(a => a.trim());

  const handleCardClick = (e) => {
    // Prevent card click when clicking on buttons
    if (e.target.closest('button')) {
      return;
    }
    navigate(`/events/${event._id}`);
  };

  const handleBookClick = (e) => {
    e.stopPropagation();
    setShowReservationModal(true);
  };

  const handleGuestClick = (e) => {
    e.stopPropagation();
    setShowGuestListModal(true);
  };

  const handleDetailsClick = (e) => {
    e.stopPropagation();
    navigate(`/events/${event._id}`);
  };

  // Calculate availability status
  const isSoldOut = availableSeats === 0;
  const isAlmostFull = availableSeats !== null && availableSeats <= (event.capacity * 0.2);
  const isAvailable = availableSeats !== null && availableSeats > 0;

  return (
    <>
      <article
        onClick={handleCardClick}
        className={`
          group relative flex flex-col rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer
          bg-gradient-to-b from-[#15151c] via-[#0b0b10] to-[#050509]
          border border-white/5 shadow-[0_8px_20px_rgba(0,0,0,0.6)] 
          sm:shadow-[0_12px_30px_rgba(0,0,0,0.65)] md:shadow-[0_18px_45px_rgba(0,0,0,0.7)]
          transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(124,58,237,0.5)] 
          sm:hover:shadow-[0_25px_60px_rgba(124,58,237,0.55)] md:hover:shadow-[0_30px_80px_rgba(124,58,237,0.6)]
          h-full
        `}
      >
        {/* IMAGE SECTION */}
        <div className="relative">
          <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-purple-900/30 to-pink-900/30">
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-900 via-fuchsia-900 to-black animate-pulse">
                <span className="text-[0.55rem] sm:text-[0.6rem] md:text-xs tracking-widest text-white/60">
                  LOADING
                </span>
              </div>
            )}

            <img
              src={event.featuredImage || event.image || 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg'}
              alt={event.title}
              className={`
                h-full w-full object-cover
                transform transition-transform duration-[900ms] scale-100
                group-hover:scale-[1.08] sm:group-hover:scale-[1.06] md:group-hover:scale-[1.07]
                ${imageLoaded ? 'opacity-100' : 'opacity-0'}
              `}
              onLoad={() => setImageLoaded(true)}
              onError={(e) => {
                e.currentTarget.src = 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg';
                setImageLoaded(true);
              }}
              loading="lazy"
            />

            {/* Gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-transparent to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            {/* DATE PILL - Ultra responsive */}
            <div className="absolute left-2 sm:left-3 md:left-4 top-2 sm:top-3 md:top-4 flex flex-col items-center justify-center 
                          rounded-lg sm:rounded-xl md:rounded-2xl bg-black/80 backdrop-blur-md 
                          px-1.5 sm:px-2 md:px-3 py-1 sm:py-1.5 md:py-2 
                          shadow-lg shadow-black/50 border border-white/10">
              <span className="text-[0.45rem] sm:text-[0.5rem] md:text-[0.55rem] lg:text-[0.65rem] 
                             uppercase tracking-[0.16em] text-gray-300 font-medium">
                {weekday}
              </span>
              <span className="mt-0.5 text-xs sm:text-sm md:text-base lg:text-xl font-bold text-white leading-none">
                {day}
              </span>
              <span className="text-[0.5rem] sm:text-[0.55rem] md:text-[0.6rem] lg:text-[0.7rem] 
                             uppercase tracking-[0.14em] text-purple-300 font-medium">
                {month}
              </span>
            </div>

            {/* STATUS + PRICE BADGE - Responsive */}
            <div className="absolute right-2 sm:right-3 md:right-4 top-2 sm:top-3 md:top-4 flex flex-col items-end gap-1.5 sm:gap-2">
              {event.status && (
                <span
                  className={`
                    inline-flex items-center rounded-full px-1.5 sm:px-2 md:px-2.5 lg:px-3 
                    py-0.5 sm:py-1 md:py-1.5
                    text-[0.5rem] sm:text-[0.55rem] md:text-[0.6rem] lg:text-[0.65rem] font-semibold
                    uppercase tracking-[0.12em] shadow-md shadow-black/50 backdrop-blur-md
                    border border-white/10
                    ${
                      event.status === 'live'
                        ? 'bg-emerald-500/90 text-emerald-50'
                        : event.status === 'upcoming'
                        ? 'bg-purple-500/90 text-purple-50'
                        : 'bg-zinc-800/90 text-zinc-100'
                    }
                  `}
                >
                  ● {event.status}
                </span>
              )}

              {event.price !== undefined && (
                <div className="inline-flex items-center gap-0.5 sm:gap-1 md:gap-1.5 
                              rounded-full bg-black/80 backdrop-blur-md 
                              px-1.5 sm:px-2 md:px-2.5 lg:px-3 py-0.5 sm:py-1 md:py-1.5 
                              shadow-md shadow-black/50 border border-white/10">
                  <CurrencyDollarIcon className="h-2 w-2 sm:h-2.5 sm:w-2.5 md:h-3 md:w-3 lg:h-3.5 lg:w-3.5 text-emerald-400" />
                  <span className="text-[0.55rem] sm:text-[0.6rem] md:text-[0.65rem] lg:text-xs font-semibold text-gray-100">
                    {Number(event.price) === 0 ? 'Free' : `AED ${event.price}`}
                  </span>
                </div>
              )}
            </div>

            {/* AVAILABILITY BADGE - New */}
            {isAvailable && (
              <div className="absolute left-2 sm:left-3 md:left-4 bottom-2 sm:bottom-3 md:bottom-4">
                <div className={`
                  inline-flex items-center gap-1 rounded-full 
                  px-1.5 sm:px-2 md:px-2.5 py-0.5 sm:py-1
                  text-[0.5rem] sm:text-[0.55rem] md:text-[0.6rem] font-medium
                  backdrop-blur-md border shadow-lg
                  ${isAlmostFull 
                    ? 'bg-orange-500/80 border-orange-400/50 text-orange-50' 
                    : 'bg-emerald-500/80 border-emerald-400/50 text-emerald-50'
                  }
                `}>
                  <UsersIcon className="h-2 w-2 sm:h-2.5 sm:w-2.5 md:h-3 md:w-3" />
                  <span>{availableSeats} left</span>
                </div>
              </div>
            )}

            {isSoldOut && (
              <div className="absolute left-2 sm:left-3 md:left-4 bottom-2 sm:bottom-3 md:bottom-4">
                <div className="inline-flex items-center gap-1 rounded-full 
                              bg-red-500/80 backdrop-blur-md px-1.5 sm:px-2 md:px-2.5 py-0.5 sm:py-1
                              border border-red-400/50 text-red-50
                              text-[0.5rem] sm:text-[0.55rem] md:text-[0.6rem] font-medium">
                  <ClockIcon className="h-2 w-2 sm:h-2.5 sm:w-2.5 md:h-3 md:w-3" />
                  <span>Sold Out</span>
                </div>
              </div>
            )}

            {/* GENRES TAGS - Responsive */}
            {musicGenres.length > 0 && (
              <div className="pointer-events-none absolute inset-x-2 sm:inset-x-3 md:inset-x-4 
                            bottom-12 sm:bottom-14 md:bottom-16 flex flex-wrap gap-1">
                {musicGenres.slice(0, 2).map((genre, idx) => (
                  <span
                    key={idx}
                    className="
                      inline-flex items-center rounded-full 
                      bg-gradient-to-r from-purple-600/90 to-pink-600/90 
                      px-1.5 sm:px-2 md:px-2.5 py-0.5 sm:py-1
                      text-[0.45rem] sm:text-[0.5rem] md:text-[0.55rem] lg:text-[0.6rem] 
                      font-semibold uppercase tracking-[0.12em] text-white
                      backdrop-blur-md shadow-lg shadow-black/40 border border-white/20
                    "
                  >
                    {genre}
                  </span>
                ))}
                {musicGenres.length > 2 && (
                  <span className="
                    inline-flex items-center rounded-full 
                    bg-black/60 backdrop-blur-md
                    px-1.5 sm:px-2 py-0.5 sm:py-1
                    text-[0.45rem] sm:text-[0.5rem] md:text-[0.55rem] 
                    font-semibold text-white border border-white/20
                  ">
                    +{musicGenres.length - 2}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* CONTENT SECTION - Optimized spacing */}
        <div className="flex flex-1 flex-col justify-between p-2.5 sm:p-3 md:p-4 lg:p-5 gap-1.5 sm:gap-2 md:gap-2.5">
          {/* TITLE + ARTISTS */}
          <div className="space-y-0.5 sm:space-y-1">
            <h3 className="line-clamp-1 text-sm sm:text-base md:text-lg lg:text-xl font-bold text-white tracking-tight">
              {event.title}
            </h3>
            {musicArtists.length > 0 && (
              <div className="flex items-center gap-1 text-gray-300">
                <MusicalNoteIcon className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-3.5 md:w-3.5 lg:h-4 lg:w-4 text-pink-400 flex-shrink-0" />
                <span className="truncate text-[0.6rem] sm:text-[0.65rem] md:text-xs lg:text-sm font-medium">
                  {musicArtists.join(' • ')}
                </span>
              </div>
            )}
          </div>

          {/* META ROWS - Compact */}
          <div className="space-y-0.5 sm:space-y-1 text-gray-300">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <CalendarDaysIcon className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-3.5 md:w-3.5 lg:h-4 lg:w-4 text-purple-300 flex-shrink-0" />
              <span className="text-[0.55rem] sm:text-[0.6rem] md:text-xs lg:text-sm truncate">
                {date.toLocaleDateString('en-US', {
                  day: '2-digit',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <MapPinIcon className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-3.5 md:w-3.5 lg:h-4 lg:w-4 text-cyan-300 flex-shrink-0" />
              <span className="truncate text-[0.55rem] sm:text-[0.6rem] md:text-xs lg:text-sm">
                {event.venue || event.location || 'Dubai, UAE'}
              </span>
            </div>
          </div>

          {/* ACTION BUTTONS - Modern, responsive grid with proper sizing */}
          <div className="mt-1 sm:mt-2 grid grid-cols-3 gap-1.5 sm:gap-2">
            {/* Book Now Button - Primary */}
            <button
              onClick={handleBookClick}
              disabled={isSoldOut}
              className={`
                group/btn relative flex flex-col xs:flex-row items-center justify-center 
                gap-0.5 xs:gap-1 sm:gap-1.5
                px-1 xs:px-1.5 sm:px-2 py-1.5 sm:py-2
                rounded-lg sm:rounded-xl
                text-[0.55rem] xs:text-[0.6rem] sm:text-xs md:text-sm font-bold
                transition-all duration-200 active:scale-95
                ${isSoldOut 
                  ? 'bg-gray-700/50 text-gray-400 cursor-not-allowed border border-gray-600/50' 
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 border border-purple-400/30'
                }
              `}
            >
              <TicketIcon className="h-3 w-3 xs:h-3.5 xs:w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5" />
              <span className="font-semibold leading-none">Book</span>
              {!isSoldOut && (
                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                </span>
              )}
            </button>

            {/* Guest List Button - Secondary */}
            <button
              onClick={handleGuestClick}
              className="
                group/btn relative flex flex-col xs:flex-row items-center justify-center 
                gap-0.5 xs:gap-1 sm:gap-1.5
                px-1 xs:px-1.5 sm:px-2 py-1.5 sm:py-2
                rounded-lg sm:rounded-xl
                text-[0.55rem] xs:text-[0.6rem] sm:text-xs md:text-sm font-bold
                bg-gradient-to-r from-cyan-600 to-blue-600 
                hover:from-cyan-700 hover:to-blue-700
                text-white shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50
                transition-all duration-200 active:scale-95
                border border-cyan-400/30
              "
            >
              <UserGroupIcon className="h-3 w-3 xs:h-3.5 xs:w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5" />
              <span className="font-semibold leading-none">Guest</span>
            </button>

            {/* Details Button with Eye Icon - Tertiary */}
            <button
              onClick={handleDetailsClick}
              className="
                flex flex-col xs:flex-row items-center justify-center 
                gap-0.5 xs:gap-1 sm:gap-1.5
                px-1 xs:px-1.5 sm:px-2 py-1.5 sm:py-2
                rounded-lg sm:rounded-xl
                text-[0.55rem] xs:text-[0.6rem] sm:text-xs md:text-sm font-bold
                bg-gradient-to-r from-gray-700 to-gray-800
                hover:from-gray-600 hover:to-gray-700
                text-white shadow-lg shadow-gray-700/30 hover:shadow-gray-700/50
                transition-all duration-200 active:scale-95
                border border-white/10 hover:border-white/20
                backdrop-blur-sm
              "
            >
              <EyeIcon className="h-3 w-3 xs:h-3.5 xs:w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5" />
              <span className="font-semibold leading-none">View</span>
            </button>
          </div>

          {/* Host Info - Minimal */}
          <div className="flex items-center justify-between pt-1 border-t border-white/5 mt-0.5 sm:mt-1">
            <div className="flex flex-col">
              <span className="text-[0.45rem] sm:text-[0.5rem] md:text-[0.55rem] 
                             uppercase tracking-[0.16em] text-gray-500 font-medium">
                Host
              </span>
              <span className="text-[0.55rem] sm:text-[0.6rem] md:text-xs font-medium text-gray-300 truncate max-w-[80px] xs:max-w-[100px] sm:max-w-[120px]">
                {event.hosterId?.name || event.hosterName || 'EventFlow'}
              </span>
            </div>
            
            {/* Capacity indicator */}
            {availableSeats !== null && availableSeats > 0 && (
              <div className="flex items-center gap-1">
                <div className="w-12 sm:w-16 h-1.5 sm:h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                    style={{ width: `${((event.capacity - availableSeats) / event.capacity) * 100}%` }}
                  />
                </div>
                <span className="text-[0.5rem] sm:text-[0.55rem] md:text-[0.6rem] text-gray-400">
                  {Math.round(((event.capacity - availableSeats) / event.capacity) * 100)}%
                </span>
              </div>
            )}
          </div>
        </div>
      </article>

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