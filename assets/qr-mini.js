/**
 * Pure-JS ISO/IEC 18004 QR Code SVG Generator (Versions 1-10, Byte Mode, ECC Level L)
 * Zero external APIs, 100% offline client-side for SEPA EPC QR & Slovenian UPN QR.
 */
(function (global) {
  // Total codewords & ECC codewords per block for Versions 1..10 at Level L
  const V_INFO = [
    null,
    { total: 26, ec: 7, blocks: 1, align: [] },
    { total: 44, ec: 10, blocks: 1, align: [6, 18] },
    { total: 70, ec: 15, blocks: 1, align: [6, 22] },
    { total: 100, ec: 20, blocks: 1, align: [6, 26] },
    { total: 134, ec: 26, blocks: 1, align: [6, 30] },
    { total: 172, ec: 18, blocks: 2, align: [6, 34] },
    { total: 196, ec: 20, blocks: 2, align: [6, 22, 38] },
    { total: 242, ec: 24, blocks: 2, align: [6, 24, 42] },
    { total: 292, ec: 30, blocks: 2, align: [6, 26, 46] },
    { total: 346, ec: 18, blocks: 4, align: [6, 28, 50] }
  ];

  const EXP = new Uint8Array(512);
  const LOG = new Uint8Array(256);
  (function initGF() {
    let x = 1;
    for (let i = 0; i < 255; i++) {
      EXP[i] = x;
      LOG[x] = i;
      x <<= 1;
      if (x & 0x100) x ^= 0x11d;
    }
    for (let i = 255; i < 512; i++) EXP[i] = EXP[i - 255];
  })();

  function gfMul(a, b) {
    return (a === 0 || b === 0) ? 0 : EXP[LOG[a] + LOG[b]];
  }

  function rsGeneratorPoly(degree) {
    let poly = [1];
    for (let i = 0; i < degree; i++) {
      const next = new Array(poly.length + 1).fill(0);
      for (let j = 0; j < poly.length; j++) {
        next[j] ^= poly[j];
        next[j + 1] ^= gfMul(poly[j], EXP[i]);
      }
      poly = next;
    }
    return poly;
  }

  function rsEncode(data, ecLen) {
    const gen = rsGeneratorPoly(ecLen);
    const res = new Uint8Array(ecLen);
    for (let i = 0; i < data.length; i++) {
      const factor = data[i] ^ res[0];
      for (let j = 0; j < ecLen - 1; j++) res[j] = res[j + 1];
      res[ecLen - 1] = 0;
      if (factor !== 0) {
        for (let j = 0; j < ecLen; j++) {
          res[j] ^= gfMul(gen[j + 1], factor);
        }
      }
    }
    return res;
  }

  function utf8Bytes(str) {
    if (typeof TextEncoder !== 'undefined') return Array.from(new TextEncoder().encode(str));
    const out = [];
    for (let i = 0; i < str.length; i++) {
      let c = str.charCodeAt(i);
      if (c < 0x80) out.push(c);
      else if (c < 0x800) out.push(0xc0 | (c >> 6), 0x80 | (c & 0x3f));
      else out.push(0xe0 | (c >> 12), 0x80 | ((c >> 6) & 0x3f), 0x80 | (c & 0x3f));
    }
    return out;
  }

  function bchFormatBits(ecLevelBits, mask) {
    const data = (ecLevelBits << 3) | mask;
    let rem = data << 10;
    for (let i = 4; i >= 0; i--) {
      if (rem & (1 << (i + 10))) rem ^= (0x537 << i);
    }
    return ((data << 10) | rem) ^ 0x5412;
  }

  function bchVersionBits(ver) {
    let rem = ver << 12;
    for (let i = 5; i >= 0; i--) {
      if (rem & (1 << (i + 12))) rem ^= (0x1f25 << i);
    }
    return (ver << 12) | rem;
  }

  function encodeQRMatrix(text) {
    const bytes = utf8Bytes(text);
    let ver = 1;
    while (ver <= 10) {
      const info = V_INFO[ver];
      const dataCap = info.total - info.ec * info.blocks;
      const headerBits = ver <= 9 ? 12 : 20;
      if (Math.ceil((headerBits + bytes.length * 8) / 8) <= dataCap) break;
      ver++;
    }
    if (ver > 10) ver = 10;
    const info = V_INFO[ver];
    const dataCap = info.total - info.ec * info.blocks;
    const maxBytes = dataCap - (ver <= 9 ? 2 : 3);
    const payload = bytes.slice(0, maxBytes);

    const bits = [];
    const pushBits = (val, len) => {
      for (let i = len - 1; i >= 0; i--) bits.push((val >>> i) & 1);
    };

    pushBits(0b0100, 4); // Byte mode
    pushBits(payload.length, ver <= 9 ? 8 : 16);
    for (const b of payload) pushBits(b, 8);

    const maxDataBits = dataCap * 8;
    for (let i = 0; i < 4 && bits.length < maxDataBits; i++) bits.push(0);
    while (bits.length % 8 !== 0) bits.push(0);

    const dataWords = [];
    for (let i = 0; i < bits.length; i += 8) {
      let byte = 0;
      for (let j = 0; j < 8; j++) byte = (byte << 1) | bits[i + j];
      dataWords.push(byte);
    }
    let padToggle = true;
    while (dataWords.length < dataCap) {
      dataWords.push(padToggle ? 0xec : 0x11);
      padToggle = !padToggle;
    }

    // Split into blocks & compute ECC
    const blocksData = [];
    const blocksEc = [];
    const shortBlockLen = Math.floor(dataCap / info.blocks);
    const numLongBlocks = dataCap % info.blocks;
    let offset = 0;
    for (let b = 0; b < info.blocks; b++) {
      const len = shortBlockLen + (b >= info.blocks - numLongBlocks ? 1 : 0);
      const slice = dataWords.slice(offset, offset + len);
      offset += len;
      blocksData.push(slice);
      blocksEc.push(Array.from(rsEncode(slice, info.ec)));
    }

    const finalWords = [];
    const maxBlockLen = shortBlockLen + (numLongBlocks > 0 ? 1 : 0);
    for (let i = 0; i < maxBlockLen; i++) {
      for (let b = 0; b < info.blocks; b++) {
        if (i < blocksData[b].length) finalWords.push(blocksData[b][i]);
      }
    }
    for (let i = 0; i < info.ec; i++) {
      for (let b = 0; b < info.blocks; b++) {
        finalWords.push(blocksEc[b][i]);
      }
    }

    const size = ver * 4 + 17;
    const grid = Array.from({ length: size }, () => new Array(size).fill(0));
    const isFunc = Array.from({ length: size }, () => new Array(size).fill(false));

    const setFunc = (r, c, dark) => {
      if (r >= 0 && r < size && c >= 0 && c < size) {
        grid[r][c] = dark ? 1 : 0;
        isFunc[r][c] = true;
      }
    };

    const drawFinder = (r, c) => {
      for (let dy = -1; dy <= 7; dy++) {
        for (let dx = -1; dx <= 7; dx++) {
          const dist = Math.max(Math.abs(dx - 3), Math.abs(dy - 3));
          setFunc(r + dy, c + dx, dist !== 2 && dist !== 4);
        }
      }
    };

    drawFinder(0, 0);
    drawFinder(0, size - 7);
    drawFinder(size - 7, 0);

    for (let i = 8; i < size - 8; i++) {
      setFunc(6, i, i % 2 === 0);
      setFunc(i, 6, i % 2 === 0);
    }

    const aPos = info.align;
    for (let i = 0; i < aPos.length; i++) {
      for (let j = 0; j < aPos.length; j++) {
        if ((i === 0 && j === 0) || (i === 0 && j === aPos.length - 1) || (i === aPos.length - 1 && j === 0)) continue;
        const cr = aPos[i], cc = aPos[j];
        for (let dy = -2; dy <= 2; dy++) {
          for (let dx = -2; dx <= 2; dx++) {
            setFunc(cr + dy, cc + dx, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
          }
        }
      }
    }

    // Reserve format areas + dark module
    for (let i = 0; i <= 8; i++) {
      if (i !== 6) {
        isFunc[8][i] = true;
        isFunc[i][8] = true;
      }
    }
    for (let i = 0; i < 8; i++) {
      isFunc[8][size - 1 - i] = true;
      isFunc[size - 1 - i][8] = true;
    }
    setFunc(size - 8, 8, true);

    if (ver >= 7) {
      const vBits = bchVersionBits(ver);
      for (let i = 0; i < 18; i++) {
        const bit = ((vBits >>> i) & 1) === 1;
        const a = size - 11 + (i % 3);
        const b = Math.floor(i / 3);
        setFunc(a, b, bit);
        setFunc(b, a, bit);
      }
    }

    // Place data bits zig-zag
    let bitIdx = 0;
    const totalBits = finalWords.length * 8;
    let upward = true;
    for (let right = size - 1; right >= 1; right -= 2) {
      if (right === 6) right = 5;
      for (let vert = 0; vert < size; vert++) {
        const r = upward ? size - 1 - vert : vert;
        for (let j = 0; j < 2; j++) {
          const c = right - j;
          if (!isFunc[r][c]) {
            let dark = false;
            if (bitIdx < totalBits) {
              dark = ((finalWords[bitIdx >>> 3] >>> (7 - (bitIdx & 7))) & 1) === 1;
              bitIdx++;
            }
            // Apply mask 0: (r + c) % 2 === 0
            if ((r + c) % 2 === 0) dark = !dark;
            grid[r][c] = dark ? 1 : 0;
          }
        }
      }
      upward = !upward;
    }

    // Format bits for Level L (01) and Mask 0 (000) per ISO/IEC 18004 Fig. 25
    const fBits = bchFormatBits(0b01, 0);
    const fBit = (idx) => ((fBits >>> idx) & 1) === 1;
    // Copy 1 (around top-left)
    for (let c = 0; c <= 5; c++) setFunc(8, c, fBit(14 - c));
    setFunc(8, 7, fBit(8));
    setFunc(8, 8, fBit(7));
    setFunc(7, 8, fBit(6));
    for (let r = 0; r <= 5; r++) setFunc(r, 8, fBit(r));

    // Copy 2 (bottom-left vertical + top-right horizontal)
    for (let i = 0; i <= 6; i++) setFunc(size - 1 - i, 8, fBit(14 - i));
    for (let i = 0; i <= 7; i++) setFunc(8, size - 8 + i, fBit(7 - i));

    return grid;
  }

  function renderQRToSVG(text, pixelSize) {
    const sz = pixelSize || 116;
    const matrix = encodeQRMatrix(text || 'SLORACUN');
    const n = matrix.length;
    const quiet = 2;
    const view = n + quiet * 2;
    let pathD = '';
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        if (matrix[r][c]) pathD += `M${c + quiet},${r + quiet}h1v1h-1z`;
      }
    }
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${view} ${view}" width="${sz}" height="${sz}" shape-rendering="crispEdges" role="img" aria-label="SEPA UPN QR koda"><rect width="${view}" height="${view}" fill="#ffffff"/><path d="${pathD}" fill="#0f172a"/></svg>`;
  }

  global.SloQR = { encodeQRMatrix, renderQRToSVG };
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { encodeQRMatrix, renderQRToSVG };
  }
})(typeof window !== 'undefined' ? window : globalThis);
