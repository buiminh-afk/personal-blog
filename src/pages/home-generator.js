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
    return `<li><a href="/category/${cat.slug}.html">[ ${cat.name} (${cat.count}) ]</a></li>`;
  }).join('\n            ');
}

/**
 * Generate homepage
 */
export function generateHome(posts, categories, outputDir) {
  const template = loadTemplate();
  const categoryList = generateCategoryList(categories);

  // Get recent posts (limit to 6 for the blog section)
  const recentPosts = posts.slice(0, 6);

  // Build post list
  const postList = recentPosts.map(post => {
    const date = new Date(post.metadata.date);
    const formattedDate = date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return `
      <article class="post-card">
        <h3><a href="/posts/${post.slug}.html">> ${post.metadata.title}</a></h3>
        <div class="post-meta">
          <span class="timestamp">[${formattedDate}]</span>
          <span class="category-badge">DIR: /${post.metadata.category}</span>
        </div>
        <p class="post-excerpt">${post.metadata.description}</p>
        <a href="/posts/${post.slug}.html" class="read-more">EXECUTE_READ</a>
      </article>
    `;
  }).join('\n');

  const content = `
    <div class="welcome-page">
      <!-- Hero Section as Terminal Window -->
      <section class="hero-section">
        <div class="terminal-window hero" role="banner" aria-label="hero terminal">
          <div class="terminal-header">
            <span>user@blog:~</span>
            <span>bash</span>
          </div>

          <div class="terminal-body">
            <div class="command-line" aria-hidden="true">
              <span class="prompt">user@blog:~$</span>
              <span class="command typing-effect" aria-live="polite" aria-atomic="true"></span>
            </div>

            <h1 class="hero-title" aria-label="greeting">
              HELLO_WORLD. I AM <span class="name" aria-hidden="true"></span>
            </h1>

            <p class="hero-subtitle">&gt; Full Stack Developer | Tech Enthusiast</p>

            <p class="hero-description">
              Initializing personal space...<br>
              Loading knowledge base...<br>
              <strong>Status:</strong> <span style="color:var(--primary-muted)">ONLINE</span><br><br>
              Welcome to my digital garden. Accessing shared data on technology and life.
            </p>

            <div class="hero-actions">
              <a class="btn" href="#blog">[ VIEW_BLOG ]</a>
              <a class="btn" href="#about">[ WHOAMI ]</a>
            </div>
          </div>
        </div>
      </section>

      <!-- About & Career Section as System Log -->
      <section id="about" class="about-section">
        <div class="terminal-window">
          <div class="terminal-header">
            <span>/var/log/career.log</span>
          </div>
          <div class="terminal-body">
            <div class="career-timeline">
              <div class="log-entry">
                <span class="timestamp">[2023-PRESENT]</span>
                <h3>Senior Full Stack Developer @ Tech Company XYZ</h3>
                <p class="description">
                  > Scaling web applications<br>
                  > Stack: React, Node.js, Cloud<br>
                  > Role: Team Lead
                </p>
              </div>

              <div class="log-entry">
                <span class="timestamp">[2021-2023]</span>
                <h3>Full Stack Developer @ Startup ABC</h3>
                <p class="description">
                  > Building SaaS features<br>
                  > Optimizing performance<br>
                  > CI/CD Implementation
                </p>
              </div>

              <div class="log-entry">
                <span class="timestamp">[2019-2021]</span>
                <h3>Junior Developer @ Software House DEF</h3>
                <p class="description">
                  > Web application development<br>
                  > Agile methodology
                </p>
              </div>

              <div class="log-entry">
                <span class="timestamp">[2015-2019]</span>
                <h3>Student @ University ABC</h3>
                <p class="description">
                  > Major: Computer Science<br>
                  > Status: Graduated with Honors
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Skills Section as Command Output -->
      <section class="skills-section">
        <div class="terminal-window">
          <div class="terminal-header">
            <span>user@blog:~/skills</span>
          </div>
          <div class="terminal-body">
            <div class="command-line">
              <span class="prompt">user@blog:~/skills$</span>
              <span class="command">cat technical.json tools.json soft.json</span>
            </div>
            <br>
            <div class="skills-grid">
              <div class="skill-block">
                <div class="skill-header">Technical_Skills</div>
                <div class="skill-list">
                  <span class="skill-item">JavaScript</span>
                  <span class="skill-item">TypeScript</span>
                  <span class="skill-item">React</span>
                  <span class="skill-item">Node.js</span>
                  <span class="skill-item">Python</span>
                  <span class="skill-item">SQL</span>
                  <span class="skill-item">MongoDB</span>
                </div>
              </div>

              <div class="skill-block">
                <div class="skill-header">Tools_&_Platforms</div>
                <div class="skill-list">
                  <span class="skill-item">Git</span>
                  <span class="skill-item">Docker</span>
                  <span class="skill-item">AWS</span>
                  <span class="skill-item">Linux</span>
                  <span class="skill-item">VS_Code</span>
                </div>
              </div>

              <div class="skill-block">
                <div class="skill-header">Soft_Skills</div>
                <div class="skill-list">
                  <span class="skill-item">Leadership</span>
                  <span class="skill-item">Problem_Solving</span>
                  <span class="skill-item">Communication</span>
                  <span class="skill-item">Mentoring</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Blog Section -->
      <section id="blog" class="blog-section">
        <div class="section-header">
          <h2>> LATEST_POSTS</h2>
        </div>
        
        <div class="posts-grid">
          ${postList}
        </div>
        
        <div class="view-all">
          <a href="/sitemap.html" class="btn">[ VIEW_ALL_POSTS ]</a>
        </div>
      </section>
    </div>
  `;

  // Replace placeholders
  const html = template
    .replace('{{TITLE}}', 'user@blog: ~')
    .replace('{{DESCRIPTION}}', 'Personal Terminal Blog')
    .replace('{{KEYWORDS}}', 'blog, terminal, developer')
    .replace('{{POST_CLASS}}', '')
    .replace('{{CATEGORY_LIST}}', categoryList)
    .replace('{{TOC}}', '')
    .replace('{{RIGHT_TOC}}', '')
    .replace('{{BREADCRUMB}}', '')
    .replace('{{CONTENT}}', content);

  // Write file
  const outputPath = join(outputDir, 'index.html');
  fs.writeFileSync(outputPath, html, 'utf-8');

  console.log('✓ Generated homepage: index.html');
}
