---
sidebar_position: 1
tags:
  - Co-Simulation
  - Verification
  - SystemVerilog
  - PLV
---

# Co-Simulation

Prototyped the experimental co-simulation flow to automate the verification of processor level
simulations. Worked with the team managing Golden model and implemented and maintained reusable
interface that can be used in multiple verification components. This environment which was later
managed by a dedicated team became a critical component of the verification infrastructure for
Synopsys ARC processors.

This changed the entire verification methodology since the tests no longer need to care about how a
feature should be tested, instead the test just focuses on triggering various scenarios while the
verification is handled by the co-simulation environment. This simplified the test development and
made space to rapid development of more complex test scenarios

For example, random programs often overwrite registers, requiring complex instruction chaining to
force reuse and propagate errors—this slows down generation and adds hidden constraints that
complicate test development. With co-simulation, the environment continuously monitors processor
state, making register overwrites irrelevant, enabling a robust test development framework.

Similarly, while a shared counter can smoke-test cache-coherency, it only exercises limited protocol
states (typically shared ↔ exclusive transitions). Co-simulation enables triggering any random state
transition without manual orchestration to provision for bug detection, naturally exposing bugs that
would otherwise require careful test design.

## Impact

- Prototyped and paved the way for more robust verification methodology for ARC processors

---

*Duration: Dec 2012 — Mar 2013*<br/>
*Role: Lead Developer*
