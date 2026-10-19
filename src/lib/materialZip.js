// ZIP/STORE: PNGs are already compressed. Assemble in the browser so every
// hosted asset stays below the static host's per-file limit.
export function zipMaterialFiles(files) {
  const encoder = new TextEncoder();
  const table = new Uint32Array(256);
  for (let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xedb88320^(c>>>1):c>>>1;table[n]=c;}
  const parts=[], central=[]; let offset=0, directorySize=0;
  for(const {name,data} of files){
    const filename=encoder.encode(name), bytes=data instanceof Uint8Array?data:new Uint8Array(data);
    let crc=0xffffffff;for(const b of bytes)crc=table[(crc^b)&255]^(crc>>>8);crc=(crc^0xffffffff)>>>0;
    const local=new Uint8Array(30+filename.length), l=new DataView(local.buffer);
    l.setUint32(0,0x04034b50,true);l.setUint16(4,20,true);l.setUint16(6,0x800,true);l.setUint16(12,0x21,true);
    l.setUint32(14,crc,true);l.setUint32(18,bytes.length,true);l.setUint32(22,bytes.length,true);l.setUint16(26,filename.length,true);local.set(filename,30);
    const dir=new Uint8Array(46+filename.length), d=new DataView(dir.buffer);
    d.setUint32(0,0x02014b50,true);d.setUint16(4,20,true);d.setUint16(6,20,true);d.setUint16(8,0x800,true);d.setUint16(14,0x21,true);
    d.setUint32(16,crc,true);d.setUint32(20,bytes.length,true);d.setUint32(24,bytes.length,true);d.setUint16(28,filename.length,true);d.setUint32(42,offset,true);dir.set(filename,46);
    parts.push(local,bytes);central.push(dir);offset+=local.length+bytes.length;directorySize+=dir.length;
  }
  const end=new Uint8Array(22), e=new DataView(end.buffer);e.setUint32(0,0x06054b50,true);e.setUint16(8,files.length,true);e.setUint16(10,files.length,true);e.setUint32(12,directorySize,true);e.setUint32(16,offset,true);
  return new Blob([...parts,...central,end],{type:'application/zip'});
}
