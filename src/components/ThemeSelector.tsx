import React, { useState, useEffect } from 'react';
import styles from './ThemeSelector.module.css';
import {
  applySiteTheme,
  DEFAULT_THEME,
  siteThemes,
  SITE_THEME_STORAGE_KEY,
} from '@site/src/theme/siteTheme';

export default function ThemeSelector(): React.ReactElement {
  const [currentTheme, setCurrentTheme] = useState<string>(DEFAULT_THEME);
  const [isOpen, setIsOpen] = useState(false);

  const handleThemeChange = (themeKey: string) => {
    applySiteTheme(themeKey);
    localStorage.setItem(SITE_THEME_STORAGE_KEY, themeKey);
    setCurrentTheme(themeKey);
    setIsOpen(false);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem(SITE_THEME_STORAGE_KEY);
    if (savedTheme && siteThemes[savedTheme]) {
      setCurrentTheme(savedTheme);
      applySiteTheme(savedTheme);
    } else {
      setCurrentTheme(DEFAULT_THEME);
      applySiteTheme(DEFAULT_THEME);
    }
  }, []);

  return (
    <div className={styles.themeSelector}>
      <button
        className={styles.themeSelectorButton}
        onClick={() => setIsOpen(!isOpen)}
        title="Change color theme"
      >
        <span className="material-icons" style={{ fontSize: '20px', verticalAlign: 'middle', marginRight: '4px' }}>palette</span>
        <span className={styles.themeButtonText}>Theme</span>
      </button>

      {isOpen && (
        <div className={styles.themeDropdown}>
          <div className={styles.themeDropdownHeader}>
            <strong>Choose Color Theme</strong>
            <button
              className={styles.closeButton}
              onClick={() => setIsOpen(false)}
            >
              <span className="material-icons" style={{ fontSize: '20px' }}>close</span>
            </button>
          </div>

          <div className={styles.themeList}>
            {Object.entries(siteThemes).map(([key, theme]) => (
              <button
                key={key}
                className={`${styles.themeOption} ${currentTheme === key ? styles.active : ''}`}
                onClick={() => handleThemeChange(key)}
              >
                <div className={styles.themeColorPreview}>
                  <span style={{ background: theme.colors.primary }}></span>
                  <span style={{ background: theme.colors.accentTeal || theme.colors.primary }}></span>
                  <span style={{ background: theme.colors.accentPurple || theme.colors.primary }}></span>
                </div>
                <div className={styles.themeInfo}>
                  <div className={styles.themeName}>{theme.name}</div>
                  <div className={styles.themeDesc}>{theme.description}</div>
                </div>
                {currentTheme === key && (
                  <span className="material-icons" style={{ fontSize: '20px', color: 'var(--ifm-color-primary)' }}>check</span>
                )}
              </button>
            ))}
          </div>

          <div className={styles.themeFooter}>
            <span className="material-icons" style={{ fontSize: '16px', verticalAlign: 'middle', marginRight: '4px' }}>lightbulb</span>
            Test with dark mode too!
          </div>
        </div>
      )}
    </div>
  );
}
