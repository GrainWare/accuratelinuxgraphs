// @ts-check
import { defineConfig } from "astro/config";

import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  server: {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
  output: "server",
  adapter: node({
    mode: "standalone",
  }),
});
