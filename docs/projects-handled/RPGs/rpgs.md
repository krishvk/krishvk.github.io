---
sidebar_position: 1
---

# RPGs

## Overview

Random Program Generators (RPGs) are a critical component of processor-level verification infrastructure. These tools generate randomized test programs that exercise various processor features, enabling comprehensive verification coverage across Synopsys' ARC processor family.

## Purpose

RPGs serve as the backbone of verification infrastructure, supporting 50+ verification engineers across multiple product lines. They automate the generation of test programs that would otherwise require significant manual effort, enabling rapid test development and comprehensive feature coverage.

## Key Components

The RPG ecosystem consists of multiple specialized generators, each designed to address specific verification challenges:

- **Offline RPG**: Lightning-fast generator that generates code patterns without communication with the golden model
- **Online RPG (Stepping)**: Context-aware program generator that communicates with the golden model for multi-issue SIMD processor verification
- **Python Environment**: Framework to generate random Application Extensions for verification
- **C-based Environment**: High-level language (HLL) test development environment focusing on scenarios rather than low-level details

## Impact

- Enabled comprehensive processor feature coverage through automated test generation
- Reduced test development time significantly
- Standardized verification methodologies across teams
- Supported verification of all processor features including multicore systems, caches, cache coherency, MMU, MPU, VLIW, SIMD, and multi-issue pipes
- Managed product lifecycle from design to deployment, ensuring continuous improvement based on user feedback

## Technical Challenges

- Handling complex multi-issue scheduling constraints
- Providing a flexible API framework for a wide range of test scenarios
- Improving probability of cache hits from random programs
- Reverse Generation Technique for functional verification
- Supporting all processor features including multicore systems, caches, cache coherency, MMU, MPU, VLIW, SIMD, and multi-issue pipes
