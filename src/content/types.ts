import type { ImageMetadata } from "astro";

export type ProductStatus = "disponible" | "ultimas-unidades" | "agotado";

export type VariantOption = {
  label: string; // "Talle 14", "45 cm", "Baño dorado"
  status?: ProductStatus; // opcional: una opción puede estar agotada
  priceDelta?: number; // opcional: diferencia de precio
};

export type Variant = {
  type: "talle" | "largo" | "color" | "baño" | "otro";
  name: string; // "Talle", "Largo de cadena"
  options: VariantOption[];
  required: boolean;
};

export type ProductImage = { src: ImageMetadata; alt: string };

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string; // id de categories.ts
  collections?: string[]; // "novedades", "para-regalo", etc.
  material: string;
  price: number | null; // ARS, entero. null = consultar
  description: string;
  details?: string[];
  images: ProductImage[]; // mínimo 1, alt descriptivo
  variants?: Variant[];
  status: ProductStatus;
  isNew?: boolean;
  featured?: boolean;
  careGuide?: string; // id en care.ts según material
};

export type Category = { id: string; name: string; plural: string };
export type Collection = { id: string; name: string; description: string };
