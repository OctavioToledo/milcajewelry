/**
 * Catálogo de Milca Jewelry.
 *
 * DEMO: las fotos son reales (Instagram de la marca), pero nombres de algunas
 * piezas, precios, materiales y variantes son ILUSTRATIVOS hasta que la marca
 * pase sus datos. Ver docs/pendientes.md.
 *
 * Para editar: cambiá precio/estado acá. Para sumar una pieza: poné las fotos en
 * assets-raw/instagram/<slug>/ (01 = portada), corré `npm run images`, importalas
 * abajo y agregá un objeto al array.
 */
import type { Product } from "./types";

import arosFlora01 from "../assets/products/aros-flora/01.webp";
import arosFlora02 from "../assets/products/aros-flora/02.webp";
import collarCorazon01 from "../assets/products/collar-corazon/01.webp";
import esclavaDione01 from "../assets/products/esclava-dione/01.webp";
import anilloEntrelazado01 from "../assets/products/anillo-entrelazado/01.webp";
import anilloOndas01 from "../assets/products/anillo-ondas/01.webp";
import anilloDestello01 from "../assets/products/anillo-destello/01.webp";
import anillosEscultura01 from "../assets/products/anillos-escultura/01.webp";
import anillosEscultura02 from "../assets/products/anillos-escultura/02.webp";

const ACERO_DORADO = "Acero quirúrgico con baño de oro"; // TODO: confirmar material real

const ANILLO_TALLES = ["14", "15", "16", "17", "18", "19", "20"];

export const products: Product[] = [
  {
    id: "aros-flora",
    slug: "aros-flora",
    name: "Aros Flora",
    category: "aros",
    collections: ["novedades", "para-regalo"],
    material: ACERO_DORADO,
    price: 24900, // TODO: precio real (ilustrativo)
    description:
      "Una flor de pétalos texturados que abraza una perla en el centro. Aros con presencia, para levantar cualquier look sin esfuerzo.",
    details: ["Perla sintética central", "Cierre a presión", "Medida aproximada: 3 cm"], // TODO: confirmar medidas
    images: [
      { src: arosFlora01, alt: "Aros Flora: par de aros dorados en forma de flor con perla al centro, sobre fondo claro" },
      { src: arosFlora02, alt: "Modelo de perfil usando los Aros Flora dorados con perla" },
    ],
    status: "disponible",
    isNew: true,
    featured: true,
    careGuide: "acero-banado",
  },
  {
    id: "collar-corazon",
    slug: "collar-corazon",
    name: "Gargantilla Corazón",
    category: "collares",
    collections: ["novedades", "para-regalo"],
    material: ACERO_DORADO,
    price: 32900, // TODO: precio real (ilustrativo)
    description:
      "Cadena tejida tipo serpiente con un corazón calado al centro. Se apoya justo en la base del cuello y brilla con la luz.",
    details: ["Cadena plana tejida", "Dije corazón calado", "Cierre mosquetón con extensor"], // TODO: confirmar
    images: [
      { src: collarCorazon01, alt: "Primer plano de una modelo usando la Gargantilla Corazón dorada en el cuello" },
    ],
    variants: [
      {
        type: "largo",
        name: "Largo",
        required: true,
        options: [{ label: "35 cm" }, { label: "40 cm" }, { label: "45 cm", status: "agotado" }],
      },
    ],
    status: "ultimas-unidades",
    isNew: true,
    featured: true,
    careGuide: "acero-banado",
  },
  {
    id: "esclava-dione",
    slug: "esclava-dione",
    name: "Esclava Dione",
    category: "pulseras",
    collections: ["para-regalo"],
    material: ACERO_DORADO,
    price: 29900, // TODO: precio real (ilustrativo)
    description:
      "Esclava rígida con cristales rectangulares engarzados a lo largo. Fina, luminosa y fácil de combinar con otras pulseras.",
    details: ["Cristales talle baguette", "Apertura con bisagra", "Diámetro interno aprox. 6 cm"], // TODO: confirmar
    images: [{ src: esclavaDione01, alt: "Esclava Dione dorada con cristales rectangulares engarzados, apoyada sobre fondo beige" }],
    status: "disponible",
    featured: true,
    careGuide: "acero-banado",
  },
  {
    id: "anillo-entrelazado",
    slug: "anillo-entrelazado",
    name: "Anillo Entrelazado",
    category: "anillos",
    collections: ["novedades"],
    material: ACERO_DORADO,
    price: 21900, // TODO: precio real (ilustrativo)
    description:
      "Dos bandas que se cruzan y sostienen un cristal oval. Ajustable, para que te quede perfecto sin pensar en el talle.",
    details: ["Cristal oval", "Ajustable"],
    images: [{ src: anilloEntrelazado01, alt: "Anillo Entrelazado dorado de dos bandas cruzadas con un cristal oval" }],
    status: "disponible",
    isNew: true,
    careGuide: "acero-banado",
  },
  {
    id: "anillo-ondas",
    slug: "anillo-ondas",
    name: "Anillo Ondas",
    category: "anillos",
    material: "Acero quirúrgico", // TODO: confirmar material real
    price: 19900, // TODO: precio real (ilustrativo)
    description:
      "Una banda ancha con relieve ondulado, como metal recién fundido. Viene en dorado y en plateado: elegí el tuyo.",
    details: ["Banda ancha texturada", "Ajustable"],
    images: [{ src: anilloOndas01, alt: "Dos Anillos Ondas de banda ancha texturada, uno dorado y uno plateado" }],
    variants: [
      {
        type: "baño",
        name: "Color",
        required: true,
        options: [{ label: "Dorado" }, { label: "Plateado" }],
      },
    ],
    status: "disponible",
    featured: true,
    careGuide: "acero",
  },
  {
    id: "anillo-destello",
    slug: "anillo-destello",
    name: "Anillo Destello",
    category: "anillos",
    collections: ["para-regalo"],
    material: ACERO_DORADO,
    price: 23900, // TODO: precio real (ilustrativo)
    description:
      "Un cristal oval protagonista sobre una banda en V que acompaña la forma del dedo. Para los días en que querés brillar.",
    details: ["Cristal oval engarzado con garras", "Banda en V"],
    images: [{ src: anilloDestello01, alt: "Anillo Destello dorado con banda en V y un gran cristal oval" }],
    variants: [
      {
        type: "talle",
        name: "Talle",
        required: true,
        options: ANILLO_TALLES.map((t) => ({ label: t, status: t === "19" ? ("agotado" as const) : undefined })),
      },
    ],
    status: "disponible",
    careGuide: "acero-banado",
  },
  {
    id: "anillos-escultura",
    slug: "anillos-escultura",
    name: "Anillos Escultura",
    category: "anillos",
    collections: ["novedades"],
    material: "Metal con baño de oro o plata", // TODO: confirmar material real
    price: null, // Piezas únicas: precio a consultar
    description:
      "Una serie de anillos escultóricos, cada uno con su forma: lazos, gotas, nudos y conchas. Escribinos y te mostramos los modelos disponibles.",
    details: ["Piezas de edición limitada", "Ajustables"],
    images: [
      { src: anillosEscultura01, alt: "Cuatro Anillos Escultura dorados y plateados apoyados sobre cubos de hielo" },
      { src: anillosEscultura02, alt: "Colección de Anillos Escultura con formas de lazo, nudo y gota, en dorado y plateado" },
    ],
    status: "ultimas-unidades",
    isNew: true,
    careGuide: "acero-banado",
  },
];
