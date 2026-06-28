# Personal Website

Built with [Docusaurus](https://docusaurus.io/) - a modern static website generator.

## New Machine Setup

### Requirements

| Tool | Version | Used for |
|------|---------|----------|
| Node.js | >= 20 | Dev server, build, scripts |
| npm | (with Node) | Dependencies, `npm install` |
| Python 3 | 3.x | Skillset/tag scripts (`scripts/*.py`) |
| PyYAML | — | Python YAML parsing (`python3-yaml` or `pip`) |
| Puppeteer libs | Linux/WSL only | `libnss3`, `libasound2t64` (for bundled Chrome PDF) |

`npm install` pulls in **Puppeteer** and downloads a bundled Chrome automatically.
On Linux/WSL, that Chrome needs a few system shared libraries.

**Note:** On modern Ubuntu, `chromium-browser` is only a transitional snap package —
it does **not** install these libraries. Use the packages below instead.

### Ubuntu / WSL

```bash
# System packages
sudo apt-get update
sudo apt-get install -y python3 python3-yaml libnss3 libasound2t64

# Node.js 20+ (if not already installed — use nvm, fnm, or nodesource)
node --version   # should be >= 20

# Project
git clone <repo-url>
cd krishvk.gitlab.io
npm install
```

### Verify setup

```bash
npm start                    # site at http://localhost:3000
npm run generate-all         # skillset + resume PDF
```

If resume PDF fails with `libnss3.so` / `libasound.so` errors, install the
libraries Puppeteer's bundled Chrome needs (`libnss3` also pulls in `libnspr4`):

```bash
sudo apt-get install -y libnss3 libasound2t64
npm run generate-resume
```

On Ubuntu 22.04 and older, use `libasound2` instead of `libasound2t64`.

If more libraries are reported missing, run:

```bash
ldd ~/.cache/puppeteer/chrome/*/chrome-linux64/chrome | grep "not found"
```

and install the matching `-dev` / library packages.

To skip PDF generation (skillset/tags only):

```bash
SKIP_RESUME_PDF=1 npm run generate-all
```

## Installation

```bash
npm install
```

## Development

### Quick Start

```bash
npm start
```

Starts local dev server with hot reload at http://localhost:3000

### Full Development Mode (Recommended)

Run in parallel terminals for auto-generation of all content:

```bash
# Terminal 1: Dev server with live reload
npm start

# Terminal 2: Auto-generate content on file changes
npm run watch
```

The watcher monitors:
- **Resume files** (`src/pages/resume.*`) → Auto-generates PDF
- **Markdown files** (`docs/**/*.md`) → Auto-generates skillset page

## Content Generation

Some content is auto-generated from source files:

### Auto-generate All Content

```bash
npm run watch           # Watch mode (auto-regenerate on changes)
npm run generate-all    # One-time generation of everything
```

### Individual Generation

```bash
npm run generate-all                 # Sync tags, skillset, skills data, resume PDF
SKIP_RESUME_PDF=1 npm run generate-all  # Skip PDF (no Puppeteer libs needed)
npm run generate-resume              # Resume PDF only
python3 scripts/sync-categories.py   # Find/map new tags
python3 scripts/generate-skillset.py # Skillset page only
```

### How It Works

**Resume PDF:**
- Uses Puppeteer + Chrome's native **print-to-PDF** (`page.pdf({ preferCSSPageSize: true })`)
- Relies on the `@media print` rules and `@page { size: 210mm 297mm }` in
  `src/pages/resume.module.css` for exact A4 layout (print mode auto-hides the navbar/footer)
- Output: `static/resume.pdf` — selectable text, clickable links, exactly 2 A4 pages
- Default source: `https://krishvk.gitlab.io/resume`. For local edits, run
  `RESUME_URL=http://localhost:3000/resume npm run generate-resume` (start `npm start` first)

> **Do not** convert this to screen capture (`emulateMediaType('screen')` or element
> screenshots). Screen mode bakes the sticky Docusaurus navbar (hamburger menu) into every
> page, and `page.pdf()` has **no `clip` option** (that belongs to `page.screenshot()`) — it
> is silently ignored and yields duplicated/cut pages. If content overflows A4, trim
> font-size/spacing in the `@media print` block, like fitting a page in MS Word.

**Skillset Page:**
- Scans all markdown files in `docs/` for frontmatter tags
- Auto-categorizes tags into skill areas
- Generates `src/pages/skillset.mdx` with clickable skill pills linking to documents

## Build

```bash
npm run build
```

Generates production static content into the `build` directory.

## Deployment

Automatically deployed to GitLab Pages via CI/CD pipeline (`.gitlab-ci.yml`).
