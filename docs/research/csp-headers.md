# Faisabilité de la CSP stricte et en-têtes de sécurité sur Pages (issue #11)

Vérifié le 2026-09-19 sur la spécification CSP3 (w3.org), MDN, la documentation Alpine.js, la documentation Astro et la documentation GitHub Pages.

## Réponse courte

Une CSP stricte en `<meta>` est tenable, à trois conditions : utiliser le build CSP d'Alpine (`@alpinejs/csp`), hasher les scripts et styles inline (Astro le fait), et accepter de perdre `frame-ancestors`, `report-uri`/`report-to` et `sandbox`. Les en-têtes HTTP (HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy) ne sont pas posables depuis `<meta>` ; la doc GitHub Pages consultée n'offre aucun moyen de les configurer (voir « Points non confirmés »).

## Faits sourcés

### Limites de `<meta>`
- CSP3 §3.3 : « The Content-Security-Policy-Report-Only header is not supported inside a meta element. Neither are the report-uri, frame-ancestors, and sandbox directives. » (https://www.w3.org/TR/CSP3/)
- CSP3 §3.3 : les politiques en `<meta>` ne s'appliquent pas au contenu qui les précède. Le `<meta>` doit donc être le premier élément utile du `<head>`, avant tout script/style/lien.
- MDN : le mode report-only est impossible en `<meta>` ; `report-to` figure aussi parmi les directives non prises en charge en `<meta>` (extrait de la page MDN, à confirmer dans le tableau de compatibilité). (https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy)

### Alpine.js
- Le build standard évalue les expressions des attributs avec `Function`, ce qui exige `unsafe-eval`. Le build `@alpinejs/csp` évite cela. (https://alpinejs.dev/advanced/csp)
- Restrictions du build CSP : pas de fonctions fléchées, déstructuration, template literals, spread, ni affectation directe de propriété (`user.name = 'x'`), ni accès aux globales (`console`, `document`, `window`, `Math`, `JSON`), ni `x-html`. Solution documentée : `Alpine.data()` pour la logique.
- Installation npm : `npm install @alpinejs/csp`. L'intégration `@astrojs/alpinejs` dépend de `alpinejs` (voir docs/research/stack-versions.md) : à vérifier qu'elle permet de substituer le build CSP (non vérifié ici).

### Hashes et directives
- MDN : hash de la forme `'sha256-…'` (sha256, sha384 ou sha512). Politique stricte par hash : `script-src 'sha256-…'; object-src 'none'; base-uri 'none'`. Tout changement du script impose de recalculer le hash. (https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP)
- MDN : avec `style-src`/`default-src`, les `<style>` et attributs `style` inline sont bloqués ; `'unsafe-hashes'` permet de hasher les attributs `style` et handlers inline. `style-src-attr` cible les attributs `style`.
- Astro : `security.csp` est stable, ajoute un `<meta http-equiv="content-security-policy">` dans chaque page, émet automatiquement les hashes des scripts et styles traités, avec `algorithm` (SHA-256 par défaut), `directives`, `scriptDirective` (dont `strictDynamic`) et `styleDirective`. (https://docs.astro.build/en/reference/configuration-reference/)

## Politique concrète proposée (à valider par test)

```
default-src 'none';
script-src 'self' 'sha256-<script thème>';   (hashes ajoutés par Astro)
style-src 'self' 'sha256-<styles inline>';
img-src 'self' data:;
font-src 'self';
connect-src 'self';
manifest-src 'self';
form-action 'self';
base-uri 'none';
object-src 'none'
```

- Script de thème inline (décision #8) : son hash est ajouté à `script-src`. Comme Astro hashe les scripts inline qu'il traite, vérifier que le script du `<head>` passe bien par ce mécanisme, sinon injecter le hash calculé au build via `scriptDirective.hashes`.
- Alpine : build CSP obligatoire, pas de `unsafe-eval`. Les expressions des templates doivent respecter les restrictions ci-dessus.
- Tests Playwright (décision #10) : « aucune violation CSP en console » reste applicable, car les violations d'une CSP `<meta>` sont bien signalées dans la console. Ajouter un test vérifiant que le `<meta>` est le premier élément du `<head>` et qu'aucun `unsafe-eval` / `unsafe-inline` n'y figure. Le report-only étant impossible en `<meta>`, les tests sont le seul garde-fou avant mise en production.
- Perdus : `frame-ancestors` (anti-clickjacking) et le reporting. Repli partiel possible : aucun équivalent fiable côté HTML (un frame-buster JS serait bloqué/fragile ; à ne pas adopter sans décision).

## En-têtes de sécurité

| En-tête | En `<meta>` | Sur GitHub Pages |
|---|---|---|
| CSP (sauf directives listées) | oui | via `<meta>` |
| `frame-ancestors`, `report-uri`, `report-to`, `sandbox` | non (CSP3 §3.3) | impossible sans en-tête |
| Referrer-Policy | oui, via `<meta name="referrer">` (spécification HTML, non re-vérifiée ici) | via `<meta>` |
| HSTS | non | aucune option documentée ; la doc ne mentionne que « Enforce HTTPS » (redirection HTTP vers HTTPS) |
| X-Content-Type-Options, Permissions-Policy | non | aucun réglage documenté |

Source GitHub Pages : https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https (mentionne l'option « Enforce HTTPS », pas de HSTS, pas d'en-têtes personnalisés).

## Points non confirmés

- Aucune page de la doc GitHub Pages consultée (HTTPS, limites) ne dit explicitement que les en-têtes personnalisés sont impossibles ; c'est l'absence de toute mention, pas une déclaration. À confirmer si la décision en dépend.
- Comportement HSTS effectif de `*.github.io` / domaine personnalisé : non mesuré (un `curl -I` sur le site déployé le trancherait).
- Compatibilité de `@astrojs/alpinejs` avec `@alpinejs/csp`.
- Le support de `report-to` en `<meta>` est issu d'un résumé de la page MDN ; seule la spec CSP3 est citée textuellement pour `report-uri`, `frame-ancestors`, `sandbox`.

## Options si les en-têtes deviennent nécessaires

Placer un CDN/proxy (ex. Cloudflare) devant Pages, ou migrer l'hébergement vers un hébergeur permettant un fichier `_headers`. Hors périmètre ; à trancher par le propriétaire.
