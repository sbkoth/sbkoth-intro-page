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

This repo includes `.github/workflows/deploy-pages.yml`, which builds and publishes the static site to the **`gh-pages`** branch on every push to `main`.

**Why Actions may show `Failed to create deployment (status: 404)`:**  
GitHub’s own rule is that **`GITHUB_TOKEN` cannot enable Pages the first time** — only a repo admin (UI or PAT) can. After Pages is on, deploys succeed automatically.

**One-time enable (about 30 seconds, free for public repos):**

1. Repo is already **public** (required for free Pages).
2. Open **Settings → Pages**  
   https://github.com/sbkoth/sbkoth-intro-page/settings/pages  
3. **Build and deployment → Source:** Deploy from a branch  
   - Branch: **`gh-pages`**  
   - Folder: **`/ (root)`**  
   - Save  
4. Wait ~1 minute, then open:  
   https://sbkoth.github.io/sbkoth-intro-page/

If you prefer the CLI after `gh auth login`:

```bash
./scripts/enable-github-pages.sh
```

No paid hosting or database is required for the public site.
