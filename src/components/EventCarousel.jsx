import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';
import { 
  MapPinIcon, 
  CalendarDaysIcon, 
  ClockIcon,
  TicketIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';

const NextArrow = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
    >
      <ChevronRightIcon className="h-6 w-6 text-dubai-blue" />
    </button>
  );
};

const PrevArrow = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
    >
      <ChevronLeftIcon className="h-6 w-6 text-dubai-blue" />
    </button>
  );
};

const EventCarousel = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCarouselEvents();
  }, []);

  const fetchCarouselEvents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/events/carousel');
      setEvents(response.data.events);
    } catch (error) {
      console.error('Error fetching carousel events:', error);
    } finally {
      setLoading(false);
    }
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          arrows: false,
        }
      }
    ]
  };

  if (loading) {
    return (
      <div className="h-96 bg-gradient-to-r from-blue-50 to-gray-50 rounded-2xl animate-pulse"></div>
    );
  }

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-2xl">
      <Slider {...settings}>
        {events.map((event) => (
          <div key={event._id} className="relative h-[500px]">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.4)), url(${event.featuredImage})`
              }}
            />
            
            <div className="relative h-full flex items-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="max-w-2xl">
                  <div className="mb-6">
                    <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-dubai-gold text-white mb-4">
                      Featured Event
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                      {event.title}
                    </h2>
                    <p className="text-xl text-gray-200 mb-8">
                      {event.shortDescription}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                        <CalendarDaysIcon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-300">Date</p>
                        <p className="text-white font-semibold">
                          {new Date(event.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                        <MapPinIcon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-300">Venue</p>
                        <p className="text-white font-semibold">{event.venue}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                        <TicketIcon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-300">Price</p>
                        <p className="text-white font-semibold">
                          AED {event.price}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                    <Link
                      to={`/events/${event._id}`}
                      className="btn-primary inline-flex items-center justify-center"
                    >
                      <TicketIcon className="h-5 w-5 mr-2" />
                      Book Now
                    </Link>
                    <Link
                      to={`/events/${event._id}#guestlist`}
                      className="btn-secondary inline-flex items-center justify-center"
                    >
                      Join Guest List
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default EventCarousel;