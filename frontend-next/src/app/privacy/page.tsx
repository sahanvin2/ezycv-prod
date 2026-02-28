import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Read the EzyCV Privacy Policy to understand how we collect, use, and protect your personal information.',
  alternates: { canonical: 'https://ezycv.org/privacy' },
  openGraph: {
    title: 'Privacy Policy – EzyCV',
    description: 'Understand how EzyCV collects, uses, and protects your personal information.',
    url: 'https://ezycv.org/privacy',
  },
};

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-gray-500 mb-10">Last updated: January 2025</p>

        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 prose prose-gray max-w-none">
          <h2>1. Introduction</h2>
          <p>Welcome to <strong>Ezy CV</strong> (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains what information we collect, how we use it, and what rights you have in relation to it.</p>

          <h2>2. Information We Collect</h2>
          <p>We collect information that you voluntarily provide to us when you register, create a CV, or contact us. This may include:</p>
          <ul>
            <li>Name, email address, phone number</li>
            <li>CV content (work experience, education, skills, etc.)</li>
            <li>Profile information</li>
            <li>Usage data and analytics</li>
          </ul>

          <h2>3. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide, operate, and maintain our services</li>
            <li>Improve and personalize your experience</li>
            <li>Send you updates and marketing communications (with your consent)</li>
            <li>Process your transactions and manage your account</li>
            <li>Respond to your comments and questions</li>
          </ul>

          <h2>4. Data Storage</h2>
          <p>Your CV data is primarily stored locally in your browser using LocalStorage. When you create an account, some data may be stored on our secure servers to enable cross-device access.</p>

          <h2>5. Third-Party Services</h2>
          <p>We may use third-party services that collect, monitor, and analyse data to improve our service. These include Google Analytics, Firebase Authentication, and BunnyCDN for content delivery.</p>

          <h2>6. Cookies</h2>
          <p>We use cookies and similar tracking technologies to track activity on our service. You can manage your cookie preferences through our <Link href="/cookies" className="text-blue-600 hover:text-blue-700">Cookie Policy</Link> page.</p>

          <h2>7. Data Security</h2>
          <p>We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure.</p>

          <h2>8. Your Rights</h2>
          <p>You have the right to access, update, or delete your personal information at any time. You can do this through your account settings or by contacting us directly.</p>

          <h2>9. Children&apos;s Privacy</h2>
          <p>Our service is not directed to children under 13. We do not knowingly collect personal information from children under 13.</p>

          <h2>10. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page.</p>

          <h2>11. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please <Link href="/contact" className="text-blue-600 hover:text-blue-700">contact us</Link> at <a href="mailto:ezycv22@gmail.com" className="text-blue-600 hover:text-blue-700">ezycv22@gmail.com</a>.</p>
        </div>
      </div>
    </div>
  );
}
