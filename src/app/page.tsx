import { PortfolioApp } from '@/components/PortfolioApp';
import { getSortedPostsData } from '@/lib/posts';

// This is a React Server Component by default in Next.js App Router
export default function Home() {
  const posts = getSortedPostsData();

  return <PortfolioApp initialPosts={posts} />;
}
