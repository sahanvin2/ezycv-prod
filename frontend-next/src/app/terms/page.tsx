import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'Read the Terms of Service for EzyCV. By using our free CV builder, wallpapers, and stock photos, you agree to these terms.',
  alternates: { canonical: 'https://ezycv.org/terms' },
  openGraph: {
    title: 'Terms of Service – EzyCV',
    description: 'Terms and conditions for using EzyCV free CV builder, wallpapers, and stock photos.',
    url: 'https://ezycv.org/terms',
  },
};

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Terms of Service</h1>
        <p className="text-gray-500 mb-10">Last updated: January 2025</p>

        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 prose prose-gray max-w-none">
          <h2>1. Acceptance of Terms</h2>
          <p>By accessing and using <strong>Ezy CV</strong> (&quot;the Service&quot;), you agree to be bound by these Terms of Service. If you do not agree, please do not use our Service.</p>

          <h2>2. Description of Service</h2>
          <p>Ezy CV provides a free online CV builder, wallpaper downloads, and stock photo access. The Service is provided &quot;as is&quot; without warranties of any kind.</p>

          <h2>3. User Accounts</h2>
          <p>To access certain features, you may need to create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.</p>

          <h2>4. User Content</h2>
          <p>You retain ownership of CVs you create using our Service. By uploading content (wallpapers, photos), you grant us a non-exclusive license to display and distribute that content through our platform.</p>

          <h2>5. Acceptable Use</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Use the Service for any unlawful purpose</li>
            <li>Upload content that violates copyright or intellectual property rights</li>
            <li>Attempt to gain unauthorized access to our systems</li>
            <li>Use automated tools to scrape or download content in bulk</li>
            <li>Harass, abuse, or harm other users</li>
          </ul>

          <h2>6. Intellectual Property</h2>
          <p>The Service, including its design, features, and content (excluding user-generated content), is owned by Ezy CV and protected by intellectual property laws.</p>

          <h2>7. Free Service</h2>
          <p>Ezy CV is provided free of charge. We reserve the right to introduce premium features in the future, but the core <Link href="/cv-builder" className="text-blue-600 hover:text-blue-700">CV builder</Link> will always remain free.</p>

          <h2>8. Limitation of Liability</h2>
          <p>In no event shall Ezy CV be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with your use of the Service.</p>

          <h2>9. Privacy</h2>
          <p>Your use of the Service is also governed by our <Link href="/privacy" className="text-blue-600 hover:text-blue-700">Privacy Policy</Link>.</p>

          <h2>10. Termination</h2>
          <p>We may terminate or suspend your account at any time, without prior notice, for conduct that we believe violates these Terms or is harmful to other users or the Service.</p>

          <h2>11. Changes to Terms</h2>
          <p>We reserve the right to modify these Terms at any time. Continued use of the Service after changes constitutes acceptance of the new Terms.</p>

          <h2>12. Governing Law</h2>
          <p>These Terms shall be governed by and construed in accordance with the laws of Sri Lanka.</p>

          <h2>13. Contact</h2>
          <p>If you have any questions about these Terms, please <Link href="/contact" className="text-blue-600 hover:text-blue-700">contact us</Link> at <a href="mailto:ezycv22@gmail.com" className="text-blue-600 hover:text-blue-700">ezycv22@gmail.com</a>.</p>
        </div>
      </div>
    </div>
  );
}
