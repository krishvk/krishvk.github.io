# Scripts Documentation

This directory contains automated content generation scripts for the website.

## Overview

The scripts follow a modular design where each script has a single responsibility:

```
sync-categories.py → skillset-categories.yaml → generate-skillset.py → skillset.mdx
         ↓                                              ↓
    Detects new tags                           Reads YAML + markdown
    Auto-updates YAML                          Generates page
```

## Scripts

### 1. `sync-categories.py`
**Purpose**: Detect new tags from markdown files and sync them to the YAML file.

**What it does**:
- Scans all markdown files in `docs/` for tags
- Detects tags not present in `skillset-categories.yaml`
- Auto-adds new tags to the "Others" section
- Preserves existing categorizations

**When to run**:
- Automatically runs when markdown files change (via watcher)
- Manually: `python3 scripts/sync-categories.py`

### 2. `generate-skills-data.js`
**Purpose**: Generate TypeScript skills data from YAML for resume.

**What it does**:
- Reads category mappings from `skillset-categories.yaml`
- Converts to TypeScript data structure
- Generates `src/data/skillsData.ts` for resume import
- Keeps resume skills in sync with skillset page

**When to run**:
- After `sync-categories.py`
- When `skillset-categories.yaml` is manually edited
- Automatically runs when YAML changes (via watcher)
- Manually: `node scripts/generate-skills-data.js`

### 3. `generate-skillset.py`
**Purpose**: Generate the skillset page from categories and tags.

**What it does**:
- Reads category mappings from `skillset-categories.yaml`
- Scans markdown files for tags and associated documents
- Generates the interactive skillset page at `src/pages/skillset.mdx`

**Requirements**:
- `skillset-categories.yaml` must be up-to-date (run `sync-categories.py` first)

**When to run**:
- After `sync-categories.py`
- When `skillset-categories.yaml` is manually edited
- Manually: `python3 scripts/generate-skillset.py`

### 4. `skillset-categories.yaml`
**Purpose**: Category mappings for all tags.

**Structure**:
```yaml
categories:
  Programming & Scripting Languages:
    - Python
    - C
    # ... more tags

  # ... more categories

  Others:
    - NewTag1  # Auto-added by sync-categories.py
```

**How to organize tags**:
1. New tags appear in "Others"
2. Manually edit the YAML to move tags to appropriate categories
3. Save the file → watcher auto-regenerates skillset page

### 5. `watch-all.js`
**Purpose**: Watch for file changes and auto-regenerate content.

**What it watches**:
- Resume files → Regenerates PDF
- Markdown files → Syncs categories → Generates skills data → Regenerates skillset
- `skillset-categories.yaml` → Generates skills data → Regenerates skillset (no sync needed)

**Usage**:
```bash
npm run watch
```

### 6. `generate-all.js`
**Purpose**: Generate all auto-generated content in one go.

**What it does**:
1. Syncs categories
2. Generates skills data
3. Generates skillset page
4. Generates resume PDF

**Usage**:
```bash
npm run generate-all
```

## Workflow

### Adding a New Tag

1. **Add tag to markdown file**:
   ```yaml
   ---
   title: My Project
   tags: [Python, NewFramework]
   ---
   ```

2. **Automatic sync** (if watcher is running):
   - Watcher detects markdown change
   - Runs `sync-categories.py` → adds "NewFramework" to Others
   - Runs `generate-skills-data.js` → updates resume skills
   - Runs `generate-skillset.py` → regenerates page

3. **Manual categorization**:
   - Edit `skillset-categories.yaml`
   - Move "NewFramework" from Others to appropriate category
   - Save → watcher regenerates skillset page

### Manual Run (without watcher)

```bash
# Option 1: Run all at once
npm run generate-all

# Option 2: Run individually
python3 scripts/sync-categories.py
node scripts/generate-skills-data.js
python3 scripts/generate-skillset.py
```

## Architecture Benefits

### Single Responsibility
- Each script does one thing well
- Easier to debug and maintain
- Clear data flow

### No Circular Dependencies
```
Markdown files → sync-categories.py → YAML
                                       ↓
                            ┌──────────┴──────────┐
                            ↓                     ↓
                generate-skills-data.js    generate-skillset.py
                            ↓                     ↓
                      skillsData.ts          skillset.mdx
                            ↓
                      resume.tsx
```

### Automatic & Manual Workflow
- Automatic: Watch mode handles everything
- Manual: Edit YAML to organize tags
- Recovery: Deleted tags auto-restore to Others

## Development

### Running the watcher

```bash
# Terminal 1: Dev server
npm start

# Terminal 2: File watcher
npm run watch
```

### Testing

```bash
# Test category sync
python3 scripts/sync-categories.py

# Test skillset generation
python3 scripts/generate-skillset.py

# Test everything
npm run generate-all
```
