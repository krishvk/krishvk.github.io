#!/usr/bin/env node

/**
 * Script to generate PDF by printing the resume page
 * This ensures the PDF looks exactly like the web view
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const PDF_FILE = path.join(PROJECT_ROOT, 'static', 'resume.pdf');
const RESUME_URL = process.env.RESUME_URL || 'https://krishvk.gitlab.io/resume';

async function generatePDFFromPage() {
  console.log('Generating PDF from resume page...');
  console.log(`  URL: ${RESUME_URL}`);
  console.log(`  PDF: ${PDF_FILE}`);

  let browser;
  try {
    // Launch browser
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // Navigate to resume page
    console.log('  Loading resume page...');
    await page.goto(RESUME_URL, {
      waitUntil: 'networkidle0',
      timeout: 30000
    });

    // Wait for resume content to load
    await page.waitForSelector('[class*="page"]', { timeout: 15000 });
    
    // Wait for fonts to load
    await page.evaluateHandle('document.fonts.ready');
    
    // Additional wait for rendering
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('  Generating PDF using browser print...');

    // Use browser's print to PDF (preserves text, links, and looks exactly like the page)
    // preferCSSPageSize: true ensures it uses the @page { size: 210mm 297mm; margin: 0; } from CSS
    await page.pdf({
      path: PDF_FILE,
      printBackground: true,
      preferCSSPageSize: true, // Use CSS @page rules for exact size/margins
      displayHeaderFooter: false
    });

    console.log(`✓ PDF generated successfully: ${PDF_FILE}`);
    const stats = fs.statSync(PDF_FILE);
    console.log(`  File size: ${(stats.size / 1024).toFixed(1)}K`);

  } catch (error) {
    console.error('Error generating PDF:', error);
    process.exit(1);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

generatePDFFromPage();
