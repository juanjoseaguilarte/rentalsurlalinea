// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Cambia site al dominio propio cuando lo tengas (necesario para sitemap y hreflang correctos)
export default defineConfig({
  site: 'https://rentalsurlalinea.vercel.app',
  redirects: {
    '/aviso-legal': '/terminos',
    '/en/legal-notice': '/en/terms',
    // Unidades RockSide renombradas en el motor (A1/A2 → Apartamento 1/2)
    '/apartamentos/rockside-suites-a1': '/apartamentos/rockside-suites-residences-apartamento-1',
    '/apartamentos/rockside-suites-a2': '/apartamentos/rockside-suites-residences-apartamento-2',
    '/en/apartments/rockside-suites-a1': '/en/apartments/rockside-suites-residences-apartamento-1',
    '/en/apartments/rockside-suites-a2': '/en/apartments/rockside-suites-residences-apartamento-2',
  },
  i18n: {
    locales: ['es', 'en'],
    defaultLocale: 'es',
    routing: {
      prefixDefaultLocale: false, // ES en la raíz "/", EN en "/en/"
    },
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'es',
        locales: { es: 'es-ES', en: 'en-GB' },
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
