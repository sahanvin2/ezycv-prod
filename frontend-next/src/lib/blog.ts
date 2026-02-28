import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const contentDirectory = path.join(process.cwd(), 'content', 'blog');

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  author: string;
  tags: string[];
  coverImage?: string;
  content: string;
}

export interface BlogPostMeta {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  author: string;
  tags: string[];
  coverImage?: string;
}

export function getAllPosts(): BlogPostMeta[] {
  if (!fs.existsSync(contentDirectory)) return [];
  const files = fs.readdirSync(contentDirectory).filter(f => f.endsWith('.mdx') || f.endsWith('.md'));

  const posts = files.map((filename) => {
    const slug = filename.replace(/\.(mdx|md)$/, '');
    const filePath = path.join(contentDirectory, filename);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(fileContents);

    return {
      slug,
      title: data.title || slug,
      date: data.date || new Date().toISOString(),
      excerpt: data.excerpt || '',
      author: data.author || 'EzyCV Team',
      tags: data.tags || [],
      coverImage: data.coverImage,
    };
  });

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!fs.existsSync(contentDirectory)) return null;

  const mdxPath = path.join(contentDirectory, `${slug}.mdx`);
  const mdPath = path.join(contentDirectory, `${slug}.md`);
  const filePath = fs.existsSync(mdxPath) ? mdxPath : fs.existsSync(mdPath) ? mdPath : null;
  if (!filePath) return null;

  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);
  const processedContent = await remark().use(html).process(content);
  const contentHtml = processedContent.toString();

  return {
    slug,
    title: data.title || slug,
    date: data.date || new Date().toISOString(),
    excerpt: data.excerpt || '',
    author: data.author || 'EzyCV Team',
    tags: data.tags || [],
    coverImage: data.coverImage,
    content: contentHtml,
  };
}

export function getAllSlugs(): string[] {
  if (!fs.existsSync(contentDirectory)) return [];
  return fs
    .readdirSync(contentDirectory)
    .filter(f => f.endsWith('.mdx') || f.endsWith('.md'))
    .map(f => f.replace(/\.(mdx|md)$/, ''));
}
