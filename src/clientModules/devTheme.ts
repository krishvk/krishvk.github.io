/**
 * Client module to apply Source Sans Pro font and Nature Professional theme
 * ONLY in development mode - removed in production builds via webpack DefinePlugin
 */

// This will be replaced by webpack: 'development' in dev, 'production' in prod builds
// The entire block will be tree-shaken out in production
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // Apply Source Sans Pro font
  const applySourceSansPro = () => {
    const root = document.documentElement;

    // Set font families
    root.style.setProperty('--font-heading', '"Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif');
    root.style.setProperty('--font-body', '"Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif');
    root.style.setProperty('--font-code', '"Source Code Pro", "SF Mono", Monaco, Consolas, monospace');
    root.style.setProperty('--site-font', '"Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif');
  };

    // Apply Nature Professional theme (tri-nature)
    const applyNatureProfessionalTheme = () => {
      const root = document.documentElement;

      // Light mode colors
      root.style.setProperty('--ifm-color-primary', '#059669');
      root.style.setProperty('--ifm-color-primary-dark', '#047857');
      root.style.setProperty('--ifm-color-primary-darker', '#065f46');
      root.style.setProperty('--ifm-color-primary-darkest', '#064e3b');
      root.style.setProperty('--ifm-color-primary-light', '#10b981');
      root.style.setProperty('--ifm-color-primary-lighter', '#34d399');
      root.style.setProperty('--ifm-color-primary-lightest', '#6ee7b7');
      root.style.setProperty('--hero-bg', 'linear-gradient(135deg, #d1fae5 0%, #dbeafe 50%, #fef3c7 100%)');
      root.style.setProperty('--hero-text-color', '#064e3b');
      root.style.setProperty('--accent-teal', '#0284c7');
      root.style.setProperty('--accent-purple', '#ca8a04');
      root.style.setProperty('--color-blue', '#059669');
      root.style.setProperty('--color-teal', '#0284c7');
      root.style.setProperty('--color-purple', '#ca8a04');
      root.style.setProperty('--docusaurus-highlighted-code-line-bg', 'rgba(5, 150, 105, 0.1)');

      // Dark mode colors
      root.style.setProperty('--dark-primary', '#34d399');
      root.style.setProperty('--dark-hero-bg', 'linear-gradient(135deg, #022c22 0%, #0c4a6e 50%, #422006 100%)');
      root.style.setProperty('--dark-hero-text', '#d1fae5');

      // Apply dark mode if currently in dark mode
      const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
      if (isDarkMode) {
        root.style.setProperty('--ifm-color-primary', '#34d399');
        root.style.setProperty('--ifm-color-primary-dark', '#10b981');
        root.style.setProperty('--ifm-color-primary-darker', '#059669');
        root.style.setProperty('--ifm-color-primary-darkest', '#047857');
        root.style.setProperty('--ifm-color-primary-light', '#6ee7b7');
        root.style.setProperty('--ifm-color-primary-lighter', '#a7f3d0');
        root.style.setProperty('--ifm-color-primary-lightest', '#d1fae5');
        root.style.setProperty('--hero-bg', 'linear-gradient(135deg, #022c22 0%, #0c4a6e 50%, #422006 100%)');
        root.style.setProperty('--hero-text-color', '#d1fae5');
        root.style.setProperty('--docusaurus-highlighted-code-line-bg', 'rgba(52, 211, 153, 0.15)');
      }
    };

  // Apply on initial load
  const applyDevSettings = () => {
    applySourceSansPro();
    applyNatureProfessionalTheme();
  };

  // Run after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyDevSettings);
  } else {
    applyDevSettings();
  }

  // Watch for theme changes (light/dark mode toggle)
  const themeObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
        applyNatureProfessionalTheme();
      }
    });
  });

  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });
}
