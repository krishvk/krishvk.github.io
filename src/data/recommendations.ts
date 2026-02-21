export interface Recommendation {
  text: string;
  author: string;
}

// Helper function to normalize text:
// - Single newlines become spaces (allows natural line wrapping in source)
// - Double newlines become single newlines (paragraph breaks)
function text(text: string): string {
  return text
    .replace(/\n\n+/g, '\n\n') // Normalize multiple newlines to double
    .replace(/\n\n/g, '\0') // Temporarily mark paragraph breaks
    .replace(/\n/g, ' ') // Replace single newlines with spaces
    .replace(/\0/g, '\n\n') // Restore paragraph breaks
    .trim();
}

export const recommendations: Recommendation[] = [
  {
    text: text(`
      Krishna is the kind of engineer every team hopes to have. He has a rare ability to look beyond
      existing approaches and guide the team toward advanced solutions that often seem impossible at
      first.

      Whether the challenge is in hardware or software, and regardless of whether it falls within
      his immediate area of expertise, Krishna always knows how to approach a problem with clarity
      and confidence. His problem-solving mindset and structured thinking consistently lead to
      effective solutions.

      Beyond technical skills, what truly sets him apart is his optimism. Whether the situation is
      technical or non-technical, he remains positive and focused. I believe that mindset is what
      enables him to achieve outcomes that sometimes feel out of reach for others.

      On a personal note, I feel fortunate to have started my career under him. His guidance and
      honest feedback played a significant role in shaping my professional growth and building my
      confidence.

      To sum up he is a great mentor and true pioneer who inspires those around him!!!
    `),
    author: 'Nikhil Mammula'
  },
  {
    text: text(`
      Krishna is a highly talented software engineer and is one of that rare
      breed that people turn to to "get things done" when a problem arises.
      His work is always of a high quality, and his work rate is exceptional.

      He is adaptable, good at taking independent ownership of problems, open
      to new ideas, and skilled in software design as well as test-driven
      development.

      I have worked with Krishna on many high-profile ARC Synopsys projects in
      the domain of processor verification - in particular, randomized
      instruction generation - to achieve effective code coverage constrained
      by aggressive tape-out schedules.

      If you need someone to work on a complex or challenging hardware
      verification project under time pressure in a globally distributed
      team, Krishna is your guy.

      I happily give Krishna my strongest recommendation!
    `),
    author: 'Igor Böhm'
  },
  {
    text: text(`
      Krishna has led and architected critical initiatives, notably the
      instruction generators and verification regression automation
      infrastructure. His experience spans processor architecture, instruction
      set architectures including ARC and RISC-V, and hardware-software
      co-design.

      Working with Krishna at Synopsys, he consistently set a strong
      technical standard while remaining approachable. He brings structured
      problem-solving, clarity of thought, and a strong emphasis on
      well-documented, maintainable platforms. Along with the ability to
      introduce and operationalize ideas at scale, he has led work on
      ML-driven triage workflows, CI/CD pipelines, and testbench bring-up.

      He has also invested significant effort in training engineers on the tools
      and frameworks he developed, ensuring widespread adoption across the
      business unit and independent use by teams.

      I appreciated the opportunity to work closely with Krishna.
    `),
    author: 'Venkateshwaran S'
  },
  {
    text: text(`
      Krishna has good knowledge on the Processor Architecture (Especially
      ARC, RISC-V, etc..) where he developed the highly effective instruction
      generator. I was consistently impressed by his depth of understanding
      and hands-on expertise. His strong grasp of the RISC-V ISA, constraint
      handling, and corner cases significantly improved the verification
      quality.
    `),
    author: 'Satish Bhavanari'
  },
  {
    text: text(`
      Krishna has strong processor architecture knowledge and was a key
      contributor behind the development of instruction stream generators. He
      is always open to challenges, dives deep into problem-solving, and
      consistently comes up with innovative solutions. He is highly
      proficient in Perl and SystemVerilog/UVM-based verification. I
      strongly recommend Krishna for his smart approach to work, curiosity,
      and continuous enthusiasm for learning new and interesting technologies.
    `),
    author: 'Abdul Mannan Shaik'
  },
  {
    text: text(`
      Highly respected professional, Great person, Excellent communication
      skills, sound with technical knowledge in Verification, Testbench,
      Generators, ML/AI, Processor Architecture.

      A go-to person for many who have worked alongside him, known for both
      his depth of knowledge and his willingness to help others succeed.

      I am very glad to have had the opportunity to work with him at Synopsys.
    `),
    author: 'Anirudh Jupudi'
  }
];
