import { defineConfig } from 'astro/config';

import node from "@astrojs/node";
import sitemap from "@astrojs/sitemap"
import compress from "astro-compress"
import { VitePWA } from "vite-plugin-pwa"

import preact from "@astrojs/preact";

// https://astro.build/config
export default defineConfig({
  adapter: node({
    mode: "standalone"
  }),
  experimental: {
    viewTransitions: true
  },
  output: 'server',
  integrations: [preact(), sitemap(), compress()],
  vite: {
    plugins: [
      VitePWA({
        registerType: "autoUpdate",
        manifest: {
          name: "Gregory Cabin",
          short_name: "Cabin",
          description:
            "An app to keep track of what's going on at the cabin",
          theme_color: "#0ca678",
          background_color: "#0ca678",
          display: "minimal-ui",
          icons: [
            {
              src: "/favicons/cabin_128.png",
              sizes: "128x128",
              type: "image/png"
            },
            {
              src: "/favicons/cabin_64.png",
              sizes: "64x64",
              type: "image/png"
            }
          ]
        },
        workbox: {
          globDirectory: 'dist',
          globPatterns: [
            '**/*.{js,css,svg,png,jpg,jpeg,gif,webp,woff,woff2,ttf,eot,ico}',
          ],
          navigateFallback: null
        },
      })
    ]
  }
});