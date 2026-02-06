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
        const upcomingResponse = await axios.get(`${baseurl}/events?status=upcoming&limit=8`);
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
      buttonText: "Book VIP",
      buttonLink: "/events?vip=true"
    },
    {
      id: 3,
      title: "Live Music & Performances",
      subtitle: "World-class artists every weekend",
      image: "https://images.pexels.com/photos/1763067/pexels-photo-1763067.jpeg",
      buttonText: "See Lineup",
      buttonLink: "/events?category=music"
    },
    {
      id: 4,
      title: "Rooftop Parties",
      subtitle: "Sky-high celebrations with stunning views",
      image: "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg",
      buttonText: "Discover",
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

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      setActiveHero((prev) => (prev + 1) % heroSlides.length);
    }
    if (touchStart - touchEnd < -75) {
      setActiveHero((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    }
  };

  const experienceImages = [
    { src: 'https://images.pexels.com/photos/167636/pexels-photo-167636.jpeg', alt: 'Vibrant party atmosphere', title: 'Nightlife', description: 'Premium club experiences' },
    { src: 'https://images.pexels.com/photos/1449794/pexels-photo-1449794.jpeg', alt: 'DJ performance', title: 'Live Music', description: 'World-class performances' },
    { src: 'https://images.pexels.com/photos/1699156/pexels-photo-1699156.jpeg', alt: 'Social celebration', title: 'Celebrations', description: 'Memorable moments' },
    { src: 'https://images.pexels.com/photos/2747449/pexels-photo-2747449.jpeg', alt: 'Rooftop venue', title: 'Rooftop Views', description: 'Stunning locations' }
  ];

  const features = [
    { icon: <FireIcon className="w-6 h-6 sm:w-8 sm:h-8" />, title: "Curated Selection", description: "Only quality events with great venues, good organization and the right crowd, hand-picked for Dubai.", gradient: "from-purple-600 to-pink-600" },
    { icon: <MapPinIcon className="w-6 h-6 sm:w-8 sm:h-8" />, title: "Prime Locations", description: "Clear venue details, maps and timings for Dubai's best rooftops, clubs, hotels and beach spots.", gradient: "from-blue-600 to-cyan-600" },
    { icon: <UsersIcon className="w-6 h-6 sm:w-8 sm:h-8" />, title: "People & Networking", description: "Meet new people, clients and friends at events built for connection, fun and memorable nights out.", gradient: "from-pink-600 to-rose-600" },
    { icon: <TicketIcon className="w-6 h-6 sm:w-8 sm:h-8" />, title: "Easy Booking", description: "Secure your spot in seconds with our seamless booking system and instant confirmation.", gradient: "from-green-600 to-emerald-600" },
    { icon: <StarIcon className="w-6 h-6 sm:w-8 sm:h-8" />, title: "VIP Access", description: "Exclusive access to premium events, early bird tickets, and special member-only experiences.", gradient: "from-orange-600 to-red-600" },
    { icon: <ClockIcon className="w-6 h-6 sm:w-8 sm:h-8" />, title: "24/7 Support", description: "Our dedicated team is always ready to help you plan the perfect event experience.", gradient: "from-indigo-600 to-purple-600" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Hero Carousel */}
      <div 
        className="relative h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-screen overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${
              activeHero === index ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
          >
            <div className="absolute inset-0 bg-black/50 z-10"></div>
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 z-20 flex items-center justify-center px-4 sm:px-6">
              <div className="text-center max-w-4xl mx-auto">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-3 sm:mb-4 md:mb-6 animate-fade-in-up leading-tight">
                  {slide.title}
                </h1>
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 mb-6 sm:mb-8 md:mb-10 animate-fade-in-up animation-delay-200 px-2">
                  {slide.subtitle}
                </p>
                <Link
                  to={slide.buttonLink}
                  className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 sm:px-8 md:px-12 py-3 sm:py-4 rounded-full text-sm sm:text-base md:text-lg font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-fade-in-up animation-delay-400"
                >
                  {slide.buttonText}
                </Link>
              </div>
            </div>
          </div>
        ))}

        {/* Hero Indicators */}
        <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 lg:bottom-10 left-1/2 transform -translate-x-1/2 z-30 flex gap-2 sm:gap-3">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveHero(index)}
              className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                activeHero === index ? 'bg-white w-8 sm:w-10 md:w-12' : 'bg-white/50 w-1.5 sm:w-2'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-10 lg:py-12">
        <div className="max-w-7xl mx-auto">
          
          {/* Featured Events Section with EventCarousel */}
          <div className="mb-8 sm:mb-12 md:mb-16 lg:mb-20">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 md:mb-8 gap-2 sm:gap-0">
              <div>
                <div className="flex items-center gap-2 mb-1 sm:mb-2">
                  <FireIcon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-orange-500" />
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                    Featured Events
                  </h2>
                </div>
                <p className="text-xs sm:text-sm md:text-base text-gray-400">
                  Spotlight Experiences
                </p>
              </div>
              <Link
                to="/events"
                className="self-start sm:self-auto inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors text-sm sm:text-base"
              >
                View all
                <ArrowRightIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
            </div>

            {/* EventCarousel Component */}
            <EventCarousel />
          </div>

          {/* Upcoming Events */}
          <div className="mb-8 sm:mb-12 md:mb-16 lg:mb-20">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 md:mb-8 gap-2 sm:gap-0">
              <div>
                <div className="flex items-center gap-2 mb-1 sm:mb-2">
                  <CalendarIcon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-blue-500" />
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                    Coming Soon
                  </h2>
                </div>
                <p className="text-xs sm:text-sm md:text-base text-gray-400">
                  Upcoming Events
                </p>
              </div>
              <Link
                to="/events"
                className="self-start sm:self-auto inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors text-sm sm:text-base"
              >
                Browse all
                <ArrowRightIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="bg-gray-800/50 rounded-xl sm:rounded-2xl h-64 sm:h-72 md:h-80 lg:h-96 animate-pulse"></div>
                ))}
              </div>
            ) : upcomingEvents.length === 0 ? (
              <div className="text-center py-12 sm:py-16 md:py-20 bg-gray-800/30 rounded-xl sm:rounded-2xl">
                <p className="text-gray-400 text-sm sm:text-base">No upcoming events available.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                {upcomingEvents.slice(0, 4).map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </div>

          {/* Experience Gallery */}
          <div className="mb-8 sm:mb-12 md:mb-16 lg:mb-20">
            <div className="text-center mb-4 sm:mb-6 md:mb-8 lg:mb-10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-3 md:mb-4">
                Experience Gallery
              </h2>
              <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-400 px-4">
                Immerse in the Experience
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
              {experienceImages.map((image, index) => (
                <div
                  key={index}
                  className="relative group overflow-hidden rounded-lg sm:rounded-xl md:rounded-2xl aspect-square hover:scale-105 transition-transform duration-500"
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 sm:p-4 md:p-5 lg:p-6">
                    <h3 className="text-white text-sm sm:text-base md:text-lg lg:text-xl font-bold mb-1">
                      {image.title}
                    </h3>
                    <p className="text-gray-300 text-xs sm:text-sm md:text-base">
                      {image.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Why Choose Us */}
          <div className="mb-8 sm:mb-12 md:mb-16 lg:mb-20">
            <div className="text-center mb-4 sm:mb-6 md:mb-8 lg:mb-10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-3 md:mb-4">
                Why Choose Us
              </h2>
              <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-400 max-w-3xl mx-auto px-4">
                A vibrant platform with curated events, clear details and easy booking
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 lg:p-8 hover:bg-gray-800/70 transition-all duration-300 hover:scale-105"
                >
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-r ${feature.gradient} rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 md:mb-5 lg:mb-6`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white mb-2 sm:mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-xs sm:text-sm md:text-base text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl sm:rounded-2xl md:rounded-3xl p-6 sm:p-8 md:p-10 lg:p-16 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 md:mb-6 leading-tight">
              Get Started Today
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 mb-6 sm:mb-8 md:mb-10 max-w-2xl mx-auto px-2">
              Join thousands of event-goers discovering the best experiences Dubai has to offer
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center max-w-md sm:max-w-none mx-auto">
              <Link
                to="/events"
                className="bg-white text-purple-600 px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-full text-sm sm:text-base md:text-lg font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 text-center"
              >
                Browse Events
              </Link>
              <Link
                to="/about"
                className="bg-transparent border-2 border-white text-white px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-full text-sm sm:text-base md:text-lg font-semibold hover:bg-white hover:text-purple-600 transition-all duration-300 text-center"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;