#!/usr/bin/env python3
"""
Sync category mappings with tags found in markdown files.

This script:
1. Scans all markdown files for tags
2. Detects new tags not in skillset-categories.yaml
3. Auto-adds new tags to "Others" section
4. Preserves existing categorizations

Run this before generate-skillset.py to ensure YAML is up-to-date.
"""

import os
import re
from pathlib import Path
from collections import defaultdict
import yaml


def load_categories(yaml_file):
    """Load category mappings from YAML file."""
    if not yaml_file.exists():
        print(f"Warning: Category file {yaml_file} not found. Creating default.")
        return {'Others': []}

    with open(yaml_file, 'r', encoding='utf-8') as f:
        data = yaml.safe_load(f)

    return data.get('categories', {'Others': []})


def save_categories(yaml_file, categories):
    """Save category mappings back to YAML file."""
    data = {'categories': categories}

    with open(yaml_file, 'w', encoding='utf-8') as f:
        f.write("# Skillset Category Mappings\n")
        f.write("# This file categorizes tags into skill areas.\n")
        f.write("# When new tags are detected, they will be automatically "
                "added to the \"Others\" section.\n")
        f.write("# You can manually move tags between categories by editing "
                "this file.\n\n")
        yaml.safe_dump(data, f, default_flow_style=False, sort_keys=False,
                      allow_unicode=True, indent=2)


def extract_frontmatter(content):
    """Extract YAML frontmatter from markdown content."""
    match = re.match(r'^---\s*\n(.*?)\n---\s*\n', content, re.DOTALL)
    if match:
        try:
            return yaml.safe_load(match.group(1))
        except yaml.YAMLError:
            return {}
    return {}


def get_all_markdown_files(docs_dir):
    """Get all markdown files from docs directory."""
    md_files = []
    for root, dirs, files in os.walk(docs_dir):
        for file in files:
            if file.endswith('.md') or file.endswith('.mdx'):
                md_files.append(os.path.join(root, file))
    return md_files


def extract_all_tags(docs_dir):
    """Extract all unique tags from all markdown files."""
    all_tags = set()

    md_files = get_all_markdown_files(docs_dir)

    for filepath in md_files:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        frontmatter = extract_frontmatter(content)
        tags = frontmatter.get('tags', [])
        all_tags.update(tags)

    return all_tags


def sync_categories(docs_dir, yaml_file):
    """
    Sync categories YAML with tags found in markdown files.
    - Detects new tags and adds them to "Others"
    - Removes stale tags from "Others" (tags no longer in any file)
    - Preserves manually curated tags in named categories
    """
    # Load existing categories
    categories = load_categories(yaml_file)

    # Extract all tags from markdown files
    all_tags = extract_all_tags(docs_dir)

    if not all_tags:
        print("No tags found in any markdown files.")
        return False

    # Build a flat set of all categorized tags
    all_categorized_tags = set()
    for tag_list in categories.values():
        all_categorized_tags.update(tag_list)

    # Find new tags not in any category
    new_tags = all_tags - all_categorized_tags

    # Clean up "Others" - remove tags that no longer exist in any file
    stale_tags = []
    if 'Others' in categories and categories['Others']:
        stale_tags = [tag for tag in categories['Others'] if tag not in all_tags]
        if stale_tags:
            categories['Others'] = [tag for tag in categories['Others']
                                   if tag in all_tags]
            print(f"Removed {len(stale_tags)} stale tag(s) from Others: "
                  f"{', '.join(sorted(stale_tags))}")

    # Add new tags to Others
    if new_tags:
        print(f"Found {len(new_tags)} new tag(s): {', '.join(sorted(new_tags))}")
        if 'Others' not in categories:
            categories['Others'] = []

        categories['Others'].extend(sorted(new_tags))
        # Remove duplicates and sort
        categories['Others'] = sorted(set(categories['Others']))

    # Save if anything changed
    if new_tags or stale_tags:
        save_categories(yaml_file, categories)
        print(f"✓ Updated {yaml_file.name}")
        return True
    else:
        print("No changes detected. Categories are up-to-date.")
        return False


def main():
    # Get repository root
    script_dir = Path(__file__).parent
    repo_root = script_dir.parent
    docs_dir = repo_root / 'docs'
    yaml_file = script_dir / 'skillset-categories.yaml'

    print(f"Scanning {docs_dir} for tags...")
    updated = sync_categories(docs_dir, yaml_file)

    if updated:
        print("\n💡 Tip: Edit skillset-categories.yaml to move tags from "
              "Others to appropriate categories")


if __name__ == '__main__':
    main()
