# Architecture Decision

Composio is the authorization hub. Each AI client connects to the same protected Composio MCP endpoint and receives only the permissions granted by the owner. The website repository and Google Drive hold content and operating documents, never account credentials.

Normal flow:

1. AI reads approved source material.
2. AI prepares a draft and media package.
3. Owner approves the destination and final content.
4. Composio executes the approved platform action.
5. The result URL and a redacted audit entry are saved.

OAuth may occasionally require reauthorization when a provider expires or revokes access.
