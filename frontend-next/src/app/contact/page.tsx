import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import JsonLd, { contactPageSchema } from '@/components/seo/JsonLd';

const ContactClient = dynamic(() => import('./ContactClient'), { ssr: true });

export const metadata: Metadata = {
  title: 'Contact Us - Get in Touch with EzyCV',
  description:
    'Have questions about EzyCV? Contact us via email or our contact form. We respond within 24-48 hours.',
  alternates: { canonical: 'https://ezycv.org/contact' },
  openGraph: {
    title: 'Contact EzyCV - We Would Love to Hear from You',
    description: 'Send us a message and we will respond as soon as possible.',
    url: 'https://ezycv.org/contact',
  },
};

export default function Page() {
  return (
    <>
      <JsonLd data={contactPageSchema} />
      <ContactClient />
    </>
  );
}
