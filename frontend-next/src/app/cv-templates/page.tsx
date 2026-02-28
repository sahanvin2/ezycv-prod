import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CV Templates – 10+ Professional Resume Templates',
  description:
    'Browse our collection of 10+ professional CV templates. Modern, creative, classic, and minimal designs – all free to use.',
  alternates: { canonical: 'https://ezycv.org/cv-templates' },
  openGraph: {
    title: 'CV Templates – 10+ Professional Resume Templates',
    description: 'Choose from 10+ professional CV templates. All free to use and customize.',
    url: 'https://ezycv.org/cv-templates',
  },
};

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">CV Templates</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Choose from our collection of professional CV templates. Each template is designed to help you stand out.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {['Modern', 'Classic', 'Creative', 'Minimal', 'Professional', 'Elegant', 'Executive', 'Tech', 'Academic', 'Compact'].map((t) => (
            <a key={t} href={`/cv-builder?template=${t.toLowerCase()}`} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-4 aspect-[3/4] flex items-center justify-center border-2 border-transparent hover:border-blue-500">
              <span className="text-gray-700 font-medium">{t}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
