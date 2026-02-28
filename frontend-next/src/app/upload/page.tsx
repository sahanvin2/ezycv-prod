import type { Metadata } from 'next';
import UploadClient from './UploadClient';

export const metadata: Metadata = {
  title: 'Upload Content',
  description: 'Upload wallpapers and stock photos to share with the EzyCV community.',
  robots: { index: false, follow: false },
};

export default function Page() {
  return <UploadClient />;
}
