#!/usr/bin/env node

/**
 * Script to generate resume PDF locally (for pre-push hook)
 * This starts a dev server, generates the resume, then stops the server
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const PROJECT_ROOT = path.resolve(__dirname, '..');

async function generateResumeLocal() {
  console.log('Generating resume PDF locally...');

  // Start dev server
  console.log('  Starting dev server...');
  const devServer = spawn('npm', ['start', '--', '--port', '3000', '--no-open'], {
    cwd: PROJECT_ROOT,
    stdio: 'pipe',
    shell: true
  });

  let serverReady = false;
  let serverOutput = '';

  devServer.stdout.on('data', (data) => {
    serverOutput += data.toString();
    if (data.toString().includes('Local:') ||
        data.toString().includes('localhost:3000') ||
        data.toString().includes('ready')) {
      serverReady = true;
    }
  });

  devServer.stderr.on('data', (data) => {
    serverOutput += data.toString();
    // Dev server might output to stderr, check for ready signal
    if (data.toString().includes('ready') ||
        data.toString().includes('localhost:3000')) {
      serverReady = true;
    }
  });

  // Wait for server to be ready (longer timeout for dev server)
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      devServer.kill();
      reject(new Error('Dev server failed to start within 60 seconds'));
    }, 60000);

    const checkInterval = setInterval(() => {
      if (serverReady) {
        clearInterval(checkInterval);
        clearTimeout(timeout);
        console.log('  Server ready');
        resolve();
      }
    }, 1000);
  });

  // Wait a bit more for server to fully initialize
  await new Promise(resolve => setTimeout(resolve, 3000));

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

    console.log('✓ Resume generation complete');

  } finally {
    // Kill the dev server
    console.log('  Stopping dev server...');
    devServer.kill();
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
}

generateResumeLocal().catch((error) => {
  console.error('Error generating resume:', error);
  process.exit(1);
});
