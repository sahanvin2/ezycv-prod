import type { Metadata } from 'next';
import EditProfileClient from './EditProfileClient';

export const metadata: Metadata = {
  title: 'Edit Profile',
  description: 'Update your EzyCV profile information.',
  robots: { index: false, follow: false },
};

export default function Page() {
  return <EditProfileClient />;
}
