import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const read = (file) => readFile(resolve(root, file), 'utf8');
const config = JSON.parse(await read('config/agent-manager.config.json'));
const schema = JSON.parse(await read('schemas/content-job.schema.json'));
const sample = JSON.parse(await read('examples/content-job.sample.json'));
const composio = await read('config/composio-session.template.jsonc');
const makePlan = await read('make/eyvan-content-draft-v1.md');
const skill = await read('skills/article-publishing-v1.md');

if (config.mode !== 'draft_only') throw new Error('Publishing must remain approval-gated.');
if (config.connections.composio.enabled !== false) throw new Error('Live Composio must remain disabled before owner connection.');
if (config.connections.composio.allowedToolkits.join(',') !== 'googledrive,github') throw new Error('Unexpected initial Composio toolkit scope.');
if (!composio.includes('GOOGLEDRIVE_FETCH') || !composio.includes('GITHUB_CREATE_PULL_REQUEST')) throw new Error('Minimal Composio tools are incomplete.');
if (composio.includes('DELETE_REPOSITORY') || composio.includes('GITHUB_DELETE')) throw new Error('Destructive GitHub tool detected.');
for (const required of schema.required) if (!(required in sample)) throw new Error(`Sample job missing ${required}`);
if (sample.status !== 'ready' || !sample.languages.includes('en') || !sample.languages.includes('fa')) throw new Error('Sample must begin as bilingual ready job.');
if (!makePlan.includes('status=ready') || !makePlan.includes('needs_review') || !makePlan.includes('paused')) throw new Error('Make failure/review states are incomplete.');
if (!skill.includes('approved') || !skill.includes('Pull Request')) throw new Error('Publisher approval boundary missing.');

console.log('Agent foundation validated: draft-only mode, bilingual job contract, minimal Composio scope, Make review path, and human publication gate are ready.');
