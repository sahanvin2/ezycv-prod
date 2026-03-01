import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import JsonLd, { wallpapersSchema } from '@/components/seo/JsonLd';

const WallpapersClient = dynamic(() => import('./WallpapersClient'), { ssr: true });

export const metadata: Metadata = {
  title: 'Free HD Wallpapers – Desktop & Mobile',
  description:
    'Download stunning HD wallpapers for desktop and mobile. Nature, abstract, space, dark themes, and more – all free.',
  alternates: { canonical: 'https://ezycv.org/wallpapers' },
  openGraph: {
    title: 'Free HD Wallpapers – Desktop & Mobile',
    description: 'Download free HD wallpapers for desktop and mobile. Updated regularly with new content.',
    url: 'https://ezycv.org/wallpapers',
  },
};

export default function Page() {
  return (
    <>
      <JsonLd data={wallpapersSchema} />
      <WallpapersClient />
    </>
  );
}
