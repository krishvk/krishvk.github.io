#!/usr/bin/env node

/**
 * Generate all auto-generated content:
 * 1. Sync categories (detect new tags)
 * 2. Generate skills data (for resume)
 * 3. Skillset page (from markdown tags and categories)
 * 4. Resume PDF (from React component)
 */

const { spawn } = require('child_process');
const path = require('path');

const PROJECT_ROOT = path.resolve(__dirname, '..');

function runCommand(command, args, cwd) {
  return new Promise((resolve, reject) => {
    console.log(`\n📦 Running: ${command} ${args.join(' ')}`);

    const proc = spawn(command, args, {
      cwd,
      stdio: 'inherit',
      shell: true
    });

    proc.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`${command} exited with code ${code}`));
      } else {
        resolve();
      }
    });

    proc.on('error', (err) => {
      reject(err);
    });
  });
}

async function generateAll() {
  console.log('🚀 Generating all auto-generated content...\n');

  const startTime = Date.now();

  try {
    // Step 1: Sync categories first (must run before skillset generation)
    await runCommand('python3', ['scripts/sync-categories.py'], PROJECT_ROOT);
    console.log('✅ Categories synced\n');

    // Step 2: Generate skills data for resume
    await runCommand('node', ['scripts/generate-skills-data.js'], PROJECT_ROOT);
    console.log('✅ Skills data generated\n');

    // Step 3: Generate skillset page
    await runCommand('python3', ['scripts/generate-skillset.py'], PROJECT_ROOT);
    console.log('✅ Skillset page generated\n');

    // Step 4: Resume PDF (optional — needs Chrome system libraries on Linux/WSL)
    if (process.env.SKIP_RESUME_PDF === '1') {
      console.log('⏭️  Skipping resume PDF (SKIP_RESUME_PDF=1)\n');
    } else {
      try {
        await runCommand('npm', ['run', 'generate-resume'], PROJECT_ROOT);
        console.log('✅ Resume PDF generated\n');
      } catch (error) {
        console.warn('\n⚠️  Resume PDF generation failed (other content was generated).');
        console.warn('   On Ubuntu/WSL, chromium-browser is a snap stub — install libs instead:');
        console.warn('   sudo apt-get install -y libnss3 libasound2t64');
        console.warn('   (Ubuntu 22.04: use libasound2 instead of libasound2t64)');
        console.warn('   Then: npm run generate-resume');
        console.warn(`   Details: ${error.message}\n`);
      }
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`\n✨ All content generated successfully in ${duration}s`);
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Error generating content:', error.message);
    process.exit(1);
  }
}

generateAll();
