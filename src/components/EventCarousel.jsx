import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';
import {
  MapPinIcon,
  CalendarDaysIcon,
  TicketIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  SparklesIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';
import baseurl from '../Base/base';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const NextArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-30 bg-black/60 backdrop-blur-md p-2.5 md:p-4 rounded-full border border-white/30 hover:bg-black/80 hover:scale-110 transition-all duration-300 shadow-lg"
    aria-label="Next slide"
  >
    <ChevronRightIcon className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
  </button>
);

const PrevArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-30 bg-black/60 backdrop-blur-md p-2.5 md:p-4 rounded-full border border-white/30 hover:bg-black/80 hover:scale-110 transition-all duration-300 shadow-lg"
    aria-label="Previous slide"
  >
    <ChevronLeftIcon className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
  </button>
);

const EventCarousel = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageDimensions, setImageDimensions] = useState({});

  const staticSlides = [
    {
      _id: 's1',
      title: "Dubai's Premier Event Experience",
      shortDescription: "Best parties and business events across Dubai",
      featuredImage: "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg",
      date: new Date(),
      venue: "Dubai Venues",
      price: "Varies"
    }
  ];

  useEffect(() => {
    fetchCarouselEvents();
  }, []);

  const fetchCarouselEvents = async () => {
    try {
      const res = await axios.get(`${baseurl}/carousel`);
      setEvents(res.data.events || []);
    } catch {
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleImageLoad = (e, id) => {
    const { naturalWidth, naturalHeight } = e.target;
    setImageDimensions(prev => ({
      ...prev,
      [id]: { width: naturalWidth, height: naturalHeight }
    }));
  };

  const getImageClass = (id) => {
    const dims = imageDimensions[id];
    if (!dims) return 'object-cover';
    
    const isPortrait = dims.height > dims.width;
    const isSquare = Math.abs(dims.width - dims.height) < 100;
    
    if (isPortrait || isSquare) {
      return 'object-contain md:object-cover';
    }
    return 'object-cover';
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    fade: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    dotsClass: "slick-dots custom-dots",
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          fade: true,
          arrows: true
        }
      },
      {
        breakpoint: 1024,
        settings: {
          fade: true,
          arrows: true
        }
      },
      {
        breakpoint: 768,
        settings: {
          fade: false,
          arrows: false,
          dots: true
        }
      },
      {
        breakpoint: 640,
        settings: {
          fade: false,
          arrows: false,
          dots: true
        }
      }
    ]
  };

  if (loading) {
    return (
      <div className="relative overflow-hidden rounded-xl sm:rounded-2xl lg:rounded-3xl bg-gradient-to-br from-purple-900/30 to-pink-900/30 animate-pulse">
        <div className="h-[280px] xs:h-[320px] sm:h-[380px] md:h-[450px] lg:h-[550px] xl:h-[600px] w-full" />
      </div>
    );
  }

  const displayEvents = events.length ? events : staticSlides;
  const isStatic = events.length === 0;

  return (
    <div className="relative overflow-hidden rounded-xl sm:rounded-2xl lg:rounded-3xl bg-black shadow-2xl shadow-purple-500/10">
      <style>{`
        .custom-dots {
          position: absolute;
          bottom: 16px;
          left: 0;
          right: 0;
          display: flex !important;
          justify-content: center;
          align-items: center;
          gap: 8px;
          z-index: 40;
          margin: 0;
          padding: 0;
          list-style: none;
        }
        .custom-dots li {
          margin: 0;
          width: auto;
          height: auto;
        }
        .custom-dots li button {
          width: 8px;
          height: 8px;
          padding: 0;
          background: rgba(255,255,255,0.4);
          border-radius: 9999px;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          border: none;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .custom-dots li button:before {
          display: none;
        }
        .custom-dots li.slick-active button {
          width: 32px;
          background: linear-gradient(to right, #a855f7, #ec4899);
          box-shadow: 0 4px 12px rgba(168,85,247,0.5);
        }
        @media (min-width: 640px) {
          .custom-dots { bottom: 24px; gap: 12px; }
          .custom-dots li button { width: 10px; height: 10px; }
          .custom-dots li.slick-active button { width: 40px; }
        }
        @media (min-width: 1024px) {
          .custom-dots { bottom: 32px; gap: 16px; }
          .custom-dots li button { width: 12px; height: 12px; }
          .custom-dots li.slick-active button { width: 48px; }
        }
        .slick-slide {
          overflow: hidden;
        }
        .slick-list {
          border-radius: inherit;
        }
        .carousel-overlay {
          background: linear-gradient(to top, 
            rgba(0,0,0,0.95) 0%,
            rgba(0,0,0,0.7) 30%,
            rgba(0,0,0,0.4) 60%,
            rgba(0,0,0,0.1) 100%
          );
        }
        @media (min-width: 1024px) {
          .carousel-overlay {
            background: linear-gradient(to right, 
              rgba(0,0,0,0.9) 0%,
              rgba(0,0,0,0.6) 50%,
              rgba(0,0,0,0.2) 100%
            );
          }
        }
      `}</style>
      
      <Slider {...settings}>
        {displayEvents.map((event, i) => {
          const eventId = event._id || `static-${i}`;
          const imageUrl = event.featuredImage || event.image || 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg';
          const isPortrait = imageDimensions[eventId]?.height > imageDimensions[eventId]?.width;
          
          return (
            <div key={eventId} className="relative outline-none">
              <div className="relative h-[280px] xs:h-[320px] sm:h-[380px] md:h-[450px] lg:h-[550px] xl:h-[600px] w-full bg-[#0a0a0a]">
                {/* Image Container */}
                <div className="absolute inset-0 w-full h-full overflow-hidden">
                  <img
                    src={imageUrl}
                    alt={event.title}
                    className={`w-full h-full transition-all duration-700 ${getImageClass(eventId)}`}
                    style={{
                      transform: 'scale(1)',
                      transition: 'transform 7s ease'
                    }}
                    onLoad={(e) => handleImageLoad(e, eventId)}
                    onMouseOver={(e) => {
                      if (window.innerWidth >= 1024) {
                        e.currentTarget.style.transform = 'scale(1.1)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  />
                </div>
                
                {/* Gradient Overlay - Different for mobile/desktop */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/30 lg:bg-gradient-to-r lg:from-black/95 lg:via-black/70 lg:to-transparent" />
                
                {/* Content Container */}
                <div className="absolute inset-0 z-20 flex items-end lg:items-center">
                  <div className="w-full px-4 xs:px-5 sm:px-6 md:px-8 lg:px-12 xl:px-16 pb-6 xs:pb-8 sm:pb-10 md:pb-12 lg:pb-0 lg:max-w-2xl xl:max-w-3xl">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-1.5 xs:gap-2 px-2.5 xs:px-3 py-1 xs:py-1.5 md:px-4 md:py-2 rounded-full bg-purple-600/40 backdrop-blur-md border border-purple-500/40 mb-3 xs:mb-4 sm:mb-5 md:mb-6 animate-fade-in">
                      <SparklesIcon className="h-3 w-3 xs:h-3.5 xs:w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 text-purple-300" />
                      <span className="text-[10px] xs:text-xs sm:text-sm md:text-base font-bold text-white uppercase tracking-wider">
                        {isStatic ? 'Discover Events' : 'Featured Event'}
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white leading-tight mb-2 xs:mb-3 sm:mb-4 drop-shadow-2xl">
                      {event.title}
                    </h2>

                    {/* Description - Hidden on smallest screens */}
                    <p className="hidden xs:block text-sm xs:text-base sm:text-lg md:text-xl text-gray-200 line-clamp-2 mb-4 xs:mb-5 sm:mb-6 md:mb-7 drop-shadow-lg max-w-xl">
                      {event.shortDescription}
                    </p>

                    {/* Event Details Cards */}
                    <div className="grid grid-cols-3 gap-2 xs:gap-3 sm:gap-4 mb-4 xs:mb-5 sm:mb-6 md:mb-8 max-w-sm md:max-w-md">
                      <div className="bg-black/40 backdrop-blur-md border border-white/20 rounded-xl p-2 xs:p-2.5 sm:p-3 md:p-4 hover:bg-black/60 transition-all duration-300">
                        <CalendarDaysIcon className="h-4 w-4 xs:h-5 xs:w-5 sm:h-6 sm:w-6 text-purple-300 mb-1" />
                        <p className="text-[8px] xs:text-[9px] sm:text-[10px] md:text-xs text-gray-300 truncate">Date</p>
                        <p className="text-white text-[10px] xs:text-xs sm:text-sm md:text-base font-bold truncate">
                          {event.date ? new Date(event.date).toLocaleDateString('en-US', { 
                            day: 'numeric', 
                            month: 'short' 
                          }) : 'TBD'}
                        </p>
                      </div>

                      <div className="bg-black/40 backdrop-blur-md border border-white/20 rounded-xl p-2 xs:p-2.5 sm:p-3 md:p-4 hover:bg-black/60 transition-all duration-300">
                        <MapPinIcon className="h-4 w-4 xs:h-5 xs:w-5 sm:h-6 sm:w-6 text-blue-300 mb-1" />
                        <p className="text-[8px] xs:text-[9px] sm:text-[10px] md:text-xs text-gray-300 truncate">Venue</p>
                        <p className="text-white text-[10px] xs:text-xs sm:text-sm md:text-base font-bold truncate">
                          {event.venue?.substring(0, 15) || 'Dubai'}
                        </p>
                      </div>

                      <div className="bg-black/40 backdrop-blur-md border border-white/20 rounded-xl p-2 xs:p-2.5 sm:p-3 md:p-4 hover:bg-black/60 transition-all duration-300">
                        <TicketIcon className="h-4 w-4 xs:h-5 xs:w-5 sm:h-6 sm:w-6 text-pink-300 mb-1" />
                        <p className="text-[8px] xs:text-[9px] sm:text-[10px] md:text-xs text-gray-300 truncate">Price</p>
                        <p className="text-white text-[10px] xs:text-xs sm:text-sm md:text-base font-bold truncate">
                          {typeof event.price === 'number' ? `AED ${event.price}` : event.price}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col xs:flex-row gap-2 xs:gap-3 sm:gap-4">
                      <Link
                        to={isStatic ? '/events' : `/events/${event._id}`}
                        className="w-full xs:w-auto px-4 xs:px-5 sm:px-6 md:px-8 py-2.5 xs:py-3 sm:py-3.5 md:py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-xs xs:text-sm sm:text-base md:text-lg font-bold rounded-full shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70 transition-all duration-300 hover:scale-105 active:scale-95 text-center"
                      >
                        {isStatic ? 'Explore Events' : 'Book Now'}
                      </Link>

                      {!isStatic && (
                        <Link
                          to={`/events/${event._id}#guestlist`}
                          className="w-full xs:w-auto px-4 xs:px-5 sm:px-6 md:px-8 py-2.5 xs:py-3 sm:py-3.5 md:py-4 bg-white/10 backdrop-blur-md border-2 border-white/30 hover:bg-white/20 text-white text-xs xs:text-sm sm:text-base md:text-lg font-bold rounded-full transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-1.5 sm:gap-2"
                        >
                          <UserGroupIcon className="h-3.5 w-3.5 xs:h-4 xs:w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                          Join Guest List
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </Slider>
    </div>
  );
};

export default EventCarousel;