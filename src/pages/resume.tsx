import type {ReactNode} from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Head from '@docusaurus/Head';
import styles from './resume.module.css';

export default function Resume(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  const photoUrl = useBaseUrl('/img/photo.jpg');
  const logoUrl = useBaseUrl('/img/logo.jpg');
  const homeUrl = useBaseUrl('/');
  const educationUrl = useBaseUrl('/about-me/education');
  const positionsUrl = useBaseUrl('/about-me/positions-held');
  const workUrl = useBaseUrl('/work');
  const rpgsUrl = useBaseUrl('/work/verification-tools/rpgs/rpgs');
  const logAnomalyUrl = useBaseUrl('/academic/log-anomaly-detector');
  const coSimUrl = useBaseUrl('/work/verification-tools/co-simulation');
  const cForgeUrl = useBaseUrl('/work/verification-tools/c-forge');
  const publicationsUrl = useBaseUrl('/about-me/publications');
  const personalUrl = useBaseUrl('/personal');
  const argparseUrl = useBaseUrl('/personal/argparse-enh');
  const txtoflowUrl = useBaseUrl('/personal/txtoflow');

  return (
    <Layout
      title="Resume"
      description="Resume of Vijaya Krishna Kasula">
      <Head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </Head>
      <main className={styles.resumeContainer}>
        <div className={styles.downloadSection}>
          <a
            href={useBaseUrl('/resume.pdf')}
            download="Vijaya_Krishna_Kasula_Resume.pdf"
            className={styles.downloadButton}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            <span className={styles.downloadButtonText}>Download PDF</span>
          </a>
        </div>
        <div className={styles.htmlResume}>
          {/* Left Sidebar */}
          <div className={styles.sidebar}>
            {/* Photo */}
            <div className={styles.photoContainer}>
              <img
                src={photoUrl}
                alt="Photo"
                className={styles.photo}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  // Try logo as fallback
                  if (target.src !== logoUrl) {
                    target.src = logoUrl;
                    return;
                  }
                  // Show placeholder if both fail
                  target.style.display = 'none';
                  const placeholder = target.nextElementSibling as HTMLElement;
                  if (placeholder) placeholder.style.display = 'inline-flex';
                }}
              />
              <div className={styles.photoPlaceholder} style={{display: 'none'}}>VK</div>
            </div>

            {/* Contact */}
            <div className={styles.sidebarSection}>
              <h2>Contact</h2>
              <div className={styles.contactItem}>
                <i className="fas fa-envelope"></i>
                <a href="mailto:vijayakrishnakasula@gmail.com">vijayakrishnakasula@gmail.com</a>
              </div>
              <div className={styles.contactItem}>
                <i className="fas fa-phone"></i>
                <a href="tel:+919293194921">+91 92931 94921</a>
              </div>
              <div className={styles.contactItem}>
                <i className="fab fa-linkedin"></i>
                <a href="https://www.linkedin.com/in/krishvk" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                <span className={styles.contactSeparator}> • </span>
                <i className="fab fa-github"></i>
                <a href="https://github.com/krishvk" target="_blank" rel="noopener noreferrer">GitHub</a>
                <span className={styles.contactSeparator}> • </span>
                <i className="fab fa-gitlab"></i>
                <a href="https://gitlab.com/krishvk" target="_blank" rel="noopener noreferrer">GitLab</a>
              </div>
              <div className={styles.contactItem}>
                <i className="fas fa-globe"></i>
                <a href={homeUrl} target="_blank" rel="noopener noreferrer">Detailed Resume / CV</a>
              </div>
            </div>

            {/* Professional Summary */}
            <div className={styles.sidebarSection}>
              <h2>Professional Summary</h2>
              <p>15+ years of experience in processor-level verification. Led development of critical verification infrastructure supporting 50+ engineers.</p>
            </div>

            {/* Technical Skills */}
            <div className={styles.sidebarSection}>
              <h2>Technical Skills</h2>
              <div className={styles.skillCategory}>Languages:</div>
              <p>SystemVerilog, Python, Perl, C/C++, SQL</p>
              <div className={styles.skillCategory}>Verification:</div>
              <p>UVM, Processor Verification, Coverage-Driven</p>
              <div className={styles.skillCategory}>ML/AI:</div>
              <p>scikit-learn, NLP, Unsupervised Learning, Anomaly Detection</p>
              <div className={styles.skillCategory}>Tools:</div>
              <p>Grafana, GitLab CI/CD, Docusaurus, Sphinx, Doxygen, Verdi</p>
              <div className={styles.skillCategory}>Infrastructure:</div>
              <p>Git, GitLab, Regression Automation, Monitoring</p>
            </div>

            {/* Education */}
            <div className={styles.sidebarSection}>
              <h2>Education <a href={educationUrl} target="_blank" rel="noopener noreferrer" className={styles.smallLink}>(full)</a></h2>
              <p><strong>M.Tech in Data Science & Engineering</strong><br />
              BITS Pilani (WILP)<br />
              Nov 2019 - Feb 2022 | CGPA: 8.75</p>
              <p style={{marginTop: '8px'}}><strong>B.Tech in Electronics & Communication</strong><br />
              SVIT (JNTU Hyderabad)<br />
              Jun 2006 - Jun 2010 | 71.40%</p>
            </div>

            {/* Awards */}
            <div className={styles.sidebarSection}>
              <h2>Awards & Recognition</h2>
              <p>Received a certificate of recommendation from HARVARD University, Cambridge, MA, USA, acknowledging my performance in an online coding competition held in collaboration with NASA on TopCoder (2012)</p>
              <p>More on LinkedIn</p>
            </div>
          </div>

          {/* Right Content */}
          <div className={styles.content}>
            {/* Header with Name and Experience */}
            <div className={styles.contentHeader}>
              <h1>Vijaya Krishna Kasula</h1>
              <div className={styles.experienceLine}>
                <div className={styles.experienceMainLine}>
                  Principal Engineer, Processor Verification @ Synopsys Jul 2010 - Present
                </div>
                <div className={styles.experienceSubLine}>
                  <p>Worked as a contractor from SoCtronics from Jul 2010 - Feb 2014{' '}
                  <a href={positionsUrl} target="_blank" rel="noopener noreferrer" className={styles.smallLink}>(details)</a>
                  </p>
                </div>
              </div>
            </div>

            {/* Key Projects */}
            <div className={styles.contentSection}>
              <h2>Key Projects <a href={workUrl} target="_blank" rel="noopener noreferrer" className={styles.smallLink}>(all)</a></h2>

              <div className={styles.item}>
                <div className={styles.itemHeader}>
                  <div className={styles.itemTitle}>Random Program Generators (RPGs) <a href={rpgsUrl} target="_blank" rel="noopener noreferrer" className={styles.smallLink}>(details)</a></div>
                  <div className={styles.itemDate}>Dec 2011 - Present</div>
                </div>
                <div className={styles.itemSubtitle}>Lead Developer & Product Manager, Synopsys</div>
                <ul className={styles.itemList}>
                  <li>Designed and developed multiple RPGs: Offline RPG, Online RPG (Stepping), Python Environment, C-based Environment</li>
                  <li>Managed product lifecycle end-to-end, supporting 50+ verification engineers across multiple product lines</li>
                  <li>Developed SystemVerilog-based generator with coverage-driven features (Cov2gen)</li>
                  <li>Impact: Enabled comprehensive processor feature coverage, reduced test development time significantly</li>
                </ul>
              </div>

              <div className={styles.item}>
                <div className={styles.itemHeader}>
                  <div className={styles.itemTitle}>AI-ML Log Anomaly Detector <a href={logAnomalyUrl} target="_blank" rel="noopener noreferrer" className={styles.smallLink}>(details)</a></div>
                  <div className={styles.itemDate}>Nov 2021 - Feb 2022</div>
                </div>
                <div className={styles.itemSubtitle}>Master's Thesis Project, BITS Pilani, Deployed in production at Synopsys</div>
                <ul className={styles.itemList}>
                  <li>Developed intelligent log analyzer using scikit-learn, NLP, and unsupervised learning</li>
                  <li>Evaluated on 10 datasets with 400M+ reference log lines, tested 36 model combinations</li>
                  <li>Deployed in production at Synopsys, automating verification failure log triaging</li>
                </ul>
              </div>

              <div className={styles.item}>
                <div className={styles.itemHeader}>
                  <div className={styles.itemTitle}>Co-Simulation Environment <a href={coSimUrl} target="_blank" rel="noopener noreferrer" className={styles.smallLink}>(details)</a></div>
                  <div className={styles.itemDate}>Dec 2012 - Mar 2014</div>
                </div>
                <div className={styles.itemSubtitle}>Sole Developer, Synopsys</div>
                <ul className={styles.itemList}>
                  <li>Designed and implemented robust co-simulation environment for processor-level verification</li>
                  <li>Enabled seamless integration between testbenches and golden reference models</li>
                </ul>
              </div>

              <div className={styles.item}>
                <div className={styles.itemHeader}>
                  <div className={styles.itemTitle}>C-Forge <a href={cForgeUrl} target="_blank" rel="noopener noreferrer" className={styles.smallLink}>(details)</a></div>
                  <div className={styles.itemDate}>2025</div>
                </div>
                <div className={styles.itemSubtitle}>Sole Developer, Synopsys</div>
                <ul className={styles.itemList}>
                  <li>Efficient configuration generator for configuration space verification of ARC Processor IP</li>
                  <li>Presented at Purple Poster event (Synopsys) 2025</li>
                </ul>
              </div>
            </div>

            {/* Publications */}
            <div className={styles.contentSection}>
              <h2>Publications & Presentations <a href={publicationsUrl} target="_blank" rel="noopener noreferrer" className={styles.smallLink}>(all)</a></h2>
              <div className={styles.publicationItem}>Kasula, V. K. (2025). <em>C-Forge, Efficient Configuration Generator for Configuration Space Verification of ARC Processor IP</em>. Purple Poster, Synopsys.</div>
              <div className={styles.publicationItem}>Kasula, V. K., & Chedella, S. S. (2016). <em>Barrier Insertion in Test Programs for Controlled Verification of Cache Coherency</em>. SITC, Bangalore.</div>
              <div className={styles.publicationItem}>Kasula, V. K. (2016). <em>Reverse Generation Technique for Functional Verification of Processor Cores</em>. SITC, Bangalore.</div>
              <div className={styles.publicationItem}>Kasula, V. K., & Tadiboina, G. K. (2016). <em>Test Generation for Processors with Extended Address Capability</em>. SITC, Bangalore.</div>
            </div>

            {/* Open Source */}
            <div className={styles.contentSection}>
              <h2>Open Source Contributions <a href={personalUrl} target="_blank" rel="noopener noreferrer" className={styles.smallLink}>(all)</a></h2>

              <div className={styles.item}>
                <div className={styles.itemHeader}>
                  <div className={styles.itemTitle}>argparse-enh <a href={argparseUrl} target="_blank" rel="noopener noreferrer" className={styles.smallLink}>(details)</a></div>
                  <div className={styles.itemDate}>Active</div>
                </div>
                <div className={styles.itemSubtitle}>Python Library, PyPI</div>
                <ul className={styles.itemList}>
                  <li>Enhanced argparse with API, shell, and automatic GUI generation modes</li>
                </ul>
              </div>

              <div className={styles.item}>
                <div className={styles.itemHeader}>
                  <div className={styles.itemTitle}>txtoflow <a href={txtoflowUrl} target="_blank" rel="noopener noreferrer" className={styles.smallLink}>(details)</a></div>
                  <div className={styles.itemDate}>Active</div>
                </div>
                <div className={styles.itemSubtitle}>Python Library, PyPI</div>
                <ul className={styles.itemList}>
                  <li>Automatically generates flowcharts from pseudo-code written in C-like languages</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
