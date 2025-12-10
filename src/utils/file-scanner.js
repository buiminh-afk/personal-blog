import { readdirSync, statSync } from 'fs';
import { join, basename, extname } from 'path';
import { parseMarkdown } from './markdown-parser.js';

/**
 * Recursively scan directory for markdown files
 * @param {string} dir - Directory to scan
 * @returns {Array} List of file paths
 */
function scanDirectory(dir) {
  const files = [];

  try {
    const items = readdirSync(dir);

    for (const item of items) {
      const fullPath = join(dir, item);
      const stat = statSync(fullPath);

      if (stat.isDirectory()) {
        files.push(...scanDirectory(fullPath));
      } else if (stat.isFile() && (extname(item) === '.md' || extname(item) === '.markdown')) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    console.error(`Error scanning directory ${dir}:`, error.message);
  }

  return files;
}

/**
 * Scan contents directory and organize posts by category
 * @param {string} contentsDir - Path to contents directory
 * @returns {Object} Posts organized by category
 */
export function scanContents(contentsDir) {
  const files = scanDirectory(contentsDir);
  const posts = [];

  for (const filePath of files) {
    try {
      const parsed = parseMarkdown(filePath);
      // Remove both .md and .markdown extensions
      const ext = extname(filePath);
      const fileName = basename(filePath, ext);

      posts.push({
        ...parsed,
        slug: fileName,
        filePath
      });
    } catch (error) {
      console.error(`Error parsing ${filePath}:`, error.message);
    }
  }

  // Sort by date (newest first)
  posts.sort((a, b) => new Date(b.metadata.date) - new Date(a.metadata.date));

  // Group by category
  const categories = {};
  for (const post of posts) {
    const category = post.metadata.category;
    if (!categories[category]) {
      categories[category] = [];
    }
    categories[category].push(post);
  }

  return {
    posts,
    categories,
    categoryList: Object.keys(categories).map(key => ({
      slug: key,
      name: getCategoryName(key),
      count: categories[key].length
    }))
  };
}

/**
 * Get display name for category
 */
function getCategoryName(slug) {
  const names = {
    'hoc-tap': 'Học tập',
    'doi-song': 'Đời sống',
    'cong-nghe': 'Công nghệ',
    'CCNP': 'CCNP'
  };
  return names[slug] || slug;
}

export { getCategoryName };
