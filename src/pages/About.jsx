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
      name: 'Mohamed Jafar',
      role: 'CEO & Founder',
      description: 'Visionary leader with extensive experience in event management across the GCC region',
      image: '/jafer.png'
    },
    {
      name: 'Aghil Shajahan',
      role: 'Operations Director',
      description: 'Expert in luxury event planning and venue management across the UAE',
      image: '/agil.png'
    },
    {
      name: 'Jabir Ahmd',
      role: 'Technical Director',
      description: 'Digital transformation and technology innovation specialist for the events industry ',
      image: '/jabir.png'
    },
    {
      name: 'Mariya Rose',
      role: 'Marketing Director',
      description: 'Brand strategy and digital marketing expert with a creative approach',
      image: '/mariya.png'
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
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Animated background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="relative">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-32 pb-20 px-6">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/50 via-gray-950 to-gray-950" />
          
          <div className="container mx-auto max-w-7xl relative z-10">
            <div className="text-center space-y-8">
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold">
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-white">
                  About Eventra
                </span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
                  Dubai
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
                Dubai's premier event platform connecting you to extraordinary experiences since 2015
              </p>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-20 px-6">
          <div className="container mx-auto max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-white mb-6">
                  Our Story
                </h2>
                
                <div className="space-y-6">
                  <p className="text-lg text-gray-300 leading-relaxed">
                    Founded in the heart of Dubai, Eventra began with a simple vision: to transform how people discover and experience events in one of the world's most vibrant cities.
                  </p>
                  <p className="text-lg text-gray-300 leading-relaxed">
                    What started as a small team of event enthusiasts has grown into Dubai's leading event management platform, curating thousands of unforgettable experiences.
                  </p>
                  <p className="text-lg text-gray-300 leading-relaxed">
                    Today, Eventra stands as a testament to Dubai's dynamic spirit, bridging exceptional organizers with attendees seeking memorable nights out.
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="group relative overflow-hidden rounded-2xl">
                    <img
                      src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                      alt="Eventra Office"
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="group relative overflow-hidden rounded-2xl">
                    <img
                      src="https://images.unsplash.com/photo-1549451371-64aa98a6f660?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                      alt="Team Meeting"
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
                
                <div className="space-y-4 mt-8">
                  <div className="group relative overflow-hidden rounded-2xl">
                    <img
                      src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                      alt="Event Setup"
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="group relative overflow-hidden rounded-2xl">
                    <img
                      src="https://images.unsplash.com/photo-1492684223066-e9e4aab4d25e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                      alt="Successful Event"
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 px-6">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-white mb-4">
                Our Core Values
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                The principles that guide every decision and action we take
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="group relative rounded-2xl bg-gradient-to-br from-purple-900/40 via-indigo-900/40 to-purple-800/40 backdrop-blur-sm border border-purple-500/20 p-8 text-center hover:border-purple-400/50 hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 via-pink-600/0 to-purple-600/0 group-hover:from-purple-600/10 group-hover:via-pink-600/10 group-hover:to-purple-600/10 rounded-2xl transition-all duration-300" />
                  
                  <div className="relative space-y-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50 group-hover:scale-110 transition-all duration-300">
                      <value.icon className="h-8 w-8" />
                    </div>
                    <h3 className="text-2xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-300 group-hover:to-pink-300 transition-all duration-300">
                      {value.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

{/* Team Section */}
<section className="py-20 px-6">
  <div className="container mx-auto max-w-7xl">
    <div className="text-center mb-16">
      <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-white mb-4">
        Meet Our Leadership Team
      </h2>
      <p className="text-xl text-gray-400 max-w-3xl mx-auto">
        The passionate individuals driving Eventra's success story
      </p>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {teamMembers.map((member, index) => (
        <div
          key={index}
          className="group relative block overflow-hidden rounded-2xl bg-gradient-to-br from-purple-900/40 via-indigo-900/40 to-purple-800/40 backdrop-blur-sm border border-purple-500/20 hover:border-purple-400/50 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 via-pink-600/0 to-purple-600/0 group-hover:from-purple-600/10 group-hover:via-pink-600/10 group-hover:to-purple-600/10 transition-all duration-500" />
          
          {/* Fixed image container with object-cover and object-top to show faces */}
          <div className="relative h-64 overflow-hidden">
            <img
              src={member.image}
              alt={member.name}
              className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/400x400?text=' + member.name;
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
          </div>
          
          <div className="relative p-5 space-y-2">
            <h3 className="text-lg font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-300 group-hover:to-pink-300 transition-all duration-300">
              {member.name}
            </h3>
            
            <div className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30 px-2.5 py-0.5">
              <span className="text-xs font-semibold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300">
                {member.role}
              </span>
            </div>
            
            <p className="text-xs text-gray-300">
              {member.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

        {/* Milestones Section */}
        <section className="py-20 px-6">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-white mb-4">
                Our Journey
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Milestones that shaped Eventra into Dubai's premier event platform
              </p>
            </div>
            
            <div className="relative max-w-4xl mx-auto">
              <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-pink-500 to-purple-500 rounded-full z-0" />
              
              <div className="space-y-16 relative z-10">
                {milestones.map((milestone, index) => (
                  <div key={index} className={`flex flex-col md:flex-row items-center ${index % 2 === 0 ? 'md:flex-row-reverse md:justify-start' : 'md:justify-end'}`}>
                    <div className={`w-full md:w-5/12 p-6 rounded-2xl backdrop-blur-sm border ${index % 2 === 0 ? 'md:ml-auto bg-gradient-to-br from-purple-900/40 to-pink-900/40 border-purple-500/20' : 'md:mr-auto bg-gradient-to-br from-pink-900/40 to-purple-900/40 border-pink-500/20'}`}>
                      <div className="text-2xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-400">
                        {milestone.year}
                      </div>
                      <h3 className="text-xl font-bold text-white mb-3">{milestone.title}</h3>
                      <p className="text-gray-300">{milestone.description}</p>
                    </div>
                    
                    <div className="hidden md:flex items-center justify-center">
                      <div className="w-6 h-6 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full border-4 border-gray-950 shadow-lg mx-4 flex-shrink-0 z-10" />
                    </div>
                    
                    <div className="md:hidden flex items-center justify-center my-4">
                      <ChevronRightIcon className="h-6 w-6 text-purple-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6">
          <div className="container mx-auto max-w-7xl">
            <div className="relative rounded-3xl bg-gradient-to-br from-purple-900/40 via-indigo-900/40 to-purple-800/40 backdrop-blur-sm border border-purple-500/20 p-8 md:p-12 lg:p-16 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-pink-600/10 to-purple-600/10" />
              
              <div className="relative grid lg:grid-cols-3 gap-8 items-center">
                <div className="lg:col-span-2">
                  <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-white mb-6">
                    Ready to Create Unforgettable Events?
                  </h2>
                  <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-2xl">
                    Partner with Dubai's most trusted event platform. Whether you're organizing or attending, we make every event extraordinary.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <a
                      href="/contact"
                      className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/60 transition-all duration-300 hover:scale-105"
                    >
                      <span>Contact Our Team</span>
                      <svg className="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </a>
                    <a
                      href="/events"
                      className="inline-flex items-center justify-center rounded-full bg-white/5 backdrop-blur-sm border border-purple-500/30 px-8 py-4 text-lg font-semibold text-white hover:bg-white/10 hover:border-purple-400/50 transition-all duration-300"
                    >
                      Browse Events
                    </a>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50 mb-4">
                    <TrophyIcon className="h-10 w-10 md:h-12 md:w-12" />
                  </div>
                  <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2">
                    1,250+
                  </div>
                  <div className="text-lg font-semibold text-gray-300">Events Managed</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;