import type { Metadata } from 'next';

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

export { default } from './WallpapersClient';
