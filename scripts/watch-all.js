#!/usr/bin/env node

/**
 * Watch all project files and auto-generate content as needed:
 * 1. Resume files (tsx, css) → Generate PDF
 * 2. Markdown files with tags → Sync categories → Generate skills data → Generate skillset
 * 3. Category YAML file → Generate skills data → Generate skillset
 *
 * Run this in parallel with `npm start` for full dev experience.
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.resolve(__dirname, '..');

// Files to watch
const RESUME_FILES = [
  path.join(PROJECT_ROOT, 'src/pages/resume.tsx'),
  path.join(PROJECT_ROOT, 'src/pages/resume.module.css'),
  path.join(PROJECT_ROOT, 'src/data/skillsData.ts')
];

const DOCS_DIR = path.join(PROJECT_ROOT, 'docs');
const SKILLSET_CATEGORIES_FILE = path.join(PROJECT_ROOT,
                                           'scripts/skillset-categories.yaml');

// Debounce timers
let resumeTimer = null;
let skillsetTimer = null;

// Track running processes
let isGeneratingResume = false;
let isGeneratingSkillset = false;

console.log('🔍 Starting project watcher...\n');

// Helper to run a command
function runCommand(command, args, label) {
  return new Promise((resolve, reject) => {
    console.log(`\n📦 ${label}...`);

    const proc = spawn(command, args, {
      cwd: PROJECT_ROOT,
      stdio: 'inherit',
      shell: true
    });

    proc.on('close', (code) => {
      if (code === 0) {
        console.log(`✅ ${label} complete`);
        resolve();
      } else {
        console.error(`❌ ${label} failed with code ${code}`);
        reject(new Error(`${label} failed`));
      }
    });

    proc.on('error', (err) => {
      console.error(`❌ ${label} error:`, err.message);
      reject(err);
    });
  });
}

// Generate resume PDF
async function generateResume() {
  if (isGeneratingResume) {
    console.log('⏳ Resume generation already in progress, skipping...');
    return;
  }

  isGeneratingResume = true;
  try {
    await runCommand('npm', ['run', 'generate-resume'], 'Generating resume PDF');
  } catch (error) {
    // Error already logged
  } finally {
    isGeneratingResume = false;
  }
}

// Generate skillset from markdown changes (sync categories first)
async function generateSkillsetFromMarkdown() {
  if (isGeneratingSkillset) {
    console.log('⏳ Skillset generation already in progress, skipping...');
    return;
  }

  isGeneratingSkillset = true;
  try {
    await runCommand('python3', ['scripts/sync-categories.py'],
                     'Syncing categories');
    await runCommand('node', ['scripts/generate-skills-data.js'],
                     'Generating skills data');
    await runCommand('python3', ['scripts/generate-skillset.py'],
                     'Generating skillset page');
    // Also regenerate resume PDF since skillsData.ts changed
    await generateResume();
  } catch (error) {
    // Error already logged
  } finally {
    isGeneratingSkillset = false;
  }
}

// Generate skillset from YAML changes (no sync needed, user edited manually)
async function generateSkillsetFromYaml() {
  if (isGeneratingSkillset) {
    console.log('⏳ Skillset generation already in progress, skipping...');
    return;
  }

  isGeneratingSkillset = true;
  try {
    await runCommand('node', ['scripts/generate-skills-data.js'],
                     'Regenerating skills data');
    await runCommand('python3', ['scripts/generate-skillset.py'],
                     'Regenerating skillset from updated categories');
    // Also regenerate resume PDF since skillsData.ts changed
    await generateResume();
  } catch (error) {
    // Error already logged
  } finally {
    isGeneratingSkillset = false;
  }
}

// Watch resume files
RESUME_FILES.forEach((file) => {
  const fileName = path.basename(file);
  console.log(`👀 Watching: ${fileName}`);

  fs.watch(file, (eventType) => {
    if (eventType === 'change') {
      console.log(`\n🔄 Detected change in ${fileName}`);

      // Debounce: wait 1 second after last change
      if (resumeTimer) clearTimeout(resumeTimer);
      resumeTimer = setTimeout(() => {
        generateResume();
      }, 1000);
    }
  });
});

// Watch markdown files recursively
function watchDirectory(dir) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach((dirent) => {
    const fullPath = path.join(dir, dirent.name);

    if (dirent.isDirectory()) {
      // Recursively watch subdirectories
      watchDirectory(fullPath);
    } else if (dirent.isFile() &&
               (dirent.name.endsWith('.md') || dirent.name.endsWith('.mdx'))) {
      fs.watch(fullPath, (eventType) => {
        if (eventType === 'change') {
          const relativePath = path.relative(PROJECT_ROOT, fullPath);
          console.log(`\n🔄 Detected change in ${relativePath}`);

          // Debounce: wait 1 second after last change
          if (skillsetTimer) clearTimeout(skillsetTimer);
          skillsetTimer = setTimeout(() => {
            generateSkillsetFromMarkdown();
          }, 1000);
        }
      });
    }
  });
}

console.log(`👀 Watching: docs/**/*.{md,mdx}`);
watchDirectory(DOCS_DIR);

// Watch skillset categories YAML file
const yamlFileName = path.basename(SKILLSET_CATEGORIES_FILE);
console.log(`👀 Watching: scripts/${yamlFileName}\n`);
fs.watch(SKILLSET_CATEGORIES_FILE, (eventType) => {
  if (eventType === 'change') {
    console.log(`\n🔄 Detected change in ${yamlFileName} (manual edit)`);

    // Debounce: wait 1 second after last change
    if (skillsetTimer) clearTimeout(skillsetTimer);
    skillsetTimer = setTimeout(() => {
      generateSkillsetFromYaml();
    }, 1000);
  }
});

console.log('✨ Project watcher is running!');
console.log('   • Edit resume files → PDF regenerates');
console.log('   • Edit markdown/MDX files → Categories sync → Skillset regenerates');
console.log('   • Edit categories YAML → Skillset regenerates');
console.log('\n💡 Tip: Run "npm start" in another terminal for live preview\n');
console.log('Press Ctrl+C to stop watching...\n');

// Keep the process running
process.on('SIGINT', () => {
  console.log('\n\n👋 Stopping project watcher...');
  process.exit(0);
});
