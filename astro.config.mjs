// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://personal-website-wheat-gamma-81.vercel.app',
  vite: {
    // @ts-ignore — @tailwindcss/vite plugin type is compatible at runtime but conflicts with Astro's bundled Vite type
    plugins: [tailwindcss()],
  },
});
