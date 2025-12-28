import type {ReactNode} from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function Resume(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title="Resume"
      description="Resume of Vijaya Krishna Kasula">
      <main style={{padding: '2rem', maxWidth: '1200px', margin: '0 auto'}}>
        <div style={{textAlign: 'center', marginBottom: '2rem'}}>
          <h1>Resume</h1>
          <p>Resume content will be available here.</p>
          <p>
            For now, please refer to the <a href="/">homepage</a> and other sections for detailed information.
          </p>
        </div>
      </main>
    </Layout>
  );
}
