# Decisiones

Criterios tomados donde `DESIGN.md` o el contexto no definían algo.

## Diseño
- **Tipografías:** las de DESIGN.md son comerciales (Die Grotesk, Bonto). Usamos los sustitutos que indica el propio DESIGN.md: Space Grotesk (texto), Archivo (controles/navegación), Archivo Black (titulares tipo statement) y Anton (wordmark monumental). Self-hosted con `@fontsource`.
- **Tamaño de texto:** DESIGN.md define el cuerpo en 12px. Para lectura en celular y accesibilidad subimos el cuerpo a 15px; los controles de navegación mantienen 12px en mayúsculas.
- **Botones de compra:** DESIGN.md pide controles transparentes. Para los CTAs de compra ("Ver colección", "Agregar al pedido", "Enviar pedido") usamos un botón relleno en Cocoa Ink, cuadrado y sin sombra, porque son la acción principal del flujo. Los botones secundarios son de contorno.
- **Logo:** recreado en SVG a partir del packaging ("MILCA · Essential Jewelry") con Cinzel convertida a trazos (`npm run logo`). Hay que reemplazarlo por el vector original.
- **Wordmark del hero:** "MILCA" en Anton a todo el ancho, con animación de entrada (letras que suben, la foto que se revela y el círculo orbital que se dibuja). Es CSS puro y respeta `prefers-reduced-motion`.
- **Estados de producto:** sin verde ni rojo (DESIGN.md los prohíbe). Los badges usan la gama cocoa/peach.

## Contenido
- **Datos de demo:** nombres de algunas piezas, precios, materiales, variantes y textos son ilustrativos (acordado con Devott para la demo de venta). Están marcados con `TODO` en `src/content/` y listados en `docs/pendientes.md`.
- **Fotos:** son capturas de Instagram de unos 460–680px de ancho. Las más grandes (con modelo) se usan en el hero y en los bloques grandes; las de producto, en cards y fichas. Las capturas originales quedan en `assets-raw/instagram/_originales/`. A tres anillos se les recortó aire vacío para la proporción 4:5, y se sacaron bordes de la interfaz de Instagram.
- **Anillos Escultura:** la foto muestra varios anillos distintos, así que se carga como pieza con precio a consultar (sirve además para mostrar el estado "Consultar precio").
- **WhatsApp sin número:** mientras `site.whatsapp` esté vacío, los links usan `https://wa.me/?text=…`. WhatsApp abre el mensaje armado y deja elegir el contacto, así que el flujo se puede probar igual.

## Técnica
- **Sin framework de UI:** carrito, galería, lightbox, filtros y variantes son `<script>` de Astro en TypeScript. El store del carrito (`src/lib/cart/store.ts`) es un módulo compartido con un reducer puro (testeado) y persistencia versionada en `localStorage`. Así evitamos sumar React o Preact.
- **Drawer y lightbox con `<dialog>` nativo:** dan trap de foco, cierre con Escape y fondo inerte sin librerías.
- **Zoom:** en el lightbox, clic o tap amplía 2,2× en el punto tocado; en móvil también funciona el pinch-zoom nativo (`touch-action: pinch-zoom`). No hizo falta librería.
- **Filtro del catálogo:** las cards se renderizan estáticas y el filtro solo muestra u oculta; queda en la URL (`?categoria=anillos` o `?coleccion=para-regalo`).
- **Botón flotante de WhatsApp:** en la ficha, en móvil, sube por encima de la barra sticky de compra (`--float-offset`).
- **Piezas con precio a consultar:** el botón principal pasa a "Consultar por WhatsApp" y además se pueden sumar al pedido; el carrito muestra "Total parcial".
- **Vaciar el pedido:** se confirma con un segundo toque en vez de un `confirm()` nativo.
- **Lighthouse mobile (build de producción):** 100 / 100 / 100 / 100 en la home y en la ficha.
- **Astro en lugar de Next.js:** genera todo estático y solo carga JS en las islas interactivas (carrito, galería, filtros).
- **Imágenes:** el script `npm run images` genera masters WebP de alta calidad; `astro:assets` produce los anchos y formatos AVIF/WebP en el build.

## Movimiento y vista previa del link
- **Animaciones al hacer scroll:** `src/scripts/motion.ts` (sin librerías) + estilos al final de `global.css`. Se activan con atributos: `data-reveal`, `data-stagger`, `data-split` (títulos letra por letra / palabra por palabra), `data-parallax`, `data-draw` (círculos que se dibujan). También: header que se esconde al bajar, barra de progreso, cinta de texto (`Marquee.astro`), botones con relleno y brillo, y transición entre páginas donde la foto de la card viaja a la ficha (View Transitions, Chrome/Edge/Safari 18.2+). Todo respeta `prefers-reduced-motion` y, si el JS no carga, nada queda oculto.
- **Vista previa al compartir:** la home usa `public/og.jpg` (1200×630, foto + logo); las fichas usan la foto del producto. Íconos PNG, apple-touch-icon y manifest se generan con `npm run share` (volver a correrlo si cambia el logo o la foto del hero).
