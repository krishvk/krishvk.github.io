import React from 'react';
import styles from './RecommendationsCards.module.css';

interface Recommendation {
  text: string;
  author: string;
}

const recommendations: Recommendation[] = [
  {
    text: `Krishna has led and architected critical initiatives, notably the instruction
generators and verification regression automation infrastructure. His experience spans
processor architecture, instruction set architectures including ARC and RISC-V, and
hardware-software co-design.

Working with Krishna at Synopsys, he consistently set a strong technical standard while
remaining approachable. He brings structured problem-solving, clarity of thought, and a
strong emphasis on well-documented, maintainable platforms. Along with the ability to
introduce and operationalize ideas at scale, he has led work on ML-driven triage
workflows, CI/CD pipelines, and testbench bring-up.

He has also invested significant effort in training engineers on the tools and frameworks
he developed, ensuring widespread adoption across the business unit and independent use by
teams.

I appreciated the opportunity to work closely with Krishna.`,
    author: 'Venkateshwaran S'
  },
  {
    text: `Krishna has strong processor architecture knowledge and was a key contributor
behind the development of instruction stream generators. He is always open to challenges,
dives deep into problem-solving, and consistently comes up with innovative solutions. He
is highly proficient in Perl and SystemVerilog/UVM-based verification. I strongly
recommend Krishna for his smart approach to work, curiosity, and continuous enthusiasm for
learning new and interesting technologies.`,
    author: 'Abdul Mannan Shaik'
  },
  {
    text: `Highly respected professional, Great person, Excellent communication skills,
sound with technical knowledge in Verification, Testbench, Generators, ML/AI, Processor
Architecture.

A go-to person for many who have worked alongside him, known for both his depth of
knowledge and his willingness to help others succeed.

I am very glad to have had the opportunity to work with him at Synopsys.`,
    author: 'Anirudh Jupudi'
  }
];

export default function RecommendationsCards(): JSX.Element {
  return (
    <div className={styles.container}>
      <div className={styles.scrollContainer}>
        {recommendations.map((rec, index) => (
          <div key={index} className={styles.card}>
            <div className={styles.quoteIcon}>"</div>
            <p className={styles.text}>{rec.text}</p>
            <div className={styles.author}>— {rec.author}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
