---
sidebar_position: 6
description: FSDB tracer tool that generates human-readable instruction execution traces from FPGA emulator waveforms, bridging the gap between FPGA and RTL simulation.
tags:
  - FSDB
  - Debugging
  - FPGA
  - SystemVerilog
  - Python
  - Verdi
---

# FSDB Tracer for Debugging

Developed a tool that loads the FSDB file and generates an instruction execution trace in a human
readable format to help debug complex bugs from FPGA emulator. Worked with another engineer who is
an expert in the FSDB file format to understand the APIs. Prototyped the possibility of re-animating
the RTL simulation from waveforms. This opened up the possibilities to run RTL simulation once and
us the waveforms to implements checks or run CoSimulation that are difficult to run on FPGA due to
the physical limitations of FPGA. Thus bridging the gap between FPGA and RTL simulation.

---

*Duration: Less than a week*<br/>
*Role: Developer*
