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

const NextArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/20 backdrop-blur-sm p-2 rounded-full border border-white/30"
  >
    <ChevronRightIcon className="h-5 w-5 text-white" />
  </button>
);

const PrevArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/20 backdrop-blur-sm p-2 rounded-full border border-white/30"
  >
    <ChevronLeftIcon className="h-5 w-5 text-white" />
  </button>
);

const EventCarousel = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4500,
    fade: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      { breakpoint: 768, settings: { arrows: false } }
    ]
  };

  if (loading) {
    return <div className="h-[420px] rounded-2xl bg-gray-900 animate-pulse" />;
  }

  const displayEvents = events.length ? events : staticSlides;
  const isStatic = events.length === 0;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-black">
      <Slider {...settings}>
        {displayEvents.map((event, i) => (
          <div key={event._id || i} className="relative h-[460px] sm:h-[520px] md:h-[600px]">
            <img
              src={event.featuredImage || event.image}
              alt={event.title}
              className="absolute inset-0 w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/20" />

            <div className="relative h-full flex items-end">
              <div className="w-full px-4 pb-5">
                <div className="space-y-3 max-w-xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-600/30 border border-purple-500/40 backdrop-blur">
                    <SparklesIcon className="h-4 w-4 text-purple-300" />
                    <span className="text-xs font-bold text-white">
                      {isStatic ? 'Discover Events' : 'Featured Event'}
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl md:text-4xl font-extrabold text-white leading-tight">
                    {event.title}
                  </h2>

                  <p className="text-sm sm:text-base text-gray-200 line-clamp-2">
                    {event.shortDescription}
                  </p>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-white/10 border border-white/20 rounded-lg p-2 backdrop-blur">
                      <CalendarDaysIcon className="h-4 w-4 text-purple-300 mb-1" />
                      <p className="text-[10px] text-gray-300">Date</p>
                      <p className="text-white text-xs font-semibold">
                        {new Date(event.date).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="bg-white/10 border border-white/20 rounded-lg p-2 backdrop-blur">
                      <MapPinIcon className="h-4 w-4 text-blue-300 mb-1" />
                      <p className="text-[10px] text-gray-300">Venue</p>
                      <p className="text-white text-xs font-semibold truncate">
                        {event.venue}
                      </p>
                    </div>

                    <div className="bg-white/10 border border-white/20 rounded-lg p-2 backdrop-blur">
                      <TicketIcon className="h-4 w-4 text-pink-300 mb-1" />
                      <p className="text-[10px] text-gray-300">Price</p>
                      <p className="text-white text-xs font-semibold">
                        {event.price === 'Varies' ? 'Varies' : `AED ${event.price}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 pt-1">
                    <Link
                      to={isStatic ? '/events' : `/events/${event._id}`}
                      className="w-full text-center rounded-full bg-gradient-to-r from-purple-600 to-pink-600 py-3 text-sm font-bold text-white"
                    >
                      {isStatic ? 'Explore Events' : 'Book Now'}
                    </Link>

                    {!isStatic && (
                      <Link
                        to={`/events/${event._id}#guestlist`}
                        className="w-full text-center rounded-full bg-white/10 border border-white/30 py-3 text-sm font-bold text-white"
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
    </div>
  );
};

export default EventCarousel;
