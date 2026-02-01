---
sidebar_position: 4
description: AI-ML log anomaly detector using machine learning for automated failure triaging in processor verification regressions. Master's thesis project.
tags:
  - Python
  - scikit-learn
  - NLTK
  - anomaly-detection
  - clustering
  - Streamlit
  - Plotly-Dash
  - Parquet
  - JSON
  - kd-tree
  - hashing-vectorizer
---

# Log Anomaly Detector

The idea was born when triaging different failures from regressions, especially when a bug was
introduced in a sanity suit. Instead of spending engineer's time in manually analyzing the log
files, the tool automates this process by approximately comparing the log files with a reference log
files. A lot of persistant warning or error messages that can be misleading to (especially fresher)
engineers can be handled diligently by the tool as it compares the log files with a reference log
files, which likely have similar messages.

## Idea

If a message is present in a passing and failing log, its most likely not contributing
to the failure. But a message that is present in a failing log but not in a passing log, is likely
contributing to the failure. Such a unique pattern is called as anomaly.

## Technical Approach

A simple diff won't work due to noise (timestamps, file paths), unordered lines, parallel jobs, and
template messages with variable parts. The system uses a multi-stage ML pipeline to handle this
complexity.

### Pipeline Architecture

- **Preprocessing**: Noise filtering, lemmatization (NLTK WordNet), stop word removal, duplicate
  elimination, custom rules for timestamps/pathnames
- **Vectorization**: Hashing Vectorizer with Trigram N-grams (Unigram→0.92 score, Trigram→1.0
  score)
- **Anomaly Detection**: Nearest Neighbor (KD-Tree) with Euclidean distance.
- **Classification**: Agglomerative Clustering (no cluster count required) groups similar anomalies
- **HTML Interface**: Interactive regression analysis with embedded feedback collection to grade the
  algorithm.

## Status

Deployed for a while in production at Synopsys, however it is now not being maintained after it
encountered scalability issues due to the large number of log files overwhelming the server. With
the advent of Large Language Models (LLMs), it is possible to build a similar tool with less effort
and more accuracy. Exploring this as a next version.

---

*Duration: Nov 2021 — Feb 2022 (Final Semester)*<br/>
*Role: Developer (Master's Thesis Project)*<br/>
*Institution: BITS Pilani*<br/>
*Degree: M.Tech in Data Science & Engineering*<br/>
