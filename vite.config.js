import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { articleClientBundle } from './scripts/lib/article-client-bundle.mjs';
import { newsletterClientBundle } from './scripts/lib/newsletter-client-bundle.mjs';
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

// Preload the two faces used above the fold on every page (body text and
// display headlines) so the first paint swaps to them immediately; all faces
// already use font-display: swap via @fontsource.
function fontPreloads() {
  const wanted = [/^inter-latin-400-normal-.*\.woff2$/, /^cormorant-garamond-latin-500-normal-.*\.woff2$/];
  let tags = '';
  return {
    name: 'font-preloads',
    generateBundle(_options, bundle) {
      tags = Object.keys(bundle)
        .filter((name) => wanted.some((pattern) => pattern.test(name.split('/').pop())))
        .map((name) => `<link rel="preload" as="font" type="font/woff2" crossorigin href="/${name}">`)
        .join('');
    },
    transformIndexHtml(html) {
      return tags ? html.replace('</head>', `${tags}</head>`) : html;
    },
  };
}

export default defineConfig({
  // Resolve from the real project path so builds also work when this checkout
  // is accessed through the active-site junction used by Codex.
  root: here,
  plugins: [react(), articleClientBundle(), newsletterClientBundle(), fontPreloads()],
  base: process.env.VITE_PUBLIC_BASE || '/',
  build: {
    manifest: true,
    rollupOptions: {
      output: {
        // Keep React in a vendor chunk so editorial/data changes do not bust
        // the framework cache for returning visitors on every deploy.
        manualChunks: (id) => (id.includes('node_modules/react-dom') || id.includes('node_modules/react/') || id.includes('node_modules/scheduler') ? 'vendor' : undefined),
      },
    },
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
