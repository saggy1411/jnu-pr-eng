import fs from 'fs';
import zlib from 'zlib';

function unfilterPNG(buf) {
  let offset = 8, idat = [];
  let width, height;
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
  const raw = zlib.inflateSync(Buffer.concat(idat));
  const bpp = 4;
  const stride = 1 + width * bpp;
  const pixels = Buffer.alloc(width * height * bpp);

  function paeth(a, b, c) {
    const p = a + b - c;
    const pa = Math.abs(p - a);
    const pb = Math.abs(p - b);
    const pc = Math.abs(p - c);
    if (pa <= pb && pa <= pc) return a;
    if (pb <= pc) return b;
    return c;
  }

  for (let y = 0; y < height; y++) {
    const filter = raw[y * stride];
    const prevRowOffset = (y - 1) * width * bpp;
    const currRowOffset = y * width * bpp;

    for (let x = 0; x < width * bpp; x++) {
      const rawByte = raw[y * stride + 1 + x];
      const a = x >= bpp ? pixels[currRowOffset + x - bpp] : 0;
      const b = y > 0 ? pixels[prevRowOffset + x] : 0;
      const c = (x >= bpp && y > 0) ? pixels[prevRowOffset + x - bpp] : 0;

      let val = 0;
      if (filter === 0) val = rawByte;
      else if (filter === 1) val = (rawByte + a) & 0xff;
      else if (filter === 2) val = (rawByte + b) & 0xff;
      else if (filter === 3) val = (rawByte + Math.floor((a + b) / 2)) & 0xff;
      else if (filter === 4) val = (rawByte + paeth(a, b, c)) & 0xff;

      pixels[currRowOffset + x] = val;
    }
  }

  return { width, height, pixels };
}

const logo = unfilterPNG(fs.readFileSync('assets/images/jnu-logo.png'));
console.log('jnu-logo.png width:', logo.width, 'height:', logo.height);
// sample some pixels from jnu-logo.png
let nonTransparent = 0;
let darkCount = 0, whiteCount = 0;
for (let i = 0; i < logo.pixels.length; i += 4) {
  const r = logo.pixels[i], g = logo.pixels[i+1], b = logo.pixels[i+2], a = logo.pixels[i+3];
  if (a > 50) {
    nonTransparent++;
    if (r < 50 && g < 50 && b < 100) darkCount++;
    if (r > 200 && g > 200 && b > 200) whiteCount++;
  }
}
console.log('Non-transparent pixels:', nonTransparent, 'Dark pixels:', darkCount, 'White pixels:', whiteCount);

