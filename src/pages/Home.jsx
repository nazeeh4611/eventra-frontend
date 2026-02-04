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
} from '@heroicons/react/24/outline';
import axios from 'axios';

const EventCard = ({ event }) => {
  const date = new Date(event.date);
  const day = date.toLocaleDateString('en-US', { day: '2-digit' });
  const month = date.toLocaleDateString('en-US', { month: 'short' });
  const weekday = date.toLocaleDateString('en-US', { weekday: 'short' });

  return (
    <Link
      to={`/events/${event._id}`}
      className="group bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col"
    >
      <div className="relative h-40 w-full overflow-hidden">
        <img
          src={
            event.featuredImage ||
            event.images?.[0] ||
            'https://images.pexels.com/photos/1699156/pexels-photo-1699156.jpeg'
          }
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <div className="absolute top-3 left-3 flex flex-col items-center justify-center bg-white/90 rounded-xl px-2 py-1 text-center shadow-sm">
          <span className="text-[10px] text-gray-600">{weekday}</span>
          <span className="text-lg font-bold text-gray-900 leading-none">{day}</span>
          <span className="text-[10px] text-pink-500">{month}</span>
        </div>
        {event.isFeatured && (
          <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-pink-500 text-white px-2.5 py-0.5 text-xs font-semibold shadow-sm">
            <StarIcon className="h-3 w-3" />
            Featured
          </span>
        )}
      </div>
      <div className="flex-1 flex flex-col p-4 space-y-2">
        <h3 className="text-sm sm:text-base font-semibold text-gray-900 line-clamp-2">
          {event.title}
        </h3>
        <p className="text-xs text-gray-500 line-clamp-2">
          {event.shortDescription || event.description}
        </p>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <MapPinIcon className="h-4 w-4" />
          <span className="truncate">
            {event.venue} • {event.location}
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between text-xs">
          <span className="inline-flex items-center gap-1 text-gray-600">
            <CalendarIcon className="h-4 w-4" />
            {event.time}
          </span>
          <span className="inline-flex items-center gap-1 font-semibold text-pink-600">
            {event.price && event.price > 0 ? `AED ${event.price.toFixed(0)}` : 'Free'}
          </span>
        </div>
      </div>
    </Link>
  );
};

const Home = () => {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const [featuredResponse, upcomingResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/events?featured=true&limit=6'),
          axios.get('http://localhost:5000/api/events?status=upcoming&limit=8'),
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
    { name: 'Business', icon: <BuildingLibraryIcon className="h-7 w-7" />, count: 24 },
    { name: 'Music', icon: <MusicalNoteIcon className="h-7 w-7" />, count: 18 },
    { name: 'Sports', icon: <TrophyIcon className="h-7 w-7" />, count: 12 },
    { name: 'Networking', icon: <UsersIcon className="h-7 w-7" />, count: 16 },
    { name: 'Cultural', icon: <StarIcon className="h-7 w-7" />, count: 20 },
    { name: 'Entertainment', icon: <FireIcon className="h-7 w-7" />, count: 15 },
  ];

  const stats = [
    { label: 'Events Hosted', value: '1,250+' },
    { label: 'Happy Attendees', value: '45,000+' },
    { label: 'Partner Venues', value: '85+' },
    { label: 'Cities Covered', value: '3' },
  ];

  const partyImages = [
    {
      src: 'https://images.pexels.com/photos/167636/pexels-photo-167636.jpeg',
      alt: 'People dancing at a colorful party',
    },
    {
      src: 'https://images.pexels.com/photos/1449794/pexels-photo-1449794.jpeg',
      alt: 'DJ playing in a club with neon lights',
    },
    {
      src: 'https://images.pexels.com/photos/1699156/pexels-photo-1699156.jpeg',
      alt: 'Friends celebrating with drinks and confetti',
    },
  ];

  return (
    <div className="space-y-20 bg-white text-gray-900">
      {/* Hero – white + colorful gradient accents */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -left-16 h-64 w-64 rounded-full bg-pink-200/70 blur-3xl" />
          <div className="absolute -top-24 right-0 h-64 w-64 rounded-full bg-purple-200/70 blur-3xl" />
          <div className="absolute bottom-[-6rem] left-1/3 h-64 w-64 rounded-full bg-sky-200/60 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 lg:pt-16 lg:pb-24">
          <div className="grid gap-10 lg:grid-cols-[1.4fr,1fr] items-center">
            <div className="space-y-6">
              <span className="inline-flex items-center rounded-full bg-pink-50 text-pink-600 text-xs font-semibold tracking-wide px-4 py-1 border border-pink-100">
                Dubai • Parties • Events
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900">
                Plan your next unforgettable night in Dubai.
              </h1>
              <p className="text-base sm:text-lg text-gray-600 max-w-2xl">
                Rooftop parties, beach festivals, brunches, business mixers and more – all curated in one bright, easy‑to‑use platform.
              </p>
              <div className="flex flex-wrap items-center gap-3 mt-2">
                <Link
                  to="/events"
                  className="inline-flex items-center justify-center rounded-full bg-gray-900 px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-900 transition"
                >
                  Browse All Events
                </Link>
                <Link
                  to="/events?featured=true"
                  className="inline-flex items-center justify-center rounded-full border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 hover:border-pink-400 hover:bg-pink-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-pink-500 transition"
                >
                  View Featured
                  <CalendarIcon className="h-4 w-4 ml-2" />
                </Link>
              </div>
              <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-gray-200 mt-4">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span>Live events updated daily</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                  <UsersIcon className="h-4 w-4" />
                  <span>Trusted by 45,000+ attendees</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-xl ring-1 ring-gray-200 bg-white">
                {/* Replace placeholder with your real carousel if you like */}
                <div className="h-64 flex items-center justify-center text-sm text-gray-500 bg-gradient-to-br from-pink-50 via-sky-50 to-yellow-50">
                  Event carousel / hero image
                </div>
              </div>
              <div className="hidden sm:flex gap-3 absolute -bottom-7 left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-lg px-4 py-3 items-center text-xs sm:text-sm text-gray-600 border border-gray-100">
                <MapPinIcon className="h-5 w-5 text-pink-500" />
                <span>Downtown • Marina • JBR • Festival City</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories + stats */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
              Discover Dubai&apos;s premier events
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
              Choose by category, crowd and vibe – from chilled sunset sessions to full‑scale festival nights.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 mb-12">
            {categories.map((category) => (
              <button
                type="button"
                key={category.name}
                className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-gray-200 hover:border-pink-400 hover:shadow-lg transition-all duration-200 text-center group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-pink-500"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-pink-500 via-purple-500 to-sky-500 text-white mb-3 group-hover:scale-105 group-active:scale-95 transition-transform duration-200">
                  {category.icon}
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-0.5">
                  {category.name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500">{category.count} Events</p>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-14">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-gradient-to-br from-pink-50 via-white to-sky-50 border border-pink-100 p-4 sm:p-6 rounded-2xl shadow-sm text-center"
              >
                <div className="text-xl sm:text-2xl font-bold text-pink-600 mb-1 sm:mb-2">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Party mood image strip */}
          <div className="grid md:grid-cols-3 gap-4 sm:gap-6">
            {partyImages.map((image, index) => (
              <div
                key={index}
                className="relative overflow-hidden rounded-3xl border border-gray-200 shadow-sm group bg-gray-50"
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="h-52 sm:h-64 w-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-sm sm:text-base font-semibold text-white drop-shadow">
                    {image.alt}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured events */}
      <section className="bg-gradient-to-b from-white via-pink-50/40 to-white py-14 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Featured events
              </h2>
              <p className="text-sm sm:text-base text-gray-600">
                Spotlight experiences with limited tickets, VIP access and special performances.
              </p>
            </div>
            <Link
              to="/events?featured=true"
              className="inline-flex items-center text-sm font-semibold text-pink-600 hover:text-pink-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-pink-500 rounded-full px-4 py-2 bg-white border border-gray-200 hover:border-pink-400 transition"
            >
              View all featured
              <CalendarIcon className="h-4 w-4 ml-2" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 space-y-4 animate-pulse"
                >
                  <div className="h-40 bg-gray-200 rounded-xl" />
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                    <div className="flex items-center gap-3 pt-2">
                      <div className="h-3 w-20 bg-gray-200 rounded" />
                      <div className="h-3 w-16 bg-gray-200 rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : featuredEvents.length === 0 ? (
            <div className="bg-white border border-dashed border-gray-300 rounded-2xl py-10 text-center text-gray-500 text-sm">
              No featured events available right now. Check back soon for new highlights.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredEvents.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Upcoming events */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Upcoming events
              </h2>
              <p className="text-sm sm:text-base text-gray-600">
                Reserve your spot for concerts, brunches, nightlife and business meetups happening soon.
              </p>
            </div>
            <Link
              to="/events"
              className="inline-flex items-center justify-center rounded-full bg-pink-500 px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-pink-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-pink-500 transition"
            >
              Browse all events
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div
                  key={n}
                  className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 space-y-4 animate-pulse"
                >
                  <div className="h-36 bg-gray-200 rounded-xl" />
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                    <div className="flex items-center gap-3 pt-2">
                      <div className="h-3 w-20 bg-gray-200 rounded" />
                      <div className="h-3 w-16 bg-gray-200 rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : upcomingEvents.length === 0 ? (
            <div className="bg-white border border-dashed border-gray-300 rounded-2xl py-10 text-center text-gray-500 text-sm">
              No upcoming events available right now. New events will appear here soon.
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

      {/* Why choose section */}
      <section className="bg-gradient-to-r from-pink-50 via-sky-50 to-yellow-50 text-gray-900 py-14 sm:py-16 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3">
              Why choose Eventra Dubai?
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-3xl mx-auto">
              A bright, friendly interface with curated events, clear details and easy booking – so planning your next party feels as fun as attending it.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center p-6 rounded-2xl bg-white border border-gray-200 shadow-sm">
              <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-pink-100 mb-4">
                <StarIcon className="h-7 w-7 sm:h-8 sm:w-8 text-pink-500" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">
                Curated selection
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                Only quality events with great venues, good organization and the right crowd, hand‑picked for Dubai.
              </p>
            </div>

            <div className="text-center p-6 rounded-2xl bg-white border border-gray-200 shadow-sm">
              <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-sky-100 mb-4">
                <MapPinIcon className="h-7 w-7 sm:h-8 sm:w-8 text-sky-500" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">
                Prime locations
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                Clear venue details, maps and timings for Dubai&apos;s best rooftops, clubs, hotels and beach spots.
              </p>
            </div>

            <div className="text-center p-6 rounded-2xl bg-white border border-gray-200 shadow-sm">
              <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-yellow-100 mb-4">
                <UsersIcon className="h-7 w-7 sm:h-8 sm:w-8 text-yellow-500" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">
                People & networking
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                Meet new people, clients and friends at events built for connection, fun and memorable nights out.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
