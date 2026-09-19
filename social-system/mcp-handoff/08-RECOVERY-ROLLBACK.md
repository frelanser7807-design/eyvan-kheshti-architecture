# Recovery and Rollback

If an AI client or connection should lose access:

1. Disable or remove that AI client's Composio MCP configuration.
2. Revoke the affected OAuth connection in Composio or the provider's connected-app settings.
3. Rotate the Composio consumer key if it may have been exposed.
4. Review recent provider activity and Composio logs.
5. Reconnect only the required account with minimum permissions.

Removing an MCP client does not delete social accounts or website content. Never place recovery codes, passwords, tokens, cookies, or consumer keys in this folder.
