export const SITE_FONT_STORAGE_KEY = 'siteFont';
export const DEFAULT_FONT = 'inter-modern';

type FontPreset = {
  name: string;
  description: string;
  fonts: {
    heading: string;
    body: string;
    code: string;
  };
  googleFonts: string | null;
};

export const siteFontPresets: Record<string, FontPreset> = {
  'system-native': {
    name: 'System Native',
    description: 'OS default fonts',
    fonts: {
      heading: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      code: '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
    },
    googleFonts: null,
  },
  'inter-modern': {
    name: 'Inter Modern',
    description: 'Clean & professional',
    fonts: {
      heading: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      body: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      code: '"JetBrains Mono", "Fira Code", "SF Mono", Monaco, Consolas, monospace',
    },
    googleFonts:
      'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800' +
      '&family=JetBrains+Mono:wght@400;500;600&display=swap',
  },
  'roboto-professional': {
    name: 'Roboto Professional',
    description: "Google's corporate font",
    fonts: {
      heading: '"Roboto", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      body: '"Roboto", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      code: '"Roboto Mono", "SF Mono", Monaco, Consolas, monospace',
    },
    googleFonts:
      'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700' +
      '&family=Roboto+Mono:wght@400;500&display=swap',
  },
  'source-sans': {
    name: 'Source Sans Pro',
    description: "Adobe's professional font",
    fonts: {
      heading: '"Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      body: '"Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      code: '"Source Code Pro", "SF Mono", Monaco, Consolas, monospace',
    },
    googleFonts:
      'https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@300;400;600;700' +
      '&family=Source+Code+Pro:wght@400;500;600&display=swap',
  },
  'open-sans-readable': {
    name: 'Open Sans',
    description: 'Highly readable',
    fonts: {
      heading: '"Open Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      body: '"Open Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      code: '"Fira Code", "SF Mono", Monaco, Consolas, monospace',
    },
    googleFonts:
      'https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700' +
      '&family=Fira+Code:wght@400;500&display=swap',
  },
};

export function applySiteFont(fontKey: string): void {
  const fontPreset = siteFontPresets[fontKey];
  if (!fontPreset || typeof document === 'undefined') {
    return;
  }

  const root = document.documentElement;
  root.style.setProperty('--font-heading', fontPreset.fonts.heading);
  root.style.setProperty('--font-body', fontPreset.fonts.body);
  root.style.setProperty('--font-code', fontPreset.fonts.code);

  const existingLink = document.getElementById('google-fonts-link');
  if (existingLink) {
    existingLink.remove();
  }

  if (fontPreset.googleFonts) {
    const link = document.createElement('link');
    link.id = 'google-fonts-link';
    link.rel = 'stylesheet';
    link.href = fontPreset.googleFonts;
    document.head.appendChild(link);
  }
}

export function initSiteFont(): void {
  if (typeof window === 'undefined') {
    return;
  }

  const savedFont = localStorage.getItem(SITE_FONT_STORAGE_KEY);
  const fontKey = savedFont && siteFontPresets[savedFont] ? savedFont : DEFAULT_FONT;
  applySiteFont(fontKey);
}
