/**
 * Genera el wordmark "MILCA · Essential Jewelry" como SVG con trazos (sin
 * depender de la fuente en runtime), recreado a partir del packaging.
 * TODO: reemplazar por el logo vectorial original de la marca cuando lo tengamos.
 *
 * Uso: npm run logo
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
// @ts-expect-error opentype.js no trae tipos y es solo una herramienta de desarrollo.
import opentype from "opentype.js";

const fontFile = "node_modules/@fontsource/cinzel/files/cinzel-latin-400-normal.woff";
const buf = await readFile(fontFile);
const font = opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));

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

/** Devuelve el path de un texto con tracking, y su ancho. */
function tracked(text: string, size: number, tracking: number, y: number) {
  let x = 0;
  const parts: string[] = [];
  for (const ch of text) {
    const glyph = font.charToGlyph(ch);
    // Serializamos a mano: toPathData() de opentype.js 2.0 genera NaN al redondear algunos valores.
    parts.push(glyph.getPath(x, y, size).commands.map(toSvg).join(""));
    x += (glyph.advanceWidth! / font.unitsPerEm) * size + tracking;
  }
  return { d: parts.join(""), width: x - tracking };
}

const main = tracked("MILCA", 64, 10, 60);
const tag = tracked("ESSENTIAL JEWELRY", 11, 4.2, 86);
const width = Math.ceil(main.width);
const tagX = (width - tag.width) / 2;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 12 ${width} 80" fill="currentColor" role="img" aria-label="Milca Essential Jewelry"><path d="${main.d}"/><g transform="translate(${tagX.toFixed(2)} 0)"><path d="${tag.d}"/></g></svg>\n`;

await mkdir("src/assets/brand", { recursive: true });
await writeFile("src/assets/brand/logo.svg", svg);
console.log(`✓ src/assets/brand/logo.svg (${width}×80)`);
