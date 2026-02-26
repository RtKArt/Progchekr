#!/usr/bin/env node
// ============================================================
// Progchekr — PWA Icon Generator
// ============================================================
// Run:  node scripts/generate-icons.js
//
// Generates PNG icons from the SVG source for PWA manifest.
// Requires NO dependencies — uses the Canvas API via a tiny
// inline renderer. If you prefer higher quality, install
// "sharp" and swap in the sharp-based section below.
// ============================================================

import { writeFileSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC = join(__dirname, "..", "public");

// ---- Config ----
const SIZES = [192, 512];
const BG_STOPS = [
  [0, "#333333"],
  [1, "#1a1a1a"],
];
const CHECK_COLOR = "#00cc44";
const CORNER_RATIO = 0.15; // border-radius as fraction of size

// ---- Minimal PNG encoder (no dependencies) ----
// Creates an uncompressed PNG. For production you may want to
// pipe through pngquant / optipng or use sharp.

function createPNG(width, height, renderFn) {
  const pixels = new Uint8Array(width * height * 4);
  renderFn(pixels, width, height);

  // Build IDAT (uncompressed deflate blocks)
  const rawSize = height * (1 + width * 4); // filter byte + RGBA per row
  const raw = new Uint8Array(rawSize);
  let offset = 0;
  for (let y = 0; y < height; y++) {
    raw[offset++] = 0; // filter: None
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      raw[offset++] = pixels[i];
      raw[offset++] = pixels[i + 1];
      raw[offset++] = pixels[i + 2];
      raw[offset++] = pixels[i + 3];
    }
  }

  // Deflate: store blocks (no compression)
  const maxBlock = 65535;
  const numBlocks = Math.ceil(raw.length / maxBlock);
  const deflated = new Uint8Array(raw.length + numBlocks * 5 + 2 + 4);
  let dOff = 0;
  deflated[dOff++] = 0x78;
  deflated[dOff++] = 0x01; // zlib header

  for (let i = 0; i < numBlocks; i++) {
    const start = i * maxBlock;
    const end = Math.min(start + maxBlock, raw.length);
    const len = end - start;
    const last = i === numBlocks - 1 ? 1 : 0;
    deflated[dOff++] = last;
    deflated[dOff++] = len & 0xff;
    deflated[dOff++] = (len >> 8) & 0xff;
    deflated[dOff++] = ~len & 0xff;
    deflated[dOff++] = (~len >> 8) & 0xff;
    deflated.set(raw.subarray(start, end), dOff);
    dOff += len;
  }

  // Adler-32 checksum
  let a = 1,
    b = 0;
  for (let i = 0; i < raw.length; i++) {
    a = (a + raw[i]) % 65521;
    b = (b + a) % 65521;
  }
  const adler = ((b << 16) | a) >>> 0;
  deflated[dOff++] = (adler >> 24) & 0xff;
  deflated[dOff++] = (adler >> 16) & 0xff;
  deflated[dOff++] = (adler >> 8) & 0xff;
  deflated[dOff++] = adler & 0xff;

  const idatData = deflated.subarray(0, dOff);

  // CRC-32 table
  const crcTable = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    crcTable[n] = c;
  }
  function crc32(buf) {
    let c = 0xffffffff;
    for (let i = 0; i < buf.length; i++) c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
    return (c ^ 0xffffffff) >>> 0;
  }

  function makeChunk(type, data) {
    const typeBytes = new TextEncoder().encode(type);
    const len = data.length;
    const chunk = new Uint8Array(12 + len);
    // Length
    chunk[0] = (len >> 24) & 0xff;
    chunk[1] = (len >> 16) & 0xff;
    chunk[2] = (len >> 8) & 0xff;
    chunk[3] = len & 0xff;
    // Type
    chunk.set(typeBytes, 4);
    // Data
    chunk.set(data, 8);
    // CRC (over type + data)
    const crcBuf = new Uint8Array(4 + len);
    crcBuf.set(typeBytes, 0);
    crcBuf.set(data, 4);
    const c = crc32(crcBuf);
    chunk[8 + len] = (c >> 24) & 0xff;
    chunk[9 + len] = (c >> 16) & 0xff;
    chunk[10 + len] = (c >> 8) & 0xff;
    chunk[11 + len] = c & 0xff;
    return chunk;
  }

  // IHDR
  const ihdr = new Uint8Array(13);
  ihdr[0] = (width >> 24) & 0xff;
  ihdr[1] = (width >> 16) & 0xff;
  ihdr[2] = (width >> 8) & 0xff;
  ihdr[3] = width & 0xff;
  ihdr[4] = (height >> 24) & 0xff;
  ihdr[5] = (height >> 16) & 0xff;
  ihdr[6] = (height >> 8) & 0xff;
  ihdr[7] = height & 0xff;
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type: RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  const signature = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdrChunk = makeChunk("IHDR", ihdr);
  const idatChunk = makeChunk("IDAT", idatData);
  const iendChunk = makeChunk("IEND", new Uint8Array(0));

  const png = new Uint8Array(
    signature.length + ihdrChunk.length + idatChunk.length + iendChunk.length
  );
  let p = 0;
  png.set(signature, p);
  p += signature.length;
  png.set(ihdrChunk, p);
  p += ihdrChunk.length;
  png.set(idatChunk, p);
  p += idatChunk.length;
  png.set(iendChunk, p);
  return Buffer.from(png);
}

// ---- Color helpers ----
function hexToRgb(hex) {
  const h = hex.replace("#", "");
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function lerpColor(c1, c2, t) {
  return [lerp(c1[0], c2[0], t), lerp(c1[1], c2[1], t), lerp(c1[2], c2[2], t)];
}

// ---- Render functions ----
function isInsideRoundedRect(x, y, w, h, r) {
  if (x >= r && x <= w - r) return true;
  if (y >= r && y <= h - r) return true;
  // Check corners
  const corners = [
    [r, r],
    [w - r, r],
    [r, h - r],
    [w - r, h - r],
  ];
  for (const [cx, cy] of corners) {
    const dx = x - cx;
    const dy = y - cy;
    if (
      (x < r || x > w - r) &&
      (y < r || y > h - r) &&
      dx * dx + dy * dy <= r * r
    )
      return true;
  }
  return false;
}

function distToSegment(px, py, ax, ay, bx, by) {
  const dx = bx - ax;
  const dy = by - ay;
  const lenSq = dx * dx + dy * dy;
  let t = lenSq === 0 ? 0 : ((px - ax) * dx + (py - ay) * dy) / lenSq;
  t = Math.max(0, Math.min(1, t));
  const cx = ax + t * dx;
  const cy = ay + t * dy;
  const ex = px - cx;
  const ey = py - cy;
  return Math.sqrt(ex * ex + ey * ey);
}

function renderIcon(pixels, w, h, maskable) {
  const r = w * CORNER_RATIO;
  const bgC1 = hexToRgb(BG_STOPS[0][1]);
  const bgC2 = hexToRgb(BG_STOPS[1][1]);
  const checkRgb = hexToRgb(CHECK_COLOR);
  const strokeW = w * 0.035;

  // Checkmark points (relative)
  const p1 = [w * 0.25, h * 0.51];
  const p2 = [w * 0.42, h * 0.67];
  const p3 = [w * 0.75, h * 0.33];

  // For maskable: safe zone is center 80%, fill entire canvas
  const padding = maskable ? w * 0.1 : 0;

  for (let y = 0; y < h; y++) {
    const t = y / (h - 1);
    const bgColor = lerpColor(bgC1, bgC2, t);
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;

      let inside;
      if (maskable) {
        inside = true; // fill entire canvas for maskable
      } else {
        inside = isInsideRoundedRect(x, y, w, h, r);
      }

      if (!inside) {
        pixels[i] = 0;
        pixels[i + 1] = 0;
        pixels[i + 2] = 0;
        pixels[i + 3] = 0;
        continue;
      }

      // Background
      pixels[i] = Math.round(bgColor[0]);
      pixels[i + 1] = Math.round(bgColor[1]);
      pixels[i + 2] = Math.round(bgColor[2]);
      pixels[i + 3] = 255;

      // Checkmark (adjusted for maskable padding)
      const ox = maskable ? padding : 0;
      const oy = maskable ? padding : 0;
      const scale = maskable ? 0.8 : 1;
      const cp1 = [ox + p1[0] * scale, oy + p1[1] * scale];
      const cp2 = [ox + p2[0] * scale, oy + p2[1] * scale];
      const cp3 = [ox + p3[0] * scale, oy + p3[1] * scale];
      const sw = strokeW * scale;

      const d1 = distToSegment(x, y, cp1[0], cp1[1], cp2[0], cp2[1]);
      const d2 = distToSegment(x, y, cp2[0], cp2[1], cp3[0], cp3[1]);
      const d = Math.min(d1, d2);

      if (d < sw + 1) {
        const alpha = d < sw ? 1 : Math.max(0, 1 - (d - sw));
        pixels[i] = Math.round(lerp(bgColor[0], checkRgb[0], alpha));
        pixels[i + 1] = Math.round(lerp(bgColor[1], checkRgb[1], alpha));
        pixels[i + 2] = Math.round(lerp(bgColor[2], checkRgb[2], alpha));
      }
    }
  }
}

// ---- Generate ----
console.log("Generating PWA icons...");

for (const size of SIZES) {
  const png = createPNG(size, size, (px, w, h) => renderIcon(px, w, h, false));
  const path = join(PUBLIC, `icon-${size}.png`);
  writeFileSync(path, png);
  console.log(`  Created ${path} (${png.length} bytes)`);
}

// Maskable icon (512 only)
const maskPng = createPNG(512, 512, (px, w, h) => renderIcon(px, w, h, true));
const maskPath = join(PUBLIC, "icon-maskable-512.png");
writeFileSync(maskPath, maskPng);
console.log(`  Created ${maskPath} (${maskPng.length} bytes)`);

console.log("Done! Icons are ready in public/");
