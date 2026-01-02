---
sidebar_position: 1
---

# Log Anomaly Detector

Developed an intelligent log analyzer tool as part of my Master's thesis in Data Science & Engineering that automates the triaging of verification failure logs. This machine learning system with NLP capabilities automates the analysis of log files in automated regression testing environments by suppressing common patterns that persist across logfiles while emphasizing unique patterns that indicate failures, significantly reducing the time domain experts spend analyzing log files.

The solution addresses the challenge of identifying failure root causes buried in millions of log lines produced by automated testing processes. Unlike traditional approaches that require enumerating all possible failure messages, this system uses unsupervised learning to dynamically detect new anomalies without requiring retraining for each new tool release or enhancement.

## Key Features

- **Anomaly Detection**: Automatically identifies log lines that are present in failing logs but absent from reference (passing) logs
- **Anomaly Classification**: Clusters detected anomalies to group logfiles failing due to the same root cause
- **Dynamic Learning**: Unsupervised approach that adapts to new failure patterns without manual retraining
- **Web Interface**: HTML-based regression analysis tool with user feedback collection
- **Scalable Processing**: Handles millions of log lines efficiently using optimized preprocessing and data structures
- **Pattern Recognition**: Intelligent triaging to reduce debugging time in verification failures
- **Integration**: Works with existing verification infrastructure

## Technical Approach

The system uses a multi-stage pipeline:

1. **Preprocessing**: Reference (passing) and test (failing) logfiles undergo noise filtering, lemmatization, stop word removal, and tokenization
2. **Vectorization**: Hashing Vectorizer with N-gram models (Unigram to Trigram) converts log lines into feature vectors, capturing context while handling template messages with variable parts
3. **Anomaly Detection**: Nearest Neighbor classifier with "kd_tree" algorithm assigns distance scores to failing log lines relative to reference log lines. Low scores indicate similarity to reference patterns, while high scores indicate anomalies
4. **Classification**: Agglomerative Clustering groups similar anomalies together, enabling automatic regression summaries that highlight different failure types

The system was evaluated on 10 datasets with approximately 400 million reference log lines and 70 failing log lines per dataset, testing 36 different model combinations to identify the optimal approach. Built using scikit-learn and Python, with optimized data structures for handling large-scale log processing.

## Impact

- **Time Savings**: Dramatically reduced time spent by domain experts in manual log file analysis
- **Cost Reduction**: Significant cost savings through automation of regression analysis
- **Scalability**: Addresses the bottleneck of human-limited analysis in exponentially growing log file volumes
- **Accuracy**: Successfully detects and classifies anomalies across diverse failure patterns
- **Maintainability**: Dynamic system that adapts to new failure messages without requiring constant retraining
- **Efficiency**: Significantly reduced verification cycles spent on log analysis, enabling faster failure resolution
- **Practical Application**: Demonstrated successful application of AI-ML in hardware verification and automated repetitive debugging tasks

---

*Duration: Nov 2021 — Feb 2022 (Final Semester)*
*Role: Developer (Master's Thesis Project)*
*Institution: BITS Pilani*
*Degree: M.Tech in Data Science & Engineering*
*Supervisor: Praveen Reddy Pullagurla, Mgr II, ASIC Digital Design, Synopsys India Pvt. Ltd.*
*Status: Deployed and actively used in Synopsys verification infrastructure*
