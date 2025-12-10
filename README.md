# Blog Cá Nhân - Static Blog Generator

Blog cá nhân được xây dựng từ đầu với Node.js và Markdown, hỗ trợ phân loại theo chuyên mục, tự động tạo mục lục (TOC), và tối ưu SEO.

## ✨ Tính Năng

- 📝 **Viết bài bằng Markdown**: Sử dụng file .md với frontmatter
- 📂 **Phân loại theo chuyên mục**: Tự động tổ chức bài viết theo category
- 📑 **Mục lục tự động**: TOC được tạo từ h2, h3 headings
- 🧭 **Breadcrumb navigation**: Điều hướng rõ ràng
- 🎨 **Giao diện đẹp**: Responsive, modern design
- ⚡ **Tối ưu SEO**: Meta tags, semantic HTML
- 🚀 **Load nhanh**: Static HTML, không cần database

## 📁 Cấu Trúc Project

```
Blog/
├── contents/           # Nội dung markdown
│   ├── hoc-tap/       # Chuyên mục Học tập
│   ├── doi-song/      # Chuyên mục Đời sống
│   └── cong-nghe/     # Chuyên mục Công nghệ
├── src/
│   ├── layouts/       # HTML templates
│   ├── pages/         # Page generators
│   └── utils/         # Utilities (parser, scanner, etc.)
├── public/
│   └── styles/        # CSS files
├── scripts/           # Build & dev scripts
├── dist/              # Generated static site (output)
└── package.json
```

## 🚀 Cài Đặt

### Yêu Cầu
- Node.js 16+ 
- npm hoặc yarn

### Các Bước

1. **Clone hoặc tải project**

2. **Cài đặt dependencies**
```bash
npm install
```

3. **Chạy development server**
```bash
npm run dev
```

Server sẽ chạy tại `http://localhost:3000`

4. **Build production**
```bash
npm run build
```

Output sẽ được tạo trong thư mục `/dist`

## 📝 Tạo Bài Viết Mới

### Sử dụng CLI

```bash
npm run create-post -- --title "Tiêu đề bài viết" --category "hoc-tap"
```

**Categories có sẵn:**
- `hoc-tap` - Học tập
- `doi-song` - Đời sống
- `cong-nghe` - Công nghệ

### Tạo Thủ Công

Tạo file `.md` trong thư mục category tương ứng với cấu trúc:

```markdown
---
title: "Tiêu đề bài viết"
date: 2025-03-02
category: "hoc-tap"
tags: [tag1, tag2]
description: "Mô tả ngắn"
---

# Nội dung bài viết

## Tiêu đề phụ

Nội dung...
```

## 🛠️ Scripts

| Script | Mô tả |
|--------|-------|
| `npm run dev` | Chạy dev server với live reload |
| `npm run build` | Build production static site |
| `npm run create-post` | Tạo bài viết mới |

## 🎨 Tùy Chỉnh

### Thêm Category Mới

1. Tạo thư mục trong `/contents/ten-category/`
2. Cập nhật `getCategoryName()` trong `src/utils/file-scanner.js`
3. Thêm vào danh sách valid categories trong `scripts/create-post.js`

### Thay Đổi Giao Diện

- **CSS**: Chỉnh sửa `/public/styles/main.css`
- **Layout**: Chỉnh sửa `/src/layouts/base.html`
- **Colors**: Thay đổi CSS variables trong `:root`

## 🌐 Deploy Lên GitHub Pages

### Bước 1: Chuẩn Bị Repository

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/username/blog.git
git push -u origin main
```

### Bước 2: Build Site

```bash
npm run build
```

### Bước 3: Deploy

**Option 1: GitHub Actions (Recommended)**

Tạo file `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Build
        run: npm run build
      
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

**Option 2: Manual Deploy**

```bash
# Build
npm run build

# Deploy dist folder to gh-pages branch
npx gh-pages -d dist
```

### Bước 4: Cấu Hình GitHub Pages

1. Vào repository Settings
2. Chọn Pages
3. Source: Deploy from branch `gh-pages`
4. Folder: `/ (root)`
5. Save

Site sẽ có tại: `https://username.github.io/blog/`

## 📚 Cấu Trúc Markdown

### Frontmatter Fields

| Field | Bắt buộc | Mô tả |
|-------|----------|-------|
| `title` | ✅ | Tiêu đề bài viết |
| `date` | ✅ | Ngày đăng (YYYY-MM-DD) |
| `category` | ✅ | Chuyên mục |
| `tags` | ❌ | Mảng tags |
| `description` | ❌ | Mô tả ngắn (SEO) |

### Headings cho TOC

TOC tự động tạo từ:
- `## Heading 2` - Level 1 trong TOC
- `### Heading 3` - Level 2 trong TOC (indented)

## 🔧 Công Nghệ Sử Dụng

- **Node.js**: Runtime environment
- **markdown-it**: Markdown parser
- **markdown-it-anchor**: Auto-generate heading anchors
- **gray-matter**: Parse frontmatter
- **fs-extra**: File system utilities
- **chokidar**: File watcher cho dev server

## 📄 License

MIT License - Tự do sử dụng và chỉnh sửa

## 🤝 Đóng Góp

Mọi đóng góp đều được chào đón! Hãy tạo issue hoặc pull request.

---

**Chúc bạn viết blog vui vẻ! 🎉**
