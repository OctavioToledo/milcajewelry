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

Cloudflare Pages (sitio 100% estático, no necesita adapter):

1. Cloudflare → Workers & Pages → Create → Pages → *Connect to Git* → elegí `OctavioToledo/milcajewelry`.
2. Framework preset: **Astro**. Build command: `npm run build`. Output directory: `dist`.
3. Node: lo toma de `.node-version` (24). Si no, agregá la variable `NODE_VERSION=24`.
4. Cada push a `main` despliega solo.

La URL de producción está configurada como `https://milcajewelry.pages.dev`. Si Cloudflare te da otra (por ejemplo, `milcajewelry-xxx.pages.dev`) o cuando haya dominio propio, cambiala en `astro.config.mjs` (`site`) y en `src/content/site.ts` (`url`): de ahí salen el sitemap, los links canónicos y las imágenes de vista previa al compartir.
