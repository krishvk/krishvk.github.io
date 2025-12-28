import type {ReactNode} from 'react';
import styles from './styles.module.css';

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          <div className="col col--12">
            <div className={styles.aboutContent}>
              <p>
                Currently working as a Principal Engineer in ASIC Digital Design at Synopsys with over 15 years of experience
                in processor-level verification. My approach to engineering follows a systematic methodology:
                <strong> identify the problem</strong>, <strong>plan a comprehensive solution</strong>, and
                <strong> execute with measurable results</strong>.
              </p>

              <p>
                Throughout my career, I have designed and developed critical verification infrastructure from scratch,
                including Random Program Generators (RPGs) that support 50+ verification engineers across multiple
                product lines in Synopsys' ARC processor family. I led the development of offline and online RPGs,
                Python and C-based test environments, and scalable solutions for test-TB communication and
                inter-core synchronization. These tools enabled comprehensive processor feature coverage and
                significantly reduced test development time.
              </p>

              <p>
                As a technical leader, I established and lead the Verification Best Practices team, developing
                centralized monitoring solutions and standardizing methodologies across teams. I designed and
                implemented a robust co-simulation environment for processor-level verification, created C-Forge
                for efficient configuration space verification, and developed an AI-ML log analyzer as part of
                my Master's thesis in Data Science & Engineering from BITS Pilani.
              </p>

              <p>
                Beyond verification, I contribute to open source with tools like <strong>argparse-enh</strong>
                (extending Python's argparse with API, shell, and GUI modes) and <strong>txtoflow</strong>
                (automatically generating flowcharts from pseudo-code), both available on PyPI. My work consistently
                focuses on solving real-world problems, improving efficiency, and delivering scalable solutions
                that make a measurable impact.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
