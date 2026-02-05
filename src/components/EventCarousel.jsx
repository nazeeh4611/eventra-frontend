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
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';
import baseurl from '../Base/base';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const NextArrow = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 rounded-full transition-all duration-300 hover:scale-110 border border-white/30"
    >
      <ChevronRightIcon className="h-6 w-6 text-white" />
    </button>
  );
};

const PrevArrow = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 rounded-full transition-all duration-300 hover:scale-110 border border-white/30"
    >
      <ChevronLeftIcon className="h-6 w-6 text-white" />
    </button>
  );
};

const EventCarousel = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const staticSlides = [
    {
      _id: 'static-1',
      title: "Dubai's Premier Event Experience",
      shortDescription: "From rooftop parties to business conferences, experience the best of Dubai's vibrant event scene with exclusive access and unforgettable moments.",
      featuredImage: "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg",
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      venue: "Premium Venues",
      price: "Varies",
      category: "All Events"
    },
    {
      _id: 'static-2',
      title: "Unforgettable Nights Await",
      shortDescription: "Join Dubai's most talked-about parties and exclusive club nights with VIP access, world-class DJs, and premium bottle service.",
      featuredImage: "https://images.pexels.com/photos/2114365/pexels-photo-2114365.jpeg",
      date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      venue: "Top Clubs & Venues",
      price: "299",
      category: "Nightlife"
    },
    {
      _id: 'static-3',
      title: "Network & Connect",
      shortDescription: "Connect with industry leaders at premium networking events and conferences. Build meaningful relationships in Dubai's business scene.",
      featuredImage: "https://images.pexels.com/photos/1157557/pexels-photo-1157557.jpeg",
      date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
      venue: "Business Centers",
      price: "399",
      category: "Business"
    },
    {
      _id: 'static-4',
      title: "Cultural Celebrations",
      shortDescription: "Experience Dubai's rich cultural tapestry through festivals, exhibitions, and performances that showcase art, music, and tradition.",
      featuredImage: "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg",
      date: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
      venue: "Cultural Venues",
      price: "199",
      category: "Cultural"
    }
  ];

  useEffect(() => {
    fetchCarouselEvents();
  }, []);

  const fetchCarouselEvents = async () => {
    try {
      const response = await axios.get(`${baseurl}/events/carousel`);
      setEvents(response.data.events || []);
    } catch (error) {
      console.error('Error fetching carousel events:', error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    fade: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: false,
        }
      }
    ]
  };

  if (loading) {
    return (
      <div className="relative h-[600px] md:h-[700px] rounded-3xl overflow-hidden bg-gradient-to-br from-purple-900/40 via-indigo-900/40 to-purple-800/40 backdrop-blur-sm border border-purple-500/20 animate-pulse">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex space-x-3">
            <div className="w-4 h-4 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-4 h-4 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-4 h-4 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    );
  }

  const displayEvents = events.length > 0 ? events : staticSlides;
  const isStatic = events.length === 0;

  return (
    <div className="relative rounded-3xl overflow-hidden border border-purple-500/30 shadow-2xl shadow-purple-500/20">
      <Slider {...settings}>
        {displayEvents.map((event) => (
          <div key={event._id} className="relative h-[600px] md:h-[700px]">
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
              style={{
                backgroundImage: `url(${event.featuredImage || event.image})`
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-gray-900/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent" />
            
            <div className="relative h-full flex items-center">
              <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 w-full">
                <div className="max-w-3xl">
                  <div className="mb-8 space-y-6">
                    <div className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-purple-600/30 to-pink-600/30 border border-purple-500/40 backdrop-blur-md shadow-lg">
                      <SparklesIcon className="h-5 w-5 text-purple-300" />
                      <span className="text-sm font-bold text-white tracking-wide">
                        {isStatic ? 'Discover Events' : 'Featured Event'}
                      </span>
                    </div>
                    
                    <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-white leading-tight">
                      {event.title}
                    </h2>
                    
                    <p className="text-xl md:text-2xl text-gray-200 leading-relaxed">
                      {event.shortDescription}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
                    <div className="flex items-center space-x-4 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 transition-all duration-300">
                      <div className="p-3 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl shadow-lg">
                        <CalendarDaysIcon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-300 uppercase tracking-wide font-semibold">Date</p>
                        <p className="text-white font-bold text-sm">
                          {new Date(event.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 transition-all duration-300">
                      <div className="p-3 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl shadow-lg">
                        <MapPinIcon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-300 uppercase tracking-wide font-semibold">Venue</p>
                        <p className="text-white font-bold text-sm truncate">{event.venue}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 transition-all duration-300">
                      <div className="p-3 bg-gradient-to-br from-pink-600 to-rose-600 rounded-xl shadow-lg">
                        <TicketIcon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-300 uppercase tracking-wide font-semibold">Price</p>
                        <p className="text-white font-bold text-sm">
                          {event.price === 'Varies' ? 'Varies' : `AED ${event.price}`}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                      to={isStatic ? '/events' : `/events/${event._id}`}
                      className="group inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-10 py-5 text-lg font-bold text-white shadow-2xl shadow-purple-500/50 hover:shadow-purple-500/70 transition-all duration-300 hover:scale-105"
                    >
                      <TicketIcon className="h-6 w-6" />
                      <span>{isStatic ? 'Explore Events' : 'Book Now'}</span>
                      <ArrowRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    
                    {!isStatic && (
                      <Link
                        to={`/events/${event._id}#guestlist`}
                        className="inline-flex items-center justify-center gap-3 rounded-full bg-white/10 backdrop-blur-sm border-2 border-white/30 px-10 py-5 text-lg font-bold text-white hover:bg-white/20 hover:border-white/40 transition-all duration-300"
                      >
                        Join Guest List
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>

      {isStatic && (
        <div className="absolute bottom-6 left-6 z-10">
          {/* <div className="px-4 py-2 rounded-full bg-orange-500/20 border border-orange-500/40 backdrop-blur-md">
            <p className="text-xs text-orange-200 font-semibold">
              Showing preview events
            </p>
          </div> */}
        </div>
      )}
    </div>
  );
};

export default EventCarousel;