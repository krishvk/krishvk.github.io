#!/usr/bin/env node

/**
 * Script to generate resume PDF during build process
 * This works in CI/CD by building the site first, then serving it locally
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const BUILD_DIR = path.join(PROJECT_ROOT, 'build');
const STATIC_DIR = path.join(PROJECT_ROOT, 'static');
const PDF_FILE = path.join(STATIC_DIR, 'resume.pdf');
const BUILD_PDF_FILE = path.join(BUILD_DIR, 'resume.pdf');

async function generateResumeInBuild() {
  console.log('Generating resume PDF from built site...');

  // Check if build directory exists
  if (!fs.existsSync(BUILD_DIR)) {
    console.error('Error: Build directory not found. Run "npm run build" first.');
    process.exit(1);
  }

  // Start a local server from the build directory
  console.log('  Starting local server from build directory...');
  const serveProcess = spawn('npx', ['docusaurus', 'serve', '--port', '3000', '--no-open', '--dir', 'build'], {
    cwd: PROJECT_ROOT,
    stdio: 'pipe',
    shell: true
  });

  let serverReady = false;
  let serverOutput = '';

  serveProcess.stdout.on('data', (data) => {
    serverOutput += data.toString();
    if (data.toString().includes('Local:') || data.toString().includes('localhost:3000')) {
      serverReady = true;
    }
  });

  serveProcess.stderr.on('data', (data) => {
    serverOutput += data.toString();
  });

  // Wait for server to be ready
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      serveProcess.kill();
      reject(new Error('Server failed to start within 30 seconds'));
    }, 30000);

    const checkInterval = setInterval(() => {
      if (serverReady) {
        clearInterval(checkInterval);
        clearTimeout(timeout);
        console.log('  Server ready');
        resolve();
      }
    }, 500);
  });

  // Wait a bit more for server to fully initialize
  await new Promise(resolve => setTimeout(resolve, 2000));

  try {
    // Generate HTML template
    console.log('  Generating HTML template...');
    const htmlProcess = spawn('node', ['resume/generate-html-from-react.js'], {
      cwd: PROJECT_ROOT,
      env: { ...process.env, RESUME_URL: 'http://localhost:3000/resume' },
      stdio: 'inherit',
      shell: true
    });

    await new Promise((resolve, reject) => {
      htmlProcess.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`HTML generation failed with code ${code}`));
        }
      });
    });

    // Generate PDF
    console.log('  Generating PDF...');
    const pdfProcess = spawn('node', ['resume/generate-pdf-from-html.js'], {
      cwd: PROJECT_ROOT,
      stdio: 'inherit',
      shell: true
    });

    await new Promise((resolve, reject) => {
      pdfProcess.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`PDF generation failed with code ${code}`));
        }
      });
    });

    // Copy PDF to build directory
    if (fs.existsSync(PDF_FILE)) {
      if (!fs.existsSync(path.dirname(BUILD_PDF_FILE))) {
        fs.mkdirSync(path.dirname(BUILD_PDF_FILE), { recursive: true });
      }
      fs.copyFileSync(PDF_FILE, BUILD_PDF_FILE);
      console.log(`✓ PDF copied to build directory: ${BUILD_PDF_FILE}`);
    } else {
      console.warn('  Warning: PDF file not found after generation');
    }

  } finally {
    // Kill the server
    console.log('  Stopping local server...');
    serveProcess.kill();
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('✓ Resume generation complete');
}

generateResumeInBuild().catch((error) => {
  console.error('Error generating resume:', error);
  process.exit(1);
});
