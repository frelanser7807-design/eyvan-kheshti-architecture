import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {travertineFinishes,travertineScenes,travertinePath} from '../src/data/travertine.js';
import {collectionProducts,collectionRoute} from '../src/data/materialCollections.js';
test('travertine has its own stone product route and five finishes',()=>{
 assert.equal(travertineFinishes.length,5);assert.equal(travertineScenes.length,3);
 assert(collectionRoute('/materials/category/stone/natural-stone/').products.some(p=>p.path===travertinePath));
 assert(collectionProducts.some(p=>p.id==='fluted-wood'));
});
test('all downloadable stone maps are true 4K and match their checksums',()=>{
 const root='public/assets/material-studio/travertine/';
 for(const f of travertineFinishes){
  const m=JSON.parse(fs.readFileSync(root+f.id+'/manifest.json'));
  for(const [name,sha] of Object.entries(m.sha256)){
   const data=fs.readFileSync(root+(name.startsWith('basecolor')?f.id:'shared')+'/'+name);
   assert.equal(data.readUInt32BE(16),4096);assert.equal(data.readUInt32BE(20),4096);
   assert.equal(crypto.createHash('sha256').update(data).digest('hex'),sha);
   assert(data.length<25*1024*1024);
  }
 }
 for(const s of travertineScenes)assert(fs.existsSync(root+'scenes/'+s.id+'.png'));
});
test('stone product has generated canonical SEO and does not advertise 16K',()=>{
 const html=fs.readFileSync((process.env.MATERIAL_TEST_DIST || 'tmp/material-library-validation-20261019')+travertinePath+'index.html','utf8');
 assert(html.includes('href="https://worldarchjournal.com'+travertinePath+'"'));
 assert(html.includes('Five color studies'));assert(html.includes('16K maps are not included'));
});

