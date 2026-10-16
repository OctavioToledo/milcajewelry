/**
 * Capa de acceso al catálogo. Los componentes leen SOLO de acá.
 *
 * Hoy la fuente es src/content/products.ts. Para pasar a Google Sheets se
 * reemplaza `loadProducts()` por un fetch del CSV publicado + mapeo de filas
 * a Product (ver docs/como-actualizar.md). Las funciones exportadas son async
 * para que ese cambio no toque ningún componente.
 */
import { products as localProducts } from "../content/products";
import { categories as allCategories, collections as allCollections } from "../content/categories";
import type { Category, Collection, Product } from "../content/types";

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Tira un error claro si el catálogo tiene datos inválidos (corre en el build). */
export function validateCatalog(products: Product[], categories: Category[], collections: Collection[]) {
  const errors: string[] = [];
  const categoryIds = new Set(categories.map((c) => c.id));
  const collectionIds = new Set(collections.map((c) => c.id));
  const seen = new Set<string>();

  for (const p of products) {
    const label = `Producto "${p.name || p.id || "(sin nombre)"}"`;
    if (!p.slug) errors.push(`${label}: falta el slug.`);
    else if (!SLUG_RE.test(p.slug)) errors.push(`${label}: slug inválido "${p.slug}" (usá minúsculas y guiones).`);
    else if (seen.has(p.slug)) errors.push(`${label}: slug repetido "${p.slug}".`);
    seen.add(p.slug);

    if (!p.name) errors.push(`${label}: falta el nombre.`);
    if (!categoryIds.has(p.category)) errors.push(`${label}: categoría "${p.category}" no existe en categories.ts.`);
    for (const c of p.collections ?? []) {
      if (!collectionIds.has(c)) errors.push(`${label}: colección "${c}" no existe en categories.ts.`);
    }
    if (!p.images?.length) errors.push(`${label}: necesita al menos una imagen.`);
    for (const img of p.images ?? []) {
      if (!img.alt?.trim()) errors.push(`${label}: hay una imagen sin texto alternativo (alt).`);
    }
    if (p.price !== null && (!Number.isInteger(p.price) || p.price <= 0)) {
      errors.push(`${label}: el precio tiene que ser un entero positivo o null.`);
    }
    for (const v of p.variants ?? []) {
      if (!v.options.length) errors.push(`${label}: la variante "${v.name}" no tiene opciones.`);
    }
  }

  if (errors.length) {
    throw new Error(`Catálogo inválido:\n  - ${errors.join("\n  - ")}`);
  }
}

async function loadProducts(): Promise<Product[]> {
  return localProducts;
}

let cache: Promise<Product[]> | undefined;

export function getProducts(): Promise<Product[]> {
  cache ??= loadProducts().then((products) => {
    validateCatalog(products, allCategories, allCollections);
    return products;
  });
  return cache;
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  return (await getProducts()).find((p) => p.slug === slug);
}

/** Categorías que tienen al menos un producto, en el orden de categories.ts. */
export async function getCategories(): Promise<Category[]> {
  const used = new Set((await getProducts()).map((p) => p.category));
  return allCategories.filter((c) => used.has(c.id));
}

export async function getCollections(): Promise<Collection[]> {
  const products = await getProducts();
  return allCollections.filter((c) => products.some((p) => p.collections?.includes(c.id)));
}

export async function getProductsInCollection(id: string): Promise<Product[]> {
  return (await getProducts()).filter((p) => p.collections?.includes(id));
}

export async function getNewProducts(): Promise<Product[]> {
  return (await getProducts()).filter((p) => p.isNew);
}

/** Hasta `limit` piezas de la misma categoría; completa con otras si faltan. */
export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const others = (await getProducts()).filter((p) => p.slug !== product.slug);
  const same = others.filter((p) => p.category === product.category);
  const rest = others.filter((p) => p.category !== product.category);
  return [...same, ...rest].slice(0, limit);
}

export function getCategoryName(id: string): string {
  return allCategories.find((c) => c.id === id)?.plural ?? id;
}
