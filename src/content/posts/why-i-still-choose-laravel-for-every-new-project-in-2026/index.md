---
title: Why I still choose Laravel for every new project in 2026
description: "After 15 years across the PHP ecosystem, from CodeIgniter to Symfony, I keep choosing Laravel for new projects. Here's why, beyond habit."
publishedAt: 2026-03-10
aiAssisted: true
tags: ["laravel", "php", "architecture"]
---

I've shipped production code in Symfony, Slim, and even a bespoke framework that a startup I worked at decided to maintain for six years (never again). I know what the alternatives look like from the inside. Laravel keeps winning — here's why. ⤵️

## The pit of success

The best frameworks don't just make hard things possible. They make the right thing the easy thing. Laravel has a term for this in its documentation: the "pit of success." The default path is the secure, performant, maintainable path. You have to work to fall off it.

Take authentication. In a raw PHP project, you'll Google "PHP session login", copy something half-broken from Stack Overflow, and spend a week auditing it. In Symfony, you'll configure a security firewall with voters and authenticators that require three days of reading. In Laravel:

```bash
# Full auth scaffold in 30 seconds
composer require laravel/breeze
php artisan breeze:install
php artisan migrate
```

You get rate-limited login, password reset, email verification, "remember me" — all audited, all tested, all following OWASP guidelines. The _default_ is correct.

## Expressive without magic

Laravel's reputation for "magic" has always bothered me — not because it's wrong, but because it misses the point. Yes, there are facades. Yes, you can write `Cache::get('key')` without injecting anything. But it's _optional_ magic, layered on top of a perfectly normal IoC container you can use exactly like Symfony's.

Here's a real-world Eloquent query I wrote last week:

```php
$articles = Article::query()
    ->with(['author', 'tags'])
    ->whereHas('tags', fn($q) => $q->where('slug', $tag))
    ->published()   // local scope
    ->latest()
    ->paginate(15);
```

This is readable to a non-PHP developer. It expresses _intent_ — not implementation. Compare that to the equivalent Doctrine DQL, and tell me which codebase you'd rather maintain in five years.

> "A framework should make your intent legible to the next developer — including the future version of yourself at 11pm trying to fix a production bug."

## The ecosystem, honestly assessed

Let me be honest about the ecosystem, because it's both a strength and a risk:

- **Horizon** — queue monitoring that actually works and looks good. I've used it on systems processing 50k jobs/day without issues.
- **Telescope** — local development debugging that saves hours every week. Requests, queries, logs, mail — all in one place.
- **Octane** — if you need performance and are willing to think about application state carefully, it's transformative.
- **Livewire** — I'm cautiously optimistic. For the right use cases (CRUD-heavy internal tools), it's genuinely excellent.
- **Folio + Volt** — too new for me to recommend for large projects, but the direction is sound.

The risk? Vendor lock-in to the Taylor Otwell ecosystem. Laravel's quality depends on one very talented person and his team. Symfony's governance model is less exciting but more resilient. This is a real tradeoff worth naming

### On the "too magic" objection

I hear this mostly from developers who learned PHP through Symfony. My response: spend a week reading the source code of the Container, the Eloquent ORM, and the routing engine. There is no magic. There is clever use of PHP's reflection API, closures, and traits — all standard, all readable.

The architecture of a Laravel application is as clean as you make it. Use repositories, use DTOs, use Actions, apply Domain-Driven Design if your domain warrants it. Laravel doesn't stop you from any of this.

## How I structure a new project

After years of iteration, here's the directory structure I start every project with:

```text
app/
  Actions/          # Single-purpose classes, 1 method each
  Data/             # Spatie Laravel Data DTOs
  Http/
    Controllers/    # Thin, route-only
    Requests/       # Form request validation
  Models/
  Policies/
  Services/         # Domain services, injected
  Queries/          # Eloquent query objects
domain/             # Pure PHP, framework-free logic
```

The `domain/` directory is pure PHP — no Eloquent, no facades, no Laravel dependencies. This is where business logic lives. It's testable with plain PHPUnit, no Laravel test case needed.

## Conclusion

Laravel is not perfect. Its documentation sometimes lags behind features. The magic façade pattern can make IDE support frustrating without Larastan. And yes, if you're building something that needs extreme performance, Symfony's rigidity might serve you better.

But for the vast majority of web applications — SaaS products, APIs, content platforms, internal tools — Laravel is the most productive, most maintainable, most _joyful_ framework I've ever used. And joy, in my experience, produces better software.

That's why I still choose it in 2026. And probably in 2027.
