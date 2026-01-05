#!/usr/bin/env node

/**
 * Generate TypeScript skills data from skillset-categories.yaml
 * This keeps resume skills in sync with the skillset page.
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const YAML_FILE = path.join(PROJECT_ROOT, 'scripts/skillset-categories.yaml');
const OUTPUT_FILE = path.join(PROJECT_ROOT, 'src/data/skillsData.ts');

function formatTagForDisplay(tag) {
  // Convert kebab-case and snake_case to Title Case
  return tag
    .split(/[-_]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function generateSkillsData() {
  console.log('📦 Generating skills data from YAML...');

  // Read and parse YAML file
  const yamlContent = fs.readFileSync(YAML_FILE, 'utf8');
  const data = yaml.load(yamlContent);
  const categories = data.categories || {};

  // Generate TypeScript code
  let tsCode = `/**
 * Auto-generated from skillset-categories.yaml
 * DO NOT EDIT MANUALLY - Run: node scripts/generate-skills-data.js
 */

export interface SkillCategory {
  name: string;
  skills: string[];
}

export const skillsData: SkillCategory[] = [
`;

  // Convert categories to array, excluding "Others" if empty
  for (const [categoryName, tags] of Object.entries(categories)) {
    // Skip Others if empty
    if (categoryName === 'Others' && (!tags || tags.length === 0)) {
      continue;
    }

    // Skip empty categories
    if (!tags || tags.length === 0) {
      continue;
    }

    const formattedSkills = tags.map(tag => formatTagForDisplay(tag));
    
    tsCode += `  {\n`;
    tsCode += `    name: '${categoryName}',\n`;
    tsCode += `    skills: [\n`;
    
    formattedSkills.forEach((skill, index) => {
      const comma = index < formattedSkills.length - 1 ? ',' : '';
      tsCode += `      '${skill}'${comma}\n`;
    });
    
    tsCode += `    ]\n`;
    tsCode += `  },\n`;
  }

  tsCode += `];\n`;

  // Ensure output directory exists
  const outputDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Write to file
  fs.writeFileSync(OUTPUT_FILE, tsCode, 'utf8');
  
  console.log(`✅ Generated ${OUTPUT_FILE}`);
  console.log(`   ${Object.keys(categories).length} categories`);
  console.log(`   ${Object.values(categories).flat().length} total skills`);
}

try {
  generateSkillsData();
} catch (error) {
  console.error('❌ Error generating skills data:', error.message);
  process.exit(1);
}
