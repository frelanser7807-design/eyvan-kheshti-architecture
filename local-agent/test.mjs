import { readFile, rm } from 'node:fs/promises';
import { join } from 'node:path';

process.env.LOCAL_AGENT_TOKEN = 'test-only-token-123456789012345';
const { handle } = await import('./server.mjs');
const token = process.env.LOCAL_AGENT_TOKEN;
const headers = { authorization: `Bearer ${token}`, 'content-type': 'application/json' };
const call = (path, body, method = 'POST') => handle(new Request(`http://127.0.0.1:47832${path}`, { method, headers: method === 'GET' ? {} : headers, body: method === 'GET' ? undefined : JSON.stringify(body) }));

const health = await call('/health', null, 'GET');
if (health.status !== 200) throw new Error('Health check failed.');
const denied = await handle(new Request('http://127.0.0.1:47832/v1/files/list', { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{}' }));
if (denied.status !== 401) throw new Error('Authentication gate failed.');
const escaped = await call('/v1/files/read', { path: '..\\outside.txt' });
if (escaped.status !== 400) throw new Error('Path boundary failed.');
const testPath = 'local-agent/runtime/operation-test.txt';
const written = await call('/v1/files/write', { path: testPath, content: 'local-agent-ok', ownerApproved: true });
if (written.status !== 200) throw new Error('Write test failed.');
const read = await call('/v1/files/read', { path: testPath });
const payload = await read.json();
if (payload.content !== 'local-agent-ok') throw new Error('Readback failed.');
const localPath = join(new URL('..', import.meta.url).pathname.replace(/^\/(.:)/, '$1'), 'local-agent/runtime/operation-test.txt');
if ((await readFile(localPath, 'utf8')) !== 'local-agent-ok') throw new Error('Disk verification failed.');
await rm(localPath, { force: true });
console.log('Local agent tests passed: health, auth, path boundary, approved write and readback.');
