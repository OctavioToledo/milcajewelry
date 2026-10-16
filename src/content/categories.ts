import type { Category, Collection } from "./types";

// Orden = orden de los chips del catálogo. Solo se muestran las que tienen productos.
export const categories: Category[] = [
  { id: "aros", name: "Aros", plural: "Aros" },
  { id: "collares", name: "Collar", plural: "Collares" },
  { id: "pulseras", name: "Pulsera", plural: "Pulseras" },
  { id: "anillos", name: "Anillo", plural: "Anillos" },
  { id: "sets", name: "Set", plural: "Sets" },
];

export const collections: Collection[] = [
  { id: "novedades", name: "Novedades", description: "Lo último que llegó al taller." },
  { id: "para-regalo", name: "Para regalo", description: "Piezas pensadas para regalar, listas en su packaging." },
];
