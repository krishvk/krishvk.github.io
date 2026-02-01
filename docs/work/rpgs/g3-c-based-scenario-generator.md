---
sidebar_position: 4
description: To focus on high level test scenarios/sequences
tags:
  - C
  - C++
  - Python
  - Test-Generation
  - PLV
  - RISC-V
  - CSmith
---

# G3: C Based Scenario Generator

While the G2 focuses on constructing the test sequences instruction by instruction, it suffers from
slowness due to the need to communicate with the golden model, maintain processor state etc. It
also is challenging to think at instruction level to achieve high level scenarios. Often times, high
level scenarios does not care what instructions are used to achieve the purpose.

While the G2 solves this problem by providing a lot of building blocks, it only gives incremental
boost. G3 takes a completely different approach by focusing on high level test scenarios/sequences.
discarding the need to think at instruction level, maintain processor state etc.

Uses [CSmith](https://github.com/csmith-project/csmith) to generate random C programs to save the
test developer time spent in filling in random functions. Reimplements the
[MemoryManager](./g2-state-aware-generator/g2-state-aware-generator.md#memory-manager) from
[G2](./g2-state-aware-generator/g2-state-aware-generator.md) in a more scalable way to serve the
needs of the new generator. Auto generates linker scripts and other build files for the generated C
programs.

The tool also introduces additional dimensions of randomization, a single test can be compiled for
different processor variants, different compiler flags, auto generated linker scripts can link to
different memory regions and layouts etc. drastically increasing the scope of a single test

## Status

Currently it just supports a handful of processor features to a limited set of engineers. Work in
progress to expand the scope.

---

*Duration: Sep'26 - Present*<br/>
*Role: Lead Developer*
