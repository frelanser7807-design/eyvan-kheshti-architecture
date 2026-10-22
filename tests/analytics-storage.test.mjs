import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

test('blocked browser storage preserves consent in memory without breaking tag setup', async () => {
  let source = await readFile('src/components/AnalyticsConsent.jsx', 'utf8');
  source = source.slice(0, source.indexOf('export default function AnalyticsConsent'))
    .replace(/^import .*;\s*$/gm, '').replaceAll('import.meta.env', '{}').replace('export function trackSiteEvent', 'function trackSiteEvent');
  const nodes = [], scripts = new Map();
  const window = { location: { search: '', pathname: '/' } };
  for (const key of ['localStorage', 'sessionStorage']) Object.defineProperty(window, key, { get() { throw new Error('Storage denied'); } });
  const context = { window, document: { getElementById: (id) => scripts.get(id), createElement: () => ({}), head: { appendChild(node) { nodes.push(node); scripts.set(node.id, node); } } }, URLSearchParams, Date };
  vm.createContext(context);
  vm.runInContext(source + '\nloadGoogleAnalytics();', context);
  assert.equal(nodes.length, 1);
  assert.ok(nodes[0].src.includes('G-KWCNH012H1'));
  vm.runInContext("stored('localStorage', CONSENT_KEY, 'granted'); updateGoogleConsent('granted'); trackSiteEvent('material_test'); loadGoogleAnalytics();", context);
  assert.equal(nodes.length, 1, 'tag must not be initialized twice');
  assert.ok(window.dataLayer.some((args) => args[0] === 'event' && args[1] === 'material_test'));
});


test('an article without optional tags cannot crash the homepage before analytics starts', async () => {
  const source = (await readFile('src/components/SiteSearch.jsx', 'utf8')).split('export default function SiteSearch')[0].replace(/^import .*;\s*$/gm, '');
  const context = { articles: [{ published:true, title:'A villa guide', excerpt:'Planning a home', category:'Architecture' }], magazines:[] };
  vm.createContext(context);
  const entries = vm.runInContext(source + '\ncontentEntries({});', context);
  assert.equal(entries.length, 1);
  assert.ok(entries[0].keywords.includes('A villa guide'));
});
