import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { collectionCategories, collectionProducts, collectionRoute, categoryPath, typePath } from '../src/data/materialCollections.js';
import { materialCollectionSitemap } from '../scripts/material-collection-pages.mjs';
import vm from 'node:vm';

test('client SEO executes on material routes without initialization errors',async()=>{
  const source=(await readFile(process.env.MATERIAL_SEO_SOURCE || 'src/components/SiteSeo.jsx','utf8')).replace(/^import .*;\s*$/gm,'').replaceAll('import.meta.env','{}').replace('export default function SiteSeo','function SiteSeo');
  for(const [pathname,route] of [
    [collectionProducts[0].path,{name:'material-studio'}],
    ['/material-studio/',{name:'material-studio'}],
    ['/materials/',{name:'material-library'}],
    ['/materials/category/wood/',collectionRoute('/materials/category/wood/')],
    ['/materials/category/plaster/',collectionRoute('/materials/category/plaster/')],
  ]){
    const nodes=[];
    const existingSchema={dataset:{},textContent:'{}',removeAttribute(){}};
    const document={head:{querySelector:s=>s.startsWith('script[')?existingSchema:null,querySelectorAll:()=>[],appendChild:n=>nodes.push(n)},createElement:tag=>({tag,dataset:{},setAttribute(k,v){this[k]=v;}})};
    const context={document,window:{location:{pathname,hostname:'worldarchjournal.com'}},URL,useEffect:f=>f(),assetUrl:v=>v,collectionProducts,categoryPath,typePath};
    vm.createContext(context);
    vm.runInContext(`${source}\nSiteSeo({content:{brand:{name:'WORLD ARCH JOURNAL'}},route:${JSON.stringify(route)}});`,context);
    const schema=JSON.parse(existingSchema.textContent);const main=schema['@graph']?.[0]||schema;
    assert.equal(main['@type'],route.name==='material-studio'?'CreativeWork':'CollectionPage');
    assert(document.title.includes('WORLD ARCH JOURNAL'));
    assert.equal(main.url,'https://worldarchjournal.com'+(route.name==='material-studio'?collectionProducts[0].path:pathname));
  }
});

test('category and type routes resolve without becoming project routes',()=>{
  for(const c of collectionCategories){
    assert.equal(collectionRoute(categoryPath(c.id)).category.id,c.id);
    for(const t of c.types)assert.equal(collectionRoute(typePath(c.id,t.id)).type.id,t.id);
  }
  assert.equal(collectionRoute('/materials/category/wood/missing/').name,'not-found');
  assert.equal(collectionRoute('/materials/category/missing/').name,'not-found');
  assert.equal(collectionRoute('/projects/'),null);
});
test('every original product belongs to a real category and type',async()=>{
  for(const p of collectionProducts){
    assert(collectionCategories.find(c=>c.id===p.category)?.types.some(t=>t.id===p.type));
    assert(!p.path.startsWith('/projects/'));
    await access(`public${p.image}`);await access(`public${p.scene}`);
  }
});
test('empty collections are not listed in sitemap',()=>{
  assert(!materialCollectionSitemap.some(p=>p.pathname===typePath('wood','thermally-modified-wood')));
  assert(materialCollectionSitemap.some(p=>p.pathname===collectionProducts[0].path));
});
test('generated SEO has canonical, title and honest empty states',async()=>{
  const root=process.env.MATERIAL_TEST_DIST || 'tmp/material-library-validation-20261019';
  for(const p of materialCollectionSitemap){
    const html=await readFile(`${root}${p.pathname}index.html`,'utf8');
    assert(html.includes(`rel="canonical" href="https://worldarchjournal.com${p.pathname}"`));
    assert(html.includes('application/ld+json'));
  }
  const empty=await readFile(`${root}${typePath('wood','thermally-modified-wood')}index.html`,'utf8');
  assert(empty.includes('noindex, follow'));assert(empty.includes('in preparation'));
  const alias=await readFile(`${root}/material-studio/index.html`,'utf8');
  assert(alias.includes(`rel="canonical" href="https://worldarchjournal.com${collectionProducts[0].path}"`));
});
test('4K PNG headers match promised dimensions for seven finishes',async()=>{
  for(const finish of ['natural-oak','light-oak','walnut','smoked-oak','grey-oak','charcoal','white']){
    for(const file of ['basecolor-4k.png','roughness-4k.png']){
      const data=await readFile(`public/assets/material-studio/fluted-wood/${finish}/${file}`);
      assert.equal(data.readUInt32BE(16),4096);assert.equal(data.readUInt32BE(20),4096);
    }
  }
});
