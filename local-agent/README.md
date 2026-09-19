# World Arch Local Agent

This local-only service gives approved AI workflows a narrow bridge to the World Arch Journal workspace.

## Security defaults

- Binds only to `127.0.0.1:47832`.
- Requires `LOCAL_AGENT_TOKEN` for every protected operation.
- Restricts paths to this website workspace.
- Disables delete and arbitrary commands.
- Requires `ownerApproved: true` for writes and allow-listed tasks.
- Writes a redacted local audit log to `local-agent/runtime/audit.jsonl`.

## Start

Secrets are stored in a Git-ignored local file whose NTFS permissions are restricted to the current Windows account.

Provision once: copy the scoped Composio API key, then run `local-agent/protect-secrets.ps1`. Start with `npm run local-agent:start`.

`GET /v1/composio/connections` provides an authenticated, read-only connection inventory. Composio tool execution remains disabled until explicit allow-listed actions are approved.

The current allow-listed tasks are `site_build` and `site_smoke`.
