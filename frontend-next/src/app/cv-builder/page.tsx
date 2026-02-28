import type { Metadata } from 'next';
import JsonLd, { softwareSchema } from '@/components/seo/JsonLd';
import CVBuilderClient from './CVBuilderClient';

export const metadata: Metadata = {
  title: 'Free CV Builder – Create Professional Resumes Online',
  description:
    'Build your professional CV in minutes with our free online CV builder. Choose from 10+ templates, customize, and download as PDF instantly.',
  alternates: { canonical: 'https://ezycv.org/cv-builder' },
  openGraph: {
    title: 'Free CV Builder – Create Professional Resumes Online',
    description: 'Build your professional CV in minutes. 10+ templates, PDF download, 100% free.',
    url: 'https://ezycv.org/cv-builder',
  },
};

export default function Page() {
  return (
    <>
      <JsonLd data={softwareSchema} />
      <CVBuilderClient />
    </>
  );
}
