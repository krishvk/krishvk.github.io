import type {ReactNode} from 'react';
import {useEffect, useLayoutEffect} from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Head from '@docusaurus/Head';
import styles from './resume.module.css';
import {skillsData} from '../data/skillsData';
import {professionalSummary} from '@site/src/data/professionalSummary';

export default function Resume(): ReactNode {
  // Use useLayoutEffect for immediate layout fixes before paint
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Reset scroll position to top when component mounts and ensure layout
  // is properly calculated after all content loads
  useEffect(() => {
    // Immediate scroll reset
    window.scrollTo(0, 0);

    let rafId2: number | null = null;
    let rafId3: number | null = null;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    // Wait for fonts and images to load
    const waitForResources = async () => {
      try {
        await document.fonts.ready;
        // Wait for images to load
        const images = document.querySelectorAll('img');
        await Promise.all(
          Array.from(images).map(
            (img) =>
              new Promise((resolve) => {
                if (img.complete) {
                  resolve(null);
                } else {
                  img.onload = resolve;
                  img.onerror = resolve;
                }
              })
          )
        );
      } catch (e) {
        // Ignore errors
      }
    };

    // Use requestAnimationFrame to ensure DOM is ready
    const rafId1 = requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      // Force a reflow to ensure layout is calculated
      document.body.offsetHeight;

      // Double RAF to ensure layout is fully stable
      rafId2 = requestAnimationFrame(() => {
        window.scrollTo(0, 0);
        // Triple RAF for extra stability
        rafId3 = requestAnimationFrame(() => {
          window.scrollTo(0, 0);
        });
      });

      // Wait for resources and then reset scroll
      waitForResources().then(() => {
        window.scrollTo(0, 0);
      });

      // Also ensure scroll is reset after layout fully stabilizes
      timeoutId = setTimeout(() => {
        window.scrollTo(0, 0);
      }, 300);
    });

    return () => {
      cancelAnimationFrame(rafId1);
      if (rafId2 !== null) {
        cancelAnimationFrame(rafId2);
      }
      if (rafId3 !== null) {
        cancelAnimationFrame(rafId3);
      }
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
    };
  }, []);
  const {siteConfig} = useDocusaurusContext();
  const photoUrl = useBaseUrl('/img/photo.jpg');
  const logoUrl = useBaseUrl('/img/logo.jpg');
  const homeUrl = useBaseUrl('/');
  const educationUrl = useBaseUrl('/about-me/education');
  const positionsUrl = useBaseUrl('/about-me/positions-held');
  const workUrl = useBaseUrl('/work/rpgs');
  const rpgsUrl = useBaseUrl('/work/rpgs');
  const logAnomalyUrl = useBaseUrl('/academic/log-anomaly-detector');
  const coSimUrl = useBaseUrl('/work/verification-tools/co-simulation');
  const cForgeUrl = useBaseUrl('/work/verification-tools/c-forge');
  const dashboardUrl = useBaseUrl('/work/verification-tools/dashboard');
  const regressionAutomationUrl = useBaseUrl('/work/verification-tools/other');
  const gitMigrationUrl = useBaseUrl('/work/misc/git-migration');
  const vbptUrl = useBaseUrl('/work/vbpt');
  const fsdbTracerUrl = useBaseUrl('/work/verification-tools/fsdb-tracer-for-debugging');
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
        <div className={`${styles.htmlResume} ${typeof window !== 'undefined' && process.env.NODE_ENV === 'development' ? styles.devMode : ''}`}>
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
              <p>{professionalSummary.full}</p>
            </div>

            {/* Awards */}
            <div className={styles.sidebarSection}>
              <h2>Awards & Recognition</h2>
              <p><strong>Harvard University Certificate</strong><br />
              Certificate of recommendation from Harvard University, Cambridge, MA, USA, for performance in online coding competition held in collaboration with NASA on TopCoder (2012)</p>
              <p style={{marginTop: '8px'}}><strong>Industry Recognition</strong><br />
              Multiple Synopsys awards for technical contributions and innovation</p>
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
                  <p>Worked as a contractor for Synopsys from Jul 2010 - Feb 2014 at SoCtronics{' '}
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
                <div className={styles.itemSubtitle}>Lead Developer & Team Lead, Synopsys</div>
                <ul className={styles.itemList}>
                  <li>Designed and developed 3 generations of RPGs from scratch for ARC processor verification, each addressing different design philosophies</li>
                  <li>G1 (Perl-based, 2011-2016): Fast offline instruction generator supporting 20-30 engineers, primary RPG for 6+ years, phased out for G2</li>
                  <li>G2 (SystemVerilog-based, 2016-Present): State-aware generator with coverage-driven features, longest-running tool, 50+ engineers, generates millions of instructions daily, with ~1000 test templates</li>
                  <li>G3 (C-based, Sep 2025-Present): High-level scenario generator using CSmith, focuses on test scenarios rather than instruction-level details</li>
                  <li>Managed the tools end-to-end, from planning to maintenance, supporting 50+ verification engineers across multiple parallel product lines</li>
                  <li>Handled complex challenges: multi-issue scheduling, multicore systems, cache coherency, MMU/MPU, VLIW, SIMD, virtualization, APEX extensions</li>
                  <li>Built advanced Memory Manager and Data Manager for architecture-aware instruction streams and complex scenario generation (e.g., cache coherency, DMP)</li>
                  <li>Supports automatic extraction of ISA and CSR definitions from processor specs, enabling rapid support for new architectures and near-zero setup for new processors</li>
                  <li>Provided SV-Python wrappers to load the test information generated in Text/YAML/JSON formats for seamless testbench integration, includes VSCode IDE with Ctags and extensive Doxygen/Sphinx documentation</li>
                </ul>
              </div>

              <div className={styles.item}>
                <div className={styles.itemHeader}>
                  <div className={styles.itemTitle}>AI-ML Log Anomaly Detector <a href={logAnomalyUrl} target="_blank" rel="noopener noreferrer" className={styles.smallLink}>(details)</a></div>
                  <div className={styles.itemDate}>Feb 2022 - Present (Staggered)</div>
                </div>
                <div className={styles.itemSubtitle}>Master's Thesis Project, BITS Pilani | Deployed in Production at Synopsys</div>
                <ul className={styles.itemList}>
                  <li>Developed intelligent log anomaly detector using scikit-learn, NLTK, and unsupervised learning algorithms</li>
                  <li>Multi-stage ML pipeline: preprocessing (noise filtering, lemmatization), hashing vectorizer with trigram N-grams, KD-tree nearest neighbor, agglomerative clustering</li>
                  <li>Handles noise (timestamps, file paths), unordered lines, parallel jobs, and template messages with variable parts</li>
                  <li>Deployed for a while in production at Synopsys, automating verification failure log triaging</li>
                  <li>Currently integrating LLMs into the flow for more intelligent clustering</li>
                </ul>
              </div>

              <div className={styles.item}>
                <div className={styles.itemHeader}>
                  <div className={styles.itemTitle}>C-Forge <a href={cForgeUrl} target="_blank" rel="noopener noreferrer" className={styles.smallLink}>(details)</a></div>
                  <div className={styles.itemDate}>Mar 2025 - Present</div>
                </div>
                <div className={styles.itemSubtitle}>Sole Developer, Synopsys</div>
                <ul className={styles.itemList}>
                  <li>Designed ML-enhanced configuration space optimization tool for ARC Processor IP verification</li>
                  <li>Used Synopsys VCS Intelligent Coverage Optimization (ICO) with custom cov2gen flow and heuristics</li>
                  <li>Auto analyzes uncoverable combinations, triages build failures using Random Forest and Decision Tree classifiers</li>
                  <li>Presented at Purple Poster event (Synopsys internal innovation showcase) 2025</li>
                  <li>Impact: Reduced verification effort by more than 50% by reducing configurations to verify by at least 50%</li>
                </ul>
              </div>

              <div className={styles.item}>
                <div className={styles.itemHeader}>
                  <div className={styles.itemTitle}>Co-Simulation Environment <a href={coSimUrl} target="_blank" rel="noopener noreferrer" className={styles.smallLink}>(details)</a></div>
                  <div className={styles.itemDate}>Dec 2012 - Mar 2013</div>
                </div>
                <div className={styles.itemSubtitle}>Lead Developer, Synopsys</div>
                <ul className={styles.itemList}>
                  <li>Prototyped experimental co-simulation flow to automate processor-level verification</li>
                  <li>Enabled seamless integration between SystemVerilog testbenches and C-based golden reference model</li>
                  <li>The tool Changed the verification methodology, became critical component of verification infrastructure, enabled robust test development framework</li>
                </ul>
              </div>
            </div>
          </div>
          </div>

          {/* Page 2 */}
          <div className={styles.page}>
            {/* Left Sidebar - Page 2 (Complete Skillset) */}
            <div className={styles.sidebar}>
              {/* Skills - Page 2 (all categories) */}
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
                  <div className={styles.itemTitle}>Verification Best Practices Team (VBPT) <a href={vbptUrl} target="_blank" rel="noopener noreferrer" className={styles.smallLink}>(details)</a></div>
                  <div className={styles.itemDate}>2020 - Present</div>
                </div>
                <div className={styles.itemSubtitle}>Team Lead, Synopsys</div>
                <div style={{fontWeight: 600, fontSize: '9.5pt', marginBottom: '6px', color: '#163853'}}>Team Contributions:</div>
                <ul className={styles.itemList}>
                  <li>Led cross-functional team responsible for verification infrastructure and process improvement</li>
                  <li>Established best practices, guidelines, and standards for verification across product lines</li>
                  <li>Managed innovation initiatives and explored AI/ML capabilities for verification automation</li>
                  <li>Led verification plans evolution through 3 generations (Excel → HVP/Verdi → Jama), built automation tools for spec linking and coverage back annotation, established templates and guidelines, conducted training sessions</li>
                  <li>Introduced SystemVerilog coding guidelines across verification team</li>
                  <li>Mentored engineers on verification methodologies, tools, and industry best practices</li>
                </ul>

                <div style={{marginTop: '1px'}}>
                  <div style={{fontWeight: 600, fontSize: '9.5pt', marginBottom: '6px', color: '#163853'}}>Individual Contributions:</div>
                  <ul className={styles.itemList}>
                    <li><strong>Workaround Management System</strong> <a href={vbptUrl} target="_blank" rel="noopener noreferrer" className={styles.smallLink}>(details)</a> - Standardized automated workaround process, made automation generic and reusable across environment, auto-generated Markdown/RST documentation for stale workarounds</li>
                    <li><strong>AI Integration Initiative</strong> <a href={vbptUrl} target="_blank" rel="noopener noreferrer" className={styles.smallLink}>(details)</a> - Worked with central engineering to enable internal LLM search engine, internal AI enabled tools, introduced AI editors (GitHub Copilot, Cursor, Windsurf) in the team</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Verification Dashboard & Infrastructure */}
            <div className={styles.contentSection}>
              <h2>Key Projects (continued)</h2>

              <div className={styles.item}>
                <div className={styles.itemHeader}>
                  <div className={styles.itemTitle}>Verification Dashboard & Infrastructure <a href={dashboardUrl} target="_blank" rel="noopener noreferrer" className={styles.smallLink}>(details)</a></div>
                  <div className={styles.itemDate}>2017 - Present</div>
                </div>
                <div className={styles.itemSubtitle}>Sole Developer, Synopsys</div>
                <ul className={styles.itemList}>
                  <li>Gen-1 (2017): Built Grafana-based dashboard with MySQL backend, established templates and data structures, actively used and maintained by team</li>
                  <li>Gen-2 (2024): Developed Streamlit-based dashboard (Darpan) with Python frontend, added disk caching and extensive documentation using Docusaurus</li>
                  <li>Both dashboards in active use by engineers and management up to SVP level to track project health metrics</li>
                </ul>
              </div>

              {/* Other Projects */}
              <div className={styles.item}>
                <div className={styles.itemHeader}>
                  <div className={styles.itemTitle}>Other Projects</div>
                </div>
                <ul className={styles.itemList}>
                  <li><strong>Git Migration Project</strong> <a href={gitMigrationUrl} target="_blank" rel="noopener noreferrer" className={styles.smallLink}>(details)</a> - Led Perforce to Git migration for entire ARC IP codebase, zero data loss, minimal downtime, established CI/CD infrastructure (Dec 2023 - Feb 2024)</li>
                  <li><strong>Regression Automation System</strong> <a href={regressionAutomationUrl} target="_blank" rel="noopener noreferrer" className={styles.smallLink}>(details)</a> - End-to-end automation in use for 10+ years with auto error bucketing, Jira integration, and coverage management. Guided the OGE to LSF migration in team (2012-2016)</li>
                  <li><strong>FSDB Tracer for Debugging</strong> <a href={fsdbTracerUrl} target="_blank" rel="noopener noreferrer" className={styles.smallLink}>(details)</a> - A tool that generates human-readable instruction traces from FPGA waveforms, bridging the gap between FPGA and RTL simulation</li>
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
                  <div className={styles.itemTitle}>
                    argparse-enh <a href={argparseUrl} target="_blank" rel="noopener noreferrer" className={styles.smallLink}>(details)</a>
                    <span className={styles.itemType}> • Python Library, PyPI</span>
                  </div>
                  <div className={styles.itemDate}>Active</div>
                </div>
                <ul className={styles.itemList}>
                  <li>Enhanced argparse with API, shell, and automatic GUI generation modes</li>
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
