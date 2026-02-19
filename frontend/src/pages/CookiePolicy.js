import React, { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const CookiePolicy = () => {
  const lastUpdated = 'February 16, 2026';
  const [cookiePreferences, setCookiePreferences] = useState({
    necessary: true,
    functional: true,
    analytics: false,
    marketing: false
  });

  const handleSavePreferences = () => {
    localStorage.setItem('cookiePreferences', JSON.stringify(cookiePreferences));
    toast.success('Cookie preferences saved!');
  };

  const cookieTypes = [
    {
      id: 'necessary',
      name: 'Necessary Cookies',
      description: 'These cookies are essential for the website to function properly. They enable basic functions like page navigation, secure areas access, and remembering your preferences. The website cannot function properly without these cookies. These are always enabled as permitted under the PDPA.',
      required: true,
      examples: ['Session management', 'Security tokens', 'Load balancing']
    },
    {
      id: 'functional',
      name: 'Functional Cookies',
      description: 'These cookies enable enhanced functionality and personalisation, such as remembering your CV data, template preferences, and settings. If you disable these cookies, some features may not work correctly.',
      required: false,
      examples: ['Language preferences', 'CV data storage', 'Theme settings']
    },
    {
      id: 'analytics',
      name: 'Analytics Cookies',
      description: 'These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve our services and user experience. You can opt out at any time.',
      required: false,
      examples: ['Google Analytics', 'Page views tracking', 'Feature usage statistics']
    },
    {
      id: 'marketing',
      name: 'Marketing Cookies',
      description: 'These cookies may be set by our advertising partners to build a profile of your interests and show you relevant ads on other sites. They do not directly store personal information but uniquely identify your browser and device.',
      required: false,
      examples: ['Targeted advertising', 'Social media sharing', 'Retargeting']
    }
  ];

  const sections = [
    {
      title: 'What Are Cookies?',
      content: `Cookies are small text files that are stored on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide information to website owners.

Cookies can be "persistent" or "session" cookies:
• Persistent cookies remain on your device for a set period or until you delete them
• Session cookies are temporary and deleted when you close your browser`
    },
    {
      title: 'How We Use Cookies',
      content: `Ezy CV uses cookies for several purposes:

• Essential Operations: To make our website work correctly
• Remembering Preferences: To save your settings and CV data locally
• Security: To protect your account and prevent fraudulent activity
• Analytics: To understand how visitors use our site (with your explicit consent)
• Improvement: To test new features and improve user experience

Under Sri Lanka's Personal Data Protection Act (PDPA), we obtain your informed consent before placing non-essential cookies on your device.`
    },
    {
      title: 'Third-Party Cookies',
      content: `Some cookies on our site are placed by third-party services. These may include:

• Analytics providers (e.g., Google Analytics) — used to understand site usage
• Social media platforms (when you share content)
• Cloud storage services (Backblaze B2 for CV backup)

We ensure all third-party services comply with data protection standards consistent with the PDPA. Please refer to their respective privacy policies for more information.`
    },
    {
      title: 'Local Storage',
      content: `In addition to cookies, we use local storage to save your CV data directly in your browser. This allows you to:

• Work on your CV without creating an account
• Return later and continue where you left off
• Keep your data private on your device

You can clear local storage through your browser settings, but this will delete any saved CV data.`
    },
    {
      title: 'Managing Cookies',
      content: `You have full control over cookies. You can manage them in several ways:

Browser Settings: Most browsers allow you to refuse or delete cookies through settings. Note that disabling cookies may affect website functionality.

Our Preference Centre: Use the controls above to manage which cookies we use.

Do Not Track: We respect "Do Not Track" browser signals where technically feasible.

Under the PDPA, you have the right to withdraw your consent to non-essential cookies at any time.`
    },
    {
      title: 'Cookie Retention',
      content: `Different cookies are retained for different periods:

• Session cookies: Deleted when you close your browser
• Preference cookies: Retained for up to 1 year
• Analytics cookies: Retained for up to 2 years
• Local storage data: Retained until manually cleared

We review cookie retention periods regularly to ensure we do not retain data longer than necessary.`
    },
    {
      title: 'Your Rights',
      content: `Under the Personal Data Protection Act No. 9 of 2022 of Sri Lanka, you have the right to:

• Know what cookies we use and why
• Consent to or refuse non-essential cookies
• Withdraw consent at any time through our Cookie Preference Centre
• Request deletion of cookie-related data by contacting us
• Access information about the data collected via cookies`
    },
    {
      title: 'Updates to This Policy',
      content: `We may update this Cookie Policy from time to time to reflect changes in our practices, technology, or legal requirements under the PDPA. We will notify you of any material changes by updating the "Last Updated" date.`
    },
    {
      title: 'Contact Us',
      content: `If you have questions about our use of cookies, please contact us:

Email: privacy@ezycv.com
Website: https://ezycv.org
Regulatory Body: Data Protection Authority of Sri Lanka`
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-5xl mb-4">🍪</div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Cookie Policy</h1>
            <p className="text-cyan-100">Last updated: {lastUpdated}</p>
          </motion.div>
        </div>
      </section>

      {/* Cookie Preferences */}
      <section className="py-12 -mt-8 relative z-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Manage Your Cookie Preferences
            </h2>
            
            <div className="space-y-4">
              {cookieTypes.map((cookie) => (
                <div 
                  key={cookie.id}
                  className="flex items-start justify-between p-4 bg-gray-50 rounded-xl"
                >
                  <div className="flex-1 pr-4">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{cookie.name}</h3>
                      {cookie.required && (
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-xs rounded-full">Required</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{cookie.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {cookie.examples.map((example, i) => (
                        <span key={i} className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                          {example}
                        </span>
                      ))}
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={cookiePreferences[cookie.id]}
                      onChange={(e) => !cookie.required && setCookiePreferences({
                        ...cookiePreferences,
                        [cookie.id]: e.target.checked
                      })}
                      disabled={cookie.required}
                      className="sr-only peer"
                    />
                    <div className={`w-11 h-6 bg-gray-300 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer ${cookie.required ? 'peer-checked:bg-blue-400' : 'peer-checked:bg-blue-600'} peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all ${cookie.required ? 'opacity-60 cursor-not-allowed' : ''}`}></div>
                  </label>
                </div>
              ))}
            </div>

            <button
              onClick={handleSavePreferences}
              className="mt-6 w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all"
            >
              Save Preferences
            </button>
          </div>
        </div>
      </section>

      {/* Policy Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
            <div className="space-y-10">
              {sections.map((section, index) => (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                    <span className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center text-white text-sm">
                      {index + 1}
                    </span>
                    {section.title}
                  </h2>
                  <div className="text-gray-600 pl-11 whitespace-pre-line leading-relaxed">
                    {section.content}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CookiePolicy;
