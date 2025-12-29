import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)
const isDevelopment = process.env.NODE_ENV === 'development';

const config: Config = {
  title: 'Krishna',
  tagline: 'Personal website of Krishna',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://krishvk.gitlab.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitLab Pages deployment
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'krishvk', // Usually your GitHub org/user name.
  projectName: 'krishvk.gitlab.io', // Usually your repo name.
  trailingSlash: false,

  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'projects-handled',
        path: 'docs/projects-handled',
        routeBasePath: 'projects-handled',
        showLastUpdateAuthor: false,
        showLastUpdateTime: false,
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'personal',
        path: 'docs/personal',
        routeBasePath: 'personal',
        showLastUpdateAuthor: false,
        showLastUpdateTime: false,
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'about-me',
        path: 'docs/about-me',
        routeBasePath: 'about-me',
        showLastUpdateAuthor: false,
        showLastUpdateTime: false,
      },
    ],
  ],

  presets: [
    [
      'classic',
      {
        docs: false, // Disable default docs since we're using separate plugins
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
        gtag: {
          trackingID: 'G-3F7D7EHLZ2',
          anonymizeIP: true,
        },
      } satisfies Preset.Options,
    ],
  ],

  headTags: [
    {
      tagName: 'link',
      attributes: {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/icon?family=Material+Icons',
      },
    },
    // Development-only: Source Sans Pro font
    ...(isDevelopment ? [{
      tagName: 'link',
      attributes: {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@300;400;600;700&family=Source+Code+Pro:wght@400;500;600&display=swap',
      },
    }] : []),
  ],
  themeConfig: {
    image: 'img/logo.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Krishna',
      logo: {
        alt: 'Krishna',
        src: 'img/logo.jpg',
      },
      items: [
        {type: 'doc', docId: 'ai-ml-log-analyzer', docsPluginId: 'projects-handled', position: 'left', label: 'Projects Handled'},
        {type: 'doc', docId: 'argparse-enh', docsPluginId: 'personal', position: 'left', label: 'Personal Projects'},
        {type: 'doc', docId: 'publications', docsPluginId: 'about-me', position: 'left', label: 'About me'},
        {to: '/resume', label: 'Resume', position: 'right'}
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Contact',
          items: [
            {
              label: 'Email',
              href: 'mailto:vijayakrishnakasula@gmail.com',
            },
            {
              label: 'Phone',
              href: 'tel:+919293194921',
            },
          ],
        },
        {
          title: 'Coding',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/krishvk',
            },
            {
              label: 'GitLab',
              href: 'https://gitlab.com/krishvk',
            },
            {
              label: 'PyPI',
              href: 'https://pypi.org/user/VijayaKrishnaKasula/',
            },
            {
              label: 'Codeforces',
              href: 'https://codeforces.com/profile/Krishna',
            },
          ],
        },
        {
          title: 'Other',
          items: [
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/users/1838076/krishna',
            },
            {
              label: 'LinkedIn',
              href: 'https://www.linkedin.com/in/krishvk',
            },
          ],
        },
      ],
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
