/**
 * Toma las fotos crudas de assets-raw/instagram/<slug>/ y genera los masters
 * en src/assets/products/<slug>/NN.webp (y src/assets/brand/ para _marca/).
 *
 * Los masters salen en WebP de alta calidad: el redimensionado a 2–3 anchos y
 * AVIF/WebP finales los hace astro:assets en el build (<Picture widths=...>).
 *
 * Uso: npm run images
 */
import { readdir, mkdir } from "node:fs/promises";
import { join, parse } from "node:path";
import sharp from "sharp";

const RAW = "assets-raw/instagram";
const OUT_PRODUCTS = "src/assets/products";
const OUT_BRAND = "src/assets/brand";
const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);
// En joyería el detalle vende: calidad alta en el master, sin sobre-comprimir.
const QUALITY = 90;

async function convertFolder(srcDir: string, outDir: string) {
  await mkdir(outDir, { recursive: true });
  const files = (await readdir(srcDir)).filter((f) => IMAGE_EXT.has(parse(f).ext.toLowerCase())).sort();
  for (const file of files) {
    const out = join(outDir, `${parse(file).name}.webp`);
    await sharp(join(srcDir, file)).rotate().webp({ quality: QUALITY, effort: 6 }).toFile(out);
    console.log(`✓ ${out}`);
  }
}

const entries = await readdir(RAW, { withFileTypes: true });
for (const entry of entries) {
  if (!entry.isDirectory() || entry.name === "_originales") continue;
  const src = join(RAW, entry.name);
  if (entry.name === "_marca") await convertFolder(src, OUT_BRAND);
  else await convertFolder(src, join(OUT_PRODUCTS, entry.name));
}
