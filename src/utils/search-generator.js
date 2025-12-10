import { writeFileSync } from 'fs';
import { join } from 'path';

/**
 * Generate search index JSON file
 * @param {Array} posts - List of all posts
 * @param {string} outputDir - Output directory
 */
export function generateSearchIndex(posts, outputDir) {
  const searchIndex = posts.map(post => ({
    title: post.metadata.title,
    slug: post.slug,
    description: post.metadata.description,
    tags: post.metadata.tags,
    category: post.metadata.category,
    date: post.metadata.date
  }));

  const outputPath = join(outputDir, 'search.json');
  writeFileSync(outputPath, JSON.stringify(searchIndex, null, 2), 'utf-8');
  console.log(`✓ Generated search index: search.json (${posts.length} posts)`);
}
