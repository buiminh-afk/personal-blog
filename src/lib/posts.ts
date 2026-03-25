import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'content/posts');

export interface PostData {
  slug: string;
  title: string;
  date: string;
  category: string;
  status: string;
  tags: string[];
  summary: string;
  content: string;
}

type PostFrontmatter = Partial<
  Omit<PostData, 'slug' | 'category' | 'content'>
>;

export function getSortedPostsData(): PostData[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const allPostsData: PostData[] = [];
  const categories = fs
    .readdirSync(postsDirectory)
    .filter(file => fs.statSync(path.join(postsDirectory, file)).isDirectory());

  categories.forEach(category => {
    const categoryPath = path.join(postsDirectory, category);
    const fileNames = fs
      .readdirSync(categoryPath)
      .filter(file => file.endsWith('.md'));

    fileNames.forEach(fileName => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(categoryPath, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const matterResult = matter(fileContents);
      const frontmatter = matterResult.data as PostFrontmatter;

      allPostsData.push({
        slug,
        title: frontmatter.title ?? slug,
        date: frontmatter.date ?? '',
        status: frontmatter.status ?? 'DRAFT',
        tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
        summary: frontmatter.summary ?? '',
        content: matterResult.content,
        category
      });
    });
  });

  return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
}
