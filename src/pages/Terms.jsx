import React from 'react';
import { 
  DocumentTextIcon,
  ShieldCheckIcon,
  ScaleIcon,
  CreditCardIcon,
  LockClosedIcon,
  GlobeAltIcon,
  UserGroupIcon,
  CalendarIcon,
  PhoneIcon,
  EnvelopeIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const TermsAndConditions = () => {
  const sections = [
    {
      title: '1. Acceptance of Terms',
      content: 'By accessing and using Eventra Dubai\'s platform, website, and services, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you may not use our services. These terms constitute a legally binding agreement between you and Eventra Dubai.',
      icon: DocumentTextIcon
    },
    {
      title: '2. Definitions',
      content: '"Platform" refers to Eventra Dubai\'s website and mobile applications. "Services" includes event listings, ticket purchases, event management tools, and related offerings. "User" includes event organizers, attendees, and any individual accessing our platform. "Content" means all information, text, images, and materials on our platform.',
      icon: GlobeAltIcon
    },
    {
      title: '3. User Accounts',
      content: 'Users must provide accurate, current, and complete information when creating an account. You are responsible for maintaining the confidentiality of your account credentials and all activities under your account. Notify us immediately of any unauthorized use. We reserve the right to suspend or terminate accounts for violations.',
      icon: UserGroupIcon
    },
    {
      title: '4. Event Listings & Ticketing',
      content: 'Event organizers are responsible for the accuracy of their listings. Eventra Dubai acts as a platform and is not responsible for event cancellations, changes, or disputes between organizers and attendees. Ticket purchases are subject to the event organizer\'s refund and cancellation policies.',
      icon: CalendarIcon
    },
    {
      title: '5. Payments & Fees',
      content: 'All payments are processed securely through our payment partners. Ticket prices include applicable taxes and service fees. Refunds are handled according to the specific event\'s policy. Eventra Dubai charges organizers a commission on ticket sales, detailed in our organizer agreement.',
      icon: CreditCardIcon
    },
    {
      title: '6. Cancellation & Refund Policy',
      content: 'Event cancellations: If an event is cancelled, attendees will receive a full refund of ticket price (service fees may be non-refundable). Attendee cancellations: Subject to the event organizer\'s policy as stated at purchase. Processing times for refunds vary by payment method.',
      icon: ScaleIcon
    },
    {
      title: '7. User Conduct',
      content: 'Users agree not to: harass others, post inappropriate content, attempt to breach platform security, use automated tools to access the platform, or engage in fraudulent activities. We reserve the right to remove content and ban users violating these rules.',
      icon: ShieldCheckIcon
    },
    {
      title: '8. Intellectual Property',
      content: 'All platform content, including logos, designs, text, and software, is owned by Eventra Dubai or our licensors and protected by UAE and international copyright laws. Users may not reproduce, distribute, or create derivative works without explicit permission.',
      icon: LockClosedIcon
    },
    {
      title: '9. Privacy & Data Protection',
      content: 'Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your personal data. By using our services, you consent to such processing and warrant that all data provided is accurate.',
      icon: ShieldCheckIcon
    },
    {
      title: '10. Limitation of Liability',
      content: 'Eventra Dubai is not liable for indirect, incidental, or consequential damages arising from platform use. Our total liability is limited to the amount paid for services in the preceding 12 months. We do not guarantee uninterrupted or error-free service.',
      icon: ScaleIcon
    },
    {
      title: '11. Indemnification',
      content: 'You agree to indemnify and hold Eventra Dubai harmless from any claims, damages, or expenses arising from your use of the platform, violation of these terms, or infringement of any third-party rights.',
      icon: CheckCircleIcon
    },
    {
      title: '12. Governing Law',
      content: 'These terms are governed by the laws of the United Arab Emirates and the Emirate of Dubai. Any disputes shall be resolved exclusively in the courts of Dubai. We may revise these terms at any time with notice to users.',
      icon: ScaleIcon
    }
  ];

  const contactInfo = [
    { icon: DocumentTextIcon, text: 'Office 204, Building 7, Dubai Media City, Dubai, UAE' },
    { icon: PhoneIcon, text: '+971 4 123 4567' },
    { icon: EnvelopeIcon, text: 'legal@eventra.ae' }
  ];

  const lastUpdated = 'January 15, 2024';

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Animated background effects - matching About page */}
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
                  Terms and
                </span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
                  Conditions
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
                Please read these terms carefully before using Eventra Dubai's platform
              </p>
              
              <div className="inline-flex items-center gap-2 rounded-full bg-purple-500/20 border border-purple-500/30 px-4 py-2">
                <span className="text-sm text-gray-300">Last Updated:</span>
                <span className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">
                  {lastUpdated}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Introduction */}
        <section className="py-12 px-6">
          <div className="container mx-auto max-w-4xl">
            <div className="rounded-2xl bg-gradient-to-br from-purple-900/40 via-indigo-900/40 to-purple-800/40 backdrop-blur-sm border border-purple-500/20 p-8 text-center">
              <p className="text-lg text-gray-300 leading-relaxed">
                Welcome to Eventra Dubai. These Terms and Conditions govern your use of our platform and services. 
                By accessing or using Eventra, you agree to be bound by these terms. If you're using our platform 
                on behalf of an organization, you represent that you have authority to bind that organization.
              </p>
            </div>
          </div>
        </section>

        {/* Main Terms Sections */}
        <section className="py-12 px-6">
          <div className="container mx-auto max-w-5xl">
            <div className="grid gap-8">
              {sections.map((section, index) => (
                <div
                  key={index}
                  className="group relative rounded-2xl bg-gradient-to-br from-purple-900/40 via-indigo-900/40 to-purple-800/40 backdrop-blur-sm border border-purple-500/20 p-8 hover:border-purple-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 via-pink-600/0 to-purple-600/0 group-hover:from-purple-600/10 group-hover:via-pink-600/10 group-hover:to-purple-600/10 rounded-2xl transition-all duration-300" />
                  
                  <div className="relative flex items-start gap-6">
                    <div className="flex-shrink-0">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50">
                        <section.icon className="h-6 w-6" />
                      </div>
                    </div>
                    
                    <div className="flex-1 space-y-3">
                      <h2 className="text-2xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-300 group-hover:to-pink-300 transition-all duration-300">
                        {section.title}
                      </h2>
                      <p className="text-gray-300 leading-relaxed">
                        {section.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Additional Important Information */}
        <section className="py-16 px-6">
          <div className="container mx-auto max-w-5xl">
            <div className="grid md:grid-cols-2 gap-8">
              {/* For Organizers */}
              <div className="rounded-2xl bg-gradient-to-br from-purple-900/40 via-indigo-900/40 to-purple-800/40 backdrop-blur-sm border border-purple-500/20 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600">
                    <UserGroupIcon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">For Event Organizers</h3>
                </div>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-2">
                    <CheckCircleIcon className="h-5 w-5 text-purple-400 flex-shrink-0 mt-0.5" />
                    <span>You retain full ownership of your event content</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircleIcon className="h-5 w-5 text-purple-400 flex-shrink-0 mt-0.5" />
                    <span>Commission rates are clearly outlined in your organizer agreement</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircleIcon className="h-5 w-5 text-purple-400 flex-shrink-0 mt-0.5" />
                    <span>Payouts are processed within 5-7 business days after events</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircleIcon className="h-5 w-5 text-purple-400 flex-shrink-0 mt-0.5" />
                    <span>You're responsible for event quality and accuracy of listings</span>
                  </li>
                </ul>
              </div>

              {/* For Attendees */}
              <div className="rounded-2xl bg-gradient-to-br from-pink-900/40 via-purple-900/40 to-indigo-900/40 backdrop-blur-sm border border-pink-500/20 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-pink-600 to-purple-600">
                    <CalendarIcon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">For Event Attendees</h3>
                </div>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-2">
                    <CheckCircleIcon className="h-5 w-5 text-pink-400 flex-shrink-0 mt-0.5" />
                    <span>Tickets are non-transferable unless specified otherwise</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircleIcon className="h-5 w-5 text-pink-400 flex-shrink-0 mt-0.5" />
                    <span>Refunds follow the event organizer's specific policy</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircleIcon className="h-5 w-5 text-pink-400 flex-shrink-0 mt-0.5" />
                    <span>Valid ID may be required for event entry</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircleIcon className="h-5 w-5 text-pink-400 flex-shrink-0 mt-0.5" />
                    <span>Age restrictions apply as specified per event</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Contact & Legal Info */}
        <section className="py-16 px-6">
          <div className="container mx-auto max-w-5xl">
            <div className="rounded-3xl bg-gradient-to-br from-purple-900/40 via-indigo-900/40 to-purple-800/40 backdrop-blur-sm border border-purple-500/20 p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-white mb-6">
                    Questions About Our Terms?
                  </h2>
                  <p className="text-lg text-gray-300 mb-8">
                    Our legal team is here to help you understand our terms and conditions. Reach out with any questions.
                  </p>
                  
                  <div className="space-y-4">
                    {contactInfo.map((item, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-purple-500/20">
                          <item.icon className="h-5 w-5 text-purple-400" />
                        </div>
                        <span className="text-gray-300">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50 mb-6">
                    <DocumentTextIcon className="h-12 w-12" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Legal Compliance</h3>
                  <p className="text-gray-400">
                    Eventra Dubai complies with UAE Federal Laws and Dubai Economic Department regulations. 
                    Trade License No: 1234567
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Acceptance Footer */}
        <section className="py-12 px-6">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center space-y-4">
              <p className="text-gray-400">
                By continuing to use Eventra Dubai's platform, you acknowledge that you have read, 
                understood, and agree to be bound by these Terms and Conditions.
              </p>
              <p className="text-sm text-gray-500">
                © {new Date().getFullYear()} Eventra Dubai. All rights reserved.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TermsAndConditions;