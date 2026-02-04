import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPinIcon, 
  CalendarDaysIcon, 
  ClockIcon,
  UserGroupIcon,
  TicketIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import ReservationModal from './ReservationModal';
import GuestListModal from './GuestListModal';

const EventCard = ({ event }) => {
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [showGuestListModal, setShowGuestListModal] = useState(false);

  const availableSeats = event.capacity - event.bookedSeats;
  const date = new Date(event.date);
  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <>
      <div className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 card-hover">
        <div className="relative h-56 overflow-hidden">
          <img
            src={event.featuredImage}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          />
          {event.isFeatured && (
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 bg-gradient-to-r from-dubai-gold to-yellow-600 text-white text-xs font-bold rounded-full">
                FEATURED
              </span>
            </div>
          )}
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-dubai-blue text-sm font-semibold rounded-lg">
              AED {event.price}
            </span>
          </div>
          <div className="absolute bottom-4 left-4">
            <span className={`px-3 py-1 text-white text-sm font-semibold rounded-lg ${
              event.status === 'upcoming' ? 'bg-green-500' :
              event.status === 'ongoing' ? 'bg-blue-500' :
              event.status === 'completed' ? 'bg-gray-500' : 'bg-red-500'
            }`}>
              {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
            </span>
          </div>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-start mb-3">
            <div>
              <span className="px-3 py-1 bg-blue-100 text-dubai-blue text-xs font-semibold rounded-full">
                {event.category}
              </span>
            </div>
            <div className="text-sm text-gray-500">
              {availableSeats} seats left
            </div>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-1">
            {event.title}
          </h3>
          <p className="text-gray-600 mb-6 line-clamp-2">
            {event.shortDescription}
          </p>

          <div className="space-y-3 mb-6">
            <div className="flex items-center text-gray-700">
              <CalendarDaysIcon className="h-5 w-5 text-dubai-blue mr-2" />
              <span className="text-sm font-medium">{formattedDate}</span>
            </div>
            <div className="flex items-center text-gray-700">
              <ClockIcon className="h-5 w-5 text-dubai-blue mr-2" />
              <span className="text-sm font-medium">{event.time}</span>
            </div>
            <div className="flex items-center text-gray-700">
              <MapPinIcon className="h-5 w-5 text-dubai-blue mr-2" />
              <span className="text-sm font-medium">{event.venue}</span>
            </div>
            <div className="flex items-center text-gray-700">
              <UserGroupIcon className="h-5 w-5 text-dubai-blue mr-2" />
              <span className="text-sm font-medium">{event.organizer}</span>
            </div>
          </div>

          <div className="flex flex-col space-y-3">
            <button
              onClick={() => setShowReservationModal(true)}
              className="btn-primary w-full flex items-center justify-center"
            >
              <TicketIcon className="h-5 w-5 mr-2" />
              Reserve Now
            </button>
            <button
              onClick={() => setShowGuestListModal(true)}
              className="w-full py-3 px-4 border-2 border-dubai-blue text-dubai-blue font-semibold rounded-lg hover:bg-dubai-blue hover:text-white transition duration-300"
            >
              Join Guest List
            </button>
            <Link
              to={`/events/${event._id}`}
              className="w-full py-3 px-4 text-center text-dubai-blue font-semibold rounded-lg hover:bg-blue-50 transition duration-300 flex items-center justify-center"
            >
              View Details
              <ChevronRightIcon className="h-4 w-4 ml-1" />
            </Link>
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