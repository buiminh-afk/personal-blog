import fs from 'fs-extra';
import { readFileSync } from 'fs';
import { join } from 'path';
import { renderTOC } from '../utils/markdown-parser.js';

/**
 * Load base template
 */
function loadTemplate() {
  return readFileSync(join(process.cwd(), 'src/layouts/base.html'), 'utf-8');
}

/**
 * Generate breadcrumb HTML
 */
function generateBreadcrumb(category, title) {
  const categoryNames = {
    'hoc-tap': 'Học tập',
    'doi-song': 'Đời sống',
    'cong-nghe': 'Công nghệ',
    'CCNP': 'CCNP'
  };

  return `
    <nav class="breadcrumb">
      <a href="../">Trang chủ</a>
      <span class="separator">›</span>
      <a href="../category/${category}.html">${categoryNames[category] || category}</a>
      <span class="separator">›</span>
      <span>${title}</span>
    </nav>
  `;
}

/**
 * Generate category list HTML
 */
function generateCategoryList(categories, currentCategory = null) {
  return categories.map(cat => {
    const active = cat.slug === currentCategory ? ' class="active"' : '';
    return `<li${active}><a href="../category/${cat.slug}.html">${cat.name} (${cat.count})</a></li>`;
  }).join('\n            ');
}


/**
 * Generate individual post page
 */
export function generatePost(post, categories, outputDir, allPosts) {
  const template = loadTemplate();
  const breadcrumb = generateBreadcrumb(post.metadata.category, post.metadata.title);
  const categoryList = generateCategoryList(categories);
  const toc = renderTOC(post.toc);

  // Format date
  const date = new Date(post.metadata.date);
  const formattedDate = date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Find previous and next posts
  const currentIndex = allPosts.findIndex(p => p.slug === post.slug);
  const prevPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;
  const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;

  // Build post navigation
  let postNavigation = '';
  if (prevPost || nextPost) {
    postNavigation = '<nav class="post-navigation">';

    if (prevPost) {
      postNavigation += `
        <div class="post-nav-item prev">
          <span class="post-nav-label">Bài trước</span>
          <a href="./${prevPost.slug}.html" class="post-nav-link">${prevPost.metadata.title}</a>
        </div>
      `;
    } else {
      postNavigation += '<div class="post-nav-item"></div>';
    }

    if (nextPost) {
      postNavigation += `
        <div class="post-nav-item next">
          <span class="post-nav-label">Bài tiếp theo</span>
          <a href="./${nextPost.slug}.html" class="post-nav-link">${nextPost.metadata.title}</a>
        </div>
      `;
    } else {
      postNavigation += '<div class="post-nav-item"></div>';
    }

    postNavigation += '</nav>';
  }

  // Calculate reading time (approx 200 words/min)
  const wordCount = post.rawContent.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);

  // Build post content
  const content = `
    <article class="post">
      <header class="post-header">
        <h1>${post.metadata.title}</h1>
        <div class="post-meta">
          <div class="meta-left">
            <span class="meta-item date">📅 ${formattedDate}</span>
            <span class="meta-separator">·</span>
            <span class="meta-item time">⏱️ ${readingTime} phút đọc</span>
          </div>
          ${post.metadata.tags.length > 0 ? `
          <div class="tags">
            ${post.metadata.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
          </div>
          ` : ''}
        </div>
      </header>
      <div class="post-content">
        ${post.content}
      </div>
      ${postNavigation}
    </article>
  `;

  // Build right TOC sidebar
  const rightToc = toc ? `
    <aside class="toc-sidebar">
      ${toc}
    </aside>
  ` : '';

  // Replace placeholders
  const html = template
    .replaceAll('{{BASE_PATH}}', '../')
    .replace('{{TITLE}}', `${post.metadata.title} - Blog Cá Nhân`)
    .replace('{{DESCRIPTION}}', post.metadata.description)
    .replace('{{KEYWORDS}}', post.metadata.tags.join(', '))
    .replace('{{POST_CLASS}}', ' post-page')
    .replace('{{CATEGORY_LIST}}', categoryList)
    .replace('{{TOC}}', '') // Left sidebar TOC is empty for posts
    .replace('{{RIGHT_TOC}}', rightToc)
    .replace('{{BREADCRUMB}}', breadcrumb)
    .replace('{{CONTENT}}', content);

  // Write file
  const outputPath = join(outputDir, 'posts', `${post.slug}.html`);
  fs.ensureDirSync(join(outputDir, 'posts'));
  fs.writeFileSync(outputPath, html, 'utf-8');

  console.log(`✓ Generated post: ${post.slug}.html`);
}
