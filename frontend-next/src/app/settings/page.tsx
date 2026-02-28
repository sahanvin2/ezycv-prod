import type { Metadata } from 'next';
import SettingsClient from './SettingsClient';

export const metadata: Metadata = {
  title: 'Settings',
  description: 'Manage your EzyCV account preferences and settings.',
  robots: { index: false, follow: false },
};

export default function Page() {
  return <SettingsClient />;
}
