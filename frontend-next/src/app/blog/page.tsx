import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getAllPosts } from '@/lib/blog';
import { JsonLd, websiteSchema, organizationSchema } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'CV tips, career advice, and job search strategies from the EzyCV team. Learn how to create a standout CV and advance your career.',
  openGraph: {
    title: 'Blog | EzyCV',
    description: 'CV tips, career advice, and job search strategies from the EzyCV team.',
    url: 'https://ezycv.org/blog',
    type: 'website',
  },
  alternates: { canonical: 'https://ezycv.org/blog' },
};

export default function BlogPage() {
  const posts = getAllPosts();
  const [featured, ...rest] = posts;

  const blogListSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'EzyCV Blog',
    description: 'CV tips, career advice, and job search strategies.',
    url: 'https://ezycv.org/blog',
    publisher: {
      '@type': 'Organization',
      name: 'EzyCV',
      url: 'https://ezycv.org',
    },
  };

  return (
    <>
      <JsonLd data={blogListSchema} />
      <JsonLd data={websiteSchema} />
      <JsonLd data={organizationSchema} />

      <div className="min-h-screen bg-gray-50">
        {/* Hero */}
        <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white py-20">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">EzyCV Blog</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Tips, guides, and advice to help you build a better CV and land your dream job.
            </p>
          </div>
        </section>

        {/* Posts */}
        <section className="max-w-5xl mx-auto px-4 py-16">
          {posts.length === 0 ? (
            <div className="text-center py-20">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Coming Soon</h2>
              <p className="text-gray-600">We&apos;re working on some great content. Check back soon!</p>
            </div>
          ) : (
            <>
              {/* Featured Post */}
              {featured && (
                <Link href={`/blog/${featured.slug}`} className="block mb-12 group">
                  <article className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow overflow-hidden flex flex-col md:flex-row">
                    {featured.coverImage && (
                      <div className="relative md:w-96 h-56 md:h-auto flex-shrink-0">
                        <Image
                          src={featured.coverImage}
                          alt={featured.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, 384px"
                        />
                      </div>
                    )}
                    <div className="p-8 flex flex-col justify-center">
                      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full uppercase tracking-wide mb-3 w-fit">Featured</span>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {featured.tags.map((tag) => (
                          <span key={tag} className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">{tag}</span>
                        ))}
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">{featured.title}</h2>
                      <p className="text-gray-600 mb-4 leading-relaxed">{featured.excerpt}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{featured.author}</span>
                        <span>•</span>
                        <time dateTime={featured.date}>{new Date(featured.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
                      </div>
                    </div>
                  </article>
                </Link>
              )}

              {/* Remaining Posts Grid */}
              {rest.length > 0 && (
                <div className="grid sm:grid-cols-2 gap-6">
                  {rest.map((post) => (
                    <Link key={post.slug} href={`/blog/${post.slug}`} className="block group">
                      <article className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden h-full flex flex-col">
                        {post.coverImage && (
                          <div className="relative h-48 w-full overflow-hidden">
                            <Image
                              src={post.coverImage}
                              alt={post.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                              sizes="(max-width: 640px) 100vw, 50vw"
                            />
                          </div>
                        )}
                        <div className="p-6 flex flex-col flex-1">
                          <div className="flex flex-wrap gap-2 mb-3">
                            {post.tags.map((tag) => (
                              <span key={tag} className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">{tag}</span>
                            ))}
                          </div>
                          <h2 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors flex-1">{post.title}</h2>
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{post.excerpt}</p>
                          <div className="flex items-center gap-3 text-xs text-gray-500 mt-auto">
                            <span>{post.author}</span>
                            <span>•</span>
                            <time dateTime={post.date}>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
                          </div>
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </>
  );
}
