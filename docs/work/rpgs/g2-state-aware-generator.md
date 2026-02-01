---
sidebar_position: 1
description: SystemVerilog-based processor state-aware test generation framework supporting 50+ verification engineers. Generates billions of instructions daily across ARC processor families.
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
  - RISC-V
  - ARC-ISA
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
  - Zsh
  - ISA
  - YAML
  - Verilator
  - NLTK
  - BNF
  - BeautifulSoup
  - Ctags
---

# G2: State Aware Generator

Developed a comprehensive processor state-aware SystemVerilog-based test generation framework to
address the challenges faced in [G1](./g1-offline-test-generator). In continuous use since **2016**,
it's the longest-running tool in the verification infrastructure. Around **50+ verification
engineers** across multiple product lines use it on daily basis to generate test cases and
instructions for verification. **1000s of test templates**, generating **tens of thousands of test
cases** and **billions of instructions daily** across different product families.

## Key Features

- Processor State Awareness
- Coverage-Driven Generation to close the final ISA coverage quickly or discover hidden constraints
- SystemVerilog Native
- Memory Manager to
  - Generate processor architecture aware instruction streams
  - Keep track of memory usage and allocation during generation
- Data Manager to ease the scenario generation around DMP, Cache Coherency etc.
- Barriers to synchronize multi core scenarios across cores
- Automatic ISA DB management enabling plug and play support for most of the ISA
- Automated CSR DB Management to aid verification of all CSR related scenarios
- Automatic legal scenario biasing to minimize the verification cycles wasted in illegal scenarios
- Automatic on-demand self check instructions insertion for environments without co-simulation
- Doxygen and Sphinx docs to help verification engineers understand the capabilities
- Multiple on-demand and recorded training sessions to get engineers onboarded quickly
- Invented C++ Routine patching to design complex strategies around processor features
- Control Panel and project specific switches to unblock verification from known issues
- TB-Semaphores to synchronize test generation with TB stimulus
- Generates test information in Text, YAML, JSON formats to help TB generate test aware stimulus
  - Ex: ECC error injection on critical addresses accessed by test
  - Ex: DMI on address ranges used for different purposes by test
- Fully automated workaround management process to
  - Work around known issues in the verification environment to find new bugs quicker
  - Auto eliminate workarounds when the issue is fixed without manual intervention
- Support stimulus generation for PLV and MLV levels
  - Different modes of stimulus generation for MLV modes like CSVs etc.
- Unreliable data segments with auto trashing of loaded data before its used in control flow
  - This is very useful in verifying features like Cache Coherency, ECC, bus errors etc.
- Support VLIW bundling rules to generate all possible legal VLIW instructions without manual effort
  - Support for disabling specific bundling rules to trigger exceptions for exception verification
- Support for APEX (Application Extension) ISA - see
  [G2.1](#g21-application-extension-apex-generator) section
- Hundreds of APIs, to control Memory, CSRs etc.
- Aggressive use of polymorphism to let tests override numerous points of core behavior as needed
- Auto extracts ISA and CSR definitions from the processor spec to enable near instantaneous support
  for new ISA/CSRs
- An SV-Python wrapper for TB to read the test information from YAML or JSON files at scale
- Invented a SIT (Serial Information Table) to support sequential information retreval in exceptions
- A fully functional VSCODE IDE with Ctags is available for engineers to navigate the codebase
- Recognized internally as most stable environment in verification team

## Major Processor features supported

- [MMU](https://en.wikipedia.org/wiki/Memory_management_unit) (SW and HW page table modes)
- [MPU](https://en.wikipedia.org/wiki/Memory_protection_unit)
- [Caches](https://en.wikipedia.org/wiki/CPU_cache) (L1, L2)
- [Cache Coherency](https://en.wikipedia.org/wiki/Cache_coherence)
- Cache Aliasing
- MMIO
- [ISA Coverage](https://en.wikipedia.org/wiki/Instruction_set_architecture#Coverage)
- [Action Points](https://en.wikipedia.org/wiki/Action_point)
- [Debug Unit](https://en.wikipedia.org/wiki/Debug_unit)
- [CSRs](https://en.wikipedia.org/wiki/Control/Status_Register)
- Interrupts
- RISC-V ISA
- ARC-ISA
- BPU
- Loop Buffers
- VLIW
- SIMD
- Multi-Issue Pipelines
- Multi-Core Systems
- Virtualization
- Protection Schemes
- Memory Attributes
- CCMs (Instruction, Data, Cluster)
- DMP
- IFU
- PMP
- FPU
- AGU
- APEX (Application Extension)
- Timers

## G2.1: Application Extension (APEX) Generator

Developed a comprehensive Application Extension (APEX) generator to mimic custom user extensions to
the ISA. Extensions can have custom Core Registers, CSRs, Instructions etc. with special properties.
Instructions in the extension have custom pipelined functionality like custom pipeline stages,
implicit writes etc. Used [Verilator](https://www.veripool.org/wiki/verilator) to generate C++ code
from the verilog code to add custom ISA to golden model. Also supports C++ code generation without
Verilator. Generated custom arithmetic expressions to
mimic complex instructions. Used the [NLTK](https://www.nltk.org/) framework to generate random
expressions from [BNF](https://en.wikipedia.org/wiki/Backus%E2%80%93Naur_form) grammars.

---

*Duration: 2016 - Present*
*Role: Architect, Developer, Team Lead*
