import type { Metadata } from 'next';
import RegisterClient from './RegisterClient';

export const metadata: Metadata = {
  title: 'Create Account',
  description: 'Create a free EzyCV account to save your CVs, track downloads, and access exclusive features.',
  alternates: { canonical: 'https://ezycv.org/register' },
  robots: { index: false, follow: true },
};

export default function Page() {
  return <RegisterClient />;
}
