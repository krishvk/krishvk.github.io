---
sidebar_position: 1
---

# Random Program Generators (RPGs)

Designed, developed, and led the development of 3 independent RPGs for
processor-level verification from scratch. They follow different philosophies addressing the
shortcomings of each other. They serve as the backbone of verification
infrastructure, supporting 50+ verification engineers across multiple product lines in Synopsys' ARC
processor family.

The 3 RPGs at glance:

- [G1: Offline Test Generator](./rpgs/g1-offline-test-generator): Generates random instruction
  sequences without communication with the golden model, enabling rapid test generation
- [G2: State Aware Generator](./rpgs/g2-state-aware-generator): Communicates with the golden model
  to maintain processor state, focusing on generating interesting real-time scenarios than blind
  patterns (replaced G1)
- [G3: C-Based Scenario Generator](./rpgs/g3-c-based-scenario-generator): Focuses on scenarios and
  reduces the test creation complexity (complements G2)

## Technical Challenges

- Handling complex multi-issue scheduling constraints
- Providing a flexible API framework for a wide range of test scenarios
- Managing different processor variants and configurations
- Supporting all processor features including multicore systems, caches, cache coherency, MMU, MPU,
  VLIW, SIMD, and multi-issue pipes etc.

## Impact

- Boosted the productivity of verification engineers across multiple parallel product lines
- Significantly reduced test development time

---

*Duration: Dec 2011 — Present*

*Role: Lead Developer & Product Manager*

*Users: 50+ verification engineers*
