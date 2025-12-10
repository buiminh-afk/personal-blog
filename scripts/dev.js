import { watch } from 'chokidar';
import { createServer } from 'http';
import { readFileSync, existsSync } from 'fs';
import { join, extname } from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const PORT = 3000;
const DIST_DIR = join(process.cwd(), 'dist');

/**
 * Simple HTTP server
 */
function startServer() {
  const server = createServer((req, res) => {
    let filePath = join(DIST_DIR, req.url === '/' ? 'index.html' : req.url);

    // Handle URLs without .html extension
    if (!existsSync(filePath) && !extname(filePath)) {
      filePath += '.html';
    }

    if (!existsSync(filePath)) {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end('<h1>404 Not Found</h1>');
      return;
    }

    const ext = extname(filePath);
    const contentTypes = {
      '.html': 'text/html',
      '.css': 'text/css',
      '.js': 'text/javascript',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml'
    };

    const contentType = contentTypes[ext] || 'text/plain';

    try {
      const content = readFileSync(filePath);
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    } catch (error) {
      res.writeHead(500);
      res.end('Server Error');
    }
  });

  server.listen(PORT, () => {
    console.log(`\n🌐 Server running at http://localhost:${PORT}`);
    console.log('👀 Watching for changes...\n');
  });
}

/**
 * Rebuild site
 */
async function rebuild() {
  console.log('🔄 Rebuilding...');
  try {
    await execAsync('node scripts/build.js');
    console.log('✅ Rebuild complete!\n');
  } catch (error) {
    console.error('❌ Rebuild failed:', error.message);
  }
}

/**
 * Start development server
 */
async function dev() {
  console.log('🚀 Starting development server...\n');

  // Initial build
  await rebuild();

  // Start server
  startServer();

  // Watch for changes
  const watcher = watch(['contents/**/*.md', 'src/**/*.js', 'src/**/*.html', 'public/**/*'], {
    ignoreInitial: true
  });

  watcher.on('change', (path) => {
    console.log(`📝 File changed: ${path}`);
    rebuild();
  });

  watcher.on('add', (path) => {
    console.log(`➕ File added: ${path}`);
    rebuild();
  });

  watcher.on('unlink', (path) => {
    console.log(`➖ File removed: ${path}`);
    rebuild();
  });
}

// Run dev server
dev();
