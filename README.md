# Milca Jewelry — landing con catálogo

Demo de la tienda de Milca Jewelry: catálogo con fichas de producto, carrito y pedido por WhatsApp. Sitio por Devott.

- **Stack:** Astro (estático) + Tailwind v4 + TypeScript estricto. Sin framework de UI: las partes interactivas (carrito, galería, filtros, variantes) son scripts livianos.
- **Estilos:** tokens de [`DESIGN.md`](DESIGN.md) en `src/styles/global.css`.
- **Contexto del proyecto:** [`context.md`](context.md).

## Comandos

| Comando | Qué hace |
|---|---|
| `npm install` | Instala dependencias |
| `npm run dev` | Servidor local en `localhost:4321` |
| `npm run build` | Genera el sitio en `dist/` (valida el catálogo) |
| `npm run preview` | Sirve el build |
| `npm test` | Tests (mensaje de WhatsApp, carrito, validación del catálogo) |
| `npm run check` | Chequeo de tipos |
| `npm run images` | Convierte las fotos de `assets-raw/instagram/<slug>/` a `src/assets/` |
| `npm run logo` | Regenera el logo SVG |

## Estructura

```
src/content/   → todo el contenido editable (productos, textos, FAQ, envíos, pagos, cuidados, talles)
src/lib/       → catálogo, carrito, WhatsApp, formato de precios
src/components → UI (secciones de la home, galería, carrito, ficha)
src/pages/     → home, /producto/[slug], /guia-de-talles, /cuidados
docs/          → decisiones, pendientes y cómo actualizar el catálogo
```

## Documentación

- [Cómo actualizar el catálogo](docs/como-actualizar.md)
- [Pendientes (datos a pedir a la marca)](docs/pendientes.md)
- [Decisiones de diseño y técnicas](docs/decisiones.md)

## Deploy

Vercel detecta Astro solo: importá el repo en vercel.com (framework *Astro*, comando `npm run build`, salida `dist`). Cuando haya dominio, actualizalo en `astro.config.mjs` (`site`) y en `src/content/site.ts` (`url`).
