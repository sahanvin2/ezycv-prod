import React from 'react';
import { motion } from 'framer-motion';

const PrivacyPolicy = () => {
  const lastUpdated = 'February 16, 2026';

  const sections = [
    {
      title: 'About This Policy',
      content: `This Privacy Policy explains how Ezy CV ("we", "us", or "our") collects, uses, stores, and protects your personal data in accordance with the Personal Data Protection Act No. 9 of 2022 (PDPA) of Sri Lanka, enforced by the Data Protection Authority (DPA) of Sri Lanka.

By using our services, you acknowledge that you have read and understood this policy. If you do not agree, please do not use our services.`
    },
    {
      title: 'Information We Collect',
      content: `We only collect information that is necessary for providing our CV-building services (data minimisation principle under PDPA). This includes:

Personal Information you provide: Full name, email address, phone number, and professional details you choose to include in your CV (education, work experience, skills).

Account Information: If you register, we store your email and authentication credentials securely.

CV Data: The content of your CV is stored locally in your browser and, if you consent, backed up securely in our cloud storage (Backblaze B2) so you can access it later.

Usage Data: Anonymous information about how you use our services (pages visited, features used) collected via cookies with your consent.

Device Information: Browser type, operating system, and IP address for security and analytics purposes.

⚠️ We do NOT collect: National Identity Card (NIC) numbers, health data, financial details, or any other sensitive personal data unless you voluntarily include them in your CV content.`
    },
    {
      title: 'Purpose of Data Processing',
      content: `Under the PDPA, we process your data only for clearly defined, lawful purposes:

• CV Generation: To create, store, and allow you to download your CV — this is the primary purpose
• Account Management: To manage your account, authenticate you, and provide personalised features
• Cloud Backup: To securely store a copy of your CV in our cloud storage (with your consent) so you can retrieve it from any device
• Service Improvement: To analyse anonymous usage patterns and improve our platform
• Communication: To send you important service updates and respond to your support requests
• Security: To protect against fraud, unauthorised access, and abuse of our services

Your data is NOT sold or shared with employers, recruiters, or any third party for marketing purposes.`
    },
    {
      title: 'Legal Basis for Processing',
      content: `Under the PDPA of Sri Lanka, we process your personal data based on:

• Consent: You provide informed consent when you register, create a CV, or accept cookies
• Contractual Necessity: Processing is necessary to provide the services you have requested
• Legitimate Interest: We have a legitimate interest in maintaining the security and improving the quality of our services
• Legal Obligation: We may process data where required by Sri Lankan law or court order`
    },
    {
      title: 'Data Storage and Security',
      content: `We take the security of your personal data seriously:

• Local Storage: Your CV data is primarily stored in your browser's local storage, keeping it on your device
• Cloud Backup (B2 Storage): If you choose to save your CV, an encrypted copy is stored in Backblaze B2 cloud storage
• Encryption in Transit: All data transmitted between your browser and our servers uses HTTPS/TLS encryption
• Access Controls: Only authorised personnel have access to stored data, and access is logged
• Regular Security Reviews: We regularly review and update our security measures
• Data Retention: CV data stored in the cloud is retained for up to 12 months of inactivity, after which it may be automatically deleted. You can delete your data at any time.
• Server Location: Our servers and cloud storage may be located outside Sri Lanka. We ensure appropriate safeguards comply with PDPA requirements for cross-border data transfers.`
    },
    {
      title: 'Information Sharing and Third Parties',
      content: `We do not sell, trade, or rent your personal information. We may share data only in these limited circumstances:

• Cloud Storage Provider (Backblaze B2): Your CV backup is stored using Backblaze's S3-compatible storage, which has enterprise-grade security
• Analytics (Google Analytics): We use anonymised analytics data to understand site usage (with your cookie consent)
• Legal Requirements: Where required by Sri Lankan law, regulation, or court order
• Service Providers: With trusted partners who assist our operations, bound by strict data processing agreements compliant with PDPA

All third-party providers are vetted to ensure they maintain data protection standards consistent with the PDPA.`
    },
    {
      title: 'Cookies and Tracking',
      content: `We use cookies and similar technologies to:

• Essential Cookies: Required for the site to function (always enabled)
• Functional Cookies: Remember your preferences, CV data, and settings
• Analytics Cookies: Help us understand how visitors use our site (only with your consent)

You can manage your cookie preferences at any time through our Cookie Consent banner or the Cookie Policy page. See our Cookie Policy for full details.`
    },
    {
      title: 'Your Rights Under the PDPA',
      content: `Under Sri Lanka's Personal Data Protection Act, you have the following rights:

• Right to Access: Request a copy of the personal data we hold about you
• Right to Correction: Request correction of any inaccurate or incomplete data
• Right to Deletion: Request deletion of your personal data (right to erasure)
• Right to Restrict Processing: Request that we limit how we use your data
• Right to Data Portability: Receive your data in a structured, commonly used format
• Right to Object: Object to the processing of your personal data
• Right to Withdraw Consent: Withdraw your consent at any time (this does not affect the lawfulness of processing before withdrawal)

How to exercise your rights:
• Use the "Delete Account" option in your account settings
• Email us at privacy@ezycv.com
• We will respond to your request within 30 days as required by the PDPA`
    },
    {
      title: 'Children and Minors',
      content: `Our services may be used by students and young professionals. We take extra care with minors' data:

• Users under 18 years of age should have a parent or guardian's consent before using our services
• We do not knowingly collect personal data from children under 16 without parental consent
• If you believe we have collected information from a minor without appropriate consent, please contact us immediately at privacy@ezycv.com
• The PDPA provides enhanced protections for minors' personal data, and we fully comply with these requirements`
    },
    {
      title: 'International Data Transfers',
      content: `Your information may be transferred to and processed in countries other than Sri Lanka (e.g., our cloud storage is hosted internationally). In such cases:

• We ensure appropriate safeguards are in place as required by the PDPA
• Data processing agreements are in place with all international service providers
• We take reasonable steps to ensure your data is treated securely and in accordance with this policy`
    },
    {
      title: 'Data Breach Notification',
      content: `In the event of a personal data breach that is likely to result in a risk to your rights and freedoms:

• We will notify the Data Protection Authority (DPA) of Sri Lanka within 72 hours of becoming aware of the breach
• We will notify affected users without undue delay if the breach poses a high risk
• We will take immediate steps to contain and remedy the breach`
    },
    {
      title: 'Changes to This Policy',
      content: `We may update this Privacy Policy from time to time to reflect changes in our practices, technology, or legal requirements under the PDPA. We will:

• Post the updated policy on this page with a new "Last Updated" date
• Notify registered users via email for material changes
• Provide a summary of key changes where practicable`
    },
    {
      title: 'Governing Law and Complaints',
      content: `This Privacy Policy is governed by the laws of Sri Lanka, specifically the Personal Data Protection Act No. 9 of 2022.

If you have concerns about how we handle your data, you may:

1. Contact us first at privacy@ezycv.com — we aim to resolve all complaints promptly
2. Lodge a complaint with the Data Protection Authority (DPA) of Sri Lanka

Contact Us:
Email: privacy@ezycv.com
Data Protection Queries: dpo@ezycv.com
Regulatory Body: Data Protection Authority of Sri Lanka — https://www.dpa.gov.lk`
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
              use, disclose, and safeguard your information when you use our website and services, 
              in compliance with Sri Lanka's <strong>Personal Data Protection Act No. 9 of 2022 (PDPA)</strong>.
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
