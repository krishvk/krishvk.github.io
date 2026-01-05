#!/usr/bin/env python3
"""
Generate skillset page from tags in all markdown files.
Reads category mappings from skillset-categories.yaml.

Note: Run sync-categories.py first to ensure categories are up-to-date.
"""

import os
import re
from pathlib import Path
from collections import defaultdict
import yaml


def load_categories(yaml_file):
    """Load category mappings from YAML file."""
    if not yaml_file.exists():
        print(f"Error: Category file {yaml_file} not found.")
        print("Please run sync-categories.py first.")
        return None

    with open(yaml_file, 'r', encoding='utf-8') as f:
        data = yaml.safe_load(f)

    return data.get('categories', {})

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

def extract_tags_from_files(docs_dir):
    """Extract tags and associated files from all markdown files."""
    tag_to_docs = defaultdict(lambda: defaultdict(list))

    md_files = get_all_markdown_files(docs_dir)

    for filepath in md_files:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        frontmatter = extract_frontmatter(content)
        tags = frontmatter.get('tags', [])

        if tags:
            # Get relative path and convert to URL
            rel_path = os.path.relpath(filepath, docs_dir)
            # Remove file extension (.md or .mdx) and convert to URL path
            path_without_ext = os.path.splitext(rel_path)[0]
            url_path = '/' + path_without_ext.replace(os.sep, '/')

            # Determine which section this doc belongs to
            section = rel_path.split(os.sep)[0]

            # Get document title (first H1 heading)
            title_match = re.search(r'^#\s+(.+)$', content, re.MULTILINE)
            if title_match:
                title = title_match.group(1)
            else:
                # Use filename without extension as fallback
                title = os.path.splitext(os.path.basename(filepath))[0]

            for tag in tags:
                tag_to_docs[tag][section].append({
                    'title': title,
                    'url': url_path,
                    'file': filepath
                })

    return tag_to_docs

def categorize_tags(tag_to_docs, categories):
    """
    Categorize tags into skill areas based on the YAML categories.
    """
    categorized = defaultdict(list)
    uncategorized_tags = []

    # Categorize all tags
    for tag, sections_dict in sorted(tag_to_docs.items()):
        placed = False
        for category, tag_list in categories.items():
            if tag in tag_list:
                categorized[category].append((tag, sections_dict))
                placed = True
                break

        if not placed:
            uncategorized_tags.append(tag)

    # Warn about uncategorized tags
    if uncategorized_tags:
        print(f"Warning: {len(uncategorized_tags)} tag(s) not in categories "
              f"YAML: {', '.join(sorted(uncategorized_tags))}")
        print("Run sync-categories.py to update the YAML file.")

    return categorized

def generate_skillset_page(categorized_tags, categories, output_file):
    """Generate the skillset MDX page."""

    content = """---
title: Skillset
description: Technologies, tools, and methodologies I worked with
---

import BrowserOnly from '@docusaurus/BrowserOnly';

<BrowserOnly>
  {() => {
    const initSkillsetHover = () => {
    const pillsContainer = document.querySelector('.skillset-pills');
    if (!pillsContainer) return;

    let categoryLabel = null;
    let currentCategory = null;

    // Get or create category label element
    function getCategoryLabel() {
      if (!categoryLabel) {
        categoryLabel = document.createElement('div');
        categoryLabel.className = 'skill-category-label';
        categoryLabel.style.display = 'none';
        pillsContainer.appendChild(categoryLabel);
      }
      return categoryLabel;
    }

    // Store current category bounding boxes
    let currentBoundingBoxes = [];

    // Calculate bounding boxes for a category (grouped by rows)
    function getCategoryBoundingBoxes(category) {
      const items = Array.from(
        pillsContainer.querySelectorAll('.skill-pill, .skill-dropdown')
      ).filter(item => item.getAttribute('data-category') === category);

      if (items.length === 0) return [];

      const containerRect = pillsContainer.getBoundingClientRect();
      const boxes = [];
      const rows = new Map(); // Map of row Y positions to items

      // Group items by row (same Y position, with tolerance)
      items.forEach(item => {
        const rect = item.getBoundingClientRect();
        const relativeTop = rect.top - containerRect.top;
        const relativeBottom = rect.bottom - containerRect.top;

        // Find existing row within tolerance (5px)
        let foundRow = false;
        for (const [rowY, rowItems] of rows.entries()) {
          if (Math.abs(relativeTop - rowY) < 5) {
            rowItems.push({ item, rect, relativeTop, relativeBottom });
            foundRow = true;
            break;
          }
        }

        if (!foundRow) {
          rows.set(relativeTop, [{ item, rect, relativeTop, relativeBottom }]);
        }
      });

      // Create bounding boxes for each row
      rows.forEach(rowItems => {
        if (rowItems.length === 0) return;

        // Find leftmost and rightmost items in this row
        let minLeft = Infinity;
        let maxRight = -Infinity;
        let minTop = Infinity;
        let maxBottom = -Infinity;

        rowItems.forEach(({ rect, relativeTop, relativeBottom }) => {
          const relativeLeft = rect.left - containerRect.left;
          const relativeRight = rect.right - containerRect.left;

          minLeft = Math.min(minLeft, relativeLeft);
          maxRight = Math.max(maxRight, relativeRight);
          minTop = Math.min(minTop, relativeTop);
          maxBottom = Math.max(maxBottom, relativeBottom);
        });

        // Add padding to bounding box (half gap size)
        const padding = 0.25;
        boxes.push({
          left: minLeft - padding,
          right: maxRight + padding,
          top: minTop - padding,
          bottom: maxBottom + padding
        });
      });

      return boxes;
    }

    // Check if point is within any bounding box
    function isPointInBoundingBoxes(x, y, boxes) {
      const containerRect = pillsContainer.getBoundingClientRect();
      const relativeX = x - containerRect.left;
      const relativeY = y - containerRect.top;

      return boxes.some(box => {
        return relativeX >= box.left &&
               relativeX <= box.right &&
               relativeY >= box.top &&
               relativeY <= box.bottom;
      });
    }

    // Update bounding boxes when category changes
    function updateBoundingBoxes(category) {
      if (category) {
        currentBoundingBoxes = getCategoryBoundingBoxes(category);
      } else {
        currentBoundingBoxes = [];
      }
    }

    // Highlight category by fading others
    function highlightCategory(category) {
      if (currentCategory === category) return;
      currentCategory = category;

      const allItems = pillsContainer.querySelectorAll('.skill-pill, .skill-dropdown');

      if (!category) {
        // Remove fade from all
        allItems.forEach(item => item.classList.remove('faded'));
        updateBoundingBoxes(null);
        return;
      }

      // Add fade to items NOT in this category
      allItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        if (itemCategory === category) {
          item.classList.remove('faded');
        } else {
          item.classList.add('faded');
        }
      });

      updateBoundingBoxes(category);
    }

    // Show category label in fixed position on first row of active pills
    function showCategoryLabel(category) {
      const label = getCategoryLabel();
      label.textContent = category;
      label.style.display = 'block';

      // Position label on the first row of active pills
      const activeItems = Array.from(
        pillsContainer.querySelectorAll('.skill-pill:not(.faded), .skill-dropdown:not(.faded)')
      ).filter(item => item.getAttribute('data-category') === category);

      if (activeItems.length > 0) {
        // Find the topmost active pill
        const containerRect = pillsContainer.getBoundingClientRect();
        let minTop = Infinity;

        activeItems.forEach(item => {
          const rect = item.getBoundingClientRect();
          const relativeTop = rect.top - containerRect.top;
          minTop = Math.min(minTop, relativeTop);
        });

        // Position label at the same vertical position as first row
        label.style.top = minTop + 'px';
      }
    }

    // Hide category label
    function hideCategoryLabel() {
      if (categoryLabel) {
        categoryLabel.style.display = 'none';
      }
    }

    // Attach hover listeners to all pills and dropdowns
    const allItems = pillsContainer.querySelectorAll('.skill-pill, .skill-dropdown');
    allItems.forEach(item => {
      const category = item.getAttribute('data-category');
      if (!category) return;

      item.addEventListener('mouseenter', () => {
        highlightCategory(category);
        showCategoryLabel(category);
      });
    });

    // Also handle dropdown menu hover to keep category highlighted
    const allDropdownMenus = pillsContainer.querySelectorAll('.skill-dropdown-menu');
    allDropdownMenus.forEach(menu => {
      const dropdown = menu.closest('.skill-dropdown');
      const category = dropdown?.getAttribute('data-category');
      if (!category) return;

      menu.addEventListener('mouseenter', () => {
        highlightCategory(category);
        showCategoryLabel(category);
      });
    });

    // Track mouse movement over container to maintain highlight in gaps
    pillsContainer.addEventListener('mousemove', (e) => {
      if (currentCategory && currentBoundingBoxes.length > 0) {
        // Check if mouse is within bounding boxes of current category
        if (isPointInBoundingBoxes(e.clientX, e.clientY, currentBoundingBoxes)) {
          // Maintain current category highlight
          return;
        }
      }

      // Check if mouse is directly over a pill
      const element = document.elementFromPoint(e.clientX, e.clientY);
      const pill = element?.closest('.skill-pill, .skill-dropdown, .skill-dropdown-menu');

      if (pill) {
        const category = pill.classList.contains('skill-dropdown-menu')
          ? pill.closest('.skill-dropdown')?.getAttribute('data-category')
          : pill.getAttribute('data-category');

        if (category && category !== currentCategory) {
          highlightCategory(category);
          showCategoryLabel(category);
        }
      } else if (currentCategory) {
        // Mouse is in gap and not in bounding box, clear highlight
        highlightCategory(null);
        hideCategoryLabel();
      }
    });

    // Clear highlights when leaving the container
    pillsContainer.addEventListener('mouseleave', () => {
      highlightCategory(null);
      hideCategoryLabel();
    });
  };

    // Initialize immediately
    setTimeout(initSkillsetHover, 100);
    return null;
  }}
</BrowserOnly>

<style>{`
.skillset-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 2rem;
  position: relative;
}

.skill-item {
  display: flex;
  gap: 0.25rem;
  align-items: center;
}

.skill-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  text-decoration: none;
  padding: 0.25rem 0.65rem;
  background-color: var(--ifm-color-emphasis-100);
  color: var(--ifm-font-color-base);
  border-radius: 50px;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1;
  vertical-align: middle;
  transition: all 0.2s ease;
  border: 1px solid var(--ifm-color-emphasis-300);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  position: relative;
  z-index: 1;
}

.skill-pill.faded,
.skill-dropdown.faded .skill-dropdown-btn {
  opacity: 0.25;
  transition: opacity 0.2s ease;
  pointer-events: none;
}

.skill-dropdown-menu {
  opacity: 1 !important;
}

.skill-category-label {
  position: absolute;
  left: 0;
  background: var(--ifm-color-primary);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  pointer-events: none;
  z-index: 1001;
  white-space: nowrap;
  transform: translateX(calc(-100% - 1rem));
}

.skill-pill:hover {
  background-color: var(--ifm-color-primary);
  border-color: var(--ifm-color-primary);
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  text-decoration: none;
}

.skill-pill .count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.1rem;
  height: 1.1rem;
  padding: 0 0.25rem;
  background-color: var(--ifm-color-emphasis-300);
  color: var(--ifm-color-emphasis-800);
  border-radius: 50px;
  font-size: 0.65rem;
  font-weight: 600;
  line-height: 1;
}

.skill-pill .count.zero {
  background-color: #ff4444;
  color: white;
}

.skill-pill:hover .count {
  background-color: rgba(255, 255, 255, 0.3);
  color: white;
}

.skill-pill:hover .count.zero {
  background-color: #cc0000;
  color: white;
}

.skill-dropdown {
  position: relative;
  display: inline-block;
  z-index: 1;
}

.skill-dropdown:hover,
.skill-dropdown:focus-within {
  z-index: 10000;
}

.skill-dropdown-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  text-decoration: none;
  padding: 0.25rem 0.65rem;
  margin: 0;
  background-color: var(--ifm-color-emphasis-100);
  color: var(--ifm-font-color-base);
  border-radius: 50px;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1;
  vertical-align: middle;
  border: 1px solid var(--ifm-color-emphasis-300);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.2s ease;
  outline: none;
  font-family: inherit;
}

.skill-dropdown-btn:focus {
  outline: none;
}

.skill-dropdown-btn:hover {
  background-color: var(--ifm-color-primary);
  border-color: var(--ifm-color-primary);
  color: white;
  text-decoration: none;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.skill-dropdown-btn .count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.1rem;
  height: 1.1rem;
  padding: 0 0.25rem;
  background-color: var(--ifm-color-emphasis-300);
  color: var(--ifm-color-emphasis-800);
  border-radius: 50px;
  font-size: 0.65rem;
  font-weight: 600;
  line-height: 1;
}

.skill-dropdown-btn .count.zero {
  background-color: #ff4444;
  color: white;
}

.skill-dropdown-btn:hover .count {
  background-color: rgba(255, 255, 255, 0.3);
  color: white;
}

.skill-dropdown-btn:hover .count.zero {
  background-color: #cc0000;
  color: white;
}

.skill-dropdown-menu {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 0;
  padding-top: 0.5rem;
  background: var(--ifm-background-surface-color) !important;
  border: 1px solid var(--ifm-color-emphasis-300);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 10000 !important;
  min-width: 180px;
  isolation: isolate;
}

.skill-dropdown-menu::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 0.5rem;
  background: transparent;
}

.skill-dropdown:hover .skill-dropdown-menu,
.skill-dropdown:focus-within .skill-dropdown-menu {
  display: block;
}

.skill-dropdown-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.65rem 1rem;
  color: var(--ifm-font-color-base);
  text-decoration: none;
  transition: background-color 0.15s ease;
  font-size: 0.875rem;
}

.skill-dropdown-item:first-child {
  margin-top: 0.5rem;
}

.skill-dropdown-item:last-child {
  margin-bottom: 0.5rem;
}

.skill-dropdown-item:hover {
  background-color: var(--ifm-color-emphasis-100);
  text-decoration: none;
}

.section-label {
  font-weight: 500;
}

.section-count {
  font-size: 0.75rem;
  color: var(--ifm-color-emphasis-600);
  background-color: var(--ifm-color-emphasis-200);
  padding: 0.125rem 0.5rem;
  border-radius: 12px;
  margin-left: 0.5rem;
}

[data-theme='dark'] .skill-pill {
  background-color: var(--ifm-color-emphasis-200);
  color: var(--ifm-color-emphasis-900);
  border-color: var(--ifm-color-emphasis-400);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

[data-theme='dark'] .skill-pill:hover {
  background-color: var(--ifm-color-primary-dark);
  border-color: var(--ifm-color-primary-dark);
  color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

[data-theme='dark'] .skill-pill .count {
  background-color: var(--ifm-color-emphasis-400);
  color: var(--ifm-color-emphasis-900);
}

[data-theme='dark'] .skill-pill .count.zero {
  background-color: #ff4444;
  color: white;
}

[data-theme='dark'] .skill-pill:hover .count {
  background-color: rgba(255, 255, 255, 0.25);
  color: white;
}

[data-theme='dark'] .skill-pill:hover .count.zero {
  background-color: #cc0000;
  color: white;
}

[data-theme='dark'] .skill-dropdown-btn {
  background-color: var(--ifm-color-emphasis-200);
  color: var(--ifm-color-emphasis-900);
  border-color: var(--ifm-color-emphasis-400);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

[data-theme='dark'] .skill-dropdown-btn:hover {
  background-color: var(--ifm-color-primary-dark);
  border-color: var(--ifm-color-primary-dark);
  color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

[data-theme='dark'] .skill-dropdown-btn .count {
  background-color: var(--ifm-color-emphasis-400);
  color: var(--ifm-color-emphasis-900);
}

[data-theme='dark'] .skill-dropdown-btn .count.zero {
  background-color: #ff4444;
  color: white;
}

[data-theme='dark'] .skill-dropdown-btn:hover .count {
  background-color: rgba(255, 255, 255, 0.25);
  color: white;
}

[data-theme='dark'] .skill-dropdown-btn:hover .count.zero {
  background-color: #cc0000;
  color: white;
}

[data-theme='dark'] .skill-dropdown-menu {
  background: var(--ifm-background-surface-color);
  border-color: var(--ifm-color-emphasis-400);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

[data-theme='dark'] .skill-dropdown-item:hover {
  background-color: var(--ifm-color-emphasis-300);
}

[data-theme='dark'] .section-count {
  background-color: var(--ifm-color-emphasis-400);
  color: var(--ifm-color-emphasis-900);
}

[data-theme='dark'] .skill-category-label {
  background: var(--ifm-color-primary-dark);
}
`}</style>

# Skillset

A comprehensive view of technologies, tools, and methodologies I worked with across my projects.

<div className="skillset-pills">
"""

    # Collect all pills from all categories
    all_pills = []

    # Generate content for each category
    # Show all categories from the YAML, including Others if it has tags
    for category in categories.keys():
        # Skip Others if it's empty
        if category == 'Others' and not categories[category]:
            continue

        # Get tags for this category
        defined_tags = categories.get(category, [])
        tags_with_docs = {tag for tag, _ in categorized_tags.get(category, [])}

        # Combine: tags with docs first, then missing tags
        tags_to_show = []
        for tag in defined_tags:
            if tag in tags_with_docs:
                # Find the sections_dict for this tag
                for t, sections_dict in categorized_tags.get(category, []):
                    if t == tag:
                        tags_to_show.append((tag, sections_dict))
                        break
            else:
                # Tag defined but has no documents
                tags_to_show.append((tag, {}))

        # Sort tags by total count (highest first), then alphabetically
        tags_with_counts = []
        for tag, sections_dict in tags_to_show:
            total_count = sum(len(docs) for docs in sections_dict.values())
            tags_with_counts.append((tag, sections_dict, total_count))

        # Sort by count (descending) then by tag name (ascending)
        tags_with_counts.sort(key=lambda x: (-x[2], x[0].lower()))

        for tag, sections_dict, total_count in tags_with_counts:
            pill_html = ''

            # If no documents, show as non-clickable pill with red count
            if total_count == 0:
                style_obj = "{{cursor: 'default'}}"
                pill_html = f'<span className="skill-pill" data-category="{category}" style={style_obj}>{tag}<span className="count zero">0</span></span>'
            # If tag appears in only one section, show a simple pill
            elif len(sections_dict) == 1:
                section, docs = list(sections_dict.items())[0]
                tag_slug = tag.lower().replace(' ', '-').replace('_', '-')
                url = f'/{section}/tags/{tag_slug}'

                # Create tooltip with doc titles
                doc_titles = ', '.join([doc['title'] for doc in docs[:3]])
                if len(docs) > 3:
                    doc_titles += f', +{len(docs)-3} more'

                pill_html = f'<a href="{url}" className="skill-pill" data-category="{category}" title="{doc_titles}">{tag}<span className="count">{len(docs)}</span></a>'
            else:
                # Tag appears in multiple sections - show dropdown
                pill_html = f'<div className="skill-dropdown" data-category="{category}">\n'
                pill_html += f'  <button className="skill-dropdown-btn">{tag}<span className="count">{total_count}</span></button>\n'
                pill_html += '  <div className="skill-dropdown-menu">\n'

                # Sort sections by doc count (most docs first)
                for section, docs in sorted(sections_dict.items(), key=lambda x: len(x[1]), reverse=True):
                    tag_slug = tag.lower().replace(' ', '-').replace('_', '-')
                    url = f'/{section}/tags/{tag_slug}'
                    section_label = section.replace('-', ' ').title()

                    pill_html += f'    <a href="{url}" className="skill-dropdown-item">\n'
                    pill_html += f'      <span className="section-label">{section_label}</span>\n'
                    pill_html += f'      <span className="section-count">{len(docs)}</span>\n'
                    pill_html += '    </a>\n'

                pill_html += '  </div>\n'
                pill_html += '</div>'

            all_pills.append(pill_html)

    # Add all pills to the content
    for pill in all_pills:
        content += '  ' + pill + '\n'

    content += '</div>\n'

    # Write to file
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"✓ Generated skillset page: {output_file}")
    print(f"  Total unique tags: {sum(len(tags) for tags in categorized_tags.values())}")

def main():
    # Get repository root
    script_dir = Path(__file__).parent
    repo_root = script_dir.parent
    docs_dir = repo_root / 'docs'
    output_file = repo_root / 'src' / 'pages' / 'skillset.mdx'
    yaml_file = script_dir / 'skillset-categories.yaml'

    # Load category mappings
    print(f"Loading categories from {yaml_file.name}...")
    categories = load_categories(yaml_file)

    if categories is None:
        return

    # Extract tags from all markdown files
    print(f"Scanning {docs_dir} for tags...")
    tag_to_docs = extract_tags_from_files(docs_dir)

    if not tag_to_docs:
        print("No tags found in any markdown files.")
        return

    # Categorize tags based on YAML
    categorized = categorize_tags(tag_to_docs, categories)

    # Generate the skillset page
    generate_skillset_page(categorized, categories, output_file)

if __name__ == '__main__':
    main()
