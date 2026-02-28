import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getPostBySlug, getAllSlugs } from '@/lib/blog';
import { JsonLd, blogPostSchema } from '@/components/seo/JsonLd';
import { ChevronLeft } from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: 'Post Not Found' };

  return {
    title: post.title,
    description: post.excerpt,
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://ezycv.org/blog/${slug}`,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      images: post.coverImage ? [{ url: post.coverImage, width: 1200, height: 630 }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
    },
    alternates: { canonical: `https://ezycv.org/blog/${slug}` },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return (
    <>
      <JsonLd data={blogPostSchema({ title: post.title, slug, date: post.date, excerpt: post.excerpt, author: post.author })} />

      <article className="min-h-screen bg-white">
        {/* Header */}
        <header className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white py-14">
          <div className="max-w-3xl mx-auto px-4">
            <Link href="/blog" className="inline-flex items-center gap-2 text-blue-200 hover:text-white mb-6 transition-colors text-sm">
              <ChevronLeft className="w-4 h-4" />
              Back to Blog
            </Link>
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 bg-white/20 text-white text-xs font-medium rounded-full">{tag}</span>
              ))}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">{post.title}</h1>
            <p className="text-blue-100 text-lg mb-5 leading-relaxed">{post.excerpt}</p>
            <div className="flex items-center gap-4 text-blue-200 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-xs">
                  {post.author.charAt(0)}
                </div>
                <span>{post.author}</span>
              </div>
              <span>•</span>
              <time dateTime={post.date}>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
            </div>
          </div>
        </header>

        {/* Cover Image */}
        {post.coverImage && (
          <div className="max-w-3xl mx-auto px-4 -mt-8 mb-0">
            <div className="relative h-64 md:h-80 w-full rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 768px"
                priority
              />
            </div>
          </div>
        )}

        {/* Content */}
        <div className="max-w-3xl mx-auto px-4 py-10">
          <div
            className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:py-1 prose-blockquote:rounded-r-xl prose-strong:text-gray-900 prose-code:text-blue-700 prose-code:bg-blue-50 prose-code:px-1 prose-code:rounded"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>

        {/* Author Card */}
        <div className="max-w-3xl mx-auto px-4 pb-12">
          <div className="bg-gray-50 rounded-2xl p-6 flex items-center gap-4 border border-gray-100">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
              {post.author.charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-gray-900">{post.author}</p>
              <p className="text-gray-500 text-sm">Career expert helping professionals build standout CVs and land their dream jobs.</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 py-16">
          <div className="max-w-3xl mx-auto px-4 text-center text-white">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Ready to Build Your Winning CV?</h2>
            <p className="text-blue-100 mb-6 text-lg">Create a professional, ATS-friendly CV in minutes with our free templates.</p>
            <Link href="/cv-builder" className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-colors shadow-lg text-lg">
              Start Building — It&apos;s Free →
            </Link>
            <p className="mt-3 text-blue-200 text-sm">No sign-up required. Download as PDF instantly.</p>
          </div>
        </section>
      </article>
    </>
  );
}

