---
title: A project management app that outlived two of its own architectures
description: A task management SPA built for business advisors needing offline and real-time sync — and rebuilt twice to stay relevant across seven years of production.
client: PERI-G
employer: Wixiweb
startedAt: 2018-07
role: Lead Developer
techTags:
  [
    ember-js,
    couchdb,
    node-js,
    mysql,
    vue-js,
    laravel-php,
    tailwind-css,
    docker,
    gitlab-ci,
    deployer,
    playwright,
    renovate,
  ]
skillTags: [architecture, r-d, team-lead, api, legacy, devops]
logo:
  image: ./perig.jpeg
  alt: PERI-G brand logo
isFeatured: true
---

## Context

PERI-G is a consultancy that helps companies navigate transformation — climate, energy,
digital. Their advisors spend a lot of time on-site at client companies, sometimes in rural
areas with unreliable connectivity. ALIX was built to support that work: a project and task
management application, somewhere between Trello and a structured action-plan library, designed
specifically for business advisors and the companies they work with. The core value goes beyond
task tracking — it's the combination of a curated template catalogue covering the most common
transformation plans, real-time collaboration between advisors and their clients, and an offline
mode that keeps everything working when the network doesn't. Wixiweb has owned the full
scope from the start: conception, development, ongoing support.

## Tech Stack

The original stack reflected the ambitions of the product: Zend Framework 3 with hexagonal
architecture on the backend, MySQL for authentication and workspaces, CouchDB for application
data — chosen specifically for its built-in replication protocol, which made both real-time sync
and offline support possible. The frontend was an Ember.js SPA, wrapped in Electron for desktop
field use.

After two years in production, a performance crisis led to the first major overhaul. CouchDB,
queried directly from both web and desktop clients, couldn't hold up under load. The fix was
structural: drop the Electron wrapper, replace most of the CouchDB layer with MySQL, and
introduce a Node.js/Express API between the frontend and the database — with WebSocket events
taking over real-time.

The second overhaul is now underway. The Ember.js SPA has been stuck on a deprecated version
since 2021, with no viable upgrade path. The replacement stack is Laravel 12, Blade, Tailwind
CSS, Vue.js for reactive components, and Laravel Reverb for WebSockets — a setup the whole
team owns, and one that PERI-G could take in-house if they ever needed to.

The rewrite came with a delivery pipeline of its own. GitLab CI and Deployer PHP, both run
through Docker, build, test and deploy the application over SSH to an Ubuntu server managed
with Proxmox. Playwright end-to-end tests and Renovate for dependency updates are being
rolled out on top of it.

## My Role

### V1: Ember, CouchDB and the Node.js overhaul

I joined as lead developer in 2018, responsible for the frontend architecture from the start.
That meant doing the R&D work that shaped the initial stack: evaluating React, Vue, and Ember
to find the right fit for a team used to full frameworks rather than assembled libraries. Ember
won — the conventions, the integrated data layer, the MVC structure aligned with how the team
worked. I also drove the CouchDB decision, on the strength of its replication protocol's
track record for offline sync. On the backend, I contributed to the hexagonal architecture
choice — our experience on OMICtools made it the natural call — and to the OAuth2 authentication
layer.

When performance complaints escalated after two years, I led the investigation alongside the
project manager. Tracking down the bottleneck across a multi-component system with CouchDB,
Ember, and Electron in the mix was methodical work. Once we had the diagnosis, the scope of
the fix became clear: 154 API endpoints to build and migrate to Node.js and MySQL, over
several months between two developers. I owned the MySQL side and led the effort overall.
The result was a complete elimination of the reported slowdowns — and a leaner architecture
with fewer moving parts and no new bugs introduced.

### V2: Laravel, Vue.js and a delivery pipeline

In 2026, I'm leading the second major rewrite: a full migration from Ember to Laravel and
Vue.js, structured as incremental lots rather than a single year-long freeze. Migrating
feature by feature — the project settings page, then the task list, then the task view, and
so on — was an approach I helped design to make the investment digestible for the client:
spread the cost, maintain the existing version between lots, keep shipping. The first lots
are now underway.

Shipping lot after lot only works if releasing is cheap and safe, so I set up the tooling
around the code as well. A GitLab CI pipeline, running in Docker, builds the application and
runs the test suite. Deployer PHP then deploys it over SSH to an Ubuntu server managed with
Proxmox. The deployment workflow handles database migrations, rollback when a release goes
wrong, and a maintenance page shown while the switch happens.

Agentic programming has also made a broader safety net affordable: we've started adding
Playwright end-to-end tests covering the critical user journeys, and we're working on
Renovate to automate PHP and NPM dependency updates — a direct answer to the deprecated
Ember version that started all this.

### Throughout

Across both versions, I've held technical direction on the project, managed another developer through
the MySQL refactor, and stayed close to PERI-G across seven years of shifting scope,
budget constraints, and architectural decisions.

## Retrospective

ALIX is the project that has asked the most of me technically. Two major pivots, each with
real stakes: one to recover from a performance crisis that was eroding user trust, one to
prevent a frontend in decline from becoming a dead end. Both required the same thing —
diagnosis before prescription, and enough confidence in the diagnosis to commit to a
significant course change.

What I'm most satisfied with is the continuity. The application is still running, still
growing: over 2,000 users across 70+ workspaces, nearly 8,000 projects, more than 180,000
tasks tracked. That doesn't happen by accident after seven years and two architecture changes.
The rewrite now underway isn't a panic response — it's the planned conclusion of a strategy
that kept things moving without ever burning the product down to start over. The delivery pipeline, the end-to-end
tests and automated dependency updates are meant to keep it from drifting into legacy again.
That, in the
end, is what the client hired us to do, and what earned us the trust or our clients over
the years
