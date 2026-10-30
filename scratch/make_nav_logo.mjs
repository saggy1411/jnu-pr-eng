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

function writePNG(filePath, width, height, pixels) {
  const bpp = 4;
  const raw = Buffer.alloc(height * (1 + width * bpp));
  for (let y = 0; y < height; y++) {
    raw[y * (1 + width * bpp)] = 0;
    pixels.copy(raw, y * (1 + width * bpp) + 1, y * width * bpp, (y + 1) * width * bpp);
  }
  const idat = zlib.deflateSync(raw);

  const crcTable = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      if (c & 1) c = 0xedb88320 ^ (c >>> 1);
      else c = c >>> 1;
    }
    crcTable[n] = c;
  }
  function calcCRC(buf) {
    let c = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
    }
    return (c ^ 0xffffffff) >>> 0;
  }

  function makeChunk(type, data) {
    const len = data.length;
    const chunk = Buffer.alloc(12 + len);
    chunk.writeUInt32BE(len, 0);
    chunk.write(type, 4, 4, 'ascii');
    data.copy(chunk, 8);
    const crc = calcCRC(chunk.subarray(4, 8 + len));
    chunk.writeUInt32BE(crc, 8 + len);
    return chunk;
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const header = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdrChunk = makeChunk('IHDR', ihdr);
  const idatChunk = makeChunk('IDAT', idat);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  fs.writeFileSync(filePath, Buffer.concat([header, ihdrChunk, idatChunk, iendChunk]));
}

const { width, height, pixels } = unfilterPNG(fs.readFileSync('C:/Users/sv441/.gemini/antigravity/brain/e6efd6c6-b950-4a33-a708-db6dfcc7fa0d/.user_uploaded/media_1793336717143_827f0129.png'));

// Find exact bounding box of the logo + NAAC box
// y goes from 10 to 60. x goes from 45 to 345.
let startX = 45, endX = 345, startY = 10, endY = 60;

// Also let's make a version that subtracts the background gradient to make the background transparent!
// Notice the background gradient at line y=10 has known colors:
// At x=45, r~21, g~33, b~80
// At x=345, r~74, g~31, b~81
const cropW = endX - startX;
const cropH = endY - startY;
const cropPixels = Buffer.alloc(cropW * cropH * 4);
const transPixels = Buffer.alloc(cropW * cropH * 4);

for (let y = 0; y < cropH; y++) {
  for (let x = 0; x < cropW; x++) {
    const srcX = startX + x;
    const srcY = startY + y;
    const srcIdx = (srcY * width + srcX) * 4;
    const dstIdx = (y * cropW + x) * 4;

    const r = pixels[srcIdx];
    const g = pixels[srcIdx + 1];
    const b = pixels[srcIdx + 2];
    const a = pixels[srcIdx + 3];

    // standard copy
    cropPixels[dstIdx] = r;
    cropPixels[dstIdx + 1] = g;
    cropPixels[dstIdx + 2] = b;
    cropPixels[dstIdx + 3] = a;

    // Estimate background color at this x:
    // x goes 0 to cropW, interpolating between [21, 33, 80] and [74, 31, 81]
    const t = x / cropW;
    const bgR = 21 + (74 - 21) * t;
    const bgG = 33 + (31 - 33) * t;
    const bgB = 80 + (81 - 80) * t;

    // Difference from bg:
    const diff = Math.sqrt((r - bgR)**2 + (g - bgG)**2 + (b - bgB)**2);
    
    // If it's close to background, make it transparent
    let alpha = 255;
    if (diff < 12) {
      alpha = 0;
    } else if (diff < 35) {
      alpha = Math.floor(((diff - 12) / (35 - 12)) * 255);
    }
    
    transPixels[dstIdx] = r;
    transPixels[dstIdx + 1] = g;
    transPixels[dstIdx + 2] = b;
    transPixels[dstIdx + 3] = alpha;
  }
}

writePNG('assets/images/jnu-nav-logo.png', cropW, cropH, cropPixels);
writePNG('assets/images/jnu-nav-logo-transparent.png', cropW, cropH, transPixels);
console.log('Generated jnu-nav-logo.png and jnu-nav-logo-transparent.png');

