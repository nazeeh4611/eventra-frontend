import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FireIcon,
  StarIcon,
  CalendarIcon,
  MapPinIcon,
  UsersIcon,
  TrophyIcon,
  BuildingLibraryIcon,
  MusicalNoteIcon,
  SparklesIcon,
  TicketIcon,
  ClockIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import axios from 'axios';
import baseurl from "../Base/base";
import EventCarousel from '../components/EventCarousel';
import EventCard from '../components/EventCard';

const Home = () => {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const [featuredResponse, upcomingResponse] = await Promise.all([
          axios.get(`${baseurl}/events?featured=true&limit=6`),
          axios.get(`${baseurl}/api/events?status=upcoming&limit=8`),
        ]);

        setFeaturedEvents(featuredResponse.data.events || []);
        setUpcomingEvents(upcomingResponse.data.events || []);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const categories = [
    { name: 'Business', icon: <BuildingLibraryIcon className="h-8 w-8" />, count: 24, color: 'from-blue-600 to-cyan-600' },
    { name: 'Music', icon: <MusicalNoteIcon className="h-8 w-8" />, count: 18, color: 'from-purple-600 to-pink-600' },
    { name: 'Sports', icon: <TrophyIcon className="h-8 w-8" />, count: 12, color: 'from-orange-600 to-red-600' },
    { name: 'Networking', icon: <UsersIcon className="h-8 w-8" />, count: 16, color: 'from-green-600 to-emerald-600' },
    { name: 'Cultural', icon: <BuildingLibraryIcon className="h-8 w-8" />, count: 20, color: 'from-indigo-600 to-purple-600' },
    { name: 'Entertainment', icon: <FireIcon className="h-8 w-8" />, count: 15, color: 'from-pink-600 to-rose-600' },
  ];

  const stats = [
    { label: 'Events Hosted', value: '1,250+', icon: <CalendarIcon className="h-6 w-6" /> },
    { label: 'Happy Attendees', value: '45,000+', icon: <UsersIcon className="h-6 w-6" /> },
    { label: 'Partner Venues', value: '85+', icon: <MapPinIcon className="h-6 w-6" /> },
    { label: 'Cities Covered', value: '3', icon: <SparklesIcon className="h-6 w-6" /> },
  ];

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
      src: 'https://images.pexels.com/photos/1699156/pexels-photo-1699156.jpeg',
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
      icon: <StarIcon className="h-8 w-8" />,
      title: "Curated Selection",
      description: "Only quality events with great venues, good organization and the right crowd, hand-picked for Dubai.",
      gradient: "from-purple-600 to-pink-600"
    },
    {
      icon: <MapPinIcon className="h-8 w-8" />,
      title: "Prime Locations",
      description: "Clear venue details, maps and timings for Dubai's best rooftops, clubs, hotels and beach spots.",
      gradient: "from-blue-600 to-cyan-600"
    },
    {
      icon: <UsersIcon className="h-8 w-8" />,
      title: "People & Networking",
      description: "Meet new people, clients and friends at events built for connection, fun and memorable nights out.",
      gradient: "from-pink-600 to-rose-600"
    },
    {
      icon: <TicketIcon className="h-8 w-8" />,
      title: "Easy Booking",
      description: "Secure your spot in seconds with our seamless booking system and instant confirmation.",
      gradient: "from-green-600 to-emerald-600"
    },
    {
      icon: <SparklesIcon className="h-8 w-8" />,
      title: "VIP Access",
      description: "Exclusive access to premium events, early bird tickets, and special member-only experiences.",
      gradient: "from-orange-600 to-red-600"
    },
    {
      icon: <ClockIcon className="h-8 w-8" />,
      title: "24/7 Support",
      description: "Our dedicated team is always ready to help you plan the perfect event experience.",
      gradient: "from-indigo-600 to-purple-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="relative">
        <section className="pt-8 px-6">
          <div className="container mx-auto max-w-7xl">
            <EventCarousel />
          </div>
        </section>

        <section className="py-20 px-6 relative">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center space-y-4 mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 backdrop-blur-sm mb-4">
                <FireIcon className="h-4 w-4 text-purple-400" />
                <span className="text-sm font-semibold text-purple-300">Explore Categories</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-white">
                Discover Dubai's Premier Events
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                Choose by category, crowd and vibe – from chilled sunset sessions to full-scale festival nights.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-20">
              {categories.map((category, index) => (
                <Link
                  key={category.name}
                  to={`/events?category=${category.name.toLowerCase()}`}
                  className="group relative rounded-3xl bg-gradient-to-br from-purple-900/40 via-indigo-900/40 to-purple-800/40 backdrop-blur-sm border border-purple-500/20 p-8 text-center hover:border-purple-400/50 hover:scale-105 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/30"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 via-pink-600/0 to-purple-600/0 group-hover:from-purple-600/20 group-hover:via-pink-600/20 group-hover:to-purple-600/20 rounded-3xl transition-all duration-500" />
                  
                  <div className="relative space-y-4">
                    <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${category.color} text-white shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                      {category.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg mb-1">{category.name}</h3>
                      <p className="text-sm text-gray-400">{category.count} Events</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className="relative group rounded-3xl bg-gradient-to-br from-purple-900/60 via-indigo-900/60 to-purple-800/60 backdrop-blur-sm border border-purple-500/30 p-8 text-center hover:border-purple-400/50 hover:scale-105 transition-all duration-500 overflow-hidden"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 via-pink-600/0 to-purple-600/0 group-hover:from-purple-600/20 group-hover:via-pink-600/20 group-hover:to-purple-600/20 transition-all duration-500" />
                  
                  <div className="relative">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-lg mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                      {stat.icon}
                    </div>
                    <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-400 font-semibold uppercase tracking-wide">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-6">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center space-y-4 mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 backdrop-blur-sm mb-4">
                <SparklesIcon className="h-4 w-4 text-purple-400" />
                <span className="text-sm font-semibold text-purple-300">Experience Gallery</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-white">
                Immerse in the Experience
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                Get a glimpse of the unforgettable moments that await you at our premium events
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {experienceImages.map((image, index) => (
                <div
                  key={index}
                  className="group relative h-80 rounded-3xl overflow-hidden border border-purple-500/20 hover:border-purple-400/50 transition-all duration-500 hover:scale-105"
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-900 via-purple-900/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
                  <div className="absolute inset-0 flex flex-col justify-end p-6">
                    <h3 className="text-2xl font-bold text-white mb-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                      {image.title}
                    </h3>
                    <p className="text-gray-300 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                      {image.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-6">
          <div className="container mx-auto max-w-7xl">
            <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 backdrop-blur-sm">
                  <StarIcon className="h-4 w-4 text-purple-400" />
                  <span className="text-sm font-semibold text-purple-300">Featured Events</span>
                </div>
                <h2 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-white">
                  Spotlight Experiences
                </h2>
                <p className="text-xl text-gray-400 max-w-2xl">
                  Limited tickets, VIP access and special performances at Dubai's most exclusive venues
                </p>
              </div>
              <Link
                to="/events?featured=true"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 text-purple-300 hover:text-white hover:border-purple-400/50 font-semibold transition-all duration-300 group"
              >
                View all featured
                <ArrowRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="h-[500px] rounded-3xl bg-gradient-to-br from-purple-900/40 via-indigo-900/40 to-purple-800/40 backdrop-blur-sm border border-purple-500/20 animate-pulse"
                  />
                ))}
              </div>
            ) : featuredEvents.length === 0 ? (
              <div className="text-center py-32 rounded-3xl bg-gradient-to-br from-purple-900/20 via-indigo-900/20 to-purple-800/20 backdrop-blur-sm border border-purple-500/20">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-lg mb-6">
                  <StarIcon className="h-10 w-10" />
                </div>
                <p className="text-gray-400 text-xl font-semibold">
                  No featured events available right now. Check back soon for new highlights.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredEvents.map((event) => (
                  <EventCard key={event._id} event={event} />
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="py-20 px-6">
          <div className="container mx-auto max-w-7xl">
            <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 backdrop-blur-sm">
                  <CalendarIcon className="h-4 w-4 text-purple-400" />
                  <span className="text-sm font-semibold text-purple-300">Coming Soon</span>
                </div>
                <h2 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-white">
                  Upcoming Events
                </h2>
                <p className="text-xl text-gray-400 max-w-2xl">
                  Reserve your spot for concerts, brunches, nightlife and business meetups happening soon
                </p>
              </div>
              <Link
                to="/events"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 text-purple-300 hover:text-white hover:border-purple-400/50 font-semibold transition-all duration-300 group"
              >
                Browse all events
                <ArrowRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((n) => (
                  <div
                    key={n}
                    className="h-[500px] rounded-3xl bg-gradient-to-br from-purple-900/40 via-indigo-900/40 to-purple-800/40 backdrop-blur-sm border border-purple-500/20 animate-pulse"
                  />
                ))}
              </div>
            ) : upcomingEvents.length === 0 ? (
              <div className="text-center py-32 rounded-3xl bg-gradient-to-br from-purple-900/20 via-indigo-900/20 to-purple-800/20 backdrop-blur-sm border border-purple-500/20">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-lg mb-6">
                  <CalendarIcon className="h-10 w-10" />
                </div>
                <p className="text-gray-400 text-xl font-semibold">
                  No upcoming events available right now. New events will appear here soon.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {upcomingEvents.slice(0, 4).map((event) => (
                  <EventCard key={event._id} event={event} />
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="py-20 px-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-pink-900/20 to-purple-900/20" />
          
          <div className="container mx-auto max-w-7xl relative">
            <div className="text-center space-y-4 mb-20">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 backdrop-blur-sm mb-4">
                <SparklesIcon className="h-4 w-4 text-purple-400" />
                <span className="text-sm font-semibold text-purple-300">Why Choose Us</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-white">
                Why Choose Eventra Dubai?
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                A vibrant platform with curated events, clear details and easy booking – so planning your next experience feels as fun as attending it.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group relative rounded-3xl bg-gradient-to-br from-purple-900/40 via-indigo-900/40 to-purple-800/40 backdrop-blur-sm border border-purple-500/20 p-10 hover:border-purple-400/50 hover:scale-105 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/30"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 via-pink-600/0 to-purple-600/0 group-hover:from-purple-600/20 group-hover:via-pink-600/20 group-hover:to-purple-600/20 rounded-3xl transition-all duration-500" />
                  
                  <div className="relative space-y-6">
                    <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${feature.gradient} text-white shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-white">{feature.title}</h3>
                    <p className="text-gray-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-32 px-6 relative overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="https://images.pexels.com/photos/2747449/pexels-photo-2747449.jpeg"
              alt="Dubai skyline"
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/95 to-gray-950" />
          </div>
          
          <div className="container mx-auto max-w-7xl relative">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 backdrop-blur-sm mb-4">
                <TicketIcon className="h-4 w-4 text-purple-400" />
                <span className="text-sm font-semibold text-purple-300">Get Started Today</span>
              </div>
              
              <h2 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-white">
                Ready to Experience Dubai?
              </h2>
              
              <p className="text-2xl text-gray-300 leading-relaxed">
                Join thousands of event-goers discovering the best experiences Dubai has to offer
              </p>
              
              <div className="flex flex-wrap gap-6 justify-center pt-8">
                <Link
                  to="/events"
                  className="group inline-flex items-center gap-3 px-10 py-5 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xl shadow-2xl shadow-purple-500/50 hover:shadow-purple-500/70 hover:scale-105 transition-all duration-300"
                >
                  Browse Events
                  <ArrowRightIcon className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/about"
                  className="inline-flex items-center gap-3 px-10 py-5 rounded-full bg-white/10 backdrop-blur-sm border-2 border-white/20 text-white font-bold text-xl hover:bg-white/20 transition-all duration-300"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;