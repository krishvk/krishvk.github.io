import React, { useState, useEffect } from 'react';
import styles from './FontSelector.module.css';

// Define all available font combinations
const fontPresets = {
  'system-native': {
    name: 'System Native',
    description: 'OS default fonts',
    fonts: {
      heading: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      code: '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
    },
    googleFonts: null, // No external fonts needed
  },
  'inter-modern': {
    name: 'Inter Modern',
    description: 'Clean & professional',
    fonts: {
      heading: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      body: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      code: '"JetBrains Mono", "Fira Code", "SF Mono", Monaco, Consolas, monospace',
    },
    googleFonts: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap',
  },
  'roboto-professional': {
    name: 'Roboto Professional',
    description: 'Google\'s corporate font',
    fonts: {
      heading: '"Roboto", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      body: '"Roboto", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      code: '"Roboto Mono", "SF Mono", Monaco, Consolas, monospace',
    },
    googleFonts: 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&family=Roboto+Mono:wght@400;500&display=swap',
  },
  'source-sans': {
    name: 'Source Sans Pro',
    description: 'Adobe\'s professional font',
    fonts: {
      heading: '"Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      body: '"Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      code: '"Source Code Pro", "SF Mono", Monaco, Consolas, monospace',
    },
    googleFonts: 'https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@300;400;600;700&family=Source+Code+Pro:wght@400;500;600&display=swap',
  },
  'open-sans-readable': {
    name: 'Open Sans',
    description: 'Highly readable',
    fonts: {
      heading: '"Open Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      body: '"Open Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      code: '"Fira Code", "SF Mono", Monaco, Consolas, monospace',
    },
    googleFonts: 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&family=Fira+Code:wght@400;500&display=swap',
  },
};

export default function FontSelector(): React.ReactElement {
  const [currentFont, setCurrentFont] = useState<string>('inter-modern');
  const [isOpen, setIsOpen] = useState(false);

  const applyFont = (fontKey: string) => {
    const fontPreset = fontPresets[fontKey];
    if (!fontPreset) return;

    const root = document.documentElement;

    // Apply font families
    root.style.setProperty('--font-heading', fontPreset.fonts.heading);
    root.style.setProperty('--font-body', fontPreset.fonts.body);
    root.style.setProperty('--font-code', fontPreset.fonts.code);

    // Load Google Fonts if needed
    if (fontPreset.googleFonts) {
      // Remove existing Google Fonts link if any
      const existingLink = document.getElementById('google-fonts-link');
      if (existingLink) {
        existingLink.remove();
      }

      // Add new Google Fonts link
      const link = document.createElement('link');
      link.id = 'google-fonts-link';
      link.rel = 'stylesheet';
      link.href = fontPreset.googleFonts;
      document.head.appendChild(link);
    } else {
      // Remove Google Fonts if switching to system fonts
      const existingLink = document.getElementById('google-fonts-link');
      if (existingLink) {
        existingLink.remove();
      }
    }

    // Save to localStorage
    localStorage.setItem('siteFont', fontKey);
    setCurrentFont(fontKey);
  };

  // Load saved font on mount
  useEffect(() => {
    const savedFont = localStorage.getItem('siteFont');
    if (savedFont && fontPresets[savedFont]) {
      setCurrentFont(savedFont);
      applyFont(savedFont);
    } else {
      // Default to Inter Modern - load Google Fonts
      const link = document.createElement('link');
      link.id = 'google-fonts-link';
      link.rel = 'stylesheet';
      link.href = fontPresets['inter-modern'].googleFonts!;
      document.head.appendChild(link);

      // Apply default fonts
      const root = document.documentElement;
      root.style.setProperty('--font-heading', fontPresets['inter-modern'].fonts.heading);
      root.style.setProperty('--font-body', fontPresets['inter-modern'].fonts.body);
      root.style.setProperty('--font-code', fontPresets['inter-modern'].fonts.code);

      setCurrentFont('inter-modern');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFontChange = (fontKey: string) => {
    applyFont(fontKey);
    setIsOpen(false);
  };

  return (
    <div className={styles.fontSelector}>
      <button
        className={styles.fontSelectorButton}
        onClick={() => setIsOpen(!isOpen)}
        title="Change font family"
      >
        <span className="material-icons" style={{ fontSize: '20px', verticalAlign: 'middle', marginRight: '4px' }}>text_fields</span>
        <span className={styles.fontButtonText}>Font</span>
      </button>

      {isOpen && (
        <div className={styles.fontDropdown}>
          <div className={styles.fontDropdownHeader}>
            <strong>Choose Font Family</strong>
            <button
              className={styles.closeButton}
              onClick={() => setIsOpen(false)}
            >
              <span className="material-icons" style={{ fontSize: '20px' }}>close</span>
            </button>
          </div>

          <div className={styles.fontList}>
            {Object.entries(fontPresets).map(([key, preset]) => (
              <button
                key={key}
                className={`${styles.fontOption} ${currentFont === key ? styles.active : ''}`}
                onClick={() => handleFontChange(key)}
              >
                <div className={styles.fontInfo}>
                  <div className={styles.fontName}>{preset.name}</div>
                  <div className={styles.fontDesc}>{preset.description}</div>
                </div>
                {currentFont === key && <span className="material-icons" style={{ fontSize: '20px', color: 'var(--ifm-color-primary)' }}>check</span>}
              </button>
            ))}
          </div>

          <div className={styles.fontFooter}>
            <span className="material-icons" style={{ fontSize: '16px', verticalAlign: 'middle', marginRight: '4px' }}>lightbulb</span>
            Different fonts for headings, body & code
          </div>
        </div>
      )}
    </div>
  );
}
