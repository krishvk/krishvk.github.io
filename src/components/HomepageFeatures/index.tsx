import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

function Kw({to, children}: {to: string; children: ReactNode}): ReactNode {
  return <Link to={useBaseUrl(to)}>{children}</Link>;
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className={styles.cardsContainer}>
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Processor Verification</h3>
          <p className={styles.cardText}>
            Deep expertise in processor architecture and verification methodologies.
            Proficient in complex processor features including{' '}
            <Kw to="/work/verification-tracks">MMU</Kw>,{' '}
            <Kw to="/work/verification-tracks">MPU</Kw>,{' '}
            <Kw to="/work/verification-tracks">Cache Coherency</Kw>,{' '}
            <Kw to="/work/verification-tracks">VLIW</Kw>,{' '}
            <Kw to="/work/verification-tracks">SIMD</Kw>, and{' '}
            <Kw to="/work/verification-tracks">multicore systems</Kw>. Skilled in{' '}
            <Kw to="/work/rpgs/g2-state-aware-generator">coverage-driven verification</Kw>,{' '}
            <Kw to="/work/rpgs">constraint-based test generation</Kw>, and both PLV and MLV
            verification levels. Examples include{' '}
            <Kw to="/work/rpgs/g2-state-aware-generator">
              designing state-aware test generators
            </Kw>{' '}
            supporting complex processor features and end-to-end verification of{' '}
            <Kw to="/work/verification-tracks">ISA coverage</Kw>,{' '}
            <Kw to="/work/verification-tracks">action points</Kw>, and{' '}
            <Kw to="/work/verification-tracks">debug units</Kw>.
          </p>
        </div>

        <div className={styles.card}>
          <h3 className={styles.cardTitle}>AI/ML in Verification</h3>
          <p className={styles.cardText}>
            Unique ability to apply machine learning techniques to verification challenges.
            Expertise in{' '}
            <Kw to="/work/verification-tools/log-anomaly-detector">anomaly detection</Kw>,{' '}
            <Kw to="/work/verification-tools/c-forge">clustering</Kw>, and{' '}
            <Kw to="/work/verification-tools/c-forge">classification</Kw> algorithms for
            optimization, triaging, and automation in verification workflows. Examples include
            building{' '}
            <Kw to="/work/verification-tools/log-anomaly-detector">
              AI-ML log anomaly detectors
            </Kw>{' '}
            for failure triaging, developing{' '}
            <Kw to="/work/verification-tools/c-forge">
              ML-based configuration space optimization
            </Kw>{' '}
            tools, and integrating ML-based failure analysis into verification processes.
          </p>
        </div>

        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Technical Leadership</h3>
          <p className={styles.cardText}>
            Proven capability in building{' '}
            <Kw to="/work/verification-tools/other">scalable verification infrastructure</Kw>{' '}
            from scratch and establishing best practices across teams. Skilled in prototyping
            new tools, standardizing methodologies, and leading cross-functional initiatives.
            Examples include leading the{' '}
            <Kw to="/work/vbpt">Verification Best Practices</Kw> team, prototyping{' '}
            <Kw to="/work/verification-tools/co-simulation">co-simulation environments</Kw>{' '}
            that changed verification methodology, and introducing{' '}
            <Kw to="/work/verification-tools/log-anomaly-detector">AI tools</Kw> and modern
            development practices to verification teams.
          </p>
        </div>

        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Collaborative Team Player</h3>
          <p className={styles.cardText}>
            Trusted go-to member for tough technical challenges across verification teams.
            Known for mentoring engineers and building solutions outside immediate ownership—
            through <Kw to="/work/vbpt">VBPT</Kw> and parallel initiatives—so teams move
            faster. Examples include standardizing{' '}
            <Kw to="/work/vbpt#workaround-management">workaround management</Kw>, introducing{' '}
            <Kw to="/work/rpgs/g3-c-based-scenario-generator#documentation">
              documentation standards
            </Kw>{' '}
            and{' '}
            <Kw to="/work/verification-tools/dashboard">dashboard standards</Kw>, driving{' '}
            <Kw to="/work/verification-tools/fsdb-tracer-for-debugging">
              cross-team debug support
            </Kw>{' '}
            with FSDB tracing tools, and earning consistent recognition in{' '}
            <Kw to="/recommendations">professional recommendations</Kw>.
          </p>
        </div>
      </div>
    </section>
  );
}
