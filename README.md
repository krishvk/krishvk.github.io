# Personal Website

Built with [Docusaurus](https://docusaurus.io/) - a modern static website generator.

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
npm run generate-resume              # Resume PDF only
python3 scripts/generate-skillset.py # Skillset page only
```

### How It Works

**Resume PDF:**
- Uses Puppeteer + Chrome's native print-to-PDF functionality
- Applies `@media print` CSS rules for exact layout control
- Output: `static/resume.pdf`
- ✅ Text is selectable, links are clickable, exact match with web view

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
