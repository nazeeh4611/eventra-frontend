import React, { useState } from 'react';
import { 
  MapPinIcon, 
  PhoneIcon, 
  EnvelopeIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  UsersIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const whatsappMessage = `New Contact Form Submission%0A%0A` +
        `Name: ${formData.name}%0A` +
        `Email: ${formData.email}%0A` +
        `Phone: ${formData.phone}%0A` +
        `Subject: ${formData.subject}%0A` +
        `Message: ${formData.message}`;

      window.open(`https://wa.me/+971501234567?text=${whatsappMessage}`, '_blank');
      
      toast.success('Message sent successfully! We will contact you soon.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactInfo = [
    {
      title: 'Visit Our Office',
      description: 'Business Bay, Dubai, UAE',
      details: 'Emirates Towers, Level 15',
      icon: MapPinIcon,
      color: 'text-pink-400'
    },
    {
      title: 'Call Us',
      description: '+971 4 123 4567',
      details: 'Mon-Fri 9AM-6PM',
      icon: PhoneIcon,
      color: 'text-purple-400'
    },
    {
      title: 'Email Us',
      description: 'info@eventradubai.ae',
      details: 'support@eventradubai.ae',
      icon: EnvelopeIcon,
      color: 'text-blue-400'
    },
    {
      title: 'Business Hours',
      description: 'Sunday - Thursday',
      details: '9:00 AM - 6:00 PM GST',
      icon: ClockIcon,
      color: 'text-yellow-400'
    }
  ];

  const departments = [
    {
      name: 'Event Partnerships',
      email: 'partnerships@eventradubai.ae',
      phone: '+971 4 123 4567 Ext. 101'
    },
    {
      name: 'Customer Support',
      email: 'support@eventradubai.ae',
      phone: '+971 4 123 4567 Ext. 102'
    },
    {
      name: 'Media & PR',
      email: 'media@eventradubai.ae',
      phone: '+971 4 123 4567 Ext. 103'
    },
    {
      name: 'Technical Support',
      email: 'tech@eventradubai.ae',
      phone: '+971 4 123 4567 Ext. 104'
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
                  Get In Touch
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
                Ready to plan your next epic event? Our team is here to make it unforgettable.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="py-20 px-6">
          <div className="container mx-auto max-w-7xl">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="relative rounded-2xl bg-gradient-to-br from-purple-900/40 via-indigo-900/40 to-purple-800/40 backdrop-blur-sm border border-purple-500/20 p-8 lg:p-12">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 via-pink-600/0 to-purple-600/0 group-hover:from-purple-600/10 group-hover:via-pink-600/10 group-hover:to-purple-600/10 rounded-2xl transition-all duration-300" />
                  
                  <div className="relative flex items-center mb-10">
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30 mr-6">
                      <ChatBubbleLeftRightIcon className="h-8 w-8 text-purple-300" />
                    </div>
                    <div>
                      <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-white mb-2">
                        Send us a message
                      </h2>
                      <p className="text-xl text-gray-400">We respond within 24 hours</p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="relative space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-3">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-5 py-4 rounded-2xl bg-gray-900/50 border border-purple-500/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-3">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-5 py-4 rounded-2xl bg-gray-900/50 border border-purple-500/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                          placeholder="hello@eventradubai.ae"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-3">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-5 py-4 rounded-2xl bg-gray-900/50 border border-purple-500/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                          placeholder="+971 50 123 4567"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-3">
                          Subject *
                        </label>
                        <select
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          className="w-full px-5 py-4 rounded-2xl bg-gray-900/50 border border-purple-500/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 appearance-none"
                        >
                          <option value="" className="bg-gray-900">Choose your inquiry</option>
                          <option value="general" className="bg-gray-900">General Inquiry</option>
                          <option value="partnership" className="bg-gray-900">Partnership Opportunity</option>
                          <option value="event" className="bg-gray-900">Event Planning</option>
                          <option value="technical" className="bg-gray-900">Technical Support</option>
                          <option value="feedback" className="bg-gray-900">Feedback & Suggestions</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-3">
                        Your Message *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows="6"
                        className="w-full px-5 py-4 rounded-2xl bg-gray-900/50 border border-purple-500/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-vertical"
                        placeholder="Tell us about your event vision, party plans, or questions..."
                      />
                    </div>

                    <div className="flex items-start p-4 rounded-2xl bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-500/30">
                      <input
                        type="checkbox"
                        id="newsletter"
                        className="h-5 w-5 text-purple-500 focus:ring-purple-500 border-gray-600 rounded mt-1 flex-shrink-0 bg-gray-800"
                      />
                      <label htmlFor="newsletter" className="ml-3 text-base text-gray-300 leading-relaxed cursor-pointer">
                        ✨ Subscribe to our newsletter for exclusive event invites and party updates
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full group relative inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/60 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-2"></div>
                          Sending Message...
                        </>
                      ) : (
                        <>
                          Send Message
                          <PaperAirplaneIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>

              {/* Contact Info Sidebar */}
              <div className="space-y-8">
                <div className="space-y-6">
                  <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-white">
                    Quick Contact
                  </h3>
                  <p className="text-xl text-gray-400 leading-relaxed">
                    Reach out through any channel. Our team responds fast!
                  </p>
                </div>

                <div className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="group relative rounded-2xl bg-gradient-to-br from-purple-900/40 via-indigo-900/40 to-purple-800/40 backdrop-blur-sm border border-purple-500/20 p-6 hover:border-purple-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20">
                      <div className="relative flex items-start space-x-4">
                        <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-600/20 to-pink-600/20 text-purple-300 group-hover:scale-110 transition-all duration-300">
                          <info.icon className={`h-7 w-7 ${info.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-xl text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-300 group-hover:to-pink-300 transition-all duration-300">
                            {info.title}
                          </h4>
                          <p className="text-lg font-semibold text-gray-300 mb-1 truncate">
                            {info.description}
                          </p>
                          <p className="text-sm text-gray-400 leading-relaxed">
                            {info.details}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Emergency Support */}
                <div className="relative rounded-3xl bg-gradient-to-br from-purple-600/20 via-pink-600/20 to-purple-600/20 backdrop-blur-sm border border-pink-500/30 p-8 hover:shadow-2xl hover:shadow-pink-500/20 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-pink-600/10 to-purple-600/10 rounded-3xl" />
                  
                  <div className="relative space-y-4">
                    <h4 className="text-2xl font-bold text-white">🚨 Emergency Support</h4>
                    <p className="text-lg text-gray-300">
                      Immediate help for ongoing events
                    </p>
                    <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 mb-2">
                      +971 50 123 4567
                    </div>
                    <p className="text-base text-gray-400 font-medium">
                      24/7 emergency hotline
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Departments Section */}
        <section className="py-20 px-6">
          <div className="container mx-auto max-w-7xl">
            <div className="relative rounded-3xl bg-gradient-to-br from-purple-900/40 via-indigo-900/40 to-purple-800/40 backdrop-blur-sm border border-purple-500/20 p-12 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-pink-600/10 to-purple-600/10" />
              
              <div className="relative">
                <h3 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-white mb-12 text-center">
                  Contact Specific Departments
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {departments.map((dept, index) => (
                    <div key={index} className="group relative rounded-2xl bg-gradient-to-br from-purple-900/40 via-indigo-900/40 to-purple-800/40 backdrop-blur-sm border border-purple-500/20 p-8 hover:border-purple-400/50 transition-all duration-300 hover:scale-105 text-center">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 via-pink-600/0 to-purple-600/0 group-hover:from-purple-600/10 group-hover:via-pink-600/10 group-hover:to-purple-600/10 rounded-2xl transition-all duration-300" />
                      
                      <div className="relative">
                        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30 p-4 group-hover:scale-110 transition-all duration-300">
                          <EnvelopeIcon className="h-8 w-8 text-purple-300" />
                        </div>
                        <h4 className="text-xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-300 group-hover:to-pink-300 transition-all duration-300">
                          {dept.name}
                        </h4>
                        <div className="space-y-2">
                          <a 
                            href={`mailto:${dept.email}`}
                            className="block text-purple-400 hover:text-purple-300 font-semibold text-base transition-colors"
                          >
                            📧 {dept.email}
                          </a>
                          <a 
                            href={`tel:${dept.phone}`}
                            className="block text-gray-400 hover:text-gray-300 font-medium text-sm transition-colors"
                          >
                            📞 {dept.phone}
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-20 px-6">
          <div className="container mx-auto max-w-7xl">
            <div className="relative rounded-3xl bg-gradient-to-br from-purple-900/40 via-indigo-900/40 to-purple-800/40 backdrop-blur-sm border border-purple-500/20 overflow-hidden">
              <div className="h-96 lg:h-[28rem] relative">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3610.238592056396!2d55.27041477519598!3d25.197366977705753!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f43348a67e24b%3A0xff45e502e1ceb7e2!2sBurj%20Khalifa!5e0!3m2!1sen!2sae!4v1686141234567!5m2!1sen!2sae"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  title="Eventra Dubai Location"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                />
              </div>
              
              <div className="p-12 lg:px-20">
                <h3 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-white mb-12 text-center">
                  Find Our Office
                </h3>
                <div className="grid md:grid-cols-3 gap-12">
                  <div className="text-center lg:text-left">
                    <h4 className="text-2xl font-bold text-white mb-4 flex items-center justify-center lg:justify-start gap-2">
                      <MapPinIcon className="h-8 w-8 text-pink-400" />
                      Main Office
                    </h4>
                    <p className="text-lg text-gray-300 leading-relaxed">
                      Emirates Towers<br />
                      Level 15<br />
                      Business Bay, Dubai<br />
                      United Arab Emirates
                    </p>
                  </div>
                  <div className="text-center lg:text-left">
                    <h4 className="text-2xl font-bold text-white mb-4 flex items-center justify-center lg:justify-start gap-2">
                      <ClockIcon className="h-8 w-8 text-purple-400" />
                      Parking
                    </h4>
                    <p className="text-lg text-gray-300 leading-relaxed">
                      Underground parking available<br />
                      Valet service on request<br />
                      EV charging stations
                    </p>
                  </div>
                  <div className="text-center lg:text-left">
                    <h4 className="text-2xl font-bold text-white mb-4 flex items-center justify-center lg:justify-start gap-2">
                      <UsersIcon className="h-8 w-8 text-blue-400" />
                      Public Transport
                    </h4>
                    <p className="text-lg text-gray-300 leading-relaxed">
                      Business Bay Metro Station<br />
                      Multiple bus routes<br />
                      Taxi stand at entrance
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 px-6">
          <div className="container mx-auto max-w-7xl">
            <div className="relative rounded-3xl bg-gradient-to-br from-purple-900/40 via-indigo-900/40 to-purple-800/40 backdrop-blur-sm border border-purple-500/20 p-16 lg:p-20 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-pink-600/10 to-purple-600/10" />
              
              <div className="relative text-center">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50 mb-8">
                  <ChatBubbleLeftRightIcon className="h-12 w-12" />
                </div>
                <h2 className="text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-white mb-6">
                  Still have questions?
                </h2>
                <p className="text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
                  Check our FAQ or schedule a quick call for personalized party planning assistance.
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                  <a 
                    href="#faq" 
                    className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-10 py-5 text-xl font-bold text-white shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/60 transition-all duration-300 hover:scale-105"
                  >
                    <span>🎉 View FAQ</span>
                    <svg className="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </a>
                  <button className="inline-flex items-center justify-center rounded-full bg-white/5 backdrop-blur-sm border border-purple-500/30 px-10 py-5 text-xl font-bold text-white hover:bg-white/10 hover:border-purple-400/50 transition-all duration-300">
                    📞 Schedule a Call
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Contact;