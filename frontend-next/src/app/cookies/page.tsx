import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description:
    'Learn how EzyCV uses cookies and similar technologies to improve your browsing experience.',
  alternates: { canonical: 'https://ezycv.org/cookies' },
  openGraph: {
    title: 'Cookie Policy – EzyCV',
    description: 'How EzyCV uses cookies and similar technologies to improve your experience.',
    url: 'https://ezycv.org/cookies',
  },
};

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Cookie Policy</h1>
        <p className="text-gray-500 mb-10">Last updated: January 2025</p>

        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 prose prose-gray max-w-none">
          <h2>1. What Are Cookies?</h2>
          <p>Cookies are small text files that are placed on your device when you visit a website. They are widely used to make websites work more efficiently and provide useful information to website owners.</p>

          <h2>2. How We Use Cookies</h2>
          <p>Ezy CV uses cookies for the following purposes:</p>
          <ul>
            <li><strong>Essential Cookies:</strong> Required for the website to function properly (authentication, security, preferences).</li>
            <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website (Google Analytics).</li>
            <li><strong>Functional Cookies:</strong> Remember your preferences such as language and region settings.</li>
            <li><strong>LocalStorage:</strong> Used to save your CV data locally in your browser for convenience.</li>
          </ul>

          <h2>3. Third-Party Cookies</h2>
          <p>Some cookies are placed by third-party services that appear on our pages. We use:</p>
          <ul>
            <li><strong>Google Analytics</strong> — for website usage analysis</li>
            <li><strong>Firebase</strong> — for authentication</li>
          </ul>

          <h2>4. Managing Cookies</h2>
          <p>You can control and/or delete cookies as you wish. You can delete all cookies that are already on your computer and you can set most browsers to prevent them from being placed. However, if you do this, you may have to manually adjust some preferences every time you visit our site.</p>

          <h2>5. Your Consent</h2>
          <p>By continuing to use our website, you consent to the use of cookies as described in this policy. You can withdraw your consent at any time by clearing your browser cookies.</p>

          <h2>6. Changes to This Policy</h2>
          <p>We may update this Cookie Policy from time to time. Check this page regularly for updates.</p>

          <h2>7. Contact</h2>
          <p>If you have questions about our use of cookies, please <Link href="/contact" className="text-blue-600 hover:text-blue-700">contact us</Link> or email <a href="mailto:ezycv22@gmail.com" className="text-blue-600 hover:text-blue-700">ezycv22@gmail.com</a>.</p>
        </div>
      </div>
    </div>
  );
}
