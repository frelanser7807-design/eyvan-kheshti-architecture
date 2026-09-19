import { createServer } from 'node:http';
import { timingSafeEqual } from 'node:crypto';
import { appendFile, mkdir, readFile, readdir, realpath, stat, writeFile } from 'node:fs/promises';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { listConnectedAccounts } from './composio.mjs';
import aiCommandCenter from '../netlify/functions/ai-command-center.mjs';
import composioCommand from '../netlify/functions/composio-command.mjs';
import controlInbox from '../netlify/functions/control-inbox.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const config = JSON.parse(await readFile(join(here, 'config.json'), 'utf8'));
const root = await realpath(resolve(here, config.workspaceRoot));
const runtimeDir = join(here, 'runtime');
const token = process.env.LOCAL_AGENT_TOKEN || '';
if (token.length < 24) throw new Error('LOCAL_AGENT_TOKEN must contain at least 24 characters.');

const taskMap = {
  site_build: ['npm.cmd', ['run', 'build']],
  site_smoke: ['npm.cmd', ['run', 'smoke']],
};

function json(status, body) {
  return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });
}

function isAuthorized(request) {
  const supplied = String(request.headers.get('authorization') || '').replace(/^Bearer\s+/i, '');
  const a = Buffer.from(supplied);
  const b = Buffer.from(token);
  return a.length === b.length && a.length > 0 && timingSafeEqual(a, b);
}

function resolveInside(input = '.') {
  const candidate = resolve(root, String(input));
  if (candidate !== root && !candidate.startsWith(`${root}${sep}`)) throw new Error('Path is outside the approved workspace.');
  return candidate;
}

async function audit(action, details = {}) {
  await mkdir(runtimeDir, { recursive: true });
  await appendFile(join(runtimeDir, 'audit.jsonl'), `${JSON.stringify({ at: new Date().toISOString(), action, ...details })}\n`, 'utf8');
}

async function bodyOf(request) {
  const text = await request.text();
  if (text.length > config.maxFileBytes * 1.5) throw new Error('Request is too large.');
  return text ? JSON.parse(text) : {};
}

async function runTask(name) {
  if (!config.allowedTasks.includes(name) || !taskMap[name]) throw new Error('Task is not allow-listed.');
  const [command, args] = taskMap[name];
  return await new Promise((resolvePromise, reject) => {
    const child = spawn(command, args, { cwd: root, windowsHide: true, shell: false });
    let output = '';
    const capture = (chunk) => { output = `${output}${chunk}`.slice(-24000); };
    child.stdout.on('data', capture);
    child.stderr.on('data', capture);
    const timer = setTimeout(() => { child.kill(); reject(new Error('Task timed out.')); }, 180000);
    child.on('error', reject);
    child.on('close', (code) => { clearTimeout(timer); resolvePromise({ code, output }); });
  });
}

export async function handle(request) {
  const url = new URL(request.url);
  if (url.pathname === '/health' && request.method === 'GET') return json(200, { status: 'ok', service: 'world-arch-local-agent', root: relative(dirname(root), root), deleteAllowed: false, arbitraryCommands: false });
  if (!isAuthorized(request)) return json(401, { error: 'Unauthorized.' });
  if (url.pathname === '/api/ai-command-center') return aiCommandCenter(request);
  if (url.pathname === '/api/composio-command') return composioCommand(request);
  if (url.pathname === '/api/control-inbox') return controlInbox(request);
  try {
    const body = await bodyOf(request);
    if (url.pathname === '/v1/files/list' && request.method === 'POST') {
      const target = resolveInside(body.path || '.');
      const entries = await readdir(target, { withFileTypes: true });
      const items = entries.slice(0, 250).map((entry) => ({ name: entry.name, type: entry.isDirectory() ? 'directory' : 'file' }));
      await audit('files.list', { path: relative(root, target), count: items.length });
      return json(200, { items });
    }
    if (url.pathname === '/v1/files/read' && request.method === 'POST') {
      const target = resolveInside(body.path);
      const info = await stat(target);
      if (!info.isFile() || info.size > config.maxFileBytes) throw new Error('File is unavailable or too large.');
      const content = await readFile(target, 'utf8');
      await audit('files.read', { path: relative(root, target), bytes: info.size });
      return json(200, { path: relative(root, target), content });
    }
    if (url.pathname === '/v1/files/write' && request.method === 'POST') {
      const target = resolveInside(body.path);
      const content = String(body.content ?? '');
      if (!body.ownerApproved) throw new Error('Owner approval is required for writing.');
      if (Buffer.byteLength(content) > config.maxFileBytes) throw new Error('File is too large.');
      await mkdir(dirname(target), { recursive: true });
      await writeFile(target, content, 'utf8');
      await audit('files.write', { path: relative(root, target), bytes: Buffer.byteLength(content) });
      return json(200, { written: true, path: relative(root, target) });
    }
    if (url.pathname === '/v1/tasks/run' && request.method === 'POST') {
      if (!body.ownerApproved) throw new Error('Owner approval is required for running a task.');
      const result = await runTask(String(body.task || ''));
      await audit('task.run', { task: body.task, exitCode: result.code });
      return json(result.code === 0 ? 200 : 500, result);
    }
    if (url.pathname === '/v1/composio/connections' && request.method === 'GET') {
      const result = await listConnectedAccounts(config.composio);
      await audit('composio.connections.list', { count: result.total });
      return json(200, result);
    }
    return json(404, { error: 'Unknown route.' });
  } catch (error) {
    await audit('request.failed', { route: url.pathname, message: error instanceof Error ? error.message : 'Unknown error' });
    return json(400, { error: error instanceof Error ? error.message : 'Invalid request.' });
  }
}

export function startServer() {
  const server = createServer(async (req, res) => {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const request = new Request(`http://${config.host}:${config.port}${req.url}`, { method: req.method, headers: req.headers, body: ['GET', 'HEAD'].includes(req.method) ? undefined : Buffer.concat(chunks) });
    const response = await handle(request);
    res.writeHead(response.status, Object.fromEntries(response.headers));
    res.end(Buffer.from(await response.arrayBuffer()));
  });
  server.listen(config.port, config.host, () => console.log(`World Arch Local Agent listening on http://${config.host}:${config.port}`));
  return server;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) startServer();
