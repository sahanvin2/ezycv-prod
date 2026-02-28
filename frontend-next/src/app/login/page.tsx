import type { Metadata } from 'next';
import LoginClient from './LoginClient';

export const metadata: Metadata = {
  title: 'Login',
  description: 'Sign in to your EzyCV account to access your saved CVs, downloads, and settings.',
  alternates: { canonical: 'https://ezycv.org/login' },
  robots: { index: false, follow: true },
};

export default function Page() {
  return <LoginClient />;
}
