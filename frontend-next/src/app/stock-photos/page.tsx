import type { Metadata } from 'next';
import StockPhotosClient from './StockPhotosClient';

export const metadata: Metadata = {
  title: 'Free Stock Photos – High Quality, Royalty Free',
  description:
    'Browse and download free high-quality stock photos for personal and commercial use. No attribution required.',
  alternates: { canonical: 'https://ezycv.org/stock-photos' },
  openGraph: {
    title: 'Free Stock Photos – High Quality, Royalty Free',
    description: 'Download free stock photos for any project. High quality, royalty free.',
    url: 'https://ezycv.org/stock-photos',
  },
};

export default function Page() {
  return <StockPhotosClient />;
}
