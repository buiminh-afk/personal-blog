# AGENTS.md

## Purpose

This repository is a personal portfolio built with Next.js App Router and exported as a static site for GitHub Pages. Agents working here should favor small, focused changes that preserve the terminal-inspired UI and the static deployment model.

## Stack

- Next.js 16 with App Router
- React 19
- TypeScript with `strict: true`
- Tailwind CSS v4 via `@import "tailwindcss"`
- Markdown rendering with `react-markdown`, `remark-gfm`, `rehype-highlight`, and `rehype-raw`
- Static export enabled through `next.config.ts` with `output: "export"`

## Key Commands

- `npm run dev` starts local development
- `npm run build` produces the static export in `out/`
- `npm run lint` runs ESLint

Use `npm`, not `yarn` or `pnpm`, because the repo is committed with `package-lock.json`.

## Repository Map

- `src/app/layout.tsx`: root layout, fonts, metadata, global shell
- `src/app/page.tsx`: server entrypoint that loads Markdown posts and passes them into the client UI
- `src/app/globals.css`: Tailwind v4 theme tokens, page background, utilities, shared animation rules
- `src/components/PortfolioApp.tsx`: main client experience, tab state, terminal commands, post filtering, and page sections
- `src/components/MarkdownRenderer.tsx`: Markdown pipeline and custom component mapping
- `src/components/PathTraversalLab.tsx`: interactive custom component used inside Markdown posts
- `src/components/ProjectCard.tsx`, `TabBar.tsx`, `Terminal.tsx`: presentational UI pieces
- `src/data/portfolio.ts`: profile, resume, and project content stored in TypeScript
- `src/lib/posts.ts`: filesystem-based post loader and frontmatter parsing
- `content/posts/<category>/*.md`: blog and write-up source files; category comes from the directory name
- `.github/workflows/nextjs.yml`: GitHub Pages build and deploy workflow

## Architecture Notes

- `src/app/page.tsx` is a server component by default and calls `getSortedPostsData()`, which reads from `content/posts` using Node `fs`.
- `src/components/PortfolioApp.tsx` is the main `"use client"` boundary. Interactive UI changes usually belong here or in child components.
- Posts are opened in dynamic tabs using their filename-derived slug.
- The site depends on static export. Avoid introducing runtime features that require a server.

## Static Export Constraints

Because `next.config.ts` uses `output: "export"`:

- Do not add API routes, server actions that require a server runtime, or middleware-dependent features.
- Prefer build-time data loading from local files over request-time fetching.
- Keep image handling compatible with `images.unoptimized = true`.
- If this site is deployed to a GitHub Pages repo subpath, `basePath` may need to be set in `next.config.ts`.

## Content Conventions

Posts live under `content/posts/<category>/` and use the filename as the slug.

Supported frontmatter keys:

- `title`
- `date`
- `status`
- `tags`
- `summary`

Behavior in `src/lib/posts.ts`:

- Missing `title` falls back to the slug
- Missing `status` falls back to `DRAFT`
- Missing `tags` falls back to `[]`
- Missing `summary` falls back to an empty string
- `category` is inferred from the parent folder name

When adding a new post:

1. Create a Markdown file under the correct category folder.
2. Use ISO-style dates like `2026-04-04` so sorting stays stable.
3. Include `summary`, `status`, and `tags` when possible because the UI surfaces them.
4. Be aware that `rehypeRaw` is enabled, so inline HTML and custom tags will render.

Custom Markdown integration currently includes:

- `<path-lab></path-lab>` mapped in `src/components/MarkdownRenderer.tsx`

If you add a new custom tag, update the renderer and keep the component client-safe if it uses hooks or browser APIs.

## UI And Styling Guidance

- Preserve the existing terminal / cyber-dashboard visual language.
- Reuse existing zinc, cyan, emerald, and accent patterns before introducing new colors.
- Prefer small component-level Tailwind edits over broad visual rewrites.
- Shared page-level tokens and utilities belong in `src/app/globals.css`.
- Keep font usage aligned with the Noto Sans and Noto Sans Mono setup in `src/app/layout.tsx`.

## Implementation Guidance

- Use the `@/` alias for imports into `src/` when it keeps paths clearer.
- Keep server-only filesystem logic inside server components or utility modules such as `src/lib/posts.ts`.
- Keep browser-only logic in client components marked with `"use client"`.
- Follow the existing data-first pattern: static profile content in `src/data/portfolio.ts`, long-form post content in Markdown.
- Prefer extending existing components instead of creating parallel versions of the same UI pattern.

## Verification Checklist

For most changes, run:

- `npm run lint`
- `npm run build`

Also sanity-check these flows when relevant:

- Terminal commands still switch tabs and open posts
- Post filtering by category and search still works
- Markdown posts render correctly, including code blocks and custom components
- Static export still emits files into `out/`

## Files To Avoid Editing Without A Reason

- `.next/` and `out/`: generated output
- `node_modules/`: installed dependencies

## Notes For Future Agents

- The repo may contain in-progress local edits. Do not overwrite user changes you did not make.
- Some content appears to include non-English text. Preserve the author's wording and encoding when editing those files.
- The current README is still the default Next.js template, so do not rely on it as the source of truth for project behavior.
