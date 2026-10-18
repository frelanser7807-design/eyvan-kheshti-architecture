import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { atlasVilla } from '../src/data/atlasVilla.js';
import { watchVideoEntries, watchPagePath } from '../src/data/watchVideos.js';

// Exercise the metadata effect against a small document adapter, including its
// replacement of the server's existing JSON-LD after client navigation.
const source = (await readFile(new URL('../src/components/SiteSeo.jsx', import.meta.url), 'utf8'))
  .replace(/^import .*;\s*$/gm, '')
  .replaceAll('import.meta.env', '{}')
  .replace('export default function SiteSeo', 'function SiteSeo');
for (const [name, pathname, expected] of [
  ['design-services', '/services/', 'Service'],
  ['custom-plan-design', '/contact/', 'ContactPage'],
  ['atlas-villa', '/projects/atlas-villa/', 'CreativeWork'],
]) {
  test(`${pathname} preserves route-specific schema after JavaScript runs`, () => {
    const nodes = [];
    const existingSchema = { dataset: {}, textContent: '{"@type":"WebPage"}', removeAttribute() {} };
    const document = {
      head: {
        querySelector: (selector) => selector.startsWith('script[') ? existingSchema : null,
        querySelectorAll: () => [],
        appendChild: (node) => nodes.push(node),
      },
      createElement: (tag) => ({ tag, dataset: {}, setAttribute(key, value) { this[key] = value; } }),
    };
    const context = { document, window: { location: { pathname, hostname: 'worldarchjournal.com' } },
      URL, useEffect: (callback) => callback(), assetUrl: (value) => value,
      atlasVilla, watchVideoEntries, watchPagePath,
      publishedMagazineArticles: [], promptItems: [], newsletterIssues: [], editorialArticles: [], projects: [], publishedVideoStories: [] };
    vm.createContext(context);
    vm.runInContext(`${source}\nSiteSeo({content:{brand:{name:'WORLD ARCH JOURNAL'}},route:{name:${JSON.stringify(name)}}});`, context);
    const schema = JSON.parse(existingSchema.textContent);
    assert.equal(schema['@type'], expected);
    assert.equal(schema.url, `https://worldarchjournal.com${pathname}`);
    assert.ok(schema.name && document.title.includes(schema.name));
    assert.equal(nodes.find((node) => node.rel === 'canonical').href, schema.url);
    assert.match(nodes.find((node) => node.name === 'robots').content, /^index, follow/);
  });
}
