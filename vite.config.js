import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));

function localAgentToken() {
  try {
    const text = readFileSync(join(here, 'local-agent', 'runtime', 'secrets.env'), 'utf8');
    return text.match(/^LOCAL_AGENT_TOKEN=(.+)$/m)?.[1]?.trim() || '';
  } catch {
    return '';
  }
}

const token = localAgentToken();
const localApiProxy = {
  target: 'http://127.0.0.1:47832',
  changeOrigin: false,
  headers: token ? { authorization: `Bearer ${token}` } : {},
};

export default defineConfig({
  // Resolve from the real project path so builds also work when this checkout
  // is accessed through the active-site junction used by Codex.
  root: here,
  plugins: [react()],
  base: process.env.VITE_PUBLIC_BASE || '/',
  build: {
    manifest: true,
  },
  server: {
    host: '127.0.0.1',
    port: 4173,
    proxy: { '/api': localApiProxy },
  },
  preview: {
    host: '127.0.0.1',
    port: 4173,
    proxy: { '/api': localApiProxy },
  },
});
