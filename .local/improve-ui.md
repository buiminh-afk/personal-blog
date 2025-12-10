Nhìn chung UI của bạn **khá sạch, dễ đọc, layout 3 cột rõ ràng** rồi. Có dark/light mode, TOC, category – đúng kiểu blog docs/dev.
Giờ nếu muốn “dev hơn, hiện đại hơn” thì mình góp ý thẳng theo 3 mảng: **typography, layout, “dev-feel”**.

---

## 1. Những gì đang ổn

* Layout 3 cột: sidebar trái (chuyên mục) – content – TOC phải → hợp lý, giống docs của nhiều framework.
* Dark / Light mode: đã có toggle, nhìn ổn.
* Khoảng cách dòng, padding nội dung chính khá thoáng, dễ đọc.
* Code block đã có background khác biệt, dễ nhận biết.

Giờ vấn đề chủ yếu là **“feeling” vẫn hơi generic / blog thường**, chưa toát kiểu blog lập trình.

---

## 2. Typo & màu: upgrade để nhìn “dev” hơn

### a) Font

* Hiện tại trông giống default sans-serif (Roboto/Arial) → hơi generic.
* Gợi ý:

  * Body / heading: `Inter`, `IBM Plex Sans`, hoặc `SF Pro / system-ui` là ổn.
  * Code: **bắt buộc** dùng mono đẹp: `JetBrains Mono`, `Fira Code`, `IBM Plex Mono`.

Ví dụ CSS:

```css
:root {
  --font-sans: system-ui, -apple-system, BlinkMacSystemFont, "Inter", sans-serif;
  --font-mono: "JetBrains Mono", "Fira Code", monospace;
}

body {
  font-family: var(--font-sans);
}

code, pre {
  font-family: var(--font-mono);
}
```

### b) Màu sắc

Dark mode của bạn ổn nhưng hơi “tối đều”, thiếu accent.

* Chọn **1 accent chính** (vd: xanh cyan #22d3ee hoặc tím #a855f7) dùng cho:

  * Link
  * Active item trong TOC
  * Hover nav
  * Tag / badge

```css
:root {
  --accent: #22d3ee;
}

a {
  color: var(--accent);
}

.toc a.active {
  border-left: 2px solid var(--accent);
  background: rgba(34, 211, 238, 0.1);
}
```

---

## 3. Layout: chỉnh lại cho “docs-style” hơn

### a) Content width

Hiện content giữa hơi rộng → đọc dài dòng mệt mắt.

* Set max width ~`720–800px`, căn giữa, cho cảm giác giống docu của Next.js / MDN.

```css
.main-content {
  max-width: 760px;
  margin: 0 auto;
}
```

### b) Sidebar trái (Chuyên mục)

Hiện tương đối trống và chữ hơi to.

* Giảm kích thước, thêm icon nhỏ trước từng category.
* Dùng badge số lượng bài viết trông dev hơn:

```html
<li class="category-item">
  <span class="cat-name">Học tập</span>
  <span class="cat-count">2</span>
</li>
```

```css
.category-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.35rem 0.5rem;
  border-radius: 6px;
}

.category-item:hover {
  background: rgba(148, 163, 184, 0.12);
}

.cat-count {
  font-size: 0.75rem;
  padding: 0.1rem 0.4rem;
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.2);
}
```

### c) TOC bên phải

Đang ổn nhưng có thể “docs” hơn:

* Font nhỏ hơn 1–2 cấp so với nội dung.
* Dùng `position: sticky; top: 80px;`.
* Hightlight mục đang đọc rõ hơn (background nhẹ + bar bên trái).

---

## 4. “Dev-feel”: thêm mấy chi tiết tinh chỉnh

### a) Code block “xịn” hơn

* Bo góc mạnh hơn (8px–10px), shadow nhẹ, line-height thấp hơn chút.
* Thêm **title bar** giả terminal + nút copy.

```html
<div class="code-block">
  <div class="code-header">
    <span>example.js</span>
    <button class="copy-btn">Copy</button>
  </div>
  <pre><code>...</code></pre>
</div>
```

```css
.code-block {
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #1f2937;
}

.code-header {
  display: flex;
  justify-content: space-between;
  padding: 0.35rem 0.75rem;
  font-size: 0.75rem;
  background: #020617;
}
```

### b) Meta bar dưới tiêu đề

Ngay dưới H1, thêm một dòng meta cho lập trình viên:

* Ngày, thời gian đọc (reading time), tags.

```html
<div class="post-meta">
  <span>2 Tháng 3, 2025</span>
  <span>·</span>
  <span>7 phút đọc</span>
  <span class="tag">markdown</span>
  <span class="tag">documentation</span>
</div>
```

```css
.post-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: #6b7280;
}

.tag {
  background: rgba(148, 163, 184, 0.2);
  padding: 0.1rem 0.5rem;
  border-radius: 999px;
}
```

### c) Dark/Light toggle

* Nên đưa lên **header top-right** thay vì nút tròn dưới góc phải với emoji (nhìn vui nhưng hơi “casual”).
* Dùng icon moon/sun outline (Heroicons / Lucide style) là ra vibe dev hơn.

---

## 5. Mobile & responsive

Không thấy screenshot mobile, nhưng với layout 3 cột:

* < 768px: ẩn TOC sang bottom (hoặc toggle button).
* Sidebar category thu lại thành off-canvas menu hoặc chuyển lên trên content.

---

## 6. Checklist nhanh để làm mới

Nếu muốn làm lần lượt, mình đề xuất thứ tự:

1. Đổi font: `Inter` + `JetBrains Mono`.
2. Thêm accent color thống nhất, chỉnh link + active TOC.
3. Giới hạn width nội dung, refine sidebar trái + TOC phải.
4. Nâng cấp code block (title bar + copy).
5. Đưa theme toggle lên header + thêm meta bar sau tiêu đề.

---

Nếu bạn muốn, lần tới gửi mình file HTML/CSS (hoặc repo structure), mình có thể chỉnh cho bạn một **bản CSS hoàn chỉnh** theo đúng style “blog dev” (gần giống kiểu doc của Next.js/Expo/Tailwind) để bạn drop vào project.
