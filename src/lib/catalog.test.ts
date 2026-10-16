import { describe, expect, it } from "vitest";
import { validateCatalog } from "./catalog";
import { products } from "../content/products";
import { categories, collections } from "../content/categories";
import type { Product } from "../content/types";

const base: Product = {
  id: "x",
  slug: "anillo-x",
  name: "Anillo X",
  category: "anillos",
  material: "Acero",
  price: 1000,
  description: "",
  images: [{ src: {} as never, alt: "Anillo" }],
  status: "disponible",
};

describe("validateCatalog", () => {
  it("acepta el catálogo actual", () => {
    expect(() => validateCatalog(products, categories, collections)).not.toThrow();
  });

  it("rechaza categoría inexistente, falta de imagen y slug repetido", () => {
    const bad = [
      { ...base, category: "relojes" },
      { ...base, images: [] },
    ];
    expect(() => validateCatalog(bad, categories, collections)).toThrow(/relojes[\s\S]*repetido[\s\S]*imagen/);
  });

  it("rechaza slug inválido", () => {
    expect(() => validateCatalog([{ ...base, slug: "Anillo X" }], categories, collections)).toThrow(/slug inválido/);
  });
});
