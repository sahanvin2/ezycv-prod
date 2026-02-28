import type { Metadata } from 'next';
import DashboardClient from './DashboardClient';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Manage your CVs, view your stats, and access all EzyCV features from your dashboard.',
  robots: { index: false, follow: false },
};

export default function Page() {
  return <DashboardClient />;
}
