import type {ReactNode} from 'react';
import styles from './styles.module.css';

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className={styles.cardsContainer}>
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Experience & Approach</h3>
          <p className={styles.cardText}>
            Currently working as a Principal Engineer in ASIC Digital Design at Synopsys with over 15 years of experience
            in processor-level verification. My approach to engineering follows a systematic methodology:
            <strong> identify the problem</strong>, <strong>plan a comprehensive solution</strong>, and
            <strong> execute with measurable results</strong>.
          </p>
        </div>

        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Technical Leadership</h3>
          <p className={styles.cardText}>
            Throughout my career, I have designed and developed critical verification infrastructure from scratch,
            including Random Program Generators (RPGs) that support 50+ verification engineers across multiple
            product lines in Synopsys' ARC processor family. I led the development of offline and online RPGs,
            Python and C-based test environments, and scalable solutions for test-TB communication and
            inter-core synchronization.
          </p>
        </div>

        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Innovation & Open Source</h3>
          <p className={styles.cardText}>
            As a technical leader, I established and lead the Verification Best Practices team, developing
            centralized monitoring solutions and standardizing methodologies across teams. I designed and
            implemented a robust co-simulation environment, created C-Forge for efficient configuration space verification,
            and developed an AI-ML log analyzer as part of my Master's thesis. Beyond verification, I contribute to
            open source with tools like <strong>argparse-enh</strong> and <strong>txtoflow</strong>, both available on PyPI.
          </p>
        </div>
      </div>
    </section>
  );
}
