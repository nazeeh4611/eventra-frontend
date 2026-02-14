import React from 'react';
import { 
  ShieldCheckIcon,
  LockClosedIcon,
  EyeIcon,
  DocumentTextIcon,
  UserGroupIcon,
  GlobeAltIcon,
  EnvelopeIcon,
  PhoneIcon,
  CheckCircleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

const PrivacyPolicy = () => {
  const sections = [
    {
      title: '1. Information We Collect',
      content: 'We collect personal information you provide directly, including name, email address, phone number, payment information, and event preferences. We also automatically collect usage data, device information, and cookies when you interact with our platform.',
      icon: InformationCircleIcon
    },
    {
      title: '2. How We Use Your Information',
      content: 'Your information helps us process transactions, personalize your experience, send event recommendations, improve our services, communicate with you about updates, and comply with legal obligations in the UAE.',
      icon: EyeIcon
    },
    {
      title: '3. Information Sharing',
      content: 'We share your information with event organizers for ticket validation, payment processors for transactions, and legal authorities when required by UAE law. We never sell your personal data to third parties.',
      icon: UserGroupIcon
    },
    {
      title: '4. Cookies & Tracking',
      content: 'We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. You can control cookie settings through your browser, though some features may be affected.',
      icon:InformationCircleIcon
    },
    {
      title: '5. Data Security',
      content: 'We implement industry-standard security measures including encryption, secure servers, and regular security audits to protect your information. All payment data is PCI-DSS compliant.',
      icon: LockClosedIcon
    },
    {
      title: '6. Your Rights',
      content: 'Under UAE data protection laws, you have the right to access, correct, or delete your personal data. You may also opt-out of marketing communications and request data portability.',
      icon: ShieldCheckIcon
    },
    {
      title: '7. Data Retention',
      content: 'We retain your information as long as your account is active or as needed to provide services. We may retain certain data longer to comply with legal obligations or resolve disputes.',
      icon: DocumentTextIcon
    },
    {
      title: '8. International Transfers',
      content: 'Your information may be transferred to and processed in countries outside the UAE. We ensure appropriate safeguards are in place for such transfers.',
      icon: GlobeAltIcon
    },
    {
      title: '9. Children\'s Privacy',
      content: 'Our services are not directed to individuals under 18. We do not knowingly collect information from children. If you believe a child has provided us with data, please contact us.',
      icon: UserGroupIcon
    },
    {
      title: '10. Changes to Policy',
      content: 'We may update this privacy policy periodically. We will notify you of material changes through our platform or via email. Continued use constitutes acceptance of updates.',
      icon: DocumentTextIcon
    }
  ];

  const contactInfo = [
    { icon:InformationCircleIcon, text: 'Office 204, Building 7, Dubai Media City, Dubai, UAE' },
    { icon: PhoneIcon, text: '+971 4 123 4567' },
    { icon: EnvelopeIcon, text: 'privacy@eventra.ae' },
    { icon: GlobeAltIcon, text: 'www.eventra.ae/privacy' }
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="relative">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-32 pb-20 px-6">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/50 via-gray-950 to-gray-950" />
          
          <div className="container mx-auto max-w-7xl relative z-10">
            <div className="text-center space-y-8">
              <div className="flex justify-center mb-6">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 shadow-lg shadow-purple-500/50">
                  <ShieldCheckIcon className="h-16 w-16 text-white" />
                </div>
              </div>
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold">
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-white">
                  Privacy
                </span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
                  Policy
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
                How we protect and handle your personal information at Eventra Dubai
              </p>
              
              <div className="inline-flex items-center gap-2 rounded-full bg-purple-500/20 border border-purple-500/30 px-4 py-2">
                <span className="text-sm text-gray-300">Effective Date:</span>
                <span className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">
                  January 15, 2024
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Summary Banner */}
        <section className="py-8 px-6">
          <div className="container mx-auto max-w-5xl">
            <div className="rounded-2xl bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 p-6">
              <p className="text-lg text-gray-300 text-center">
                <span className="font-bold text-white">Our Commitment:</span> We respect your privacy and are committed to protecting your personal data. This policy explains how we collect, use, and safeguard your information when you use Eventra Dubai.
              </p>
            </div>
          </div>
        </section>

        {/* Main Sections */}
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

        {/* Data Collection Table */}
        <section className="py-16 px-6">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-white mb-12">
              Types of Data We Collect
            </h2>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-purple-900/60 to-pink-900/60">
                    <th className="px-6 py-4 text-left text-white font-bold rounded-tl-2xl">Data Category</th>
                    <th className="px-6 py-4 text-left text-white font-bold">Examples</th>
                    <th className="px-6 py-4 text-left text-white font-bold rounded-tr-2xl">Purpose</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { category: 'Personal Information', examples: 'Name, email, phone, date of birth', purpose: 'Account creation, communication' },
                    { category: 'Payment Data', examples: 'Credit card details, billing address', purpose: 'Transaction processing' },
                    { category: 'Event Preferences', examples: 'Favorite categories, saved events', purpose: 'Personalized recommendations' },
                    { category: 'Usage Data', examples: 'IP address, browser type, pages visited', purpose: 'Platform improvement' },
                    { category: 'Device Information', examples: 'Device type, operating system', purpose: 'Technical optimization' }
                  ].map((row, index) => (
                    <tr key={index} className="border-b border-purple-500/20 hover:bg-purple-900/20 transition-colors">
                      <td className="px-6 py-4 text-gray-300">{row.category}</td>
                      <td className="px-6 py-4 text-gray-300">{row.examples}</td>
                      <td className="px-6 py-4 text-gray-300">{row.purpose}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Your Rights Section */}
        <section className="py-16 px-6">
          <div className="container mx-auto max-w-5xl">
            <div className="rounded-3xl bg-gradient-to-br from-purple-900/40 via-indigo-900/40 to-purple-800/40 backdrop-blur-sm border border-purple-500/20 p-8 md:p-12">
              <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-white mb-8 text-center">
                Your Privacy Rights
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  'Right to Access your personal data',
                  'Right to Rectification of inaccurate data',
                  'Right to Erasure (Right to be forgotten)',
                  'Right to Restrict Processing',
                  'Right to Data Portability',
                  'Right to Object to processing',
                  'Right to withdraw consent',
                  'Right to lodge a complaint'
                ].map((right, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircleIcon className="h-6 w-6 text-purple-400 flex-shrink-0" />
                    <span className="text-gray-300">{right}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 px-6">
          <div className="container mx-auto max-w-5xl">
            <div className="rounded-3xl bg-gradient-to-br from-purple-900/40 via-indigo-900/40 to-purple-800/40 backdrop-blur-sm border border-purple-500/20 p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-white mb-6">
                    Privacy Questions?
                  </h2>
                  <p className="text-lg text-gray-300 mb-8">
                    Our Data Protection Officer is ready to assist with any privacy-related inquiries or concerns.
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
                  <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50 mb-6">
                    <ShieldCheckIcon className="h-16 w-16" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">GDPR & UAE Compliant</h3>
                  <p className="text-gray-400">
                    We adhere to UAE Federal Law No. 45 of 2021 on Personal Data Protection and international privacy standards.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;