import { rollup } from 'rollup';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';

const dist = path.resolve(process.env.DIST_DIR || 'dist');

const bundle = await rollup({ input: 'functions/newsletter-worker.js' });
await bundle.write({ file: path.join(dist, '_worker.js'), format: 'es' });
await bundle.close();

await writeFile(path.join(dist, '_routes.json'), JSON.stringify({
  version: 1,
  include: ['/*'],
  exclude: [],
}));

console.log('Bundled newsletter routes for Cloudflare Pages Direct Upload.');
