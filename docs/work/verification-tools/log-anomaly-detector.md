---
sidebar_position: 4
description: LLM-powered verification failure triage with MCP access to logs, traces, and FSDB
  waveforms. Evolved from a Master's thesis ML anomaly detector.
tags:
  - Python
  - LLM
  - MCP
  - FSDB
  - scikit-learn
  - NLTK
  - anomaly-detection
  - clustering
  - Verification
---

# Log Anomaly Detector

Automates regression failure triage for processor verification by separating signal from noise in
log files, then using LLMs to categorize failures and drive follow-up debug. The project began as
a [Master's thesis at BITS Pilani](/academic/log-anomaly-detector) and continued at Synopsys with
LLM integration and MCP-based debug automation.

## Problem

When a bug lands in a sanity suite, engineers spend significant time reading log files to find
what actually failed. Persistent warnings and errors that also appear in passing runs add noise and
slow triage, especially for newer team members.

## Approach

The original insight still holds: messages present in both passing and failing logs are unlikely
root causes; messages unique to failing logs are anomalies worth investigating. A simple diff is
not enough because of timestamps, paths, unordered lines, parallel jobs, and templated messages
with variable fields.

The work version keeps the original ML core as a **noise-stripping front end** and layers LLM
reasoning and tool access on top for categorization and automated debug.

### ML Core (Noise Reduction)

The [thesis pipeline](/academic/log-anomaly-detector) preprocesses logs, vectorizes messages,
detects anomalies with nearest-neighbor search, and clusters similar failures. That output is
fed to LLMs as a compact, high-signal summary instead of raw log dumps.

- **Preprocessing**: Noise filtering, lemmatization, stop-word removal, timestamp/path stripping
- **Vectorization**: Hashing vectorizer with trigram N-grams
- **Anomaly detection**: KD-tree nearest neighbor on failing vs passing logs
- **Clustering**: Agglomerative clustering groups related failures before LLM review

### LLM Integration

Integrated LLMs into the detector while retaining the ML core above. The model receives
de-noised anomalies rather than full logs, then **categorizes failures** (root-cause themes,
likely subsystems, similarity to known issues) with much less token cost and higher accuracy than
raw-log prompting.

### MCP Debug Automation

Developed **MCP servers** so LLMs can query verification artifacts directly and close the triage
loop without manual handoff:

- **Trace access** — query instruction and simulation traces for failing tests
- **FSDB waveform access** — inspect FPGA/RTL waveforms when logs alone are inconclusive

Together, log anomaly filtering, LLM categorization, and MCP tool use form a **fully automated
triage path** from regression failure to categorized failure with debug context.

## Status

Evolution of the thesis prototype deployed in production at Synopsys. Active work focuses on LLM
categorization quality and MCP coverage for traces and FSDB.

---

*Duration: Feb 2022 — Present (staggered)*<br/>
*Role: Developer (thesis origin, continued at Synopsys)*<br/>
*Foundation: [M.Tech thesis, BITS Pilani](/academic/log-anomaly-detector)*<br/>
