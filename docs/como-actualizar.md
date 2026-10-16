# Cómo actualizar el catálogo

Todo el contenido vive en `src/content/`. Los componentes no se tocan.

## Cambiar un precio o marcar algo como agotado
Editá la pieza en `src/content/products.ts`:
- `price: 24900` → precio en pesos, entero. `price: null` muestra "Consultar precio".
- `status: "agotado"` | `"ultimas-unidades"` | `"disponible"`.
- Para agotar solo un talle o largo: `{ label: "45 cm", status: "agotado" }` dentro de la variante.

## Sumar una pieza
1. Creá la carpeta `assets-raw/instagram/<slug>/` con las fotos `01.jpg` (portada), `02.jpg`…
2. Corré `npm run images` → genera `src/assets/products/<slug>/01.webp`…
3. En `src/content/products.ts`, importá las fotos y agregá un objeto al array (copiá uno existente).
4. `npm run build`: si falta el slug, una imagen o la categoría no existe, el build frena con un mensaje claro.

## Más adelante: catálogo desde Google Sheets
La lectura del catálogo pasa toda por `src/lib/catalog.ts` (`getProducts`, `getProductBySlug`, `getCategories`…). Para usar una planilla:

1. La marca edita una Google Sheet y la publica como CSV (Archivo → Compartir → Publicar en la web → CSV).
2. En `catalog.ts`, `loadProducts()` pasa a hacer `fetch` del CSV y a convertir cada fila en un `Product`.
3. Para que los cambios se vean:
   - **Opción simple:** un Deploy Hook de Vercel que la marca dispara con un botón (o un cron diario), y el sitio se regenera en ~1 minuto.
   - **Opción automática:** adapter `@astrojs/vercel` con ISR (revalidación cada X minutos).
4. Fotos: la columna `fotos` lleva URLs (por ejemplo, de Cloudinary o de una carpeta de Drive pública), separadas por `|`. Se usarían con `<Image>` remoto (`image.domains` en `astro.config.mjs`).

### Columnas de la planilla

| Columna | Ejemplo | Notas |
|---|---|---|
| slug | `aros-flora` | minúsculas y guiones, único |
| nombre | Aros Flora | |
| categoria | aros | aros, collares, pulseras, anillos, sets |
| colecciones | novedades\|para-regalo | opcional |
| material | Acero con baño de oro | |
| precio | 24900 | vacío = consultar |
| estado | disponible | disponible, ultimas-unidades, agotado |
| descripcion | Una flor de pétalos… | |
| detalles | Perla central\|Cierre a presión | opcional |
| variantes | Largo: 35 cm, 40 cm, 45 cm (agotado) | una variante por línea `Nombre: opción, opción` |
| fotos | https://…/01.jpg\|https://…/02.jpg | la primera es la portada |
| alt_fotos | Aros dorados…\|Modelo usando… | texto alternativo de cada foto |
| novedad | si | si/no |
| destacado | si | si/no |
