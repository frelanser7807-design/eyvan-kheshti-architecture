import test from 'node:test';
import assert from 'node:assert/strict';
import { zipMaterialFiles } from '../src/lib/materialZip.js';

test('chunked map parts produce exactly the same valid ZIP bytes as a complete file', async () => {
  const complete = new TextEncoder().encode('A complete material map\nwith multiple parts');
  const whole = new Uint8Array(await zipMaterialFiles([{name:'map.png',data:complete}]).arrayBuffer());
  const split = new Uint8Array(await zipMaterialFiles([{name:'map.png',data:[complete.subarray(0,5),complete.subarray(5,20),complete.subarray(20)]}]).arrayBuffer());
  assert.deepEqual(split, whole);
  assert.equal(new DataView(split.buffer).getUint32(0,true), 0x04034b50);
  assert.equal(new DataView(split.buffer).getUint32(18,true), complete.length);
});
