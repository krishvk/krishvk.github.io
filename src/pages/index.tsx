import type {ReactNode} from 'react';
import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';
import ThemeSelector from '@site/src/components/ThemeSelector';
import FontSelector from '@site/src/components/FontSelector';
import {professionalSummary} from '@site/src/data/professionalSummary';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <div className={styles.heroContent}>
          <div className={styles.profileWrap}>
            <picture>
              <source type="image/webp" srcSet="/img/logo.webp 160w, /img/logo@2x.webp 320w" sizes="(max-width: 768px) 120px, 180px" />
              <source type="image/jpeg" srcSet="/img/logo.jpg 160w, /img/logo@2x.jpg 320w" sizes="(max-width: 768px) 120px, 180px" />
              <img src="/img/logo.jpg" srcSet="/img/logo.jpg 160w, /img/logo@2x.jpg 320w" alt="Vijaya Krishna Kasula - Principal Engineer at Synopsys" className={styles.profileImage} width={180} height={180} fetchPriority="high" decoding="async" />
            </picture>
          </div>

          <div className={styles.heroText}>
            <Heading as="h1" className={styles.heroTitle}>
              {siteConfig.title}
            </Heading>
            <p className={styles.heroSubtitle}>Principal Engineer (ASIC Digital Design) @ Synopsys Hyderabad</p>
            <div className={styles.heroDetails}>
              <span className={styles.heroDetailItem}>15+ years experience in Processor Verification</span>
              <span className={styles.heroDetailSeparator}>•</span>
              <span className={styles.heroDetailItem}>M.Tech in Data Science & Engineering, BITS Pilani</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Vijaya Krishna Kasula',
    alternateName: 'Krishna',
    jobTitle: 'Principal Engineer',
    worksFor: {
      '@type': 'Organization',
      name: 'Synopsys',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Hyderabad',
        addressCountry: 'IN',
      },
    },
    description: 'Principal Engineer with 15+ years in processor verification. ' +
      'Expert in building verification tools, AI/ML applications, and technical leadership.',
    alumniOf: {
      '@type': 'EducationalOrganization',
      name: 'BITS Pilani',
      description: 'M.Tech in Data Science & Engineering',
    },
    url: 'https://krishvk.gitlab.io',
    image: 'https://krishvk.gitlab.io/img/logo.jpg',
    sameAs: [
      'https://github.com/krishvk',
      'https://gitlab.com/krishvk',
      'https://www.linkedin.com/in/krishvk',
      'https://pypi.org/user/VijayaKrishnaKasula/',
    ],
  };

  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Principal Engineer with 15+ years in processor verification. Expert in building verification tools, AI/ML applications, and technical leadership.">
      <Head>
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Head>
      <HomepageHeader />
      <div className={styles.professionalStatement}>
        <div className={styles.statementContent}>
          <p>
            {professionalSummary.full}
          </p>
        </div>
      </div>
      <main>
        <HomepageFeatures />
      </main>
      <ThemeSelector />
      <FontSelector />
    </Layout>
  );
}
