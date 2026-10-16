/**
 * Datos y textos generales del sitio.
 * DEMO: los textos son generales; reemplazar por los de la marca. Ver docs/pendientes.md.
 */
export const site = {
  name: "Milca",
  fullName: "Milca Jewelry",
  tagline: "Essential Jewelry",
  url: "https://milcajewelry.vercel.app", // TODO: dominio definitivo
  description:
    "Joyas esenciales para todos los días. Aros, collares, pulseras y anillos desde San Martín, Mendoza, con envíos a todo el país.",
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

  credit: { label: "Sitio por Devott", url: "https://devott.com" }, // TODO: URL de Devott
} as const;
