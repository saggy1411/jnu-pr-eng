import fs from 'fs';
import zlib from 'zlib';

// Let's inspect the pixels of assets/images/jnu-logo.png
function readPNG(path) {
  const buf = fs.readFileSync(path);
  let offset = 8, idat = [], width, height;
  while (offset < buf.length) {
    const len = buf.readUInt32BE(offset);
    const type = buf.toString('ascii', offset + 4, offset + 8);
    const data = buf.subarray(offset + 8, offset + 8 + len);
    if (type === 'IHDR') {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
    } else if (type === 'IDAT') idat.push(data);
    offset += 12 + len;
  }
  return { width, height };
}

console.log('jnu-logo.png info:', readPNG('assets/images/jnu-logo.png'));

