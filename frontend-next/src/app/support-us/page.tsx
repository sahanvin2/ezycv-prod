import type { Metadata } from 'next';
import SupportUsClient from './SupportUsClient';

export const metadata: Metadata = {
  title: 'Support Us – Help Keep EzyCV Free',
  description:
    'EzyCV is 100% free with no ads. Support the solo developer behind it via bank transfer or by spreading the word.',
  alternates: { canonical: 'https://ezycv.org/support-us' },
  openGraph: {
    title: 'Support EzyCV – Keep It Free for Everyone',
    description: 'Help keep EzyCV free. Every rupee supports servers, storage, and new features.',
    url: 'https://ezycv.org/support-us',
  },
};

export default function Page() {
  return <SupportUsClient />;
}
