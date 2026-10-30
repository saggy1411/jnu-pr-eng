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
  // Save as uncompressed/deflated filter-0 PNG
  const bpp = 4;
  const raw = Buffer.alloc(height * (1 + width * bpp));
  for (let y = 0; y < height; y++) {
    raw[y * (1 + width * bpp)] = 0; // filter 0
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
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type 6: RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const header = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdrChunk = makeChunk('IHDR', ihdr);
  const idatChunk = makeChunk('IDAT', idat);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  fs.writeFileSync(filePath, Buffer.concat([header, ihdrChunk, idatChunk, iendChunk]));
  console.log('Saved PNG:', filePath, width, 'x', height);
}

const { width, height, pixels } = unfilterPNG(fs.readFileSync('C:/Users/sv441/.gemini/antigravity/brain/e6efd6c6-b950-4a33-a708-db6dfcc7fa0d/.user_uploaded/media_1793336717143_827f0129.png'));

// Let's crop the whole bar: x=39 to 999 (width: 961), y=6 to 64 (height: 59)
const barW = 961, barH = 59;
const barPixels = Buffer.alloc(barW * barH * 4);
for (let y = 0; y < barH; y++) {
  for (let x = 0; x < barW; x++) {
    const srcIdx = ((y + 6) * width + (x + 39)) * 4;
    const dstIdx = (y * barW + x) * 4;
    pixels.copy(barPixels, dstIdx, srcIdx, srcIdx + 4);
  }
}
writePNG('assets/images/navbar-reference-crop.png', barW, barH, barPixels);

// Also let's crop just the logo area on the left: x=39 to x=360, y=6 to 64
const logoW = 320, logoH = 59;
const logoPixels = Buffer.alloc(logoW * logoH * 4);
for (let y = 0; y < logoH; y++) {
  for (let x = 0; x < logoW; x++) {
    const srcIdx = ((y + 6) * width + (x + 39)) * 4;
    const dstIdx = (y * logoW + x) * 4;
    pixels.copy(logoPixels, dstIdx, srcIdx, srcIdx + 4);
  }
}
writePNG('assets/images/navbar-logo-crop.png', logoW, logoH, logoPixels);

