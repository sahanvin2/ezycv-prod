/** Reusable JSON-LD structured data component (server-safe) */

interface JsonLdProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default JsonLd;

/* ── Pre-built schemas ──────────────────────────────── */

export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'EzyCV',
  url: 'https://ezycv.org',
  description:
    'Create professional CVs for free, download HD wallpapers, and browse royalty-free stock photos.',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://ezycv.org/wallpapers?search={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
};

export const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'EzyCV – Free CV Builder',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  url: 'https://ezycv.org/cv-builder',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    ratingCount: '150',
  },
};

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'EzyCV',
  url: 'https://ezycv.org',
  logo: 'https://ezycv.org/logo192.png',
  sameAs: [
    'https://x.com/EzyCv',
    'https://www.linkedin.com/in/sahan-nawarathne-210b562ab/',
    'https://youtube.com/@ezycv',
    'https://www.facebook.com/profile.php?id=61587351227027',
    'https://www.reddit.com/r/EzyCV/',
  ],
};

export function blogPostSchema(post: {
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  author?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    url: `https://ezycv.org/blog/${post.slug}`,
    datePublished: post.date,
    dateModified: post.date,
    description: post.excerpt,
    author: {
      '@type': 'Person',
      name: post.author || 'EzyCV Team',
    },
    publisher: {
      '@type': 'Organization',
      name: 'EzyCV',
      logo: { '@type': 'ImageObject', url: 'https://ezycv.org/logo192.png' },
    },
  };
}
