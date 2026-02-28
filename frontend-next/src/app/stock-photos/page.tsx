import type { Metadata } from 'next';
import StockPhotosClient from './StockPhotosClient';
import JsonLd from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Free Stock Photos – 5K High Quality, Royalty Free Download',
  description:
    'Download thousands of free high-quality stock photos in 5K resolution. Business, nature, travel, fashion, food, technology and more. No attribution required. New photos added daily.',
  keywords: [
    'free stock photos', 'royalty free images', 'stock photography', 'free images download',
    '5K stock photos', 'high quality stock photos', 'business stock photos', 'nature photos',
    'travel photos', 'fashion photography', 'food photography', 'technology images',
    'free commercial images', 'no attribution required', 'ezycv stock photos'
  ],
  alternates: { canonical: 'https://ezycv.org/stock-photos' },
  openGraph: {
    title: 'Free Stock Photos – 5K High Quality, Royalty Free',
    description: 'Thousands of free 5K stock photos for any project. Business, nature, travel, fashion & more. No attribution required.',
    url: 'https://ezycv.org/stock-photos',
    images: [{ url: 'https://ezycv.org/og-image.png', width: 1200, height: 630, alt: 'EzyCV Free Stock Photos' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Stock Photos – 5K Quality | EzyCV',
    description: 'Download thousands of free 5K stock photos for commercial and personal use. No attribution needed.',
    images: ['https://ezycv.org/og-image.png'],
  },
};

const collectionSchema = {
  '@context': 'https://schema.org',
  '@type': 'ImageGallery',
  name: 'EzyCV Free Stock Photos',
  description: 'Thousands of free high-quality stock photos in 5K resolution for personal and commercial use.',
  url: 'https://ezycv.org/stock-photos',
  author: {
    '@type': 'Organization',
    name: 'EzyCV',
    url: 'https://ezycv.org'
  },
  license: 'https://creativecommons.org/publicdomain/zero/1.0/'
};

export default function Page() {
  return (
    <>
      <JsonLd data={collectionSchema} />
      <StockPhotosClient />
    </>
  );
}

