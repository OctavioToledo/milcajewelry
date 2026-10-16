// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://milcajewelry.pages.dev", // TODO: dominio definitivo (también en src/content/site.ts)
  integrations: [sitemap()],
  image: {
    // Anchos para srcset por defecto; los masters miden ~460–680px.
    layout: "constrained",
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
