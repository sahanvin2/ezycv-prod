import type { Metadata } from 'next';
import AboutClient from './AboutClient';

export const metadata: Metadata = {
  title: 'About Us – Meet the Team Behind EzyCV',
  description:
    'Learn about EzyCV, our mission to make professional CV creation free and accessible to everyone, and the founder behind it all.',
  alternates: { canonical: 'https://ezycv.org/about' },
  openGraph: {
    title: 'About EzyCV – Our Mission & Story',
    description:
      'We help millions of job seekers create professional CVs that open doors to dream careers.',
    url: 'https://ezycv.org/about',
  },
};

export default function Page() {
  return <AboutClient />;
}
