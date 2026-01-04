#!/usr/bin/env python3
"""
Generate skillset page from tags in all markdown files.
"""

import os
import re
from pathlib import Path
from collections import defaultdict
import yaml

# Category mappings - categorize tags into skill areas
CATEGORIES = {
    'Programming & Scripting Languages': [
        'Python', 'C', 'C++', 'SystemVerilog', 'MySQL', 'E',
        'Perl', 'Shell', 'Bash', 'Tcsh', 'Zsh'
    ],
    'AI & Machine Learning': [
        'scikit-learn', 'NLTK', 'Pandas',
        'anomaly-detection', 'clustering', 'hashing-vectorizer',
        'kd-tree', 'decision-tree', 'random-forest'
    ],
    'Data Visualization': [
        'Streamlit', 'Plotly-Dash', 'Grafana'
    ],
    'Programming Tools & Libraries': [
        'Bison', 'Flex', 'Yacc', 'Graphviz', 'Dot', 'Compilers', 'argparse'
    ],
    'Version Control & CI/CD': [
        'Git', 'GitLab', 'GitHub', 'SVN', 'Perforce', 'LSF', 'Farm'
    ],
    'Documentation Tools': [
        'Docusaurus', 'Sphinx', 'Doxygen'
    ],
    'EDA & Verification Tools': [
        'Verdi', 'VCS', 'Specman', 'ICO', 'VDS-DVE', 'CSmith', 'Testbench'
    ],
    'Processor Architecture': [
        'MMU', 'ISA', 'ISA-Coverage', 'Action-Points', 'Debug-Unit', 'RISC-V', 'Processor-State', 'Assembly-Language'
    ],
    'Processor Verification': [
        'Verification', 'Test-Generation', 'Co-Simulation',
        'PLV', 'MLV', 'Coverage', 'Cov2Gen', 'Constraints',
        'Configuration-Space'
    ],
    'Data Formats': [
        'JSON', 'Parquet', 'YAML'
    ]
}

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
            if file.endswith('.md'):
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
            # Remove .md extension and convert to URL path
            url_path = '/' + rel_path[:-3].replace(os.sep, '/')

            # Determine which section this doc belongs to
            section = rel_path.split(os.sep)[0]

            # Get document title (first H1 heading)
            title_match = re.search(r'^#\s+(.+)$', content, re.MULTILINE)
            title = title_match.group(1) if title_match else os.path.basename(filepath)[:-3]

            for tag in tags:
                tag_to_docs[tag][section].append({
                    'title': title,
                    'url': url_path,
                    'file': filepath
                })

    return tag_to_docs

def categorize_tags(tag_to_docs):
    """Categorize tags into skill areas."""
    categorized = defaultdict(list)
    uncategorized = []

    for tag, sections_dict in sorted(tag_to_docs.items()):
        placed = False
        for category, tag_list in CATEGORIES.items():
            if tag in tag_list:
                categorized[category].append((tag, sections_dict))
                placed = True
                break

        if not placed:
            uncategorized.append((tag, sections_dict))

    # Add uncategorized to "Other" category if any exist
    if uncategorized:
        categorized['Other'] = uncategorized

    return categorized

def generate_skillset_page(categorized_tags, output_file):
    """Generate the skillset MDX page."""

    content = """---
title: Skillset
description: Technologies, tools, and methodologies I worked with
---

<style>{`
.skillset-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 2rem;
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
  margin-top: 0.125rem;
  background: var(--ifm-background-surface-color);
  border: 1px solid var(--ifm-color-emphasis-300);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  min-width: 180px;
  padding: 0.5rem 0;
}

.skill-dropdown:hover .skill-dropdown-menu {
  display: block;
}

.skill-dropdown-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 1rem;
  color: var(--ifm-font-color-base);
  text-decoration: none;
  transition: background-color 0.15s ease;
  font-size: 0.875rem;
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
`}</style>

# Skillset

A comprehensive view of technologies, tools, and methodologies I worked with across my projects.

"""

    # Generate content for each category
    for category in list(CATEGORIES.keys()) + ['Other']:
        content += f"\n## {category}\n\n"
        content += '<div className="skillset-pills">\n'

        # Get tags for this category
        if category == 'Other':
            # For Other category, use tags from categorized_tags
            if category in categorized_tags:
                tags_to_show = sorted(categorized_tags[category])
            else:
                tags_to_show = []
        else:
            # For defined categories, show ALL tags from CATEGORIES
            defined_tags = CATEGORIES.get(category, [])
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

            # If no documents, show as non-clickable pill with red count
            if total_count == 0:
                style_obj = "{{cursor: 'default'}}"
                content += f'  <span className="skill-pill" style={style_obj}>{tag}<span className="count zero">0</span></span>\n'
            # If tag appears in only one section, show a simple pill
            elif len(sections_dict) == 1:
                section, docs = list(sections_dict.items())[0]
                tag_slug = tag.lower().replace(' ', '-').replace('_', '-')
                url = f'/{section}/tags/{tag_slug}'

                # Create tooltip with doc titles
                doc_titles = ', '.join([doc['title'] for doc in docs[:3]])
                if len(docs) > 3:
                    doc_titles += f', +{len(docs)-3} more'

                content += f'  <a href="{url}" className="skill-pill" title="{doc_titles}">{tag}<span className="count">{len(docs)}</span></a>\n'
            else:
                # Tag appears in multiple sections - show dropdown
                content += f'  <div className="skill-dropdown">\n'
                content += f'    <button className="skill-dropdown-btn">{tag}<span className="count">{total_count}</span></button>\n'
                content += '    <div className="skill-dropdown-menu">\n'

                # Sort sections by doc count (most docs first)
                for section, docs in sorted(sections_dict.items(), key=lambda x: len(x[1]), reverse=True):
                    tag_slug = tag.lower().replace(' ', '-').replace('_', '-')
                    url = f'/{section}/tags/{tag_slug}'
                    section_label = section.replace('-', ' ').title()

                    content += f'      <a href="{url}" className="skill-dropdown-item">\n'
                    content += f'        <span className="section-label">{section_label}</span>\n'
                    content += f'        <span className="section-count">{len(docs)}</span>\n'
                    content += '      </a>\n'

                content += '    </div>\n'
                content += '  </div>\n'

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

    # Extract tags from all markdown files
    print(f"Scanning {docs_dir} for tags...")
    tag_to_docs = extract_tags_from_files(docs_dir)

    if not tag_to_docs:
        print("No tags found in any markdown files.")
        return

    # Categorize tags
    categorized = categorize_tags(tag_to_docs)

    # Generate the skillset page
    generate_skillset_page(categorized, output_file)

if __name__ == '__main__':
    main()
