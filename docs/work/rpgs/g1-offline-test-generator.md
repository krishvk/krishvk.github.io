---
sidebar_position: 2
description: Perl-based offline instruction generator for ARC processors. Primary RPG for 6+ years supporting 20-30 verification engineers across multiple product lines.
tags:
  - Perl
  - Shell
  - Tcsh
  - Bash
  - C++
  - C
  - WSL
  - Gvim
  - SVN
  - Perforce
  - MMU
  - MPU
  - Caches
  - Cache-Coherency
  - ISA-Coverage
  - Action-Points
  - Debug-Unit
  - CSRs
---

# G1: Offline Test Generator

Developed an offline instruction generator in Perl from scratch that generates random instruction
sequences for a given processor model. Initially aimed at closing pipeline coverage quickly, it was
soon adopted to generate a wide variety of sequences growing into a end-end scenario generator for
embedded processors. Supported features like
[MMU](https://en.wikipedia.org/wiki/Memory_management_unit),
[MPU](https://en.wikipedia.org/wiki/Memory_protection_unit),
[Caches](https://en.wikipedia.org/wiki/CPU_cache),
[Coherency](https://en.wikipedia.org/wiki/Cache_coherence), ISA Coverage,
Action Points (Triggers), Debug
Unit, and [CSRs](https://en.wikipedia.org/wiki/Control/Status_Register).
Designed to be fast generator without monitoring the processor state.
However, as the scenario complexity grew, it suffered with issues due to lack of visibility on
processor state, generating illegal scenarios. It was hence, phased out for more advanced generators
like G2 and G3 to address these issues.

Developed features like Memory Manager to handle the dynamic memory usage during
test generation, and pioneered the flows to auto manage the
[ISA](https://en.wikipedia.org/wiki/Instruction_set_architecture) and
[CSR](https://en.wikipedia.org/wiki/Control/Status_Register) definitions from
the processor spec that enables near instantaneous support for new ISA/CSRs.

The tool is designed to adopt to the needs in verifying highly configurable ARC family of
processors.

## Impact

Primary RPG for about 6+ years for multiple ARC processor families supporting about 20-30
verification engineers across multiple product lines, until it was gradually phased out for G2.

---

*Duration: 2011 - 2016*<br/>
*Role: Developer & Team Lead*
