import type {ReactNode} from 'react';
import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';
import ThemeSelector from '@site/src/components/ThemeSelector';
import FontSelector from '@site/src/components/FontSelector';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <div className={styles.profileWrap}>
          <picture>
            <source type="image/webp" srcSet="/img/logo.webp 160w, /img/logo@2x.webp 320w" sizes="(max-width: 600px) 112px, 160px" />
            <source type="image/jpeg" srcSet="/img/logo.jpg 160w, /img/logo@2x.jpg 320w" sizes="(max-width: 600px) 112px, 160px" />
            <img src="/img/logo.jpg" srcSet="/img/logo.jpg 160w, /img/logo@2x.jpg 320w" alt="Vijaya Krishna Kasula" className="heroProfile" width={160} height={160} fetchPriority="high" />
          </picture>
        </div>

        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">Principal Engineer (ASIC Digital Design) @ Synopsys Hyderabad</p>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
      <ThemeSelector />
      <FontSelector />
    </Layout>
  );
}
