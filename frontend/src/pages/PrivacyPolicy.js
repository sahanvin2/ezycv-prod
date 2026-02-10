import React from 'react';
import { motion } from 'framer-motion';

const PrivacyPolicy = () => {
  const lastUpdated = 'January 29, 2026';

  const sections = [
    {
      title: 'Information We Collect',
      content: `We collect information you provide directly to us, such as when you create a CV, register for an account, or contact us for support.

**Personal Information:** Name, email address, phone number, and professional information you include in your CV.

**Usage Data:** Information about how you use our services, including pages visited, features used, and time spent on the platform.

**Device Information:** Browser type, operating system, device type, and IP address.`
    },
    {
      title: 'How We Use Your Information',
      content: `We use the information we collect to:

• Provide, maintain, and improve our services
• Process and complete transactions
• Send you technical notices and support messages
• Respond to your comments and questions
• Analyze usage patterns to improve user experience
• Protect against fraudulent or illegal activity`
    },
    {
      title: 'Data Storage and Security',
      content: `Your CV data is primarily stored locally in your browser using local storage technology. This means:

• Your data stays on your device unless you choose to create an account
• We use industry-standard encryption to protect any data transmitted to our servers
• We implement appropriate technical and organizational measures to protect your personal data
• We regularly review and update our security practices`
    },
    {
      title: 'Information Sharing',
      content: `We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:

• With your consent
• To comply with legal obligations
• To protect our rights and prevent fraud
• With service providers who assist in our operations (under strict confidentiality agreements)`
    },
    {
      title: 'Cookies and Tracking',
      content: `We use cookies and similar tracking technologies to:

• Remember your preferences and settings
• Analyze site traffic and usage patterns
• Improve our services and user experience

You can control cookie settings through your browser preferences. See our Cookie Policy for more details.`
    },
    {
      title: 'Your Rights',
      content: `You have the right to:

• Access the personal information we hold about you
• Request correction of inaccurate data
• Request deletion of your data
• Object to processing of your data
• Data portability
• Withdraw consent at any time

To exercise these rights, please contact us at privacy@ezycv.com`
    },
    {
      title: 'Children\'s Privacy',
      content: `Our services are not intended for children under 16 years of age. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.`
    },
    {
      title: 'International Data Transfers',
      content: `Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data in accordance with this privacy policy.`
    },
    {
      title: 'Changes to This Policy',
      content: `We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last Updated" date.`
    },
    {
      title: 'Contact Us',
      content: `If you have any questions about this Privacy Policy, please contact us:

**Email:** privacy@ezycv.com
**Address:** Ezy CV, San Francisco, CA, USA`
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-blue-100">Last updated: {lastUpdated}</p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
            <p className="text-gray-600 mb-8 text-lg">
              At Ezy CV, we take your privacy seriously. This Privacy Policy explains how we collect, 
              use, disclose, and safeguard your information when you use our website and services.
            </p>

            <div className="space-y-10">
              {sections.map((section, index) => (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                    <span className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white text-sm">
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

export default PrivacyPolicy;
