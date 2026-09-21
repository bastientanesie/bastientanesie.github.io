---
title: Building a bioinformatics registry that could survive its own success
description: Built from scratch for a bioinformatics startup, this custom registry grew to 100,000 tools and competed head-on with university-backed platforms.
client: OMICtools
employer: Wixiweb
startedAt: 2016-11
endedAt: 2018-02
role: Lead Developer
techTags: [zend-framework-2, mysql, php, jquery, hexagonal-architecture]
skillTags: [architecture, api, seo, startup]
logo:
  image: ./omictools.webp
  alt: OMICtools brand logo
---

## Context

OMICtools was a bioinformatics startup building the first centralised registry of tools and
workflows used by research labs worldwide — covering genomic, transcriptomic, proteomic, and
metabolomic data analysis. The users were mostly PhD researchers and bioinformatics engineers:
a specialised audience with exacting expectations. The client founded the company with Wixiweb
as their main technical partner from day one, with a three-phase roadmap: replace an
off-the-shelf CMS with a custom-built registry, collect and organise real-world workflows from
labs across the globe, then deliver a PaaS layer allowing workflows to be executed directly in
the browser. The project never reached phase three — but the first two were fully realised,
at scale.

## Tech Stack

The stack was Zend Framework 2 with MySQL, Bootstrap 3, LessCSS, jQuery, and Gulp. The
defining architectural decision — made collectively, proposed by the lead developer — was to
adopt hexagonal architecture from the start: domain classes, CQRS, an event bus, clean
separation between business logic and infrastructure. The upfront investment in structure paid
off throughout: the codebase grew to nearly 100,000 tool entries without a single major
refactor.

Beyond the core stack, the application integrated a significant number of third-party APIs:
GitHub and Google OAuth, synchronisation with bioinformatics-specific search engines, sitemap
submission via Google Search Console, and DOI retrieval through the DataCite MDS API.
Multilingual support was handled with gettext and POEdit. Serious SEO work — JSON-LD schemas,
microdata markup, aggressive caching strategies — rounded out the picture.

## My Role

I worked on this project as a two-person team with the project manager, who also served as
lead developer. Client meetings happened at least weekly, but at this point in my career I
wasn't in the room for those. What I did have was regular access to the technical specification
work: the lead dev frequently brought me in to think through and scope features before they
hit the Trello board. We ran one-week agile sprints.

In practice, my work covered most of the platform's surface area. I contributed to the
CMS-like content editor the OMICtools team used to document each tool in the registry, and to
the moderation system that handled community contributions — an important part of the product,
given that the registry's value depended entirely on the quality and volume of what was in it.
I worked on the third-party API integrations: OAuth flows for GitHub and Google, search engine
synchronisation, sitemap submission, DOI retrieval via DataCite. I was involved in the
multilingual implementation throughout.

A meaningful slice of the project was SEO: structured data markup with JSON-LD and microdata,
caching designed to handle the indexing demands of a 100,000-tool registry, all built to
compete for visibility against tooling created by university-sponsored labs with far greater
resources. The competition was real — major European and American institutions had their own
platforms — and getting traction required technical credibility, not just content volume.

Over two years, the client grew from a single founder to a team of around twenty, mostly PhD
researchers in bioinformatics. The platform held up through all of it.

## Retrospective

OMICtools didn't reach its full ambition. The PaaS phase never happened — budget constraints,
tied to ongoing fundraising rounds, kept priorities focused on the live product. The company
eventually reached an undisclosed agreement with a competitor and ceased operations.

What was built was real, though: a well-architected platform that scaled cleanly, served
thousands of researchers, and held its own in a field dominated by institutionally-backed
tools. The hexagonal architecture, which felt ambitious for a two-person team at the time,
proved its value over two years of continued development — the codebase grew without breaking.

For me, this project was formative. It was my first serious exposure to architectural thinking
at that scale: CQRS, domain modelling, event-driven patterns. Working alongside a lead
developer who pushed the team to build things properly left a mark. That foundation has stayed
with me.
