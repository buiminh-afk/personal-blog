import { writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import fs from 'fs-extra';
import { generateSlug } from '../src/utils/slug-generator.js';

/**
 * Parse command line arguments
 */
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {};

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--title' && args[i + 1]) {
      options.title = args[i + 1];
      i++;
    } else if (args[i] === '--category' && args[i + 1]) {
      options.category = args[i + 1];
      i++;
    }
  }

  return options;
}

/**
 * Create new post
 */
function createPost() {
  const { title, category } = parseArgs();

  // Validate inputs
  if (!title) {
    console.error('❌ Error: --title is required');
    console.log('\nUsage: npm run create-post -- --title "Post Title" --category "hoc-tap"');
    process.exit(1);
  }

  if (!category) {
    console.error('❌ Error: --category is required');
    console.log('\nAvailable categories: hoc-tap, doi-song, cong-nghe');
    process.exit(1);
  }

  // Validate category
  const validCategories = ['hoc-tap', 'doi-song', 'cong-nghe'];
  if (!validCategories.includes(category)) {
    console.error(`❌ Error: Invalid category "${category}"`);
    console.log('\nAvailable categories:', validCategories.join(', '));
    process.exit(1);
  }

  // Generate slug
  const slug = generateSlug(title);
  const fileName = `${slug}.md`;
  const categoryDir = join(process.cwd(), 'contents', category);
  const filePath = join(categoryDir, fileName);

  // Check if file exists
  if (existsSync(filePath)) {
    console.error(`❌ Error: File already exists: ${filePath}`);
    process.exit(1);
  }

  // Create category directory if it doesn't exist
  fs.ensureDirSync(categoryDir);

  // Get current date
  const now = new Date();
  const date = now.toISOString().split('T')[0];

  // Create frontmatter template
  const content = `---
title: "${title}"
date: ${date}
category: "${category}"
tags: []
description: "Mô tả ngắn về bài viết"
---

# ${title}

Nội dung bài viết ở đây...

## Tiêu đề phụ

Thêm nội dung...
`;

  // Write file
  writeFileSync(filePath, content, 'utf-8');

  console.log('✅ Post created successfully!\n');
  console.log(`📄 File: ${filePath}`);
  console.log(`🔗 Slug: ${slug}`);
  console.log(`📁 Category: ${category}`);
  console.log(`📅 Date: ${date}\n`);
  console.log('You can now edit the file and run "npm run dev" to see it in action.');
}

// Run
createPost();
