import React, { useState, useEffect } from 'react';
import styles from './FontSelector.module.css';
import {
  applySiteFont,
  DEFAULT_FONT,
  siteFontPresets,
  SITE_FONT_STORAGE_KEY,
} from '@site/src/theme/siteFont';

export default function FontSelector(): React.ReactElement {
  const [currentFont, setCurrentFont] = useState<string>(DEFAULT_FONT);
  const [isOpen, setIsOpen] = useState(false);

  const handleFontChange = (fontKey: string) => {
    applySiteFont(fontKey);
    localStorage.setItem(SITE_FONT_STORAGE_KEY, fontKey);
    setCurrentFont(fontKey);
    setIsOpen(false);
  };

  useEffect(() => {
    const savedFont = localStorage.getItem(SITE_FONT_STORAGE_KEY);
    if (savedFont && siteFontPresets[savedFont]) {
      setCurrentFont(savedFont);
      applySiteFont(savedFont);
    } else {
      setCurrentFont(DEFAULT_FONT);
      applySiteFont(DEFAULT_FONT);
    }
  }, []);

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
            {Object.entries(siteFontPresets).map(([key, preset]) => (
              <button
                key={key}
                className={`${styles.fontOption} ${currentFont === key ? styles.active : ''}`}
                onClick={() => handleFontChange(key)}
              >
                <div className={styles.fontInfo}>
                  <div className={styles.fontName}>{preset.name}</div>
                  <div className={styles.fontDesc}>{preset.description}</div>
                </div>
                {currentFont === key && (
                  <span className="material-icons" style={{ fontSize: '20px', color: 'var(--ifm-color-primary)' }}>check</span>
                )}
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
