import React, { useState, useEffect } from 'react';
import styles from './ThemeSelector.module.css';

// Define all available themes
const themes = {
  'tech-blue': {
    name: 'Modern Tech Blue',
    description: 'Professional & trustworthy',
    colors: {
      primary: '#2563eb',
      primaryDark: '#1d4ed8',
      primaryDarker: '#1e40af',
      primaryDarkest: '#1e3a8a',
      primaryLight: '#3b82f6',
      primaryLighter: '#60a5fa',
      primaryLightest: '#93c5fd',
      heroGradient: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 50%, #bfdbfe 100%)',
      heroText: '#1e3a8a',
      accentTeal: '#06b6d4',
      accentPurple: '#10b981',
    },
    darkColors: {
      primary: '#60a5fa',
      heroGradient: 'linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #020617 100%)',
      heroText: '#f1f5f9',
    }
  },
  'vibrant-purple': {
    name: 'Vibrant Purple',
    description: 'Creative & memorable',
    colors: {
      primary: '#7c3aed',
      primaryDark: '#6d28d9',
      primaryDarker: '#5b21b6',
      primaryDarkest: '#4c1d95',
      primaryLight: '#8b5cf6',
      primaryLighter: '#a78bfa',
      primaryLightest: '#c4b5fd',
      heroGradient: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 50%, #e9d5ff 100%)',
      heroText: '#581c87',
      accentTeal: '#ec4899',
      accentPurple: '#d946ef',
    },
    darkColors: {
      primary: '#a78bfa',
      heroGradient: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #3730a3 100%)',
      heroText: '#f5f3ff',
    }
  },
  'tri-tech': {
    name: 'Tech Gradient (Tri-color)',
    description: 'Blue + Teal + Purple',
    colors: {
      primary: '#2563eb',
      primaryDark: '#1d4ed8',
      primaryDarker: '#1e40af',
      primaryDarkest: '#1e3a8a',
      primaryLight: '#3b82f6',
      primaryLighter: '#60a5fa',
      primaryLightest: '#93c5fd',
      heroGradient: 'linear-gradient(135deg, #dbeafe 0%, #ccfbf1 40%, #e9d5ff 100%)',
      heroText: '#1e3a8a',
      accentTeal: '#14b8a6',
      accentPurple: '#7c3aed',
    },
    darkColors: {
      primary: '#60a5fa',
      heroGradient: 'linear-gradient(135deg, #0f172a 0%, #0c4a6e 40%, #312e81 100%)',
      heroText: '#f1f5f9',
    }
  },
  'tri-sunset': {
    name: 'Sunset Vibes (Tri-color)',
    description: 'Orange + Pink + Purple',
    colors: {
      primary: '#f97316',
      primaryDark: '#ea580c',
      primaryDarker: '#c2410c',
      primaryDarkest: '#9a3412',
      primaryLight: '#fb923c',
      primaryLighter: '#fdba74',
      primaryLightest: '#fed7aa',
      heroGradient: 'linear-gradient(135deg, #ffedd5 0%, #fce7f3 50%, #f3e8ff 100%)',
      heroText: '#7c2d12',
      accentTeal: '#ec4899',
      accentPurple: '#7c3aed',
    },
    darkColors: {
      primary: '#fb923c',
      heroGradient: 'linear-gradient(135deg, #1c1917 0%, #831843 50%, #312e81 100%)',
      heroText: '#fef3c7',
    }
  },
  'tri-nature': {
    name: 'Nature Professional (Tri-color)',
    description: 'Green + Blue + Gold',
    colors: {
      primary: '#059669',
      primaryDark: '#047857',
      primaryDarker: '#065f46',
      primaryDarkest: '#064e3b',
      primaryLight: '#10b981',
      primaryLighter: '#34d399',
      primaryLightest: '#6ee7b7',
      heroGradient: 'linear-gradient(135deg, #d1fae5 0%, #dbeafe 50%, #fef3c7 100%)',
      heroText: '#064e3b',
      accentTeal: '#0284c7',
      accentPurple: '#ca8a04',
    },
    darkColors: {
      primary: '#34d399',
      heroGradient: 'linear-gradient(135deg, #022c22 0%, #0c4a6e 50%, #422006 100%)',
      heroText: '#d1fae5',
    }
  },
  'tri-cyber': {
    name: 'Cyber Modern (Tri-color)',
    description: 'Navy + Cyan + Magenta',
    colors: {
      primary: '#1e40af',
      primaryDark: '#1e3a8a',
      primaryDarker: '#1e293b',
      primaryDarkest: '#0f172a',
      primaryLight: '#2563eb',
      primaryLighter: '#3b82f6',
      primaryLightest: '#60a5fa',
      heroGradient: 'linear-gradient(135deg, #dbeafe 0%, #cffafe 50%, #fce7f3 100%)',
      heroText: '#0f172a',
      accentTeal: '#06b6d4',
      accentPurple: '#d946ef',
    },
    darkColors: {
      primary: '#3b82f6',
      heroGradient: 'linear-gradient(135deg, #020617 0%, #083344 50%, #4a044e 100%)',
      heroText: '#f1f5f9',
    }
  },
  'microsoft-azure': {
    name: 'Microsoft Azure',
    description: 'Professional corporate blue',
    colors: {
      primary: '#0078D4',
      primaryDark: '#106EBE',
      primaryDarker: '#005A9E',
      primaryDarkest: '#004578',
      primaryLight: '#50E6FF',
      primaryLighter: '#00BCF2',
      primaryLightest: '#7FBA00',
      heroGradient: 'linear-gradient(135deg, #F2F2F2 0%, #E8E8E8 100%)',
      heroText: '#1F1F1F',
      accentTeal: '#00BCF2',
      accentPurple: '#737373',
    },
    darkColors: {
      primary: '#50E6FF',
      heroGradient: 'linear-gradient(135deg, #1F1F1F 0%, #2D2D2D 100%)',
      heroText: '#FFFFFF',
    }
  },
  'apple-minimal': {
    name: 'Apple Minimal',
    description: 'Clean, sophisticated gray',
    colors: {
      primary: '#1d1d1f',
      primaryDark: '#000000',
      primaryDarker: '#000000',
      primaryDarkest: '#000000',
      primaryLight: '#424245',
      primaryLighter: '#6e6e73',
      primaryLightest: '#86868b',
      heroGradient: 'linear-gradient(135deg, #fbfbfd 0%, #f5f5f7 100%)',
      heroText: '#1d1d1f',
      accentTeal: '#0071e3',
      accentPurple: '#86868b',
    },
    darkColors: {
      primary: '#2997ff',
      heroGradient: 'linear-gradient(135deg, #000000 0%, #1d1d1f 100%)',
      heroText: '#f5f5f7',
    }
  },
  'netflix-deep': {
    name: 'Netflix Deep Red',
    description: 'Sophisticated dark red',
    colors: {
      primary: '#831010',
      primaryDark: '#650D0D',
      primaryDarker: '#450909',
      primaryDarkest: '#2A0505',
      primaryLight: '#B20710',
      primaryLighter: '#E50914',
      primaryLightest: '#F40612',
      heroGradient: 'linear-gradient(135deg, #fafafa 0%, #f0f0f0 100%)',
      heroText: '#1a1a1a',
      accentTeal: '#564d4d',
      accentPurple: '#8c8c8c',
    },
    darkColors: {
      primary: '#E50914',
      heroGradient: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 100%)',
      heroText: '#ffffff',
    }
  },
  'meta-professional': {
    name: 'Meta Professional',
    description: 'Modern corporate blue',
    colors: {
      primary: '#0866FF',
      primaryDark: '#0554E0',
      primaryDarker: '#0443C7',
      primaryDarkest: '#0332A3',
      primaryLight: '#4E8BFF',
      primaryLighter: '#7BA4FF',
      primaryLightest: '#A8BFFF',
      heroGradient: 'linear-gradient(135deg, #F0F2F5 0%, #E4E6EB 100%)',
      heroText: '#1C1E21',
      accentTeal: '#00A3BF',
      accentPurple: '#65676B',
    },
    darkColors: {
      primary: '#4E8BFF',
      heroGradient: 'linear-gradient(135deg, #18191A 0%, #242526 100%)',
      heroText: '#E4E6EB',
    }
  },
  'google-multicolor': {
    name: 'Google Multicolor',
    description: 'Playful + Professional',
    colors: {
      primary: '#4285F4',
      primaryDark: '#3367D6',
      primaryDarker: '#2A56C6',
      primaryDarkest: '#1E40AF',
      primaryLight: '#669DF6',
      primaryLighter: '#8AB4F8',
      primaryLightest: '#AECBFA',
      heroGradient: 'linear-gradient(135deg, #F8F9FA 0%, #E8F0FE 100%)',
      heroText: '#202124',
      accentTeal: '#34A853',
      accentPurple: '#EA4335',
    },
    darkColors: {
      primary: '#8AB4F8',
      heroGradient: 'linear-gradient(135deg, #202124 0%, #292A2D 100%)',
      heroText: '#E8EAED',
    }
  },
};

export default function ThemeSelector(): React.ReactElement {
  const [currentTheme, setCurrentTheme] = useState<string>('tri-tech');
  const [isOpen, setIsOpen] = useState(false);

  const applyTheme = (themeKey: string) => {
    const theme = themes[themeKey];
    if (!theme) return;

    const root = document.documentElement;

    // Apply light mode colors
    root.style.setProperty('--ifm-color-primary', theme.colors.primary);
    root.style.setProperty('--ifm-color-primary-dark', theme.colors.primaryDark);
    root.style.setProperty('--ifm-color-primary-darker', theme.colors.primaryDarker);
    root.style.setProperty('--ifm-color-primary-darkest', theme.colors.primaryDarkest);
    root.style.setProperty('--ifm-color-primary-light', theme.colors.primaryLight);
    root.style.setProperty('--ifm-color-primary-lighter', theme.colors.primaryLighter);
    root.style.setProperty('--ifm-color-primary-lightest', theme.colors.primaryLightest);
    root.style.setProperty('--hero-bg', theme.colors.heroGradient);
    root.style.setProperty('--hero-text-color', theme.colors.heroText);
    root.style.setProperty('--accent-teal', theme.colors.accentTeal);
    root.style.setProperty('--accent-purple', theme.colors.accentPurple);
    root.style.setProperty('--color-blue', theme.colors.primary);
    root.style.setProperty('--color-teal', theme.colors.accentTeal);
    root.style.setProperty('--color-purple', theme.colors.accentPurple);

    // Apply dark mode colors
    root.style.setProperty('--dark-primary', theme.darkColors.primary);
    root.style.setProperty('--dark-hero-bg', theme.darkColors.heroGradient);
    root.style.setProperty('--dark-hero-text', theme.darkColors.heroText);

    // Save to localStorage
    localStorage.setItem('siteTheme', themeKey);
    setCurrentTheme(themeKey);
  };

  // Load saved theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('siteTheme');
    if (savedTheme && themes[savedTheme]) {
      setCurrentTheme(savedTheme);
      applyTheme(savedTheme);
    } else {
      // Apply default theme
      applyTheme('tri-tech');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleThemeChange = (themeKey: string) => {
    applyTheme(themeKey);
    setIsOpen(false);
  };

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
            {Object.entries(themes).map(([key, theme]) => (
              <button
                key={key}
                className={`${styles.themeOption} ${currentTheme === key ? styles.active : ''}`}
                onClick={() => handleThemeChange(key)}
              >
                <div className={styles.themeColorPreview}>
                  <span style={{ background: theme.colors.primary }}></span>
                  <span style={{ background: theme.colors.accentTeal }}></span>
                  <span style={{ background: theme.colors.accentPurple }}></span>
                </div>
                <div className={styles.themeInfo}>
                  <div className={styles.themeName}>{theme.name}</div>
                  <div className={styles.themeDesc}>{theme.description}</div>
                </div>
                {currentTheme === key && <span className="material-icons" style={{ fontSize: '20px', color: 'var(--ifm-color-primary)' }}>check</span>}
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
