import type {ReactNode} from 'react';
import styles from './styles.module.css';

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className={styles.cardsContainer}>
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Processor Verification</h3>
          <p className={styles.cardText}>
            Deep expertise in processor architecture and verification methodologies.
            Proficient in complex processor features including MMU, MPU, Cache Coherency,
            VLIW, SIMD, and multicore systems. Skilled in coverage-driven verification,
            constraint-based test generation, and both PLV and MLV verification levels.
            Examples include designing state-aware test generators supporting complex
            processor features and end-to-end verification of ISA coverage, action points,
            and debug units.
          </p>
        </div>

        <div className={styles.card}>
          <h3 className={styles.cardTitle}>AI/ML in Verification</h3>
          <p className={styles.cardText}>
            Unique ability to apply machine learning techniques to verification challenges.
            Expertise in anomaly detection, clustering, and classification algorithms for
            optimization, triaging, and automation in verification workflows. Examples
            include building AI-ML log anomaly detectors for failure triaging, developing
            ML-based configuration space optimization tools, and integrating ML-based
            failure analysis into verification processes.
          </p>
        </div>

        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Technical Leadership</h3>
          <p className={styles.cardText}>
            Proven capability in building scalable verification infrastructure from scratch
            and establishing best practices across teams. Skilled in prototyping new tools,
            standardizing methodologies, and leading cross-functional initiatives. Examples
            include leading the Verification Best Practices team, prototyping co-simulation
            environments that changed verification methodology, and introducing AI tools and
            modern development practices to verification teams.
          </p>
        </div>
      </div>
    </section>
  );
}
