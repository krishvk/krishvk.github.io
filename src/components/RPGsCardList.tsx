import React from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './RPGsCardList.module.css';

interface DocItem {
  id: string;
  title: string;
  description: string;
}

const rpgsDocs: DocItem[] = [
  {
    id: 'rpgs/g1-offline-test-generator',
    title: 'G1: Offline Test Generator',
    description: 'A Perl based offline instruction generator',
  },
  {
    id: 'rpgs/g2-state-aware-generator/g2-state-aware-generator',
    title: 'G2: State Aware Generator',
    description: 'SystemVerilog-based processor state-aware test generation',
  },
  {
    id: 'rpgs/g3-c-based-scenario-generator',
    title: 'G3: C Based Scenario Generator',
    description: 'To focus on high level test scenarios/sequences',
  },
];

export default function RPGsCardList(): React.ReactElement {
  return (
    <div className={styles.cardsContainer}>
      {rpgsDocs.map((doc) => (
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
