import React from 'react';
import { 
  BuildingOffice2Icon,
  UserGroupIcon,
  TrophyIcon,
  MapPinIcon,
  HeartIcon,
  GlobeAltIcon,
  CheckCircleIcon,
  StarIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

const About = () => {
  const teamMembers = [
    {
      name: 'Ahmed Al Mansoori',
      role: 'CEO & Founder',
      description: '15+ years in event management across the GCC region',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      name: 'Sarah Al Hashimi',
      role: 'Operations Director',
      description: 'Expert in luxury event planning and venue management',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      name: 'Omar Al Farsi',
      role: 'Technology Director',
      description: 'Digital transformation specialist for the events industry',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      name: 'Fatima Al Qasimi',
      role: 'Marketing Director',
      description: 'Brand strategy and digital marketing expert',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    }
  ];

  const milestones = [
    { year: '2015', title: 'Founded', description: 'Started with 3 team members in Dubai Marina' },
    { year: '2017', title: 'First Major Event', description: 'Managed Dubai International Film Festival' },
    { year: '2019', title: 'Platform Launch', description: 'Launched Eventra digital platform' },
    { year: '2021', title: 'Regional Expansion', description: 'Expanded to Abu Dhabi and Sharjah' },
    { year: '2023', title: 'Tech Innovation', description: 'Integrated AI-powered event recommendations' }
  ];

  const values = [
    {
      title: 'Excellence',
      description: 'We strive for perfection in every event we manage',
      icon: StarIcon
    },
    {
      title: 'Innovation',
      description: 'Constantly evolving with technology and trends',
      icon: GlobeAltIcon
    },
    {
      title: 'Integrity',
      description: 'Transparent and honest in all our dealings',
      icon: CheckCircleIcon
    },
    {
      title: 'Passion',
      description: 'Driven by our love for creating memorable experiences',
      icon: HeartIcon
    }
  ];

  return (
    <div className="min-h-screen space-y-16 md:space-y-20 bg-white text-gray-900 overflow-hidden">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -left-12 sm:-top-32 sm:-left-24 h-48 w-48 sm:h-80 sm:w-80 rounded-full bg-pink-200/50 blur-xl sm:blur-3xl animate-pulse" />
          <div className="absolute -top-24 right-8 sm:-top-40 sm:right-20 h-56 w-56 sm:h-96 sm:w-96 rounded-full bg-purple-200/40 blur-xl sm:blur-3xl animate-pulse delay-1000" />
          <div className="absolute bottom-[-4rem] left-1/4 sm:bottom-[-8rem] h-48 w-48 sm:h-80 sm:w-80 rounded-full bg-sky-200/50 blur-xl sm:blur-3xl animate-pulse delay-500" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32 text-center">
          <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-pink-600 to-purple-600 bg-clip-text text-transparent mb-4 sm:mb-6 px-2">
            About Eventra Dubai
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed px-4 sm:px-0">
            Dubai's premier event platform connecting you to extraordinary experiences since 2015
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
          <div className="order-2 lg:order-1">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 bg-gradient-to-r from-gray-900 to-pink-600 bg-clip-text">
              Our Story
            </h2>
            <div className="prose prose-base sm:prose-lg text-gray-600 max-w-none">
              <p className="text-base sm:text-lg mb-4 sm:mb-6 leading-relaxed">
                Founded in the heart of Dubai, Eventra began with a simple vision: to transform how people discover and experience events in one of the world's most vibrant cities.
              </p>
              <p className="text-base sm:text-lg mb-4 sm:mb-6 leading-relaxed">
                What started as a small team of event enthusiasts has grown into Dubai's leading event management platform, curating thousands of unforgettable experiences.
              </p>
              <p className="text-base sm:text-lg leading-relaxed">
                Today, Eventra stands as a testament to Dubai's dynamic spirit, bridging exceptional organizers with attendees seeking memorable nights out.
              </p>
            </div>
          </div>
          <div className="order-1 lg:order-2 grid grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-3 sm:space-y-4">
              <div className="group relative overflow-hidden rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl sm:hover:shadow-2xl transition-all duration-500">
                <img
                  src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                  alt="Eventra Office"
                  className="w-full h-40 sm:h-48 md:h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="group relative overflow-hidden rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl sm:hover:shadow-2xl transition-all duration-500">
                <img
                  src="https://images.unsplash.com/photo-1549451371-64aa98a6f660?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                  alt="Team Meeting"
                  className="w-full h-40 sm:h-48 md:h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
            <div className="space-y-3 sm:space-y-4 mt-6 sm:mt-8 lg:mt-0">
              <div className="group relative overflow-hidden rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl sm:hover:shadow-2xl transition-all duration-500">
                <img
                  src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                  alt="Event Setup"
                  className="w-full h-40 sm:h-48 md:h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="group relative overflow-hidden rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl sm:hover:shadow-2xl transition-all duration-500">
                <img
                  src="https://images.unsplash.com/photo-1492684223066-e9e4aab4d25e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                  alt="Successful Event"
                  className="w-full h-40 sm:h-48 md:h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-gradient-to-br from-pink-50 via-white to-sky-50 py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
              Our Core Values
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4 sm:px-0">
              The principles that guide every decision and action we take
            </p>
          </div>
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {values.map((value, index) => (
              <div key={index} className="group bg-white p-6 sm:p-8 rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg sm:hover:shadow-xl hover:-translate-y-1 sm:hover:-translate-y-2 transition-all duration-300 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-gradient-to-r from-pink-500 to-purple-500 text-white mb-4 sm:mb-6 group-hover:scale-105 sm:group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <value.icon className="h-8 w-8 sm:h-10 sm:w-10" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 group-hover:text-pink-600 transition-colors">{value.title}</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
            Meet Our Leadership Team
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4 sm:px-0">
            The passionate individuals driving Eventra's success story
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {teamMembers.map((member, index) => (
            <div key={index} className="group bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg hover:shadow-xl sm:hover:shadow-2xl hover:-translate-y-1 sm:hover:-translate-y-2 transition-all duration-500 border border-gray-100">
              <div className="relative h-56 sm:h-64 md:h-72 overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <div className="p-6 sm:p-8 text-center">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-pink-500 font-bold text-sm sm:text-base md:text-lg mb-3 sm:mb-4 bg-pink-50 px-3 py-1 rounded-full inline-block w-fit mx-auto">{member.role}</p>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{member.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Milestones Section */}
      <section className="bg-gradient-to-r from-purple-50 via-pink-50 to-sky-50 py-12 sm:py-16 lg:py-20 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
              Our Journey
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4 sm:px-0">
              Milestones that shaped Eventra into Dubai's premier event platform
            </p>
          </div>
          <div className="relative max-w-4xl mx-auto">
            {/* Timeline line - hidden on mobile, shown on md and up */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-pink-400 to-purple-400 rounded-full z-0"></div>
            
            <div className="space-y-8 sm:space-y-12 md:space-y-16 relative z-10">
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex flex-col md:flex-row items-center ${index % 2 === 0 ? 'md:flex-row-reverse md:justify-start' : 'md:justify-end'}`}>
                  {/* Content */}
                  <div className={`w-full md:w-5/12 p-5 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg mb-4 md:mb-0 ${index % 2 === 0 ? 'md:ml-auto bg-gradient-to-br from-pink-500 to-purple-500 text-white' : 'md:mr-auto bg-white border border-gray-200 shadow-xl'}`}>
                    <div className="text-2xl sm:text-3xl font-black mb-2 sm:mb-3 bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
                      {milestone.year}
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">{milestone.title}</h3>
                    <p className={`text-sm sm:text-base ${index % 2 === 0 ? 'text-blue-100' : 'text-gray-600'}`}>{milestone.description}</p>
                  </div>
                  
                  {/* Timeline dot */}
                  <div className="hidden md:flex items-center justify-center">
                    <div className="w-6 h-6 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full border-4 border-white shadow-lg mx-4 flex-shrink-0 z-10"></div>
                  </div>
                  
                  {/* Mobile connector */}
                  <div className="md:hidden flex items-center justify-center my-4">
                    <ChevronRightIcon className="h-6 w-6 text-pink-500" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="bg-gradient-to-br from-pink-50 via-white to-purple-50 rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl p-6 sm:p-8 md:p-12 lg:p-16 xl:p-20 border border-gray-100">
          <div className="grid lg:grid-cols-3 gap-8 sm:gap-12 items-center">
            <div className="lg:col-span-2">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
                Ready to Create Unforgettable Events?
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 leading-relaxed max-w-2xl">
                Partner with Dubai's most trusted event platform. Whether you're organizing or attending, we make every event extraordinary.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-purple-500 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-bold text-white shadow-lg sm:shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
                >
                  Contact Our Team
                </a>
                <a
                  href="/events"
                  className="inline-flex items-center justify-center rounded-full border-2 border-gray-300 bg-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-bold text-gray-900 shadow-lg hover:border-pink-400 hover:bg-pink-50 hover:shadow-xl transition-all duration-300"
                >
                  Browse Events
                </a>
              </div>
            </div>
            <div className="text-center order-first lg:order-last">
              <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-xl sm:rounded-2xl bg-gradient-to-r from-yellow-400 to-pink-500 text-white shadow-xl sm:shadow-2xl mb-4 sm:mb-6">
                <TrophyIcon className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14" />
              </div>
              <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-2 sm:mb-3 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text">
                1,250+
              </div>
              <div className="text-base sm:text-lg md:text-xl font-semibold text-gray-600">Events Managed</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;