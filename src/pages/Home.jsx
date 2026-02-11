import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FireIcon,
  CalendarIcon,
  MapPinIcon,
  UsersIcon,
  TicketIcon,
  ClockIcon,
  ArrowRightIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import axios from 'axios';
import baseurl from "../Base/base";
import EventCard from '../components/EventCard';
import EventCarousel from '../components/EventCarousel';

const Home = () => {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const upcomingResponse = await axios.get(`${baseurl}/allevents?status=upcoming&limit=8`);
        setUpcomingEvents(upcomingResponse.data.events || []);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const heroSlides = [
    {
      id: 1,
      title: "Dubai's Hottest Nightlife",
      subtitle: "Experience the city that never sleeps",
      image: "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg",
      buttonText: "Explore Now",
      buttonLink: "/events"
    },
    {
      id: 2,
      title: "Exclusive VIP Events",
      subtitle: "Get access to premium experiences",
      image: "https://images.pexels.com/photos/2747449/pexels-photo-2747449.jpeg",
      buttonText: "Explore Now",
      buttonLink: "/events?vip=true"
    },
    {
      id: 3,
      title: "Live Music & Performances",
      subtitle: "World-class artists every weekend",
      image: "https://images.pexels.com/photos/1763067/pexels-photo-1763067.jpeg",
      buttonText: "Explore Now",
      buttonLink: "/events?category=music"
    },
    {
      id: 4,
      title: "Rooftop Parties",
      subtitle: "Sky-high celebrations with stunning views",
      image: "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg",
      buttonText: "Explore Now",
      buttonLink: "/events?venue=rooftop"
    }
  ];

  const [activeHero, setActiveHero] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveHero((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleTouchStart = (e) => setTouchStart(e.targetTouches[0].clientX);
  const handleTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);
  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) setActiveHero((prev) => (prev + 1) % heroSlides.length);
    if (touchStart - touchEnd < -75) setActiveHero((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const experienceImages = [
    {
      src: 'https://images.pexels.com/photos/167636/pexels-photo-167636.jpeg',
      alt: 'Vibrant party atmosphere',
      title: 'Nightlife',
      description: 'Premium club experiences'
    },
    {
      src: 'https://images.pexels.com/photos/1449794/pexels-photo-1449794.jpeg',
      alt: 'DJ performance',
      title: 'Live Music',
      description: 'World-class performances'
    },
    {
      src: 'https://production-dubainight.s3.me-south-1.amazonaws.com/region_dubai/article/1-OAK-Duba-6761-2024-06-26.webp',
      alt: 'Social celebration',
      title: 'Celebrations',
      description: 'Memorable moments'
    },
    {
      src: 'https://images.pexels.com/photos/2747449/pexels-photo-2747449.jpeg',
      alt: 'Rooftop venue',
      title: 'Rooftop Views',
      description: 'Stunning locations'
    }
  ];

  const features = [
    {
      icon: <TicketIcon className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: "Curated Selection",
      description: "Only quality events with great venues, good organization and the right crowd, hand-picked for Dubai."
    },
    {
      icon: <MapPinIcon className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: "Prime Locations",
      description: "Clear venue details, maps and timings for Dubai's best rooftops, clubs, hotels and beach spots."
    },
    {
      icon: <UsersIcon className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: "People & Networking",
      description: "Meet new people, clients and friends at events built for connection, fun and memorable nights out."
    },
    {
      icon: <CalendarIcon className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: "Easy Booking",
      description: "Secure your spot in seconds with our seamless booking system and instant confirmation."
    },
    {
      icon: <StarIcon className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: "VIP Access",
      description: "Exclusive access to premium events, early bird tickets, and special member-only experiences."
    },
    {
      icon: <ClockIcon className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: "24/7 Support",
      description: "Our dedicated team is always ready to help you plan the perfect event experience."
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Hero Carousel */}
      <div
        className="relative h-[85vh] xs:h-[80vh] sm:h-[75vh] md:h-[80vh] lg:h-[85vh] overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {heroSlides.map((slide, index) => {
          const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                activeHero === index ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-purple-900/70 via-black/70 to-[#0a0a0a] z-10" />
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className={`w-full h-full ${
                    imageDimensions.width && imageDimensions.height
                      ? imageDimensions.width > imageDimensions.height
                        ? 'object-cover'
                        : 'object-contain'
                      : 'object-cover'
                  }`}
                  onLoad={(e) => {
                    const { naturalWidth, naturalHeight } = e.target;
                    setImageDimensions({ width: naturalWidth, height: naturalHeight });
                  }}
                />
              </div>
              <div className="absolute inset-0 flex items-center justify-center z-20 px-4">
                <div className="text-center w-full max-w-4xl">
                  <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-2 sm:mb-4 md:mb-6 tracking-tight drop-shadow-[0_0_30px_rgba(168,85,247,0.5)] leading-tight">
                    {slide.title}
                  </h1>
                  <p className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 mb-4 sm:mb-6 md:mb-8 max-w-2xl mx-auto px-4">
                    {slide.subtitle}
                  </p>
                  <Link
                    to={slide.buttonLink}
                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 xs:px-7 sm:px-8 py-3 sm:py-3.5 rounded-full font-semibold transition-all duration-300 shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70 text-sm sm:text-base touch-manipulation active:scale-95"
                  >
                    {slide.buttonText}
                    <ArrowRightIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
        <div className="absolute bottom-4 xs:bottom-6 sm:bottom-8 left-0 right-0 z-30 flex justify-center gap-2 px-4">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveHero(index)}
              className={`h-1.5 xs:h-2 rounded-full transition-all duration-300 touch-manipulation ${
                activeHero === index
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 w-8 xs:w-10 sm:w-12'
                  : 'bg-white/30 w-1.5 xs:w-2 hover:bg-white/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Spotlight Carousel Section */}
      <section className="py-8 xs:py-10 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <img 
            src="https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg" 
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-purple-950/20 to-[#111111]" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-row justify-between items-center mb-5 xs:mb-6 sm:mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <FireIcon className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
                <span className="text-cyan-400 font-semibold text-xs uppercase tracking-wider">
                  Featured Events
                </span>
              </div>
              <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                Spotlight Experiences
              </h2>
            </div>
            <Link
              to="/events"
              className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 group text-xs sm:text-sm transition-colors touch-manipulation"
            >
              View all
              <ArrowRightIcon className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <EventCarousel />
        </div>
      </section>

{/* Upcoming Events Section - Mobile First */}
{/* Upcoming Events Section - Clean card layout like events page */}
<section className="py-6 px-3 bg-[#0a0a0a] relative overflow-hidden">
  <div className="max-w-7xl mx-auto relative z-10">
    {/* Header */}
    <div className="flex items-center justify-between mb-4">
      <div>
        <div className="flex items-center gap-1 mb-0.5">
          <CalendarIcon className="w-3.5 h-3.5 text-pink-400" />
          <span className="text-pink-400 font-semibold text-[10px] uppercase tracking-wider">
            Coming Soon
          </span>
        </div>
        <h2 className="text-lg font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
          Upcoming Events
        </h2>
      </div>
      <Link
        to="/events"
        className="text-pink-400 hover:text-pink-300 font-medium flex items-center gap-0.5 text-xs"
      >
        View all
        <ArrowRightIcon className="w-3 h-3" />
      </Link>
    </div>
    
    {loading ? (
      <div className="grid grid-cols-2 gap-3">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-lg animate-pulse">
            <div className="h-32 bg-purple-800/20 rounded-t-lg" />
            <div className="p-3 space-y-2">
              <div className="h-3 bg-purple-700/30 rounded w-3/4" />
              <div className="h-2 bg-purple-700/30 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    ) : upcomingEvents.length === 0 ? (
      <div className="text-center py-6 text-gray-400 bg-gradient-to-br from-purple-900/10 to-pink-900/10 rounded-lg text-xs">
        No upcoming events available.
      </div>
    ) : (
      <div className="grid grid-cols-2 gap-3">
        {upcomingEvents.slice(0, 4).map((event) => (
          <EventCard key={event._id} event={event} isHomePage={true} />
        ))}
      </div>
    )}
  </div>
</section>

      {/* Experience Gallery */}
      <section className="py-8 xs:py-10 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <img 
            src="https://images.pexels.com/photos/1449794/pexels-photo-1449794.jpeg" 
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-cyan-950/10 to-[#111111]" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-6 xs:mb-8 sm:mb-10">
            <div className="flex items-center justify-center gap-2 mb-2">
              <StarIcon className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
              <span className="text-purple-400 font-semibold text-xs uppercase tracking-wider">
                Experience Gallery
              </span>
            </div>
            <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Immerse in the Experience
            </h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 xs:gap-3 sm:gap-4">
            {experienceImages.map((image, index) => {
              const [imgDims, setImgDims] = useState({ width: 0, height: 0 });
              return (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-lg aspect-[3/4] cursor-pointer border border-purple-500/20 hover:border-cyan-400/50 transition-all duration-300 touch-manipulation active:scale-95"
                >
                  <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
                    <img
                      src={image.src}
                      alt={image.alt}
                      className={`w-full h-full ${
                        imgDims.width && imgDims.height
                          ? imgDims.width > imgDims.height
                            ? 'object-cover'
                            : 'object-contain bg-gray-900'
                          : 'object-cover'
                      } transition-transform duration-500 group-hover:scale-110`}
                      onLoad={(e) => {
                        const { naturalWidth, naturalHeight } = e.target;
                        setImgDims({ width: naturalWidth, height: naturalHeight });
                      }}
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-900 via-purple-900/60 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                  <div className="absolute bottom-0 left-0 right-0 p-2 xs:p-3 sm:p-4 transform translate-y-1 group-hover:translate-y-0 transition-transform">
                    <h3 className="text-white font-bold text-xs xs:text-sm sm:text-base md:text-lg mb-0.5 drop-shadow-lg">
                      {image.title}
                    </h3>
                    <p className="text-cyan-200 text-[10px] xs:text-xs sm:text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 line-clamp-1">
                      {image.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-8 xs:py-10 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-[#0a0a0a] relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <img 
            src="https://images.pexels.com/photos/1699156/pexels-photo-1699156.jpeg" 
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-transparent to-[#0a0a0a]" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-6 xs:mb-8 sm:mb-10 md:mb-12">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TicketIcon className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
              <span className="text-cyan-400 font-semibold text-xs uppercase tracking-wider">
                Why Choose Us
              </span>
            </div>
            <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-2 px-4">
              A vibrant platform with curated events, clear details and easy booking
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-4 sm:gap-5 md:gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-sm border border-purple-500/20 p-4 xs:p-5 sm:p-6 rounded-xl hover:border-cyan-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 group touch-manipulation"
              >
                <div className="w-9 h-9 xs:w-10 xs:h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-lg flex items-center justify-center mb-3 sm:mb-4 text-cyan-400 group-hover:from-purple-600/30 group-hover:to-pink-600/30 transition-colors border border-purple-500/30">
                  {feature.icon}
                </div>
                <h3 className="text-base xs:text-lg sm:text-xl font-bold text-white mb-1 sm:mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-300 text-xs xs:text-sm sm:text-base leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-10 xs:py-12 sm:py-14 md:py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img 
            src="https://images.pexels.com/photos/1763067/pexels-photo-1763067.jpeg" 
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-purple-950/30 to-[#0a0a0a]" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 xs:mb-4 sm:mb-5 drop-shadow-[0_0_30px_rgba(168,85,247,0.5)] leading-tight px-4">
            Get Started Today
          </h2>
          <p className="text-sm xs:text-base sm:text-lg md:text-xl text-gray-300 mb-5 xs:mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            Join thousands of event-goers discovering the best experiences Dubai has to offer
          </p>
          <div className="flex flex-col xs:flex-row gap-3 justify-center items-stretch xs:items-center px-4">
            <Link
              to="/events"
              className="w-full xs:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 xs:px-7 sm:px-8 py-3 sm:py-3.5 rounded-full font-semibold transition-all duration-300 shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70 text-center text-sm sm:text-base touch-manipulation active:scale-95"
            >
              Browse Events
            </Link>
            <Link
              to="/about"
              className="w-full xs:w-auto border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400/10 px-6 xs:px-7 sm:px-8 py-3 sm:py-3.5 rounded-full font-semibold transition-all duration-300 text-center hover:shadow-lg hover:shadow-cyan-400/30 text-sm sm:text-base touch-manipulation active:scale-95"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;