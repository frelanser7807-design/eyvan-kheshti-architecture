---
type: index
created: 2026-09-14
updated: 2026-09-14
status: active
---

# Credential Index — No Secrets Stored Here

Actual passwords are kept only in **Google Password Manager** under the owner's Google account. This note is a locator, not a password file.

| Service | Where to retrieve credentials | Normal AI access path |
|---|---|---|
| Instagram | Google Password Manager entry for `instagram.com` | Composio OAuth |
| Facebook / Meta | Google Password Manager if a saved entry exists | Composio OAuth |
| YouTube / Google | Google Account sign-in and Password Manager | Composio OAuth |
| Pinterest | Google Password Manager if saved | Composio OAuth |
| LinkedIn | Google Password Manager if saved | Composio OAuth |
| WhatsApp Business | Phone/Meta ownership flow; never store OTP | Composio OAuth |
| GitHub | Google Password Manager entry for GitHub if saved | Composio OAuth |
| Netlify | Google Password Manager if saved | Composio OAuth |
| Google Drive | Google Account sign-in | Composio OAuth |

AI clients must not request or retrieve these passwords. Connect each AI by adding the Composio MCP endpoint and putting the consumer key only in that client's protected secret/environment field.
