---
sidebar_position: 1
tags:
  - SystemVerilog
  - Constraints
  - Verification
  - Coverage
  - Test-Generation
  - Processor-State
  - Cov2Gen
  - Markdown
  - RST
  - Doxygen
  - Sphinx
  - Python
  - Perl
  - Makefile
  - Shell
  - Tcsh
  - Bash
  - C++
  - C
  - WSL
  - VSCode
  - Bash
  - Zsh
  - ISA
  - YAML
---

# G2: State Aware Generator*

Developed a comprehensive SystemVerilog-based instruction stream generator that serves as a
processor state-aware test generation framework. This generator provides a flexible and powerful
environment for creating verification tests that are aware of the processor's internal state and can
generate instruction streams based on coverage goals and verification requirements.

## Key Features

- **Processor State Awareness**: Generates instruction streams that are aware of the processor's
  current state, enabling more targeted and effective test generation
- **Coverage-Driven Generation**: Supports coverage-driven test generation through the Cov2gen
  feature
- **SystemVerilog Native**: Built entirely in SystemVerilog, enabling seamless integration with
  existing verification infrastructure
- **Flexible Architecture**: Provides a flexible framework for generating various types of
  instruction streams
- **Integration**: Seamlessly integrates with testbenches and co-simulation environments

## Technical Approach

The SV-based generator leverages SystemVerilog's powerful features to create a state-aware
instruction generation framework. It maintains awareness of processor state and can generate
instruction streams that target specific verification scenarios and coverage goals.

## Components

- **Cov2gen**: Coverage-driven instruction stream generation feature that generates tests based on
  coverage requirements

## Memory Manager

The Memory Manager is a key component of G2 that handles memory allocation and management during
test generation. It provides:

- **Memory Region Management**: Manages different memory regions (code, data, stack, heap) with
  configurable properties
- **Address Allocation**: Intelligently allocates addresses while respecting alignment requirements
  and memory boundaries
- **State Tracking**: Maintains awareness of allocated memory regions and their usage patterns
- **Conflict Avoidance**: Prevents memory access conflicts by tracking and managing overlapping
  regions

The Memory Manager enables G2 to generate valid memory access patterns and maintain consistency
across the generated instruction streams.

## Impact

- Enabled more targeted test generation through processor state awareness
- Improved verification efficiency by generating relevant instruction streams
- Enhanced coverage through coverage-driven generation capabilities
- Seamless integration with existing SystemVerilog verification infrastructure

---

*Duration: 2016 - Present*

*Role: [To be filled]*
