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

function getPixel(x, y) {
  const idx = (y * width + x) * 4;
  return [pixels[idx], pixels[idx+1], pixels[idx+2], pixels[idx+3]];
}

// Find bar boundary:
// Look for where pixel is not white (e.g. r < 240)
let minX = width, maxX = 0, minY = height, maxY = 0;
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const [r, g, b, a] = getPixel(x, y);
    if (r < 235 || g < 235 || b < 235) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
}

console.log('Bar bounding box: x from', minX, 'to', maxX, ', y from', minY, 'to', maxY);
console.log('Bar dimensions:', (maxX - minX + 1), 'x', (maxY - minY + 1));

// Right pill analysis: find dark navy area on right side (x > 750)
let pillMinX = width, pillMaxX = 0, pillMinY = height, pillMaxY = 0;
for (let y = 10; y < height - 10; y++) {
  for (let x = 750; x < maxX; x++) {
    const [r, g, b, a] = getPixel(x, y);
    // pill background is dark navy (r < 30, g < 40, b < 90)
    if (r < 30 && g < 45 && b > 60 && b < 120) {
      if (x < pillMinX) pillMinX = x;
      if (x > pillMaxX) pillMaxX = x;
      if (y < pillMinY) pillMinY = y;
      if (y > pillMaxY) pillMaxY = y;
    }
  }
}
console.log('Right pill bounding box: x from', pillMinX, 'to', pillMaxX, ', y from', pillMinY, 'to', pillMaxY);
console.log('Right pill size:', (pillMaxX - pillMinX + 1), 'x', (pillMaxY - pillMinY + 1));

// Dot inside pill: find bright crimson/pink circle in pill area (x around pillMinX to pillMinX + 30)
for (let x = pillMinX; x < pillMinX + 35; x++) {
  const [r, g, b, a] = getPixel(x, Math.floor((pillMinY + pillMaxY)/2));
  console.log(`Pill dot at x=${x}: rgb(${r},${g},${b})`);
}

