# Proyecto: Demo de landing con catálogo para Milca Jewelry — by Devott

> Documento de contexto del proyecto. Es la referencia de qué construimos y cómo.
> **Cambios respecto del brief original:** (1) la tecnología es **Astro** en lugar de Next.js; (2) la fuente de estilos es **`DESIGN.md`** (en la raíz del repo).
>
> **Acuerdos para la demo (2026-10-15):**
> - Es una demo de venta: los datos que no tenemos (precios, materiales, variantes, nombres, textos de "Quiénes somos", FAQ, etc.) se cargan con **valores generales/ilustrativos**, marcados con `TODO` y listados en `docs/pendientes.md`. Siguen prohibidos los testimonios, reseñas, cifras y premios inventados.
> - Ubicación: San Martín, Mendoza, Argentina. Envíos a todo el país. Pagos: efectivo y transferencia. Las piezas tienen garantía.
> - WhatsApp: sin número por ahora (el link abre WhatsApp con el mensaje y deja elegir el contacto).
> - Logo: recreación en SVG del wordmark del packaging ("MILCA · Essential Jewelry").
> - Imágenes: las más grandes (fotos con modelo) para el hero y los bloques grandes; las de producto para cards y fichas.
> - Se mantiene el estilo editorial de `DESIGN.md` (aunque la marca sea más fina), con la animación de entrada del hero.

## Rol y contexto
Sos un desarrollador frontend senior. Vas a construir una DEMO funcional (pero con calidad de producción) de la landing con catálogo de Milca Jewelry, un emprendimiento de joyería que hoy vende por Instagram (https://www.instagram.com/milcajewelry_) y WhatsApp. Abandonaron Tiendanube: el sitio tiene que ser MÁS SIMPLE que eso, rápido y fácil de actualizar.

El flujo central del producto: la clienta entra desde el celular → ve piezas con fotos, descripción y precio → elige variante (talle, largo, baño) → arma el carrito → toca "Enviar pedido por WhatsApp" → se abre WhatsApp con el pedido ya escrito (productos, variantes, cantidades, opción regalo y total). No hay cobro online, ni panel de administración, ni control de stock real.

La demo se va a mostrar en el celular del dueño para cerrar la venta: el flujo "elegir pieza → carrito → WhatsApp" tiene que ser impecable.

## Fuentes de verdad (leer ANTES de escribir código)
1. `DESIGN.md` → fuente PRINCIPAL de estilo: colores, tipografías, espaciados, radios, sombras y componentes. Tiene prioridad sobre cualquier criterio propio. Si algo no está definido ahí, elegí lo más coherente con ese sistema y anotalo en `docs/decisiones.md`.
2. `assets-raw/instagram/<slug-producto>/` → fotos reales tomadas de Instagram (01.jpg = portada) + `notas.txt` con nombre, precio, material, variantes y estado de cada pieza.
3. Este documento.

## Reglas no negociables
- Textos en español rioplatense con voseo ("elegí", "tocá", "escribinos"). Tono cálido, elegante y cercano. Nada de textos genéricos de plantilla.
- PROHIBIDO inventar testimonios, reseñas, cifras ("+1000 clientas"), premios o datos del negocio. Si falta un dato, usá un placeholder visible y marcado con `TODO:` en el archivo de datos, y sumalo a `docs/pendientes.md`.
- Si un producto no tiene precio en `notas.txt`, cargalo con `price: null` y mostrá "Consultar precio" (el botón del producto pasa a "Consultar por WhatsApp").
- Mobile-first real: diseñá a 375px primero y escalá. Objetivo Lighthouse mobile ≥ 90 en Performance, Accessibility, Best Practices y SEO.
- Contenido 100% separado del código: productos, categorías, textos, FAQ, guías y contacto viven en `src/content`. Ningún texto de negocio hardcodeado en componentes.
- Dependencias mínimas. Antes de agregar una librería, preguntate si se resuelve con CSS o 30 líneas de código.

## Stack
- **Astro** + TypeScript estricto (`tsconfig` strict). Salida 100% estática (SSG) de todas las páginas; `getStaticPaths` para las fichas.
- Estilos: Tailwind CSS v4 con los tokens de `DESIGN.md` (el propio `DESIGN.md` trae el bloque `@theme` para Tailwind v4 y las CSS custom properties). Si `DESIGN.md` indica otro enfoque, seguí `DESIGN.md`.
- Imágenes: `astro:assets` (`<Image>` / `<Picture>`) para todas las imágenes (AVIF/WebP, `widths` + `sizes` correctos, `loading="eager"` + `fetchpriority="high"` solo en el hero y la primera foto del producto; el resto lazy).
- Tipografías: las de `DESIGN.md` (o sus sustitutos indicados ahí), self-hosted (Astro Fonts API o `@fontsource`), con `preload` de la fuente principal y `font-display: swap` + fallback ajustado para evitar layout shift.
- Interactividad con **islas**: componentes `.astro` (cero JS) por defecto; JS solo donde haya interacción. Para las islas, preferir TypeScript vanilla / web components; si hace falta un framework, Preact (liviano) con `client:load`/`client:visible`/`client:idle` según corresponda.
- Estado del carrito: store compartido entre islas con `nanostores` (o equivalente mínimo), persistido en `localStorage` (con try/catch y versión de esquema). Reducer puro para las acciones del carrito (testeable).
- Galería: scroll-snap nativo con CSS para el swipe; lightbox propio con pinch-zoom en móvil y zoom al hacer clic en desktop. Solo si el zoom nativo no alcanza, usar una librería liviana y justificarlo.
- Tests: Vitest.
- Deploy en Cloudflare Pages (sitio estático, sin adapter).

## Estructura del proyecto
```
/src
  /layouts
    BaseLayout.astro       → fuentes, metadata base, header, footer, CartDrawer, botón flotante de WhatsApp
  /pages
    index.astro            → landing (secciones abajo)
    producto/[slug].astro  → ficha de producto (URL compartible, con OG propio)
    guia-de-talles.astro
    cuidados.astro
    robots.txt.ts          → (sitemap con @astrojs/sitemap)
  /components              → UI reutilizable (ProductCard, Gallery, Lightbox, VariantPicker, CartDrawer, CategoryFilter, StatusBadge, Section, FAQ, etc.)
  /content
    site.ts                → nombre, slogan, textos de secciones, redes, WhatsApp, horarios
    products.ts            → catálogo
    categories.ts          → categorías y colecciones
    faq.ts, shipping.ts, payments.ts, care.ts, ring-sizes.ts
  /lib
    catalog.ts             → capa de acceso a datos (ver "Actualización de productos")
    whatsapp.ts            → armado del mensaje y del link
    format.ts              → formato de precios ARS
    cart/                  → store, reducer, tipos, persistencia
  /styles/global.css       → tokens de DESIGN.md (@theme Tailwind v4)
  /assets/products/<slug>/01.webp, 02.webp…   (procesadas por astro:assets)
/public                    → favicon, imagen OG estática
/scripts/optimize-images.ts → toma assets-raw, genera versiones optimizadas en src/assets/products
/docs → decisiones.md, pendientes.md, como-actualizar.md
DESIGN.md
context.md
```

## Modelo de datos (TypeScript)
```ts
type ProductStatus = "disponible" | "ultimas-unidades" | "agotado";

type VariantOption = {
  label: string;                 // "Talle 14", "45 cm", "Baño dorado"
  status?: ProductStatus;        // opcional: una opción puede estar agotada
  priceDelta?: number;           // opcional: diferencia de precio
};

type Variant = {
  type: "talle" | "largo" | "color" | "baño" | "otro";
  name: string;                  // "Talle", "Largo de cadena"
  options: VariantOption[];
  required: boolean;
};

type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;              // id de categories.ts
  collections?: string[];        // "novedades", "para-regalo", etc.
  material: string;              // "Plata 925", "Acero quirúrgico"...
  price: number | null;          // ARS, entero. null = consultar
  description: string;
  details?: string[];            // medidas, piedra, cierre
  images: { src: string; alt: string }[]; // mínimo 1, alt descriptivo
  variants?: Variant[];
  status: ProductStatus;
  isNew?: boolean;
  featured?: boolean;
  careGuide?: string;            // id en care.ts según material
};
```

Validá el catálogo al build (una función que tire error claro si falta slug, imagen o categoría válida). Las categorías iniciales: aros, collares, pulseras, anillos, sets. Colecciones: novedades, para regalo. Mostrá solo las categorías que tengan productos.

## Actualización de productos (punto clave de venta)
Toda lectura del catálogo pasa por `src/lib/catalog.ts` con funciones `getProducts()`, `getProductBySlug()`, `getCategories()`. En la demo leen de `src/content/products.ts`. Diseñá esta capa para que más adelante se pueda cambiar la fuente a una planilla de Google Sheets (CSV publicado, leído en build + re-deploy automático vía Deploy Hook de Vercel, o ISR con el adapter de Vercel) SIN tocar componentes. No implementes Sheets ahora: dejá la interfaz preparada y documentá en `docs/como-actualizar.md` cómo sería el cambio y qué columnas tendría la planilla (slug, nombre, categoría, material, precio, estado, variantes, fotos, novedad).

## Secciones de la landing (en este orden, ajustable según DESIGN.md)
1. Header: logo/nombre, navegación ancla (Catálogo, Cómo comprar, Contacto), ícono de carrito con contador. Sticky, compacto en móvil.
2. Hero: foto protagonista real, frase corta de marca, CTA "Ver colección". Mucho aire, look premium.
3. Novedades: carrusel horizontal (scroll-snap) de productos `isNew`.
4. Catálogo: filtros por categoría como chips horizontales scrolleables + colecciones. Grilla 2 columnas en móvil, 3–4 en desktop. Filtro reflejado en la URL (`?categoria=aros`) para poder compartir (filtrado del lado del cliente sobre HTML estático).
5. Para regalo: bloque destacado con piezas de la colección "para-regalo" y explicación de la opción regalo.
6. Materiales y garantía: qué material usa cada línea y qué cubre la garantía (texto desde content, con TODO si falta).
7. Cómo comprar: 4 pasos visuales (elegí → agregá → enviá por WhatsApp → coordinamos pago y envío).
8. Envíos y pagos: zonas, retiro, correo, medios de pago (desde content).
9. Guías: accesos a Guía de talles de anillos y Cuidados según material.
10. Quiénes somos: breve, desde content.
11. Preguntas frecuentes: acordeón accesible (`<details>` o botones con aria-expanded).
12. Instagram: link al perfil con CTA "Seguinos en Instagram". Grilla de 6 fotos estáticas del feed (las mismas de assets) que linkean al perfil. Sin embeds ni scripts de Instagram.
13. Footer: contacto, redes, links a guías, crédito discreto "Sitio por Devott".

Botón flotante de WhatsApp para consultas generales (que no tape el botón del carrito ni el CTA de la ficha en móvil).

## Ficha de producto
- Galería: swipe con scroll-snap, indicadores de posición, miniaturas en desktop, lightbox con zoom. Primera imagen con prioridad de carga.
- Nombre, material, precio (o "Consultar precio"), badge de estado.
- Selector de variantes: botones (no selects) para talle/largo/baño. Opciones agotadas visibles pero deshabilitadas. No se puede agregar al carrito sin elegir las variantes requeridas (mensaje claro, no alert).
- Link "¿No sabés tu talle? Mirá la guía" cuando la variante es talle de anillo.
- Cantidad, botón "Agregar al pedido" (sticky al fondo en móvil). Feedback al agregar: abrir el carrito o un toast breve.
- Descripción, detalles, cuidados del material.
- "También te puede gustar": 4 productos de la misma categoría.
- Estados: "Agotado" → botón deshabilitado + CTA "Avisame si vuelve" que abre WhatsApp con mensaje prearmado. "Últimas unidades" → badge visible.

## Carrito
- Drawer lateral (desktop) / hoja inferior a pantalla completa (móvil).
- Cada línea: foto, nombre, variante elegida, cantidad editable, subtotal, eliminar. La misma pieza con distinta variante = líneas distintas.
- Opción "Es para regalo" (checkbox) + campo opcional "Mensaje para la tarjeta" (máx. 150 caracteres).
- Campo opcional "Tu nombre".
- Total en ARS. Si hay productos con precio null, mostrar "Total parcial" + aclaración.
- Botón "Enviar pedido por WhatsApp". Persistencia en localStorage: si la clienta vuelve, el pedido sigue ahí. Botón para vaciar el carrito.

## Mensaje de WhatsApp (src/lib/whatsapp.ts)
Número desde `src/content/site.ts` (formato internacional sin +, ej. 549261XXXXXXX). Link `https://wa.me/<numero>?text=<encodeURIComponent(mensaje)>`. Formato:

    ¡Hola Milca! 👋 Quiero hacer este pedido:

    • 1 x Anillo Luna — Talle 14 — $18.000
    • 2 x Aros Perla Gota — Baño dorado — $24.000

    Total: $42.000
    🎁 Es para regalo. Mensaje para la tarjeta: "Feliz cumple, ma"

    Mi nombre es Sofía.
    ¿Me confirmás disponibilidad y cómo seguimos con el pago y el envío?

Escribí tests unitarios (Vitest) para el armado del mensaje (variantes, regalo, precio null, caracteres especiales y emojis).

## SEO y compartir
- Metadata por página (title, description) desde content. Open Graph y Twitter card con imagen real: la del hero para la home y la portada de cada producto para su ficha (que el link se vea lindo al mandarlo por WhatsApp).
- JSON-LD: `JewelryStore` en home y `Product` en cada ficha (solo con datos reales; sin rating ni reseñas).
- sitemap.xml (`@astrojs/sitemap`), robots.txt, `lang="es-AR"`, favicon.

## Rendimiento y accesibilidad
- Imágenes: script que convierte assets-raw a WebP en 2–3 anchos, manteniendo detalle (calidad ~80, sin sobre-comprimir: en joyería el detalle vende). Proporción consistente en las cards (definida en DESIGN.md o 4:5 por defecto) con object-fit.
- Sin layout shift: dimensiones definidas en imágenes, fuentes self-hosted con preload y fallback ajustado.
- Accesible: contraste AA, foco visible, navegación por teclado en drawer/lightbox/acordeón (trap de foco, Escape cierra), alt descriptivos, áreas táctiles ≥ 44px, `prefers-reduced-motion` respetado.
- JS mínimo: componentes `.astro` sin JS por defecto, islas solo donde haya interacción.

## Plan de trabajo (por fases, frená al final de cada una y mostrame el resultado)
- Fase 0 — Lectura: leé DESIGN.md y assets-raw. Devolveme: resumen de tokens de diseño, lista de productos detectados con sus datos y lo que falta. NO escribas código todavía. Esperá mi confirmación.
- Fase 1 — Base: setup del proyecto Astro, tokens de diseño, fuentes, layout, header, footer, componentes base. Deploy de prueba en Vercel.
- Fase 2 — Contenido: script de imágenes, products.ts y resto de src/content con datos reales + TODOs, validación del catálogo, capa lib/catalog.ts.
- Fase 3 — Catálogo y ficha: grilla, filtros, cards, ficha con galería, lightbox, variantes y estados.
- Fase 4 — Carrito y WhatsApp: store, persistencia, drawer, opción regalo, mensaje + tests.
- Fase 5 — Secciones de confianza: materiales y garantía, cómo comprar, envíos y pagos, guías, FAQ, Instagram, quiénes somos.
- Fase 6 — SEO, rendimiento y accesibilidad: OG, JSON-LD, sitemap, auditoría Lighthouse mobile y correcciones.
- Fase 7 — QA y entrega: recorrido completo en 375px y 1440px, prueba real del link de WhatsApp en un celular, actualizar docs/pendientes.md y docs/como-actualizar.md.

## Criterios de aceptación
- En un celular, se puede ir de la home a un pedido enviado por WhatsApp en menos de 1 minuto, sin fricción.
- El mensaje de WhatsApp incluye producto, variante, cantidad, precio, total, opción regalo y nombre.
- No se puede agregar una pieza sin la variante requerida ni una pieza agotada.
- El carrito sobrevive a cerrar y volver a abrir la página.
- Cada producto tiene URL propia con vista previa correcta al compartir.
- Lighthouse mobile ≥ 90 en las 4 categorías.
- Ningún dato inventado: todo lo faltante está marcado como TODO y listado en docs/pendientes.md.
- Cambiar un precio, marcar algo como agotado o sumar un producto se hace editando solo src/content (y agregando fotos), sin tocar componentes.
