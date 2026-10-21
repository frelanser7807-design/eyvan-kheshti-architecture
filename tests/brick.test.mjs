import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {brickFinishes,brickScenes,brickPath} from '../src/data/brick.js';
import {collectionRoute} from '../src/data/materialCollections.js';
test('brick routes, five finishes and three scenes are complete',()=>{
 assert.equal(brickFinishes.length,5);assert.equal(brickScenes.length,3);
 assert(collectionRoute('/materials/category/brick/brickwork/').products.some(p=>p.path===brickPath));
 for(const scene of brickScenes) assert(fs.statSync(`public/assets/material-studio/brick/scenes/${scene.id}.png`).size>100000);
});
test('every brick map is real 4K, height is 16-bit, and hashes match',()=>{
 const root='public/assets/material-studio/brick/';
 for(const f of brickFinishes){
  const m=JSON.parse(fs.readFileSync(root+f.id+'/manifest.json'));
  assert.equal(Object.keys(m.sha256).length,4);
  for(const [name,sha] of Object.entries(m.sha256)){
   const data=fs.readFileSync(root+(name.startsWith('basecolor')?f.id:'shared')+'/'+name);
   assert.equal(data.readUInt32BE(16),4096);assert.equal(data.readUInt32BE(20),4096);
   if(name.includes('height'))assert.equal(data[24],16);
   assert.equal(crypto.createHash('sha256').update(data).digest('hex'),sha);
   assert(data.length<25*1024*1024);
  }
  for(const n of ['preview.webp','display.webp'])assert(fs.statSync(root+f.id+'/'+n).size>0);
 }
});
test('brick has crawlable HTML, canonical, sitemap and disclosure',()=>{
 const dir=process.env.MATERIAL_TEST_DIST || 'dist';
 const html=fs.readFileSync(dir+brickPath+'index.html','utf8');
 assert(html.includes('href="https://worldarchjournal.com'+brickPath+'"'));
 assert(html.includes('Five color studies'));assert(html.includes('not photographs of built projects'));
 assert(fs.readFileSync(dir+'/sitemap.xml','utf8').includes(brickPath));
});
