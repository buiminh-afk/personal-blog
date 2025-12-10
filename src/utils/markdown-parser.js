import matter from 'gray-matter';
import MarkdownIt from 'markdown-it';
import anchor from 'markdown-it-anchor';
import { readFileSync } from 'fs';
import hljs from 'highlight.js';

/**
 * Convert text to URL-friendly slug (Vietnamese support)
 */
function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// markdown-it instance + highlight.js
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: (str, lang) => {
    // Nếu khai báo language và highlight.js support → highlight theo lang
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, {
          language: lang,
          ignoreIllegals: true
        }).value;
      } catch (e) {
        // ignore and fallback
      }
    }

    // Fallback: để highlight.js tự đoán
    try {
      return hljs.highlightAuto(str).value;
    } catch (e) {
      return ''; // sẽ handle ở fence renderer
    }
  }
}).use(anchor, {
  level: [2, 3],
  slugify,
  permalink: false,
  permalinkBefore: false
});

// Custom fence renderer for code blocks
md.renderer.rules.fence = function (tokens, idx, options) {
  const token = tokens[idx];
  const info = token.info ? md.utils.unescapeAll(token.info).trim() : '';
  const langName = info ? info.split(/\s+/)[0] : '';
  const langClass = langName ? `language-${langName}` : '';

  // chạy highlight()
  let highlighted = '';
  if (options.highlight) {
    highlighted = options.highlight(token.content, langName) || '';
  }

  // nếu highlight() trả về rỗng → escape HTML bình thường
  if (!highlighted) {
    highlighted = md.utils.escapeHtml(token.content);
  }

  return `
    <div class="code-block">
      <pre><code class="hljs ${langClass}">${highlighted}</code></pre>
    </div>
  `;
};

/**
 * Generate Table of Contents from markdown content
 * Extracts h2 and h3 headings
 */
function generateTOC(content) {
  const headings = [];
  const tokens = md.parse(content, {});

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token.type === 'heading_open' && (token.tag === 'h2' || token.tag === 'h3')) {
      const level = parseInt(token.tag.substring(1));
      const nextToken = tokens[i + 1];
      if (nextToken && nextToken.type === 'inline') {
        const text = nextToken.content;
        const slug = slugify(text);

        headings.push({ level, text, slug });
      }
    }
  }

  return headings;
}

/**
 * Parse markdown file with frontmatter
 * @param {string} filePath - Path to markdown file
 * @returns {Object} Parsed content with metadata
 */
export function parseMarkdown(filePath) {
  const fileContent = readFileSync(filePath, 'utf-8');
  const { data, content } = matter(fileContent);

  // Generate TOC
  const toc = generateTOC(content);

  // Render markdown to HTML
  const html = md.render(content);

  return {
    metadata: {
      title: data.title || 'Untitled',
      date: data.date || new Date(),
      category: data.category || 'uncategorized',
      tags: data.tags || [],
      description: data.description || ''
    },
    content: html,
    toc,
    rawContent: content
  };
}

/**
 * Generate TOC HTML
 */
export function renderTOC(toc) {
  if (!toc || toc.length === 0) {
    return '';
  }

  let html = '<nav class="toc"><h3>Mục lục</h3><ul>';

  for (const item of toc) {
    const indent = item.level === 3 ? ' class="toc-sub"' : '';
    html += `<li${indent}><a href="#${item.slug}">${item.text}</a></li>`;
  }

  html += '</ul></nav>';
  return html;
}
