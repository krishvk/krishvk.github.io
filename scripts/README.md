# Scripts

This directory contains utility scripts for maintaining the site.

## Content Generation

### `generate-skillset.py`

Automatically generates the skillset page by extracting tags from all markdown files.

**Usage:**

```bash
python3 scripts/generate-skillset.py
```

**What it does:**

- Scans all markdown files in `docs/` for tags in frontmatter
- Categorizes tags into skill areas (AI & ML, Programming, Verification, etc.)
- Generates `src/pages/skillset.mdx` with clickable skill pills
- Each pill links to a relevant document and shows the count

**Customization:**
Edit the `CATEGORIES` dict in the script to adjust tag categorization.

## Git Hooks

### Pre-commit Hook

A pre-commit hook is set up to automatically:

1. **Generate skillset page** when markdown files with tags are modified
2. **Generate resume PDF** when resume-related files are modified

This ensures generated content is always up-to-date and included in the same commit.

**Manual Setup (required for local development):**

After cloning the repository, run this command once to set up the git hooks:

```bash
./scripts/setup-git-hooks.sh
```

**Note:** This is a manual step and should only be run in your local development environment.
It is not needed (and will not run) in CI/CD pipelines.

**What it does:**

- Runs before each `git commit`
- Detects if markdown or resume-related files are being committed
- Generates skillset page and/or resume PDF as needed
- Automatically adds generated files to the same commit if they changed
- Skips generation if no relevant files are in the commit

**To skip the hook:**

```bash
git commit --no-verify
```

## Resume Generation Scripts

- `generate-resume-local.js` - Generates resume PDF using dev server (for local/pre-push use)
- `generate-resume-in-build.js` - Generates resume PDF using built site (for CI/CD use, now optional)
