---
sidebar_position: 2
tags:
  - python
  - vcs
  - ICO
  - coverage
  - cov2gen
  - verification
  - configuration space
  - random forest
  - decision tree
  - scikit-learn
  - pandas
  - streamlit
  - systemverilog
---

# C-Forge

Designed a new tool C-Forge, that reduced the effort required to verify configuration space of ARC
Processor IP by more than 50% by reducing the number of configurations to verify by at least 50%.
Designed and developed as an efficient configuration generator, C-Forge specifically addresses
configuration space verification challenges for ARC Processor IP.

## Highlights

- Used Synopsys-VCS' Intelligent Coverage Optimization (ICO) features
- Implemented custom [cov2gen](/work/tags/cov-2-gen) flow that is more problem aware than the
  generic VCS' [ICO](/work/tags/ico) flow
- Custom heuristics to boost the coverage faster
- Used VCS' auto exclusion file generation to auto exclude the uncoverable combinations
- Auto analyze and report uncoverable combinations at the end, listing the conflicting constraints
- Also auto triages the build failures to associate them to specific combinations of options using
  [Random Forest](https://scikit-learn.org/stable/modules/ensemble.html#forest) and
  [Decision Tree](https://scikit-learn.org/stable/modules/tree.html) Classifiers

---

*Duration: Mar 2025 - Present*<br/>
*Role: Sole Developer*<br/>
*Publication: [Purple Poster event (Internal to Synopsys) 2025](/about-me/publications)*
