import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const TermsOfService = () => {
  const lastUpdated = 'February 16, 2026';

  const sections = [
    {
      title: 'Acceptance of Terms',
      content: `By accessing and using Ezy CV ("Service"), you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these terms, please do not use our Service.

These Terms of Service apply to all users of the Service, including without limitation users who are browsers, customers, and/or contributors of content. These terms are governed by the laws of Sri Lanka.`
    },
    {
      title: 'Description of Service',
      content: `Ezy CV provides a free online platform for creating professional CVs and resumes, along with access to wallpapers and stock photos. Our services include:

• CV/Resume builder with multiple templates
• PDF export functionality
• Cloud backup of your CV data (via Backblaze B2 secure storage)
• HD wallpapers for personal use
• Stock photos for personal and commercial use (where indicated)
• User account management`
    },
    {
      title: 'User Accounts',
      content: `To access certain features of the Service, you may be required to create an account. You agree to:

• Provide accurate and complete registration information
• Maintain the security of your account credentials
• Promptly update any changes to your information
• Accept responsibility for all activities under your account
• Notify us immediately of any unauthorised use

Both registered and non-registered users can create CVs. Non-registered users' data is stored locally in their browser and optionally backed up in our cloud storage.`
    },
    {
      title: 'User Content and Data Ownership',
      content: `You retain full ownership of any content you create using our Service, including your CVs and personal information. By using our Service, you grant us a limited licence to:

• Store and process your content to provide the Service
• Display your content back to you
• Create secure backups in our cloud storage (Backblaze B2) for data protection purposes
• Generate anonymised, aggregate statistics (e.g., total CVs created)

You are solely responsible for the accuracy and legality of the information you include in your CV. We process your personal data in accordance with our Privacy Policy and the Personal Data Protection Act No. 9 of 2022 (PDPA) of Sri Lanka.`
    },
    {
      title: 'Acceptable Use',
      content: `You agree not to use the Service to:

• Upload false, misleading, or fraudulent information
• Violate any applicable Sri Lankan or international laws
• Infringe upon intellectual property rights
• Distribute malware or harmful code
• Attempt to gain unauthorised access to our systems
• Harass, abuse, or harm other users
• Use automated systems to access the Service without permission
• Resell or redistribute our services without authorisation`
    },
    {
      title: 'Intellectual Property',
      content: `The Service and its original content, features, and functionality are owned by Ezy CV and are protected by Sri Lankan and international copyright, trademark, and intellectual property laws.

Our Content: All templates, designs, graphics, and software are our property or licensed to us.

Your Content: You retain full rights to your personal information and CV content.

Wallpapers & Photos: Usage rights vary by image. Check individual licences before commercial use.`
    },
    {
      title: 'No Employment Guarantee',
      content: `Ezy CV is a tool for creating CVs and resumes only. We make absolutely no guarantees that:

• Using our service will result in employment or job interviews
• The CV templates will be suitable for all industries or countries
• The information or advice provided is error-free

You are solely responsible for reviewing and verifying all content in your CV before submission to potential employers.`
    },
    {
      title: 'Free Service & Limitations',
      content: `Ezy CV is provided free of charge. We reserve the right to:

• Modify or discontinue features without notice
• Limit usage to prevent abuse
• Introduce premium features in the future
• Display advertisements to support the Service

We make no guarantees about the availability or performance of the Service.`
    },
    {
      title: 'Disclaimer of Warranties',
      content: `THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.

We do not warrant that:
• The Service will be uninterrupted or error-free
• Results obtained will be accurate or reliable
• The Service will meet your specific requirements

Your use of the Service is at your sole risk.`
    },
    {
      title: 'Limitation of Liability',
      content: `TO THE MAXIMUM EXTENT PERMITTED BY SRI LANKAN LAW, EZY CV SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION:

• Loss of profits or revenue
• Loss of data or content
• Loss of business opportunities
• Personal injury or property damage

Our total liability shall not exceed the amount paid by you (if any) for the Service.`
    },
    {
      title: 'Indemnification',
      content: `You agree to defend, indemnify, and hold harmless Ezy CV and its officers, directors, employees, and agents from any claims, damages, losses, or expenses arising from:

• Your use of the Service
• Your violation of these Terms
• Your violation of any third-party rights
• Content you submit through the Service`
    },
    {
      title: 'Termination',
      content: `We may terminate or suspend your access to the Service immediately, without prior notice, for any reason, including:

• Breach of these Terms
• Request by law enforcement or regulatory authority
• Discontinuation of the Service
• Technical or security issues

Upon termination, your right to use the Service will cease immediately. You may request deletion of your data per our Privacy Policy and the PDPA.`
    },
    {
      title: 'Governing Law and Jurisdiction',
      content: `These Terms shall be governed by and construed in accordance with the laws of the Democratic Socialist Republic of Sri Lanka, including but not limited to the Personal Data Protection Act No. 9 of 2022.

Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts of Sri Lanka.`
    },
    {
      title: 'Changes to Terms',
      content: `We reserve the right to modify these Terms at any time. We will notify users of significant changes by:

• Posting the updated Terms on this page
• Updating the "Last Updated" date
• Sending email notifications for material changes

Your continued use after changes constitutes acceptance of the new Terms.`
    },
    {
      title: 'Contact Information',
      content: `For questions about these Terms of Service, please contact us:

Email: legal@ezycv.com
Privacy Matters: privacy@ezycv.com
Website: https://ezycv.org
Governing Law: Laws of Sri Lanka`
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
            <p className="text-purple-100">Last updated: {lastUpdated}</p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
            <p className="text-gray-600 mb-8 text-lg">
              Please read these Terms of Service carefully before using Ezy CV. 
              By using our Service, you agree to be bound by these terms.
            </p>

            <div className="space-y-10">
              {sections.map((section, index) => (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                    <span className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center text-white text-sm">
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

            <div className="mt-12 pt-8 border-t border-gray-200 text-center">
              <p className="text-gray-600 mb-4">
                By using Ezy CV, you acknowledge that you have read and understood these Terms of Service.
              </p>
              <Link
                to="/cv-builder"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all"
              >
                Start Using Ezy CV
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TermsOfService;
