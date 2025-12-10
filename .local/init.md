Bạn là senior fullstack engineer chuyên thiết kế static blog architecture.

Hãy tạo cho tôi project blog cá nhân từ file Markdown, code từ đầu, với các yêu cầu sau:

MỤC TIÊU:
- Blog cá nhân sử dụng file .md để viết bài
- Có phân loại theo CHUYÊN MỤC (Category)
- Có mục lục tổng thể + breadcrumb điều hướng
- Dễ bảo trì, tối ưu SEO, load nhanh

STACK:
- Node.js + markdown-it
- HTML + CSS + Vanilla JS (hoặc Astro nếu phù hợp hơn)

TÍNH NĂNG BẮT BUỘC:
1. Category System:
   - Mỗi bài viết bắt buộc có field:
     category: "hoc-tap" | "doi-song" | "cong-nghe" | ...
   - Tự generate:
     - Trang danh sách bài theo category
     - Sidebar hiển thị tất cả category

2. Table of Contents (TOC):
   - Tự động tạo TOC từ heading (h2, h3)
   - TOC hiển thị bên phải hoặc sticky sidebar

3. CẤU TRÚC MARKDOWN:
---
title: "Tiêu đề bài viết"
date: 2025-03-02
category: "hoc-tap"
tags: [css, markdown]
description: "Mô tả ngắn"
---

# Nội dung bài viết

4. CẤU TRÚC PROJECT:
/contents
  /hoc-tap
  /doi-song
  /cong-nghe

/src
  /layouts
  /utils
  /pages
/public
/scripts

5. CHỨC NĂNG:
- Tự scan folder /contents để build
- Generate:
  - Trang chủ
  - Trang danh sách category
  - Trang bài viết chi tiết
  - Trang mục lục tổng blog

6. CLI Scripts:
- npm run create-post -- --title "Tên bài viết" --category "hoc-tap"
- npm run dev
- npm run build

7. GIAO DIỆN:
- Có Sidebar:
  - Danh sách chuyên mục
  - Mục lục bài viết (TOC)
- Breadcrumb navigation:
  Home > Học tập > Tên bài

OUTPUT:
- Source code hoàn chỉnh
- Ví dụ:
  - 2 bài trong mục "Học tập"
  - 1 bài trong "Đời sống"
- Script build markdown → HTML
- Hướng dẫn deploy GitHub Pages

YÊU CẦU CHẤT LƯỢNG:
- Clean code
- Modular
- Có chú thích dễ mở rộng
- Ready for production
