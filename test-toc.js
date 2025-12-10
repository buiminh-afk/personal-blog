import { readFileSync } from 'fs';
import { parseMarkdown } from './src/utils/markdown-parser.js';

try {
  const filePath = 'd:/Blog/contents/hoc-tap/hoc-css-hieu-qua.md';
  console.log(`Reading file: ${filePath}`);

  const result = parseMarkdown(filePath);
  console.log('TOC Result:', JSON.stringify(result.toc, null, 2));

  if (result.toc && result.toc.length > 0) {
    console.log('✅ TOC generated successfully');
  } else {
    console.error('❌ TOC is empty');
  }
} catch (error) {
  console.error('Error:', error);
}
