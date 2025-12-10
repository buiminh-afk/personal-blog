import fs from 'fs-extra';
import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * Load base template
 */
function loadTemplate() {
  return readFileSync(join(process.cwd(), 'src/layouts/base.html'), 'utf-8');
}

/**
 * Generate category list HTML
 */
function generateCategoryList(categories) {
  return categories.map(cat => {
    return `<li><a href="/category/${cat.slug}.html">${cat.name} (${cat.count})</a></li>`;
  }).join('\n            ');
}

/**
 * Generate sitemap/archive page
 */
export function generateSitemap(categoriesData, categories, outputDir) {
  const template = loadTemplate();
  const categoryList = generateCategoryList(categories);

  const breadcrumb = `
    <nav class="breadcrumb">
      <a href="/">Trang chủ</a>
      <span class="separator">›</span>
      <span>Mục lục tổng</span>
    </nav>
  `;

  // Build sitemap by category
  const categoryNames = {
    'hoc-tap': 'Học tập',
    'doi-song': 'Đời sống',
    'cong-nghe': 'Công nghệ',
    'CCNP': 'CCNP'
  };

  const categoryBlocks = Object.keys(categoriesData).map(categorySlug => {
    const posts = categoriesData[categorySlug];
    const categoryName = categoryNames[categorySlug] || categorySlug;

    const postList = posts.map(post => {
      const date = new Date(post.metadata.date);
      const formattedDate = date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      return `
        <li>
          <a href="/posts/${post.slug}.html">${post.metadata.title}</a>
          <time datetime="${post.metadata.date}">${formattedDate}</time>
        </li>
      `;
    }).join('\n');

    return `
      <section class="sitemap-category">
        <h2>
          <a href="/category/${categorySlug}.html">${categoryName}</a>
          <span class="count">(${posts.length})</span>
        </h2>
        <ul class="sitemap-posts">
          ${postList}
        </ul>
      </section>
    `;
  }).join('\n');

  const content = `
    <div class="sitemap-page">
      <h1>Mục lục tổng</h1>
      <p class="subtitle">Tất cả bài viết được sắp xếp theo chuyên mục</p>
      ${categoryBlocks}
    </div>
  `;

  // Replace placeholders
  const html = template
    .replace('{{TITLE}}', 'Mục lục tổng - Blog Cá Nhân')
    .replace('{{DESCRIPTION}}', 'Danh sách tất cả bài viết trên blog')
    .replace('{{KEYWORDS}}', 'mục lục, sitemap, blog')
    .replace('{{POST_CLASS}}', '')
    .replace('{{CATEGORY_LIST}}', categoryList)
    .replace('{{TOC}}', '')
    .replace('{{RIGHT_TOC}}', '')
    .replace('{{BREADCRUMB}}', breadcrumb)
    .replace('{{CONTENT}}', content);

  // Write file
  const outputPath = join(outputDir, 'sitemap.html');
  fs.writeFileSync(outputPath, html, 'utf-8');

  console.log('✓ Generated sitemap: sitemap.html');
}
