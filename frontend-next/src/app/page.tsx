import type { Metadata } from 'next';
import HomePage from './HomeClient';
import JsonLd, { websiteSchema, softwareSchema, organizationSchema } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'EzyCV – Free CV Builder, HD Wallpapers & Stock Photos',
  description:
    'Create professional CVs for free with 10+ templates. Download HD wallpapers and royalty-free stock photos. No sign-up required.',
  alternates: { canonical: 'https://ezycv.org' },
  openGraph: {
    title: 'EzyCV – Free CV Builder, HD Wallpapers & Stock Photos',
    description:
      'Create professional CVs for free, download HD wallpapers, and browse royalty-free stock photos.',
    url: 'https://ezycv.org',
  },
};

export default function Page() {
  return (
    <>
      <JsonLd data={websiteSchema} />
      <JsonLd data={softwareSchema} />
      <JsonLd data={organizationSchema} />
      <HomePage />
    </>
  );
}
