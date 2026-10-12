# World Arch Journal daily newsletter routine

## Approval and scope

On 29 September 2026 the user approved automatic updates of the separate news newsletter. Publish at most one new English-language dated edition per Tehran calendar day, after all release gates pass. Keep the thematic magazine, its existing issues, original articles and analysis archive separate and unchanged. This approval does not authorize subscriber email campaigns, social posting, advertising changes, purchases, credentials changes, or content deletion.

Use the Codex thread heartbeat, daily at 09:00 Asia/Tehran. The desktop app and host computer must be running. Read this file and the current site state before each run. Never assume that a previous deployment is still current.

## Input and duplicate prevention

- Repo: C:/Users/irana/Documents/Codex/2026-09-02/new-chat-2/outputs/architecture-cinematic-site.
- Content: src/data/newsletters.js; published newsletterIssues is separate from editorialArticles, src/data/articles.js and src/data/magazines.js.
- Public archive: https://worldarchjournal.com/newsletter/; RSS: /newsletter/feed.xml; sitemap: /sitemap.xml.
- Ledger: newsletter-daily-ledger.json. Check BOTH the live sitemap/archive and ledger before writing. Use key waj-newsletter:YYYY-MM-DD:Asia-Tehran. If an edition is already live for today, reconcile the ledger and stop without republishing.
- Baseline pilot: /newsletter/architecture-briefing-2026-09-29/, verified live on 29 September. See newsletter-dated-publication-20260929.md for the successful preview/production evidence and recovery lessons.
- Public source URLs used in previous editions must be compared before selection. Reuse a topic only for a genuinely new, independently verified development; do not recycle old headlines or change old publication dates.

## Editorial gate

Browse current source pages on every run. Select 3 to 5 significant international architecture stories, normally published in the last 24 to 48 hours and never more than 72 hours old at publication. Verify actual publication dates, distinguish event dates, reject future-dated or inaccessible evidence. Prefer official institutions, architects and project announcements; corroborate with respected reporting such as Architectural Record, ArchDaily, Dezeen, Archinect or Designboom. Require at least three distinct source domains. Attribute a direct source beside each item, plus a source list.

Write original English summaries and an explicitly labelled Our reading: editorial paragraph for every story. Do not reproduce publisher articles, fabricate facts, imply on-site reporting, or promise technical performance or Google AdSense approval. Add an editorial synthesis, author/contact, reading time and links to relevant existing original articles or analysis. Follow /editorial-policy/ and retain corrections history.

Provide at least one rights-cleared photograph with creator, source URL, license and accurate contextual date, or an original clearly labelled diagram. Never use an arbitrary publisher photo without permission. Label historic reference photos honestly. Include meaningful alt text, title, description, canonical URL and valid structured data. No undisclosed sponsored content.

If fewer than three adequately sourced fresh stories pass this gate, preserve the current publication and record a skipped run. Do not manufacture a new edition just to meet a schedule.

## Draft and release gate

Preserve dirty unrelated user changes. Add a NEW immutable date slug and prepend it to newsletterIssues; retain all previous editions. Keep old article and magazine URLs and legacy redirects. Ensure latest-issue/default archive image metadata points to the newest edition rather than an old hard-coded dailyBriefing. Update date-specific tests to validate the new edition generically, without weakening source or rights checks.

For publication timestamps, use a real current timestamp close to submission; confirm the first successful public deployment time and correct feedPublishedAt only if necessary. Never invent a future publication time.

Run from the repo:

1. npm run build (fresh Vite output, then static generation and newsletter worker).
2. node --test tests/newsletter-publication.test.mjs tests/newsletter.test.mjs.
3. npm run smoke.
4. Local desktop/mobile browser checks using scripts/qa-dated-briefing.cjs. QA_ISSUE_SLUG can select the newly drafted issue; QA_SITE_URL selects a verified preview or production URL. Confirm heading/canonical/source dates, licensed images, no page errors or horizontal overflow.

Do NOT rerun generate-static-pages over an already generated dist. Build fresh. Do NOT publish a partial/failed build. Check archived editions, articles, magazine, legal/editorial pages, existing MP4 assets and newsletter API remain intact. Testing must not send a production email or create a real subscriber.

## Approved publication route

Existing connected Cloudflare MCP via Composio: alias world-arch-cloudflare. Account ae4148eebed330a40d70eff241afef2e; Pages project world-arch-journal; production branch main. Discover exact current tools and schemas first, prefer CLOUDFLARE_MCP_SEARCH / CLOUDFLARE_MCP_EXECUTE; do not substitute an unconnected generic toolkit or attempt new OAuth/token flows unattended.

Read the project canonical deployment at the start, save its ID and verify its public health. The pilot healthy ID fe96b93e-9cc5-4523-9d7d-7d3b003cfb2c is historical evidence, NOT a permanent rollback target. Check for a newer external deployment immediately before production; stop for review if the baseline changed unexpectedly.

The user previously approved temporary Composio processing of prepared PUBLIC site assets and worker files only. Never upload .env, API keys or secret configuration. Keep upload JWTs only in memory and never print them. Missing platform permission or expired connection is a stop condition, not authorization to bypass controls.

scripts/cloudflare-pages-upload.mjs generates the exact manifest with --manifest-only; its --force-text mode documents the recovery requirement. Upload actual bytes of ALL compiled public text files plus new image/media files before registering hashes. A check-missing response or upsert-hashes alone is NOT proof of asset presence.

Use the exact supported Pages upload-token, assets/upload, assets/upsert-hashes and deployment endpoints discovered in the Cloudflare spec. Upload asset values as base64 with correct metadata; preserve hashes and byte content. Deployment multipart includes manifest, branch, commit_dirty and message, plus special _worker.js (application/javascript+module), _routes.json, _redirects and _headers if present. These special files are not ordinary asset-manifest entries. Retain Pages Functions and runtime secrets unchanged.

First publish a preview on a dated codex/briefing branch. Confirm preview stage success, retrieve all compiled text assets to check HTTP status/content/hash, and run desktop/mobile QA there. Deploy the same frozen verified manifest and special files to main only after these checks pass.

Verify the actual worldarchjournal.com domain: new issue and archive, RSS/sitemap, source and image links, correct canonical/title/static HTML, legacy redirects, existing articles/magazine/media, and newsletter API GET returns its expected 405. Run desktop/mobile QA on the custom domain, not only pages.dev. Confirm the current canonical deployment matches this release.

If our selected deployment fails, restore the healthy START-OF-RUN baseline only when still safe (no intervening external deployment), using the supported Pages rollback endpoint. Verify recovery and report the failure. Never overwrite a newer user's release. Clean up only our verified temporary processing copies after successful publication; do not delete live assets.

## Evidence and completion

Save a dated publication record with selected stories, source dates/check times, image rights, tests, preview and production IDs, live URL checks and first successful publication time. Update the ledger to published only after public verification; failed/skipped states must not masquerade as published. If a retry finds the edition already live, reconcile rather than publish again. Keep credentials out of evidence files.

Send a short Persian completion with the new edition link only after verified publication. Stay quiet when unchanged, already published or safely skipped for insufficient fresh news. Notify on connection failure, failed release/recovery or required user action. Never generate ten-minute checking alerts or an unrelated monitoring schedule.
