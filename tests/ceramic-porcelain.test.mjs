import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {ceramicFinishes,ceramicScenes,ceramicPath} from '../src/data/ceramicPorcelain.js';
import {collectionProducts,collectionRoute} from '../src/data/materialCollections.js';
test('porcelain stoneware has its own ceramic product route, five finishes and three room studies',()=>{
 assert.equal(ceramicFinishes.length,5);assert.equal(ceramicScenes.length,3);
 assert.deepEqual(ceramicScenes.map(s=>s.id),['kitchen','bathroom','living']);
 assert(collectionRoute('/materials/category/stone/ceramic-porcelain/').products.some(p=>p.path===ceramicPath));
 assert(collectionProducts.some(p=>p.id==='travertine'));
});
test('all downloadable porcelain maps are true 4K and match their checksums',()=>{
 const root='public/assets/material-studio/ceramic-porcelain/';
 for(const f of ceramicFinishes){
  const m=JSON.parse(fs.readFileSync(root+f.id+'/manifest.json'));
  for(const [name,sha] of Object.entries(m.sha256)){
   const data=fs.readFileSync(root+(name.startsWith('basecolor')?f.id:'shared')+'/'+name);
   assert.equal(data.readUInt32BE(16),4096);assert.equal(data.readUInt32BE(20),4096);
   assert.equal(crypto.createHash('sha256').update(data).digest('hex'),sha);
   assert(data.length<25*1024*1024);
  }
 }
 for(const s of ceramicScenes)assert(fs.existsSync(root+'scenes/'+s.id+'.png'));
});
test('ceramic product has generated canonical SEO and does not advertise 16K',()=>{
 const html=fs.readFileSync((process.env.MATERIAL_TEST_DIST || 'tmp/material-library-validation-20261019')+ceramicPath+'index.html','utf8');
 assert(html.includes('href="https://worldarchjournal.com'+ceramicPath+'"'));
 assert(html.includes('Five finish studies'));assert(html.includes('16K maps are not included'));
});
