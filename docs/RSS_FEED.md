# Article RSS 2.0 feed

- Public endpoint: `https://worldarchjournal.com/rss.xml`
- Build integration: `scripts/generate-static-pages.mjs` writes RSS from `src/data/articles.js`, the same article collection used to generate the sitemap. All published articles are included; unpublished drafts are excluded.
- Each item contains its title, absolute canonical link, excerpt, stable permalink GUID and publication date formatted with an English weekday/month and GMT (`Date.toUTCString()`, RFC-822-compatible).
- Entries are newest first. No date or GUID is regenerated from the current build clock. Missing/invalid publication dates or duplicate URLs fail the build.
- Channel title, link, description and language follow the owner's exact requested values. The Atom self-link identifies the feed's canonical address.
- Discovery is present in the application HTML template and injected idempotently into every built HTML head, including copied Atlas, offline and 404 pages. The separate newsletter RSS link is preserved.
- `public/_headers` sets `Content-Type: application/rss+xml; charset=utf-8` and revalidation for `/rss.xml`. Preview and production deployment checks require a successful RSS response with the correct media type and RSS body.

## Publication date repair

The legacy `courtyard-wind-house-passive-cooling` entry lacked a publication date. Its date was backfilled as `2026-09-16`, based on its earliest preserved published source version, commit `f5b727b` dated 16 September 2026. This is the earliest retained publication record, not an assertion that no earlier copy existed. New RSS builds require explicit publication dates instead of inventing current dates.

## W3C validation before deployment

On 18 October 2026, the generated feed containing 27 items was submitted by direct input to the W3C Feed Validation Service at `https://validator.w3.org/feed/check.cgi` using its documented SOAP interface. The response reported `validity=true` and zero errors. Its only warning (`SelfDoesntMatchLocation`) reflects direct-input validation having no document URL while the feed correctly declares its production self URL. The raw response is preserved in `docs/validation/rss-w3c-predeploy.xml`.

The validated bytes exactly matched the build output. SHA-256: `24d66e15e065105108bbe25c5935f1443d17a8d7cd6bcf6ee0e1d1837dfed51a`.

After deployment, validate the public URL again to verify delivery and the self-link at its actual location. The five RSS regressions also check XML escaping, invalid metadata, stable dates/GUIDs, draft exclusion, complete sitemap coverage and discovery in every built HTML page.
