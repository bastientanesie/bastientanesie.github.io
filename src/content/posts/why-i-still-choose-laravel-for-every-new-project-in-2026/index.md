---
title: Why I still choose Laravel for every new project in 2026
description: "After 15 years across CodeIgniter, Zend Framework and Laravel, here's why Laravel keeps winning for new projects in 2026 — beyond habit."
publishedAt: 2026-03-10
aiAssisted: true
tags: ["laravel", "php", "architecture"]
---

I've shipped production code on CodeIgniter, then Zend Framework 1, 2 and 3, before landing on Laravel. I know what "before Laravel" looked like from the inside, not as a strawman. Laravel keeps winning for every new project — here's why.

## Laravel makes the safe path the easy path

The best frameworks don't just make hard things possible. They make the right thing the easy thing, and Laravel is unusually good at that. The default path — the one you get without thinking too hard — is generally the secure, maintainable one. You have to actively work to fall off it.

Take authentication. In a raw PHP project, you'll Google "PHP session login", copy something half-broken from Stack Overflow, and spend a week auditing it. In Zend Framework, you'd hand-roll your auth adapters and ACLs, which meant days of reading before writing a single useful line. In Laravel, I reach for [Fortify](https://laravel.com/docs/13.x/fortify) as the headless backend for authentication:

```bash
composer require laravel/fortify
php artisan vendor:publish --provider="Laravel\Fortify\FortifyServiceProvider"
php artisan migrate
```

Fortify gives you rate-limited login, password reset, email verification and two-factor authentication — implemented and tested, with no opinion on your frontend. For a quick proof of concept where I don't want to wire up views by hand, I'll reach for one of the official [starter kits](https://laravel.com/docs/13.x/starter-kits) instead, which bundle Fortify with a working UI. Either way, the default is correct, and getting it wrong takes more effort than getting it right.

## Expressive without magic

Laravel's reputation for "magic" has always bothered me — not because it's wrong, but because it misses the point. Yes, there are facades. Yes, you can write `Cache::get('key')` without injecting anything. But it's _optional_ magic, layered on top of a perfectly ordinary IoC container you can use like any other.

Here's a real-world Eloquent query, listing published articles filtered by tag:

```php
$articles = Article::query()
    ->with(['author', 'tags'])
    ->whereHas('tags', fn ($q) => $q->where('slug', $tag))
    ->published()   // local scope
    ->latest()
    ->paginate(15);
```

This is readable to a developer who's never touched PHP. It expresses _intent_, not implementation. Compare that to the equivalent Doctrine DQL, and tell me which codebase you'd rather maintain in five years.

> "A framework should make your intent legible to the next developer — including the future version of yourself at 7pm trying to fix a production bug."

## The ecosystem, honestly assessed

Let me be honest about the ecosystem, because it's both a strength and a risk.

- **[Horizon](https://laravel.com/docs/12.x/horizon)** — queue monitoring that actually works and looks good. My workloads are modest (a couple hundred jobs a day, not tens of thousands), but the dashboard and the ability to see failed jobs at a glance has saved me real debugging time regardless of scale.
- **[Telescope](https://laravel.com/docs/12.x/telescope)** — local development debugging that saves hours every week. Requests, queries, logs, mail, all in one place.
- **[Passport](https://laravel.com/docs/12.x/passport)** — full OAuth2 server implementation. I've used it to expose an API to third-party integrations and it removed an entire category of "how do we do auth for external clients" decisions.
- **[Reverb](https://laravel.com/docs/12.x/reverb)** — Laravel's own WebSocket server. Dropping it into a project that needed real-time notifications took an afternoon, not a sprint.

The risk worth naming: a meaningful chunk of this ecosystem's direction depends on Taylor Otwell and his team's priorities. That's a real dependency, and Symfony's more distributed governance model is more resilient on paper. What tempers it in practice is that the _community_ ecosystem around Laravel — packages, tutorials, Stack Overflow answers, conference talks — is unusually mature and dense. Even if first-party tooling stalled tomorrow, there's more community-maintained surface area to fall back on than with most frameworks I've used.

### On the "too magic" objection

I hear this mostly from developers coming from more explicit, configuration-heavy frameworks. My response: spend a week reading the source of the Container, the Eloquent ORM, and the routing engine. There's no magic in there. There's clever, standard use of PHP's reflection API, closures and traits. All readable.

The architecture of a Laravel application is as clean as you make it. Use Actions, use DTOs, use services, apply Domain-Driven Design if your domain warrants it. Laravel doesn't stop you from any of this: it just doesn't force it on you on day one, which is the right default for most projects.

## How I structure a new project

After years of iteration, here's the directory structure I start every project with:

```text
app/
  Actions/          # Single-purpose classes, 1 method each
  Http/
    Controllers/    # Thin, route-only
    Requests/       # Form request validation
  Jobs/              # Call Actions in the background
  Models/            # Thin, no business logic
  Policies/          # Access control, applied scrupulously
  Services/         # Domain services, injected
```

For larger projects, I'll add a `domain/` directory of pure PHP classes — no Eloquent, no facades, no Laravel dependencies. That's where business logic lives, testable with plain PHPUnit, no Laravel test case needed.

## Laravel's bet on agentic AI is one more point in its favour

Laravel's first-party AI tooling isn't a side experiment — it's three distinct packages solving three distinct problems, and [Laravel itself frames it that way](https://laravel.com/blog/announcing-laravel-boost): the [AI SDK](https://laravel.com/blog/introducing-the-laravel-ai-sdk) helps you _build_ AI features into your app, Boost helps AI coding agents _write_ better Laravel code, and Laravel MCP helps _external_ AI tools interact with your app.

[Laravel Boost](https://laravel.com/blog/announcing-laravel-boost) is a Laravel-aware MCP server you run as a dev dependency. It gives coding agents like Claude Code tools to run Tinker, query your database, inspect your schema and pull version-specific documentation, so generated code follows your actual project conventions instead of whatever the model's training data assumed Laravel looked like.

The [AI SDK](https://laravel.com/blog/introducing-the-laravel-ai-sdk) is a different concern entirely: a unified API for building AI _features_ into your application — OpenAI, Anthropic, Gemini and others behind one interface, with agents, tools and structured output as first-class citizens.

None of this makes Laravel win on its own. But going into 2027, when every framework is scrambling to bolt on AI tooling as an afterthought, having this maintained as first-party, coherent packages rather than a pile of community wrappers is one more reason it stays my default.

## Conclusion

Laravel is not perfect. Its documentation sometimes lags behind features. The facade pattern can make IDE support frustrating without [Larastan](https://github.com/larastan/larastan) or [Laravel Idea](https://laravel-idea.com/). And if you're building something that genuinely needs extreme performance under tight constraints, a more rigid framework might serve you better — I'm genuinely curious to hear from anyone in that situation.

But for the vast majority of web applications — SaaS products, APIs, content platforms, internal tools — Laravel remains the most productive, most maintainable, most _joyful_ framework I've used across 15 years and four frameworks. And joy, in my experience, produces better software.

That's why I still choose it in 2026. Probably in 2027 too.
