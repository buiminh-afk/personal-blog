import fs from 'fs-extra';
import { join } from 'path';
import { scanContents } from '../src/utils/file-scanner.js';
import { generateHome } from '../src/pages/home-generator.js';
import { generateCategory } from '../src/pages/category-generator.js';
import { generatePost } from '../src/pages/post-generator.js';
import { generateSitemap } from '../src/pages/sitemap-generator.js';
import { generateSearchIndex } from '../src/utils/search-generator.js';

const CONTENTS_DIR = join(process.cwd(), 'contents');
const OUTPUT_DIR = join(process.cwd(), 'dist');
const PUBLIC_DIR = join(process.cwd(), 'public');

/**
 * Build the static site
 */
async function build() {
  console.log('🚀 Starting build...\n');

  try {
    // Clean output directory
    console.log('🧹 Cleaning output directory...');
    fs.removeSync(OUTPUT_DIR);
    fs.ensureDirSync(OUTPUT_DIR);

    // Scan contents
    console.log('📂 Scanning content files...');
    const { posts, categories, categoryList } = scanContents(CONTENTS_DIR);
    console.log(`   Found ${posts.length} posts in ${categoryList.length} categories\n`);

    // Generate pages
    console.log('📝 Generating pages...');

    // Homepage
    generateHome(posts, categoryList, OUTPUT_DIR);

    // Category pages
    for (const categorySlug of Object.keys(categories)) {
      generateCategory(categorySlug, categories[categorySlug], categoryList, OUTPUT_DIR);
    }

    // Post pages
    for (const post of posts) {
      generatePost(post, categoryList, OUTPUT_DIR, posts);
    }

    // Sitemap
    generateSitemap(categories, categoryList, OUTPUT_DIR);

    // Search Index
    generateSearchIndex(posts, OUTPUT_DIR);

    console.log('');

    // Copy static assets
    console.log('📦 Copying static assets...');
    fs.copySync(PUBLIC_DIR, OUTPUT_DIR, { overwrite: true });
    console.log('   ✓ Copied public assets\n');

    console.log('✅ Build complete! Output in /dist directory\n');
    console.log('📊 Summary:');
    console.log(`   - ${posts.length} posts`);
    console.log(`   - ${categoryList.length} categories`);
    console.log(`   - ${Object.keys(categories).length + posts.length + 2} total pages\n`);

  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

// Run build
build();
