/**
 * Genera los íconos del sitio y la imagen para compartir el link (Open Graph):
 *   public/favicon.svg, favicon-48.png, favicon-96.png, apple-touch-icon.png,
 *   icon-192.png, icon-512.png (manifest) y og.jpg (1200×630).
 *
 * Los textos se convierten a trazos con opentype.js, así no dependen de las
 * fuentes instaladas en la máquina que corre el script.
 *
 * Uso: npm run share
 */
import { readFile, writeFile } from "node:fs/promises";
import sharp from "sharp";
// @ts-expect-error opentype.js no trae tipos y es solo una herramienta de desarrollo.
import opentype from "opentype.js";

const COCOA = "#1b0800";
const MILK = "#fff4ec";
const PEACH = "#f6c9a1";
const GREY = "#999999";

async function loadFont(file: string) {
  const buf = await readFile(file);
  return opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
}
const cinzel = await loadFont("node_modules/@fontsource/cinzel/files/cinzel-latin-400-normal.woff");
const archivo = await loadFont("node_modules/@fontsource/archivo/files/archivo-latin-600-normal.woff");

const n = (v: number) => String(Math.round(v * 100) / 100);
type Cmd = { type: string; x?: number; y?: number; x1?: number; y1?: number; x2?: number; y2?: number };
function toSvg(c: Cmd): string {
  switch (c.type) {
    case "M":
    case "L":
      return `${c.type}${n(c.x!)} ${n(c.y!)}`;
    case "Q":
      return `Q${n(c.x1!)} ${n(c.y1!)} ${n(c.x!)} ${n(c.y!)}`;
    case "C":
      return `C${n(c.x1!)} ${n(c.y1!)} ${n(c.x2!)} ${n(c.y2!)} ${n(c.x!)} ${n(c.y!)}`;
    default:
      return "Z";
  }
}

/** Path de un texto con tracking. `align` centra o alinea a la derecha respecto de `x`. */
function text(font: any, str: string, size: number, tracking: number, x: number, y: number, align: "start" | "middle" = "start") {
  const advance = (ch: string) => (font.charToGlyph(ch).advanceWidth / font.unitsPerEm) * size;
  const width = [...str].reduce((w, ch) => w + advance(ch) + tracking, -tracking);
  let cx = align === "middle" ? x - width / 2 : x;
  const parts: string[] = [];
  for (const ch of str) {
    parts.push(font.charToGlyph(ch).getPath(cx, y, size).commands.map(toSvg).join(""));
    cx += advance(ch) + tracking;
  }
  return { d: parts.join(""), width };
}

// ---------- Ícono: "M" de Cinzel sobre Cocoa Ink, con el círculo fino de la marca ----------
function iconSvg(size: number, { orbit = true, pad = 0 } = {}) {
  const m = text(cinzel, "M", size * 0.56, 0, size / 2, size * 0.7, "middle");
  const r = size * 0.36 - pad;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
<rect width="${size}" height="${size}" fill="${COCOA}"/>
${orbit ? `<circle cx="${size / 2}" cy="${size / 2}" r="${n(r)}" fill="none" stroke="${PEACH}" stroke-opacity="0.55" stroke-width="${n(size / 96)}"/>` : ""}
<path d="${m.d}" fill="${MILK}"/>
</svg>`;
}

await writeFile("public/favicon.svg", iconSvg(64, { orbit: false }).replace(/width="64" height="64" /, ""));
const pngs: [string, number, boolean][] = [
  ["public/favicon-48.png", 48, false],
  ["public/favicon-96.png", 96, false],
  ["public/apple-touch-icon.png", 180, true],
  ["public/icon-192.png", 192, true],
  ["public/icon-512.png", 512, true],
];
for (const [file, size, orbit] of pngs) {
  await sharp(Buffer.from(iconSvg(size, { orbit }))).png().toFile(file);
  console.log(`✓ ${file}`);
}

// ---------- Imagen para compartir (WhatsApp, Instagram, Facebook, X) ----------
const W = 1200;
const H = 630;
const PHOTO_W = 520;
const photo = await sharp("src/assets/products/aros-flora/02.webp")
  .resize(PHOTO_W, H, { fit: "cover", position: "attention" })
  .toBuffer();

const logoSrc = await readFile("src/assets/brand/logo.svg", "utf8");
const [, vbY, vbW] = logoSrc.match(/viewBox="([\d.]+) ([\d.]+) ([\d.]+) ([\d.]+)"/)!.slice(1).map(Number);
const logoInner = logoSrc.replace(/^<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");
const panelX = PHOTO_W;
const panelW = W - PHOTO_W;
const logoScale = 420 / vbW;
const logoX = panelX + (panelW - vbW * logoScale) / 2;
const cx = panelX + panelW / 2;

const line1 = text(archivo, "AROS · COLLARES · PULSERAS · ANILLOS", 17, 3.4, cx, 418, "middle");
const line2 = text(archivo, "ENVÍOS A TODO EL PAÍS · MENDOZA, ARGENTINA", 14, 2.8, cx, 452, "middle");

const og = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<rect x="${panelX}" width="${panelW}" height="${H}" fill="${MILK}"/>
<circle cx="${PHOTO_W}" cy="${H * 0.62}" r="250" fill="none" stroke="${GREY}" stroke-width="1"/>
<g transform="translate(${n(logoX)} ${n(150 - vbY * logoScale)}) scale(${n(logoScale)})" fill="${COCOA}">${logoInner}</g>
<rect x="${cx - 24}" y="372" width="48" height="1.5" fill="${COCOA}"/>
<path d="${line1.d}" fill="${COCOA}"/>
<path d="${line2.d}" fill="${COCOA}" fill-opacity="0.7"/>
</svg>`;

await sharp({ create: { width: W, height: H, channels: 3, background: MILK } })
  .composite([
    { input: photo, left: 0, top: 0 },
    { input: Buffer.from(og), left: 0, top: 0 },
  ])
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile("public/og.jpg");
console.log("✓ public/og.jpg (1200×630)");
