/**
 * Datos y textos generales del sitio.
 * DEMO: los textos son generales; reemplazar por los de la marca. Ver docs/pendientes.md.
 */
export const site = {
  name: "Milca",
  fullName: "Milca Jewelry",
  tagline: "Essential Jewelry",
  url: "https://milcajewelry.pages.dev", // TODO: dominio definitivo
  // Título de la home en Google y al compartir el link (≤ 60 caracteres).
  homeTitle: "Milca Jewelry · Joyas doradas para todos los días",
  description:
    "Joyas doradas para usar todos los días: aros, collares, pulseras y anillos de acero con baño de oro. Desde Mendoza, con envíos a todo el país.",
  location: {
    city: "San Martín",
    province: "Mendoza",
    country: "Argentina",
    label: "San Martín, Mendoza, Argentina",
  },
  // Formato internacional sin "+", ej. 549261XXXXXXX.
  // TODO: número real. Vacío = el link abre WhatsApp para elegir el contacto.
  whatsapp: "",
  instagram: { handle: "@milcajewelry_", url: "https://www.instagram.com/milcajewelry_" },
  hours: "", // TODO: horario de atención

  nav: [
    { label: "Catálogo", href: "/#catalogo" },
    { label: "Cómo comprar", href: "/#como-comprar" },
    { label: "Contacto", href: "/#contacto" },
  ],

  hero: {
    eyebrow: "Essential Jewelry",
    title: "Joyas para usar todos los días",
    text: "Piezas doradas con detalles que se notan. Elegí la tuya, armá tu pedido y lo terminamos juntas por WhatsApp.",
    cta: "Ver colección",
  },

  // Cinta de texto debajo del hero.
  marquee: ["Essential Jewelry", "Acero con baño de oro", "Envíos a todo el país", "Listas para regalar", "Desde Mendoza"],

  credit: { label: "Sitio por Devott", url: "https://devott.com" }, // TODO: URL de Devott
} as const;
