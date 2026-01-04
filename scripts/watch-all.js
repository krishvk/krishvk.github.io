#!/usr/bin/env node

/**
 * Watch all project files and auto-generate content as needed:
 * 1. Resume files (tsx, css) → Generate PDF
 * 2. Markdown files with tags → Generate skillset
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
  path.join(PROJECT_ROOT, 'src/pages/resume.module.css')
];

const DOCS_DIR = path.join(PROJECT_ROOT, 'docs');

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

// Generate skillset
async function generateSkillset() {
  if (isGeneratingSkillset) {
    console.log('⏳ Skillset generation already in progress, skipping...');
    return;
  }

  isGeneratingSkillset = true;
  try {
    await runCommand('python3', ['scripts/generate-skillset.py'], 'Generating skillset page');
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
    } else if (dirent.isFile() && dirent.name.endsWith('.md')) {
      fs.watch(fullPath, (eventType) => {
        if (eventType === 'change') {
          const relativePath = path.relative(PROJECT_ROOT, fullPath);
          console.log(`\n🔄 Detected change in ${relativePath}`);
          
          // Debounce: wait 1 second after last change
          if (skillsetTimer) clearTimeout(skillsetTimer);
          skillsetTimer = setTimeout(() => {
            generateSkillset();
          }, 1000);
        }
      });
    }
  });
}

console.log(`👀 Watching: docs/**/*.md\n`);
watchDirectory(DOCS_DIR);

console.log('✨ Project watcher is running!');
console.log('   • Edit resume files → PDF auto-regenerates');
console.log('   • Edit markdown files → Skillset auto-regenerates');
console.log('\n💡 Tip: Run "npm start" in another terminal for live preview\n');
console.log('Press Ctrl+C to stop watching...\n');

// Keep the process running
process.on('SIGINT', () => {
  console.log('\n\n👋 Stopping project watcher...');
  process.exit(0);
});
