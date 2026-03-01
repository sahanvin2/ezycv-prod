import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import JsonLd, { wallpaperCategorySchema } from '@/components/seo/JsonLd';

const WallpapersClient = dynamic(() => import('../WallpapersClient'), { ssr: true });

interface Props {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const label = category.charAt(0).toUpperCase() + category.slice(1);
  return {
    title: `${label} HD Wallpapers – Free Download`,
    description: `Download free ${label.toLowerCase()} HD wallpapers for desktop & mobile. High quality, no sign-up required.`,
    alternates: { canonical: `https://ezycv.org/wallpapers/${category}` },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  return (
    <>
      <JsonLd data={wallpaperCategorySchema(category)} />
      <WallpapersClient initialCategory={category} />
    </>
  );
}
