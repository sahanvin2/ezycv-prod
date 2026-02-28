import type { Metadata } from 'next';
import './globals.css';
import Providers from './providers';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  metadataBase: new URL('https://ezycv.org'),
  title: {
    default: 'EzyCV – Free CV Builder, HD Wallpapers & Stock Photos',
    template: '%s | EzyCV',
  },
  description:
    'Create professional CVs for free, download HD wallpapers, and browse royalty-free stock photos – all in one place. No sign-up required.',
  keywords: [
    'free CV builder',
    'resume maker',
    'professional CV',
    'HD wallpapers',
    'stock photos',
    'free resume',
    'online CV creator',
    'EzyCV',
  ],
  authors: [{ name: 'EzyCV', url: 'https://ezycv.org' }],
  creator: 'EzyCV',
  publisher: 'EzyCV',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ezycv.org',
    siteName: 'EzyCV',
    title: 'EzyCV – Free CV Builder, HD Wallpapers & Stock Photos',
    description:
      'Create professional CVs for free, download HD wallpapers, and browse royalty-free stock photos.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'EzyCV – Free CV Builder',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@EzyCv',
    creator: '@EzyCv',
    title: 'EzyCV – Free CV Builder, HD Wallpapers & Stock Photos',
    description:
      'Create professional CVs for free. Download HD wallpapers and stock photos.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: { canonical: 'https://ezycv.org' },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-gray-50 antialiased">
        <Providers>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
