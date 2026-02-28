import type { Metadata } from 'next';
import WallpapersClient from '../WallpapersClient';

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
  return <WallpapersClient initialCategory={category} />;
}
