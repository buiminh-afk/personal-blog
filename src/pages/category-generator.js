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
function generateCategoryList(categories, currentCategory = null) {
  return categories.map(cat => {
    const active = cat.slug === currentCategory ? ' class="active"' : '';
    return `<li${active}><a href="/category/${cat.slug}.html">${cat.name} (${cat.count})</a></li>`;
  }).join('\n            ');
}

/**
 * Generate category page
 */
export function generateCategory(categorySlug, posts, categories, outputDir) {
  const template = loadTemplate();
  const category = categories.find(c => c.slug === categorySlug);
  const categoryList = generateCategoryList(categories, categorySlug);

  const breadcrumb = `
    <nav class="breadcrumb">
      <a href="/">Trang chủ</a>
      <span class="separator">›</span>
      <span>${category.name}</span>
    </nav>
  `;

  // Build post list
  const postList = posts.map(post => {
    const date = new Date(post.metadata.date);
    const formattedDate = date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return `
      <article class="post-preview">
        <h2><a href="/posts/${post.slug}.html">${post.metadata.title}</a></h2>
        <div class="post-meta">
          <time datetime="${post.metadata.date}">${formattedDate}</time>
        </div>
        <p class="post-excerpt">${post.metadata.description}</p>
        <a href="/posts/${post.slug}.html" class="read-more">Đọc tiếp →</a>
      </article>
    `;
  }).join('\n');

  const content = `
    <div class="category-page">
      <h1>${category.name}</h1>
      <p class="category-count">${posts.length} bài viết</p>
      <div class="posts-list">
        ${postList}
      </div>
    </div>
  `;

  // Replace placeholders
  const html = template
    .replace('{{TITLE}}', `${category.name} - Blog Cá Nhân`)
    .replace('{{DESCRIPTION}}', `Danh sách bài viết trong chuyên mục ${category.name}`)
    .replace('{{KEYWORDS}}', category.name)
    .replace('{{POST_CLASS}}', '')
    .replace('{{CATEGORY_LIST}}', categoryList)
    .replace('{{TOC}}', '')
    .replace('{{RIGHT_TOC}}', '')
    .replace('{{BREADCRUMB}}', breadcrumb)
    .replace('{{CONTENT}}', content);

  // Write file
  const outputPath = join(outputDir, 'category', `${categorySlug}.html`);
  fs.ensureDirSync(join(outputDir, 'category'));
  fs.writeFileSync(outputPath, html, 'utf-8');

  console.log(`✓ Generated category: ${categorySlug}.html`);
}
