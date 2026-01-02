#!/usr/bin/env node

/**
 * Script to generate HTML template from React resume component
 * This extracts the rendered HTML from the React component and creates a standalone HTML file
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const HTML_TEMPLATE = path.join(PROJECT_ROOT, 'resume', 'resume-template.html');
const RESUME_PAGE_URL = process.env.RESUME_URL || 'http://localhost:3000/resume';

async function generateHTMLTemplate() {
  console.log('Generating HTML template from React component...');
  console.log(`  URL: ${RESUME_PAGE_URL}`);
  console.log(`  Output: ${HTML_TEMPLATE}`);

  // Note: We'll check if server is running when we try to navigate

  let browser;
  try {
    // Launch browser
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // Set viewport to A4 size
    await page.setViewport({
      width: 794, // A4 width in pixels at 96 DPI
      height: 1123, // A4 height
    });

    // Navigate to resume page
    console.log('  Loading resume page...');
    try {
      await page.goto(RESUME_PAGE_URL, {
        waitUntil: 'networkidle0',
        timeout: 30000
      });
    } catch (error) {
      console.error(`\nError: Cannot connect to ${RESUME_PAGE_URL}`);
      console.error('Please make sure the Docusaurus dev server is running:');
      console.error('  npm start\n');
      throw error;
    }

    // Wait for resume content to load - try multiple selectors
    let resumeElement = null;
    try {
      await page.waitForSelector('[class*="htmlResume"], [class*="html-resume"], .resume-container', { timeout: 15000 });
    } catch (e) {
      // Try waiting a bit more for React to render
      await page.waitForTimeout(2000);
    }

    // Extract the resume HTML and convert CSS module classes to regular classes
    const resumeHTML = await page.evaluate(() => {
      // Find the htmlResume element (the actual resume content)
      let resumeElement = document.querySelector('[class*="htmlResume"]');

      if (!resumeElement) {
        // Fallback: find by structure
        const main = document.querySelector('main');
        if (main) {
          const children = Array.from(main.children);
          resumeElement = children.find(el => {
            const hasSidebar = el.querySelector('[class*="sidebar"]');
            const hasContent = el.querySelector('[class*="content"]');
            return hasSidebar && hasContent;
          });
        }
      }

      if (!resumeElement) {
        throw new Error('Resume element not found');
      }

      // Create a comprehensive class mapping based on element structure and computed styles
      const mapClass = (el, classList) => {
        if (!classList || classList.length === 0) return '';

        const styles = window.getComputedStyle(el);
        const bgColor = styles.backgroundColor;
        const width = parseFloat(styles.width) || 0;
        const parent = el.parentElement;
        const parentBg = parent ? window.getComputedStyle(parent).backgroundColor : '';

        // Check each class in the list - CSS modules use patterns like className_hash
        for (const cls of classList) {
          // Extract base class name (before underscore/hash)
          const baseClass = cls.split('_')[0] || cls.split('-')[0] || cls;

          // Main container
          if (baseClass === 'htmlResume' || cls.includes('htmlResume')) return 'html-resume';

          // Sidebar (blue background rgb(22, 56, 83), ~33% width, direct child of htmlResume)
          if ((baseClass === 'sidebar' || cls.includes('sidebar')) &&
              (bgColor.includes('rgb(22, 56, 83)') || bgColor.includes('rgb(22,56,83)')) &&
              width > 200 && width < 500) {
            return 'sidebar';
          }

          // Sidebar sections (inside sidebar, not blue background)
          if (baseClass === 'sidebarSection' ||
              (cls.includes('sidebarSection') || (cls.includes('sidebar') && parentBg.includes('rgb(22, 56, 83)') && !bgColor.includes('rgb(22, 56, 83)')))) {
            return 'sidebar-section';
          }

          // Content area (white background, ~67% width, direct child of htmlResume)
          if ((baseClass === 'content' || cls.includes('content')) &&
              !cls.includes('section') && !cls.includes('header') && !cls.includes('title') &&
              width > 400 && parentBg !== 'rgb(22, 56, 83)') {
            return 'content';
          }

          // Content sections (inside content area)
          if (baseClass === 'contentSection' || cls.includes('contentSection')) {
            return 'content-section';
          }

          // Other specific classes
          if (baseClass === 'photoContainer' || cls.includes('photoContainer')) return 'photo-container';
          if ((baseClass === 'photo' || cls.includes('photo')) && !cls.includes('placeholder') && !cls.includes('Container')) return 'photo';
          if (baseClass === 'photoPlaceholder' || cls.includes('photoPlaceholder')) return 'photo-placeholder';
          if ((baseClass === 'name' || cls.includes('name')) && !cls.includes('item')) return 'name';
          if ((baseClass === 'title' || cls.includes('title')) && !cls.includes('item') && !cls.includes('content') && !cls.includes('Header') && !cls.includes('Section')) return 'title';
          if (baseClass === 'contactItem' || cls.includes('contactItem')) return 'contact-item';
          if (baseClass === 'skillCategory' || cls.includes('skillCategory')) return 'skill-category';
          if (baseClass === 'contentHeader' || cls.includes('contentHeader')) return 'content-header';
          if (baseClass === 'contentTitle' || cls.includes('contentTitle')) return 'content-title';
          if (baseClass === 'headerLine' || cls.includes('headerLine')) return 'header-line';
          if (baseClass === 'itemHeader' || cls.includes('itemHeader')) return 'item-header';
          if (baseClass === 'itemTitle' || cls.includes('itemTitle')) return 'item-title';
          if (baseClass === 'itemDate' || cls.includes('itemDate')) return 'item-date';
          if (baseClass === 'itemSubtitle' || cls.includes('itemSubtitle')) return 'item-subtitle';
          if (baseClass === 'itemList' || cls.includes('itemList')) return 'item-list';
          if (baseClass === 'publicationItem' || cls.includes('publicationItem')) return 'publication-item';
          if (baseClass === 'experienceLine' || cls.includes('experienceLine')) return 'experience-line';
          if (baseClass === 'experienceMainLine' || cls.includes('experienceMainLine')) return 'experience-main-line';
          if (baseClass === 'experienceSubLine' || cls.includes('experienceSubLine')) return 'experience-sub-line';
          if ((baseClass === 'item' || cls.includes('item')) && !cls.includes('Header') && !cls.includes('Title') && !cls.includes('Date') && !cls.includes('Subtitle') && !cls.includes('List')) return 'item';
          if (baseClass === 'smallLink' || cls.includes('smallLink')) return 'small-link';
        }

        // Fallback: try to extract meaningful class from hash
        const firstClass = classList[0] || '';
        if (firstClass.includes('_')) {
          const base = firstClass.split('_')[0];
          // Try common mappings
          if (base === 'sidebar' && width > 200) return 'sidebar';
          if (base === 'content' && width > 400) return 'content';
        }

        return '';
      };

      // Clone the element and replace class names
      const clone = resumeElement.cloneNode(true);

      // Process all elements recursively
      const processElement = (el) => {
        if (el.nodeType === 1) { // Element node
          const classList = el.classList;
          if (classList && classList.length > 0) {
            const mappedClass = mapClass(el, Array.from(classList));
            if (mappedClass) {
              el.className = mappedClass;
            } else {
              // Fallback: try to extract base class from CSS module pattern
              const firstClass = classList[0];
              if (firstClass && firstClass.includes('_')) {
                const base = firstClass.split('_')[0];
                const styles = window.getComputedStyle(el);
                const bgColor = styles.backgroundColor;
                const width = parseFloat(styles.width) || 0;

                // Map based on base name and computed styles
                if (base === 'sidebar' && (bgColor.includes('rgb(22, 56, 83)') || bgColor.includes('rgb(22,56,83)')) && width > 200) {
                  el.className = 'sidebar';
                } else if (base === 'content' && width > 400 && !bgColor.includes('rgb(22, 56, 83)')) {
                  el.className = 'content';
                } else if (base === 'sidebar' && width < 200) {
                  el.className = 'sidebar-section';
                } else if (base === 'content' && width < 400) {
                  el.className = 'content-section';
                }
              }
            }
          }
          Array.from(el.children).forEach(processElement);
        }
      };

      processElement(clone);

      // Convert href attributes that use baseUrl to relative paths
      const allLinks = clone.querySelectorAll('a[href]');
      allLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('http') && href.includes('localhost')) {
          try {
            const url = new URL(href);
            link.setAttribute('href', url.pathname + url.search);
          } catch (e) {
            // Keep as-is if URL parsing fails
          }
        }
      });

      // The clone is the htmlResume element, which should have exactly 2 direct children:
      // 1. sidebar (blue background)
      // 2. content (white background)
      const children = Array.from(clone.children);

      if (children.length < 2) {
        throw new Error(`Expected 2 children (sidebar and content), found ${children.length}`);
      }

      // Find sidebar and content by computed styles
      let sidebarEl = null;
      let contentEl = null;

      for (const child of children) {
        const styles = window.getComputedStyle(child);
        const bgColor = styles.backgroundColor;
        const width = parseFloat(styles.width) || 0;
        const parentBg = window.getComputedStyle(clone).backgroundColor;

        // Sidebar: blue background rgb(22, 56, 83), ~33% width, direct child of htmlResume
        if ((bgColor.includes('rgb(22, 56, 83)') || bgColor.includes('rgb(22,56,83)')) &&
            width > 200 && width < 500 &&
            !parentBg.includes('rgb(22, 56, 83)')) {
          sidebarEl = child;
          sidebarEl.className = 'sidebar';
        }
        // Content: white/transparent background, ~67% width, direct child of htmlResume
        else if (!bgColor.includes('rgb(22, 56, 83)') &&
                 !bgColor.includes('rgb(22,56,83)') &&
                 width > 400 &&
                 !parentBg.includes('rgb(22, 56, 83)')) {
          contentEl = child;
          contentEl.className = 'content';
        }
      }

      // If we found both, return them (this is the correct structure)
      if (sidebarEl && contentEl) {
        return sidebarEl.outerHTML + contentEl.outerHTML;
      }

      // If we only found one or neither, try to find by position (first = sidebar, second = content)
      if (!sidebarEl && !contentEl && children.length >= 2) {
        sidebarEl = children[0];
        contentEl = children[1];
        sidebarEl.className = 'sidebar';
        contentEl.className = 'content';
        return sidebarEl.outerHTML + contentEl.outerHTML;
      }

      // Final fallback: reconstruct from found elements
      if (sidebarEl && !contentEl) {
        // Find content as the other child
        contentEl = children.find(child => child !== sidebarEl);
        if (contentEl) {
          contentEl.className = 'content';
          return sidebarEl.outerHTML + contentEl.outerHTML;
        }
      }

      if (contentEl && !sidebarEl) {
        // Find sidebar as the other child
        sidebarEl = children.find(child => child !== contentEl);
        if (sidebarEl) {
          sidebarEl.className = 'sidebar';
          return sidebarEl.outerHTML + contentEl.outerHTML;
        }
      }

      throw new Error('Could not identify sidebar and content containers');
    });

    // Get Font Awesome link
    const fontAwesomeLink = '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">';

    // Read the CSS module and convert it
    const cssModulePath = path.join(PROJECT_ROOT, 'src', 'pages', 'resume.module.css');
    let moduleCSS = '';
    if (fs.existsSync(cssModulePath)) {
      const cssContent = fs.readFileSync(cssModulePath, 'utf8');
      // Convert CSS module class names to regular class names
      // This is a simplified approach - in production you might want to use a CSS module parser
      moduleCSS = cssContent
        .replace(/\.resumeContainer/g, '.resume-container')
        .replace(/\.downloadSection/g, '.download-section')
        .replace(/\.downloadButton/g, '.download-button')
        .replace(/\.downloadButtonText/g, '.download-button-text')
        .replace(/\.htmlResume/g, '.html-resume')
        .replace(/\.sidebar/g, '.sidebar')
        .replace(/\.content/g, '.content')
        .replace(/\.contentHeader/g, '.content-header')
        .replace(/\.contentTitle/g, '.content-title')
        .replace(/\.headerLine/g, '.header-line')
        .replace(/\.photoContainer/g, '.photo-container')
        .replace(/\.photo/g, '.photo')
        .replace(/\.photoPlaceholder/g, '.photo-placeholder')
        .replace(/\.name/g, '.name')
        .replace(/\.title/g, '.title')
        .replace(/\.sidebarSection/g, '.sidebar-section')
        .replace(/\.contactItem/g, '.contact-item')
        .replace(/\.skillCategory/g, '.skill-category')
        .replace(/\.smallLink/g, '.small-link')
        .replace(/\.contentSection/g, '.content-section')
        .replace(/\.item/g, '.item')
        .replace(/\.itemHeader/g, '.item-header')
        .replace(/\.itemTitle/g, '.item-title')
        .replace(/\.itemDate/g, '.item-date')
        .replace(/\.itemSubtitle/g, '.item-subtitle')
        .replace(/\.itemList/g, '.item-list')
        .replace(/\.publicationItem/g, '.publication-item')
        .replace(/\.experienceLine/g, '.experience-line')
        .replace(/\.experienceMainLine/g, '.experience-main-line')
        .replace(/\.experienceSubLine/g, '.experience-sub-line');
    }

    // Create the complete HTML template
    const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vijaya Krishna Kasula - Resume</title>
    ${fontAwesomeLink}
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        @page {
            size: A4;
            margin: 0;
        }

        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            font-size: 10pt;
            line-height: 1.3;
            color: #1a1a1a;
            background: white;
            overflow: hidden;
        }

        .resume-container {
            display: flex;
            width: 100%;
            height: 100vh;
            max-height: 297mm; /* A4 height */
        }

        /* Left Sidebar - Colored */
        .sidebar {
            width: 33%;
            background-color: #163853;
            color: white;
            padding: 20px 15px;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }

        /* Right Content - White */
        .content {
            width: 67%;
            background-color: white;
            padding: 25px 30px;
            overflow-y: auto;
            overflow-x: hidden;
        }

        /* Right Column Header */
        .content-header {
            margin-bottom: 20px;
        }

        .content-header h1 {
            font-size: 24pt;
            font-weight: bold;
            color: #1a1a1a;
            margin: 0;
            margin-bottom: 5px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .content-header .content-title {
            font-size: 11pt;
            color: #555;
            margin-bottom: 8px;
            font-weight: 500;
        }

        .content-header .header-line {
            width: 100%;
            height: 2px;
            background-color: #163853;
            margin-bottom: 15px;
        }

        /* Photo */
        .photo-container {
            text-align: center;
            margin-bottom: 15px;
        }

        .photo {
            width: 140px;
            height: 140px;
            border-radius: 50%;
            object-fit: cover;
            border: 3px solid white;
            background: white;
        }

        .photo-placeholder {
            width: 140px;
            height: 140px;
            border-radius: 50%;
            background: white;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            color: #163853;
            font-size: 36px;
            font-weight: bold;
            border: 3px solid white;
        }

        /* Sidebar Sections */
        .sidebar-section {
            margin-bottom: 15px;
        }

        .sidebar-section h2 {
            font-size: 10pt;
            font-weight: bold;
            text-transform: uppercase;
            margin-bottom: 8px;
            color: white;
            border-bottom: 1px solid white;
            padding-bottom: 5px;
        }

        .sidebar-section p,
        .sidebar-section .contact-item {
            font-size: 9pt;
            margin-bottom: 5px;
            color: white;
            word-wrap: break-word;
        }

        .sidebar-section .contact-item {
            margin-bottom: 6px;
        }

        .sidebar-section .contact-item i {
            width: 16px;
            margin-right: 6px;
        }

        .sidebar-section a {
            color: white;
            text-decoration: none;
        }

        .sidebar-section a:hover {
            text-decoration: underline;
        }

        .sidebar-section .skill-category {
            font-weight: bold;
            margin-top: 8px;
            margin-bottom: 3px;
        }

        .sidebar-section .skill-category:first-child {
            margin-top: 0;
        }

        /* Content Sections */
        .content-section {
            margin-bottom: 15px;
        }

        .content-section h2 {
            font-size: 11pt;
            font-weight: bold;
            color: #1a1a1a;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            padding-bottom: 5px;
            border-bottom: 1.5px solid #163853;
        }

        .content-section h2 a {
            color: #163853;
            text-decoration: none;
            font-size: 8pt;
            font-weight: normal;
            text-transform: none;
        }

        /* Experience/Project Items */
        .item {
            margin-bottom: 10px;
        }

        .item-header {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            margin-bottom: 4px;
            flex-wrap: wrap;
        }

        .item-title {
            font-size: 10pt;
            font-weight: bold;
            flex: 1;
            word-wrap: break-word;
            color: #1a1a1a;
            min-width: 200px;
        }

        .item-title a {
            color: #163853;
            text-decoration: none;
            font-size: 8pt;
            font-weight: normal;
        }

        .item-date {
            font-size: 9pt;
            color: #163853;
            white-space: nowrap;
            margin-left: 10px;
            font-weight: 600;
        }

        .item-subtitle {
            font-size: 9pt;
            font-style: normal;
            color: #555;
            margin-bottom: 6px;
            font-weight: 500;
        }

        .item-list {
            list-style: none;
            padding-left: 15px;
            margin-top: 4px;
        }

        .item-list li {
            font-size: 9pt;
            margin-bottom: 3px;
            position: relative;
            padding-left: 12px;
            word-wrap: break-word;
        }

        .item-list li:before {
            content: "●";
            position: absolute;
            left: 0;
            color: #163853;
            font-weight: normal;
            font-size: 8pt;
        }

        .publication-item {
            font-size: 9pt;
            margin-bottom: 5px;
            word-wrap: break-word;
        }

        .publication-item em {
            font-style: italic;
        }

        /* Experience Lines */
        .experience-line {
            margin-top: 8px;
            margin-bottom: 8px;
            font-size: 9pt;
            color: #1a1a1a;
        }

        .experience-main-line {
            font-size: 9pt;
            color: #1a1a1a;
            margin-bottom: 4px;
        }

        .experience-sub-line {
            font-size: 8pt;
            color: #555;
            font-style: italic;
            margin-bottom: 4px;
        }

        /* Print styles */
        @media print {
            body {
                margin: 0;
            }
            .resume-container {
                max-height: none;
            }
        }

        /* Additional styles from CSS module */
        ${moduleCSS}
    </style>
</head>
<body>
    <div class="resume-container">
${resumeHTML}
    </div>
</body>
</html>`;

    // Write the HTML template
    fs.writeFileSync(HTML_TEMPLATE, htmlTemplate, 'utf8');
    console.log(`✓ HTML template generated successfully: ${HTML_TEMPLATE}`);

  } catch (error) {
    console.error('Error generating HTML template:', error);
    process.exit(1);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

generateHTMLTemplate();
