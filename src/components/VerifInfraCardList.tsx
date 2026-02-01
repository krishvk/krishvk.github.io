import React from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './RPGsCardList.module.css';

interface DocItem {
  id: string;
  title: string;
  description: string;
}

const verifInfraDocs: DocItem[] = [
  {
    id: 'verification-tools/co-simulation',
    title: 'Co-Simulation',
    description: 'Prototyped co-simulation environment that revolutionized processor verification methodology for Synopsys ARC processors',
  },
  {
    id: 'verification-tools/c-forge',
    title: 'C-Forge',
    description: 'ML-based configuration space optimization tool that reduced verification effort by 50%+ for ARC Processor IP',
  },
  {
    id: 'verification-tools/log-anomaly-detector',
    title: 'Log Anomaly Detector',
    description: 'AI-ML log anomaly detector using machine learning for automated failure triaging in processor verification regressions',
  },
  {
    id: 'verification-tools/dashboard',
    title: 'Dashboard',
    description: 'Built project dashboards for verification health monitoring with Grafana and Streamlit',
  },
  {
    id: 'verification-tools/fsdb-tracer-for-debugging',
    title: 'FSDB Tracer',
    description: 'FSDB tracer tool that generates human-readable instruction execution traces from FPGA emulator waveforms',
  },
  {
    id: 'verification-tools/other',
    title: 'Other Contributions',
    description: 'Regression automation system for ARC processors in use for 10+ years with OGE to LSF migration',
  },
];

export default function VerifInfraCardList(): React.ReactElement {
  return (
    <div className={styles.cardsContainer}>
      {verifInfraDocs.map((doc) => (
        <Link
          key={doc.id}
          to={useBaseUrl(`/work/${doc.id}`)}
          className={styles.card}
        >
          <div className={styles.cardContent}>
            <h3 className={styles.cardTitle}>{doc.title}</h3>
            {doc.description && (
              <p className={styles.cardDescription}>{doc.description}</p>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
