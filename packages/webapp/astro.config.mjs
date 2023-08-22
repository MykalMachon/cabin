import { defineConfig } from 'astro/config';
import node from "@astrojs/node";

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
  integrations: [preact()],
});