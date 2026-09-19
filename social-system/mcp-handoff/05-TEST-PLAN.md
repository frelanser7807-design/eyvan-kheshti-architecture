# Test Plan

For every connected service:

1. Confirm the Composio connection reports `ACTIVE`.
2. Run a read-only identity/profile request.
3. Confirm the returned account is the intended WORLD ARCH account.
4. Prepare one private draft or dry-run payload where the platform supports it.
5. Request explicit owner approval before the first public write.
6. Verify the resulting public URL and record a redacted outcome.

Never use a public post or customer message merely as a connectivity test.
