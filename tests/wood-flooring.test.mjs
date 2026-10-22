import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {woodFinishes,woodScenes,woodPath} from '../src/data/woodFlooring.js';
import {collectionProducts,collectionRoute} from '../src/data/materialCollections.js';

function jpegSize(buf){
 // walk JPEG markers to SOF0/SOF2 for dimensions
 let i=2;assert.equal(buf[0],0xff);assert.equal(buf[1],0xd8);
 while(i<buf.length){assert.equal(buf[i],0xff);const m=buf[i+1];
  if(m>=0xc0&&m<=0xc3){return [buf.readUInt16BE(i+7),buf.readUInt16BE(i+5)];}
  i+=2+buf.readUInt16BE(i+2);}
 throw new Error('no SOF');
}
function imageSize(buf){
 if(buf[0]===0x89&&buf[1]===0x50)return [buf.readUInt32BE(16),buf.readUInt32BE(20)];
 return jpegSize(buf);
}

test('scanned wood flooring has its own product route, five finishes and three room studies',()=>{
 assert.equal(woodFinishes.length,5);assert.equal(woodScenes.length,3);
 assert.deepEqual(woodScenes.map(s=>s.id),['living','bedroom','hallway']);
 assert(collectionRoute('/materials/category/wood/wood-flooring/').products.some(p=>p.path===woodPath));
 assert(collectionProducts.some(p=>p.id==='scanned-wood-flooring'));
});
test('every finish is a real CC0 scan whose maps match their checksums',()=>{
 const root='public/assets/material-studio/wood-flooring/';
 for(const f of woodFinishes){
  const m=JSON.parse(fs.readFileSync(root+f.id+'/manifest.json'));
  assert.equal(m.source.license.includes('CC0'),true);
  assert.equal(m.source.asset,f.source.asset);
  assert.equal(m.source.url,f.source.url);
  assert.deepEqual(m.resolution,[4096,4096]);
  assert.deepEqual(m.nativeResolution,[f.nativeRes,f.nativeRes]);
  for(const [name,sha] of Object.entries(m.sha256)){
   const data=fs.readFileSync(root+f.id+'/'+name);
   assert.deepEqual(imageSize(data),[4096,4096]);
   assert.equal(crypto.createHash('sha256').update(data).digest('hex'),sha);
   assert(data.length<25*1024*1024);
  }
  assert(fs.existsSync(root+f.id+'/preview.jpg'));
 }
});
test('all fifteen room studies exist as per-finish scene composites',()=>{
 const root='public/assets/material-studio/wood-flooring/';
 for(const s of woodScenes)for(const f of woodFinishes)
  assert(fs.existsSync(root+'scenes/'+s.id+'-'+f.id+'.jpg'),s.id+'-'+f.id);
});
test('wood flooring product has generated canonical SEO and advertises the honest 16K edition',()=>{
 const html=fs.readFileSync((process.env.MATERIAL_TEST_DIST || 'tmp/material-library-validation-20261019')+woodPath+'index.html','utf8');
 assert(html.includes('href="https://worldarchjournal.com'+woodPath+'"'));
 assert(html.includes('Five finish studies'));assert(html.includes('16K edition'));assert(html.includes('CC0'));
 assert(!html.includes('procedural'));
});
