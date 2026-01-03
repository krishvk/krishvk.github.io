---
sidebar_position: 3
tags:
  - Grafana
  - MySQL
  - Streamlit
  - Python
  - verification
  - project-dashboard
  - Docusaurus
---

# Project Dashboard

From my experience in building custom tools to monitor the health of RPGs, I extended the knowledge
to build a dashboard to monitor the health of the entire verification project. Did market research,
prototyped and deployed 2 solutions over time to improve the capabilities and address the the
requirements and challenges of the team.

## Gen-1: Grafana based

The first attempt was with [Grafana](https://grafana.com/) as frontend and an in house MySQL server
managed by a different team to hold the data in the backend.

* Worked with IT to get it protyped and deployed within the team.
* Established templates and flows around the dashboard to ensure the look and feel is consistent
  across the team and for easy onboarding and scalability.
* Established data structures in the MySQL database to ensure the data is stored in a consistent and
  efficient manner.
* Gave sessions to the team to get them familiar with the tool and its capabilities.
* Supported the team members for a while in parallel to my day-to-day work in publishing the data to
  the dashboard and getting visualizations working.

### Status

Actively used to date by the team and being maintained by the central automation infrastructure team.

### Challenges

1. Reusability as it was not very much automatable. As the usage increased, it needed more dedicated
   engineers to manage the automation and processes.
2. The number of ways you can visualize the data was also limited.
3. Coding in MySQL was a bit too much to ask from a typical Hardware Verification Engineer.
4. This increased the dependency on few dedicated engineers, which became a bottleneck.
5. It was also slow when querying large datasets from the MySQL database, and few options to fix it.

## Gen-2: Streamlit based

The second attempt was with [Streamlit](https://streamlit.io/) as frontend reusing the same MySQL
database as backend.

* Good principles from first generation like reusable components, templates and flows were reused
* The frontend is now Python based, which is more popular with the verification engineers and easily
  handled by AI agents.
* To address the challenges of the first generation, a lot of new features were added to this
  generation like disk caching and Streamlit's own
  [caching](https://docs.streamlit.io/develop/concepts/architecture/caching) mechanisms. This led to
  lightening fast load times since the cache is shared across the users.
* Added extensive documentation with [Docusaurus](https://docusaurus.io/) a latest in the
  documentation frameworks from Meta to make it easy to onboard new team members. This was later
  used as documentation tool in other projects as well with in the team
* Developed a lot of in house libraries around the framework to enhance the capabilities of the
  tool

### Status

Actively used to date by the team. I am still maintaining it with the help of an intern working on
it full time.

## Impact

* Both the Grafana and Darpan dashboards are in use by the team till today.
* Used by engineers and management up to VP level to track various project health metrics.

---

*Duration: 2017 (Grafana), 2024 (Darpan)*<br/>
*Role: Sole Developer*
