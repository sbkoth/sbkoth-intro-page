# Srinivas Kothapalli — Portfolio

Personal portfolio site for tech leadership, data platforms, streaming, cloud, and AI work. Content is authored as markdown under `content/` and exported to static JSON for free [GitHub Pages](https://pages.github.com/) hosting.

**Live site:** https://sbkoth.github.io/sbkoth-intro-page/

## Stack

- React 19 + Vite 6 + TypeScript + Tailwind CSS 3
- TanStack Query for client data loading
- Static content export (no runtime Node/Express/Postgres required for production)
- Optional Express server for local development

## Content

| Path | Purpose |
|------|---------|
| `content/profile.json` | Name, title, bio, avatar, socials |
| `content/projects/*.md` | Project cards (frontmatter + markdown body) |
| `content/features/*.md` | Professional expertise cards |
| `content/services/*.md` | Service offerings |
| `uploads/` | Images and files referenced as `/uploads/...` |

Run `npm run export:content` (also runs on `predev` / `prebuild`) to materialize `client/public/data/*.json` and copy uploads.

## Scripts

```bash
npm install
npm run dev          # export content + Express + Vite HMR on port 5000
npm run check        # TypeScript
npm test             # content export + path helper unit tests
npm run build        # static export + Vite client + optional server bundle
npm run build:pages  # client-only static build for Pages
```

Production Pages base path is `/sbkoth-intro-page/` (see `vite.config.ts` / `VITE_BASE`).

## Deploy (GitHub Pages — free)

This repo includes `.github/workflows/deploy-pages.yml`, which builds and deploys on every push to `main`. A prebuilt `gh-pages` branch is also pushed as a fallback.

**One-time setup (free plan):**

1. Make the repository **public** (Settings → General → Danger Zone → Change visibility). Free GitHub Pages requires a public repo (private Pages needs a paid plan).
2. Settings → **Pages** → Build and deployment → Source: **GitHub Actions** (preferred), **or** Deploy from branch → `gh-pages` / root.
3. After the workflow finishes (or the branch is selected), open:  
   https://sbkoth.github.io/sbkoth-intro-page/

No paid hosting or database is required for the public site.
