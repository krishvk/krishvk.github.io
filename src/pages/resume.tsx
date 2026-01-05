import type {ReactNode} from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Head from '@docusaurus/Head';
import styles from './resume.module.css';
import {skillsData} from '../data/skillsData';

export default function Resume(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  const photoUrl = useBaseUrl('/img/photo.jpg');
  const logoUrl = useBaseUrl('/img/logo.jpg');
  const homeUrl = useBaseUrl('/');
  const educationUrl = useBaseUrl('/about-me/education');
  const positionsUrl = useBaseUrl('/about-me/positions-held');
  const workUrl = useBaseUrl('/work');
  const rpgsUrl = useBaseUrl('/work/rpgs');
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
          {/* Page 1 */}
          <div className={styles.page}>
            {/* Left Sidebar - Page 1 */}
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
              <p>Principal Engineer with 15+ years in processor verification. Led development of 3 generations of Random Program Generators serving 50+ engineers across multiple product lines. Specialized in verification infrastructure, ML/AI applications, and process improvement.</p>
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
              <p><strong>Harvard University Certificate</strong><br />
              Certificate of recommendation from Harvard University, Cambridge, MA, USA, for performance in online coding competition held in collaboration with NASA on TopCoder (2012)</p>
              <p style={{marginTop: '8px'}}><strong>Industry Recognition</strong><br />
              Multiple Synopsys awards for technical contributions and innovation</p>
              <p style={{fontSize: '8pt', marginTop: '5px'}}>More awards and certifications on LinkedIn</p>
            </div>

            {/* Skills moved to page 2 */}
          </div>

            {/* Right Content - Page 1 */}
            <div className={styles.content}>
            {/* Header with Name and Experience */}
            <div className={styles.contentHeader}>
              <h1><span className={styles.otherName}>Vijaya</span> Krishna <span className={styles.otherName}>Kasula</span></h1>
              <div className={styles.experienceLine}>
                <div className={styles.experienceMainLine}>
                  Principal Engineer, Processor Verification @ Synopsys | Jul 2010 - Present (15+ years)
                </div>
                <div className={styles.experienceSubLine}>
                  <p>Worked as a contractor from SoCtronics from Jul 2010 - Feb 2014{' '}
                  <a href={positionsUrl} target="_blank" rel="noopener noreferrer" className={styles.smallLink}>(full)</a>
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
                  <li>Designed and developed 3 generations of RPGs from scratch for ARC processor verification, each addressing different design philosophies</li>
                  <li>G1 (Perl-based, 2011-2020): Fast offline instruction generator for random instruction sequences</li>
                  <li>G2 (SystemVerilog-based): State-aware generator with coverage-driven features (Cov2gen) for targeted test generation</li>
                  <li>G3 (C-based): Advanced scenario generator with flexible API framework</li>
                  <li>Managed product lifecycle end-to-end, supporting 50+ verification engineers across multiple parallel product lines</li>
                  <li>Handled complex challenges: multi-issue scheduling, multicore systems, cache coherency, MMU/MPU, VLIW, SIMD</li>
                  <li>Impact: Significantly reduced test development time, boosted productivity across product lines</li>
                </ul>
              </div>

              <div className={styles.item}>
                <div className={styles.itemHeader}>
                  <div className={styles.itemTitle}>AI-ML Log Anomaly Detector <a href={logAnomalyUrl} target="_blank" rel="noopener noreferrer" className={styles.smallLink}>(details)</a></div>
                  <div className={styles.itemDate}>Nov 2021 - Feb 2022</div>
                </div>
                <div className={styles.itemSubtitle}>Master's Thesis Project, BITS Pilani | Deployed in Production at Synopsys</div>
                <ul className={styles.itemList}>
                  <li>Developed intelligent log analyzer using scikit-learn, NLTK, NLP, and unsupervised learning algorithms</li>
                  <li>Evaluated on 10 diverse datasets with 400M+ reference log lines, tested 36 model combinations</li>
                  <li>Implemented advanced techniques: hashing vectorizer, KD-tree, decision tree, random forest, clustering</li>
                  <li>Successfully deployed in production at Synopsys, automating verification failure log triaging</li>
                  <li>Impact: Reduced manual triaging effort, accelerated failure analysis workflow</li>
                </ul>
              </div>

              <div className={styles.item}>
                <div className={styles.itemHeader}>
                  <div className={styles.itemTitle}>C-Forge <a href={cForgeUrl} target="_blank" rel="noopener noreferrer" className={styles.smallLink}>(details)</a></div>
                  <div className={styles.itemDate}>2024 - 2025</div>
                </div>
                <div className={styles.itemSubtitle}>Sole Developer, Synopsys</div>
                <ul className={styles.itemList}>
                  <li>Designed efficient configuration generator for configuration space verification of ARC Processor IP</li>
                  <li>Automated generation of diverse processor configurations covering complex configuration spaces</li>
                  <li>Presented at Purple Poster event (Synopsys internal innovation showcase) 2025</li>
                  <li>Impact: Improved configuration space coverage, reduced manual configuration efforts</li>
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
                  <li>Enabled seamless integration between SystemVerilog testbenches and C-based golden reference models</li>
                  <li>Developed efficient communication protocols for real-time state synchronization</li>
                  <li>Impact: Enhanced verification accuracy through comprehensive state comparison</li>
                </ul>
              </div>

              <div className={styles.item}>
                <div className={styles.itemHeader}>
                  <div className={styles.itemTitle}>Verification Dashboard & Infrastructure</div>
                  <div className={styles.itemDate}>2018 - Present</div>
                </div>
                <div className={styles.itemSubtitle}>Technical Lead, Synopsys</div>
                <ul className={styles.itemList}>
                  <li>Built comprehensive verification dashboard using Grafana, Plotly-Dash, and Streamlit</li>
                  <li>Developed regression automation framework and monitoring infrastructure</li>
                  <li>Integrated with GitLab CI/CD for continuous verification workflows</li>
                  <li>Created documentation systems using Docusaurus, Sphinx, and Doxygen</li>
                  <li>Impact: Improved team visibility, reduced debugging time, enhanced collaboration</li>
                </ul>
              </div>
            </div>
          </div>
          </div>

          {/* Page 2 */}
          <div className={styles.page}>
            {/* Left Sidebar - Page 2 (Complete Skillset) */}
            <div className={styles.sidebar}>
              <div className={styles.sidebarSection}>
                <h2>Skillset</h2>
                {skillsData.map((category, index) => (
                  <div key={index}>
                    <div className={styles.skillCategory}>{category.name}:</div>
                    <p>{category.skills.join(', ')}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content - Page 2 */}
            <div className={styles.content}>

            {/* Leadership & Management */}
            <div className={styles.contentSection}>
              <h2>Leadership & Management</h2>

              <div className={styles.item}>
                <div className={styles.itemHeader}>
                  <div className={styles.itemTitle}>Verification Best Practices Team (VBPT)</div>
                  <div className={styles.itemDate}>2020 - Present</div>
                </div>
                <div className={styles.itemSubtitle}>Team Lead, Synopsys</div>
                <ul className={styles.itemList}>
                  <li>Led cross-functional team responsible for verification infrastructure and process improvement</li>
                  <li>Established best practices, guidelines, and standards for verification across product lines</li>
                  <li>Managed innovation initiatives and explored AI/ML capabilities for verification automation</li>
                  <li>Drove Git migration project, transitioning team from legacy version control systems</li>
                  <li>Mentored engineers on verification methodologies, tools, and industry best practices</li>
                </ul>
              </div>
            </div>

            {/* Publications */}
            <div className={styles.contentSection}>
              <h2>Publications & Presentations <a href={publicationsUrl} target="_blank" rel="noopener noreferrer" className={styles.smallLink}>(all)</a></h2>
              <div className={styles.publicationItem}>Kasula, V. K. (2025). <em>C-Forge, Efficient Configuration Generator for Configuration Space Verification of ARC Processor IP</em>. Purple Poster, Synopsys.</div>
              <div className={styles.publicationItem}>Kasula, V. K., & Chedella, S. S. (2016). <em>Barrier Insertion in Test Programs for Controlled Verification of Cache Coherency</em>. Synopsys India Technical Conference (SITC), Bangalore.</div>
              <div className={styles.publicationItem}>Kasula, V. K. (2016). <em>Reverse Generation Technique for Functional Verification of Processor Cores</em>. Synopsys India Technical Conference (SITC), Bangalore.</div>
              <div className={styles.publicationItem}>Kasula, V. K., & Tadiboina, G. K. (2016). <em>Test Generation for Processors with Extended Address Capability</em>. Synopsys India Technical Conference (SITC), Bangalore.</div>
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
        </div>
      </main>
    </Layout>
  );
}
