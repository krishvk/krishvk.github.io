#!/usr/bin/env node

/**
 * Script to generate PDF from HTML resume using Puppeteer
 * Usage: node generate-pdf-from-html.js
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const HTML_FILE = path.join(PROJECT_ROOT, 'resume', 'resume-template.html');
const PDF_FILE = path.join(PROJECT_ROOT, 'static', 'resume.pdf');
const PRODUCTION_URL = 'https://krishvk.github.io';

async function generatePDF() {
  // Check if HTML file exists
  if (!fs.existsSync(HTML_FILE)) {
    console.error(`Error: HTML file not found: ${HTML_FILE}`);
    process.exit(1);
  }

  console.log('Generating PDF from HTML resume...');
  console.log(`  HTML: ${HTML_FILE}`);
  console.log(`  PDF:  ${PDF_FILE}`);

  let browser;
  try {
    // Launch browser
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // Load HTML file
    const htmlContent = fs.readFileSync(HTML_FILE, 'utf8');

    // Find and embed image as base64
    const photoPath = path.join(PROJECT_ROOT, 'static', 'img', 'photo.jpg');
    const logoPath = path.join(PROJECT_ROOT, 'static', 'img', 'logo.jpg');

    // Determine which image to use (photo.jpg or logo.jpg as fallback)
    let imagePath = photoPath;
    let imageName = 'photo.jpg';
    if (!fs.existsSync(photoPath) && fs.existsSync(logoPath)) {
      imagePath = logoPath;
      imageName = 'logo.jpg';
      console.log('  Using logo.jpg as photo.jpg not found');
    } else if (fs.existsSync(photoPath)) {
      console.log('  Using photo.jpg');
    } else {
      console.log('  Warning: No image found, will use placeholder');
    }

    // Embed image as base64 if it exists
    let htmlWithAbsolutePaths = htmlContent;
    if (fs.existsSync(imagePath)) {
      const imageBuffer = fs.readFileSync(imagePath);
      const imageBase64 = imageBuffer.toString('base64');
      const imageExtension = path.extname(imagePath).slice(1); // 'jpg' or 'png'
      const imageDataUrl = `data:image/${imageExtension};base64,${imageBase64}`;

      console.log(`  Image embedded as base64 (${(imageBuffer.length / 1024).toFixed(1)}K)`);

      // Replace image src with base64 data URL - handle multiple possible paths
      // Match: src="/img/logo.jpg", src="/img/photo.jpg", src="static/img/photo.jpg", etc.
      htmlWithAbsolutePaths = htmlWithAbsolutePaths.replace(
        /src="[^"]*\/img\/(photo|logo)\.jpg"/g,
        `src="${imageDataUrl}"`
      );

      // Also handle src="/img/logo.jpg" specifically
      htmlWithAbsolutePaths = htmlWithAbsolutePaths.replace(
        /src="\/img\/[^"]*"/g,
        `src="${imageDataUrl}"`
      );

      // Remove onerror handler since we have the image embedded
      htmlWithAbsolutePaths = htmlWithAbsolutePaths.replace(
        /\s+onerror="[^"]*"/g,
        ''
      );

      console.log('  Replaced image src with base64 data URL');
    } else {
      console.log('  No image to embed, will show placeholder');
    }

    // Convert relative links to absolute production URLs for PDF
    // Match href="/..." but not href="http://", href="https://", href="mailto:", href="tel:"
    htmlWithAbsolutePaths = htmlWithAbsolutePaths.replace(
      /href="(\/[^"]*)"/g,
      (match, relativePath) => {
        const absoluteUrl = `${PRODUCTION_URL}${relativePath}`;
        console.log(`  Converting link: ${relativePath} -> ${absoluteUrl}`);
        return `href="${absoluteUrl}"`;
      }
    );

    console.log('  Converted relative links to production URLs');

    // Set content with wait for images
    await page.setContent(htmlWithAbsolutePaths, {
      waitUntil: 'networkidle0'
    });

    // Wait for images to load and verify they loaded
    const imageStatus = await page.evaluate(() => {
      return Promise.all(
        Array.from(document.images).map(img => {
          return new Promise((resolve) => {
            if (img.complete && img.naturalHeight !== 0) {
              resolve({ loaded: true, src: img.src.substring(0, 50) + '...', naturalHeight: img.naturalHeight });
              return;
            }
            img.onload = () => resolve({ loaded: true, src: img.src.substring(0, 50) + '...', naturalHeight: img.naturalHeight });
            img.onerror = () => resolve({ loaded: false, src: img.src.substring(0, 50) + '...', error: true });
            // Timeout after 2 seconds (base64 should load instantly)
            setTimeout(() => resolve({ loaded: false, src: img.src.substring(0, 50) + '...', timeout: true }), 2000);
          });
        })
      );
    });

    // Log image loading status
    imageStatus.forEach((status, idx) => {
      if (status.loaded) {
        console.log(`  Image ${idx + 1}: Loaded successfully (${status.naturalHeight}px)`);
      } else {
        console.log(`  Image ${idx + 1}: Failed to load - ${status.error ? 'error' : 'timeout'}`);
      }
    });

    // Additional wait to ensure image is rendered
    await new Promise(resolve => setTimeout(resolve, 500));

    // Wait for fonts to load
    await page.evaluateHandle('document.fonts.ready');

           // Generate PDF with proper page handling
           await page.pdf({
             path: PDF_FILE,
             format: 'A4',
             printBackground: true,
             margin: {
               top: '0',
               right: '0',
               bottom: '0',
               left: '0'
             },
             preferCSSPageSize: true,
             displayHeaderFooter: false,
             scale: 1.0
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

generatePDF();
