/**
 * Client module to add Material Icons to footer links and other elements
 */

if (typeof window !== 'undefined') {
  // Wait for DOM to be ready
  const addIconsToFooter = () => {
    const footerLinks = document.querySelectorAll('.footer__link-item');

    // Icon mapping for footer links
    const iconMap: { [key: string]: string } = {
      'Email': 'email',
      'LinkedIn': 'work',
      'Stack Overflow': 'code',
      'GitHub': 'code',
      'GitLab': 'code',
      'Codeforces': 'psychology',
      'PyPI': 'inventory_2',
    };

    footerLinks.forEach((link) => {
      const linkText = link.textContent?.trim() || '';
      const iconName = iconMap[linkText];

      if (iconName && !link.querySelector('.material-icons')) {
        const icon = document.createElement('span');
        icon.className = 'material-icons';
        icon.textContent = iconName;
        icon.style.cssText = 'font-size: 18px; vertical-align: middle; margin-right: 6px;';
        link.insertBefore(icon, link.firstChild);
      }
    });
  };

  // Run after page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addIconsToFooter);
  } else {
    addIconsToFooter();
  }

  // Also run after navigation (for SPA behavior)
  const observer = new MutationObserver(() => {
    addIconsToFooter();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}
