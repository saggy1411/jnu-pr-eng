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

const { width, height, pixels } = unfilterPNG(fs.readFileSync('C:/Users/sv441/.gemini/antigravity/brain/e6efd6c6-b950-4a33-a708-db6dfcc7fa0d/.user_uploaded/media_1793336717143_827f0129.png'));

// The bar starts at x=39, y=6.
// Let's find where the logo and NAAC box end.
// Look at column sums of brightness from x=39 to x=450
for (let x = 39; x < 450; x += 10) {
  let bright = 0;
  for (let y = 6; y < 64; y++) {
    const idx = (y * width + x) * 4;
    const r = pixels[idx], g = pixels[idx+1], b = pixels[idx+2];
    if (r > 150 && g > 150 && b > 150) bright++;
  }
  console.log(`x=${x}: bright pixels=${bright}`);
}

