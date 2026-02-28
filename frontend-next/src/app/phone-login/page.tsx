import type { Metadata } from 'next';
import PhoneLoginClient from './PhoneLoginClient';

export const metadata: Metadata = {
  title: 'Phone Login',
  description: 'Sign in to your EzyCV account using your phone number.',
  robots: { index: false, follow: true },
};

export default function Page() {
  return <PhoneLoginClient />;
}
